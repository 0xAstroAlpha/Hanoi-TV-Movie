import { UploadedFile, CharacterProfile, ModelStyle } from "../types";

const NKG_API_URL = 'http://171.244.130.36:8900/generate-multipart';
const NKG_API_KEY = 'nkg-api-key';

/**
 * Convert base64 to File object for FormData upload
 */
const base64ToFile = (base64: string, mimeType: string, filename: string): File => {
    const byteString = atob(base64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new File([ab], filename, { type: mimeType });
};

/**
 * Fetch image from URL and convert to File object
 */
const fetchImageAsFile = async (url: string, filename: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type || 'image/png' });
};

/**
 * Generate composite image using NKG API
 * This API supports multipart form data with:
 * - prompt: text description
 * - files: local image files
 * - image_urls: array of image URLs (JSON string)
 */
export const generateCompositeNKG = async (
    faceImage: UploadedFile,
    refImage: UploadedFile | null,
    characterProfile: CharacterProfile | null,
    modelStyle: ModelStyle | null,
    faceImage2: UploadedFile | null = null // Second face for couple models
): Promise<string> => {

    const formData = new FormData();

    // Build prompt based on inputs
    let prompt = "";

    if (modelStyle) {
        // Check if couple model (2 faces provided)
        const isCoupleModel = modelStyle.characterCount === 2 && faceImage2;

        if (isCoupleModel) {
            // Couple model prompt with 2 faces
            prompt = `Tạo ảnh 3D Render chất lượng cao kết hợp 2 NHÂN VẬT:

INPUT:
- Face 1: Ảnh chân dung người thật thứ 1 (Identity cho nhân vật nam/trái)
- Face 2: Ảnh chân dung người thật thứ 2 (Identity cho nhân vật nữ/phải)
- Model Reference: Ảnh 3D model "${modelStyle.name}" (nguồn Style/Pose/Costume)

YÊU CẦU BẮT BUỘC:
1. GIỮ NGUYÊN IDENTITY:
   - Giữ nguyên 100% đặc điểm nhận dạng khuôn mặt từ Face 1 và Face 2 (mắt, mũi, miệng, khuôn mặt)
   - Giữ nguyên KIỂU TÓC và MÀU TÓC gốc của từng người
   - Chỉ cách điệu nhẹ để phù hợp phong cách 3D (da mịn, nét mềm mại)

2. TỶ LỆ CƠ THỂ:
   - Tạo nhân vật với tỷ lệ cân đối, hài hòa
   - Kích thước đầu phù hợp với thân (không quá to hoặc quá nhỏ)
   
3. PHONG CÁCH 3D:
   - Tuân thủ HOÀN TOÀN phong cách render 3D của Model Reference
   - Giữ nguyên tư thế, trang phục, ánh sáng, bố cục: ${modelStyle.visualPrompt}
   - Render chất lượng cao, chi tiết sắc nét`;
        } else {
            // Single model prompt
            prompt = `Tạo ảnh 3D Render chất lượng cao:

INPUT:
- Face: Ảnh chân dung người thật (Identity Source)
- Model: Ảnh 3D model "${modelStyle.name}" (Style/Pose/Costume Source)

YÊU CẦU BẮT BUỘC:
1. GIỮ NGUYÊN IDENTITY:
   - Giữ nguyên 100% đặc điểm nhận dạng khuôn mặt (mắt, mũi, miệng, khuôn mặt)
   - Giữ nguyên KIỂU TÓC và MÀU TÓC gốc của người input
   - Chỉ cách điệu nhẹ để phù hợp phong cách 3D (da mịn, nét mềm mại)

2. TỶ LỆ CƠ THỂ:
   - Ghép khuôn mặt lên thân hình với tỷ lệ CÂN ĐỐI, HÀI HÒA
   - Kích thước đầu phù hợp với thân (không quá to hoặc quá nhỏ)
   
3. PHONG CÁCH 3D:
   - Tuân thủ HOÀN TOÀN phong cách render 3D của Model Reference
   - Giữ nguyên tư thế, trang phục, ánh sáng: ${modelStyle.visualPrompt}
   - Render chất lượng cao, chi tiết sắc nét`;
        }
    } else if (refImage && refImage.base64) {
        // User uploaded a custom 3D model ref
        prompt = `Tạo ảnh Chibi/3D Render kết hợp:
- Hình 1: Ảnh chân dung người thật (nguồn Identity)
- Hình 2: Ảnh 3D model tham chiếu (nguồn Body/Pose/Style)

YÊU CẦU:
1. Ghép KHUÔN MẶT từ Hình 1 lên THÂN HÌNH của Hình 2
2. Giữ nguyên tư thế, trang phục và ánh sáng của Hình 2
3. Đảm bảo khuôn mặt phù hợp với phong cách 3D art (da mịn, nét cách điệu) nhưng vẫn giữ đặc điểm nhận dạng`;
    } else if (characterProfile) {
        // User selected a preset character
        prompt = `Tạo ảnh 3D Chibi/Pixar style:
Mô tả nhân vật: "${characterProfile.visualPrompt}"

YÊU CẦU:
1. PHONG CÁCH: 3D Render độ chi tiết cao (Pixar/Disney/Chibi aesthetic). Tỷ lệ cute nhưng texture chi tiết.
2. IDENTITY: Sử dụng đặc điểm khuôn mặt từ ảnh input, nhưng cách điệu phù hợp thế giới 3D Chibi.
3. TRANG PHỤC: Phải khớp chính xác với mô tả (Áo giáp, màu sắc, vũ khí).
4. NỀN: Studio lighting hoặc background đơn giản phù hợp chủ đề.`;
    } else {
        prompt = "Tạo ảnh kết hợp từ các hình ảnh được cung cấp";
    }

    formData.append('prompt', prompt);

    // Add face image as file
    if (faceImage.base64) {
        const faceFile = base64ToFile(
            faceImage.base64,
            faceImage.mimeType,
            'face1.png'
        );
        formData.append('files', faceFile);
    }

    // Add second face for couple models
    if (faceImage2 && faceImage2.base64) {
        const faceFile2 = base64ToFile(
            faceImage2.base64,
            faceImage2.mimeType,
            'face2.png'
        );
        formData.append('files', faceFile2);
    }

    // Add model style image if exists
    if (modelStyle && modelStyle.imagePath) {
        try {
            const modelFile = await fetchImageAsFile(modelStyle.imagePath, 'model.png');
            formData.append('files', modelFile);
        } catch (err) {
            console.warn('Failed to fetch model image, continuing without it:', err);
        }
    }

    // Add ref image if exists
    if (refImage && refImage.base64) {
        const refFile = base64ToFile(
            refImage.base64,
            refImage.mimeType,
            'reference.png'
        );
        formData.append('files', refFile);
    }

    // If using character profile, add character icon as image_url
    if (characterProfile && characterProfile.icon) {
        formData.append('image_urls', JSON.stringify([characterProfile.icon]));
    }

    try {
        const response = await fetch(NKG_API_URL, {
            method: 'POST',
            headers: {
                'x-api-key': NKG_API_KEY,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`NKG API Error: ${response.status} - ${errorText}`);
        }

        // Check response type
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            // JSON response with image URL or base64
            const data = await response.json();

            // NKG API returns: { success: true, generated_images: [{ filename, url }] }
            if (data.success && data.generated_images && data.generated_images.length > 0) {
                return data.generated_images[0].url;
            } else if (data.image_url) {
                return data.image_url;
            } else if (data.image_base64 || data.base64) {
                const base64 = data.image_base64 || data.base64;
                return `data:image/png;base64,${base64}`;
            } else if (data.url) {
                return data.url;
            } else if (data.images && data.images.length > 0) {
                // Handle array of images
                const img = data.images[0];
                if (typeof img === 'string') {
                    return img.startsWith('data:') ? img : `data:image/png;base64,${img}`;
                }
                return img.url || img.base64 ? `data:image/png;base64,${img.base64}` : img;
            }

            throw new Error("Unexpected response format from NKG API");
        } else if (contentType && contentType.includes('image')) {
            // Direct image blob response
            const blob = await response.blob();
            return URL.createObjectURL(blob);
        } else {
            // Try to parse as JSON anyway
            const text = await response.text();
            try {
                const data = JSON.parse(text);
                if (data.image_url || data.url) {
                    return data.image_url || data.url;
                }
            } catch {
                // Not JSON, might be base64 directly
                if (text.startsWith('/9j/') || text.startsWith('iVBOR')) {
                    return `data:image/png;base64,${text}`;
                }
            }
            throw new Error("Unable to parse NKG API response");
        }
    } catch (error: any) {
        console.error("NKG Generation Error:", error);
        throw error;
    }
};
