/**
 * NKG API Load Tester
 * Tests concurrent request capacity from 2 to 100 requests per batch
 * Each batch is run sequentially, not in parallel with other batches
 */

const NKG_API_URL = 'http://171.244.130.36:8900/generate-multipart';
const NKG_API_KEY = 'nkg-api-key';

// Sample test data - minimal prompt for load testing
const TEST_PROMPT = 'Generate a simple 3D chibi character test image. This is a load test.';

// Batch sizes to test: 2, 5, 10, 20, 30, 50, 75, 100
const BATCH_SIZES = [2, 5, 10, 20, 30, 50, 75, 100];

// Results storage
const results = [];

/**
 * Create a single API request
 */
async function makeRequest(requestId, batchId) {
    const startTime = Date.now();
    const formData = new FormData();
    formData.append('prompt', `${TEST_PROMPT} Request ${requestId} of batch ${batchId}`);

    // Add a small test image (1x1 red pixel)
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    const binaryString = atob(testImageBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    const testFile = new File([bytes], 'test.png', { type: 'image/png' });
    formData.append('files', testFile);

    try {
        const response = await fetch(NKG_API_URL, {
            method: 'POST',
            headers: {
                'x-api-key': NKG_API_KEY,
            },
            body: formData,
        });

        const endTime = Date.now();
        const duration = endTime - startTime;

        if (!response.ok) {
            return {
                requestId,
                success: false,
                status: response.status,
                duration,
                error: `HTTP ${response.status}`
            };
        }

        // Just check response is valid, don't save image
        const contentType = response.headers.get('content-type');
        let isValidResponse = false;

        if (contentType?.includes('application/json')) {
            const data = await response.json();
            isValidResponse = data.success || data.image_url || data.generated_images?.length > 0;
        } else if (contentType?.includes('image')) {
            isValidResponse = true;
            await response.blob(); // Consume response
        }

        return {
            requestId,
            success: isValidResponse,
            status: response.status,
            duration
        };
    } catch (error) {
        const endTime = Date.now();
        return {
            requestId,
            success: false,
            duration: endTime - startTime,
            error: error.message
        };
    }
}

/**
 * Run a batch of concurrent requests
 */
async function runBatch(batchSize, batchId) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 BATCH ${batchId}: Testing ${batchSize} concurrent requests...`);
    console.log(`${'='.repeat(60)}`);

    const batchStartTime = Date.now();

    // Create all requests for this batch
    const requests = [];
    for (let i = 1; i <= batchSize; i++) {
        requests.push(makeRequest(i, batchId));
    }

    // Run all requests concurrently and wait for all to complete
    const responses = await Promise.all(requests);

    const batchEndTime = Date.now();
    const totalDuration = batchEndTime - batchStartTime;

    // Analyze results
    const successCount = responses.filter(r => r.success).length;
    const failCount = batchSize - successCount;
    const avgDuration = Math.round(responses.reduce((sum, r) => sum + r.duration, 0) / batchSize);
    const minDuration = Math.min(...responses.map(r => r.duration));
    const maxDuration = Math.max(...responses.map(r => r.duration));

    const result = {
        batchId,
        batchSize,
        totalDuration,
        successCount,
        failCount,
        successRate: ((successCount / batchSize) * 100).toFixed(1),
        avgDuration,
        minDuration,
        maxDuration,
        requestsPerSecond: (batchSize / (totalDuration / 1000)).toFixed(2),
        errors: responses.filter(r => r.error).map(r => r.error)
    };

    results.push(result);

    // Print batch summary
    console.log(`\n📊 Batch ${batchId} Results:`);
    console.log(`   ✅ Success: ${successCount}/${batchSize} (${result.successRate}%)`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log(`   ⏱️  Total time: ${totalDuration}ms`);
    console.log(`   📈 Avg response: ${avgDuration}ms (min: ${minDuration}ms, max: ${maxDuration}ms)`);
    console.log(`   🔥 Throughput: ${result.requestsPerSecond} req/s`);

    if (failCount > 0) {
        const uniqueErrors = [...new Set(result.errors)];
        console.log(`   ⚠️  Errors: ${uniqueErrors.join(', ')}`);
    }

    return result;
}

/**
 * Print final summary table
 */
function printSummary() {
    console.log(`\n\n${'='.repeat(80)}`);
    console.log('📋 FINAL LOAD TEST SUMMARY');
    console.log(`${'='.repeat(80)}\n`);

    console.log('| Batch | Concurrent | Success | Failed | Total Time | Avg Time | Throughput |');
    console.log('|-------|------------|---------|--------|------------|----------|------------|');

    for (const r of results) {
        console.log(`| ${String(r.batchId).padStart(5)} | ${String(r.batchSize).padStart(10)} | ${String(r.successCount).padStart(7)} | ${String(r.failCount).padStart(6)} | ${String(r.totalDuration + 'ms').padStart(10)} | ${String(r.avgDuration + 'ms').padStart(8)} | ${String(r.requestsPerSecond + '/s').padStart(10)} |`);
    }

    // Find the breaking point
    const firstFail = results.find(r => r.failCount > 0);
    const lastPerfect = results.filter(r => r.failCount === 0).pop();

    console.log(`\n${'='.repeat(80)}`);
    console.log('🎯 CONCLUSIONS:');

    if (lastPerfect) {
        console.log(`   ✅ Maximum stable concurrency: ${lastPerfect.batchSize} requests`);
        console.log(`   📈 Peak throughput at stable: ${lastPerfect.requestsPerSecond} req/s`);
    }

    if (firstFail) {
        console.log(`   ⚠️  First failures at: ${firstFail.batchSize} concurrent requests`);
        console.log(`   ❌ Failure rate: ${(100 - parseFloat(firstFail.successRate)).toFixed(1)}%`);
    } else {
        console.log(`   🏆 All tests passed! API can handle 100+ concurrent requests`);
    }

    console.log(`${'='.repeat(80)}\n`);
}

/**
 * Main test runner
 */
async function runLoadTest() {
    console.log('\n');
    console.log(`${'═'.repeat(70)}`);
    console.log(`          🔥 NKG API LOAD TESTER 🔥`);
    console.log(`${'═'.repeat(70)}`);
    console.log(`\nAPI URL: ${NKG_API_URL}`);
    console.log(`Test batches: ${BATCH_SIZES.join(', ')} concurrent requests`);
    console.log(`Started at: ${new Date().toLocaleString()}`);

    const overallStart = Date.now();

    for (let i = 0; i < BATCH_SIZES.length; i++) {
        const batchSize = BATCH_SIZES[i];
        await runBatch(batchSize, i + 1);

        // Add delay between batches to let API recover
        if (i < BATCH_SIZES.length - 1) {
            console.log(`\n⏳ Waiting 3 seconds before next batch...`);
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }

    const overallEnd = Date.now();
    const totalTime = ((overallEnd - overallStart) / 1000).toFixed(1);

    console.log(`\n✅ All tests completed in ${totalTime}s`);

    printSummary();
}

// Run the test
runLoadTest().catch(console.error);
