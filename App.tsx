import React, { useState } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { ResultDisplay } from './components/ResultDisplay';
import { CharacterSelector } from './components/CharacterSelector';
import { ModelStyleSelector } from './components/ModelStyleSelector';
import { UploadedFile, AppStatus, CharacterProfile, AIProvider, ModelStyle } from './types';
import { generateComposite } from './services/geminiService';
import { generateCompositeNKG } from './services/nkgService';
import { CHARACTERS, QUOTES } from './data/characters';
import { MODEL_STYLES } from './data/modelStyles';
import { ArrowRight, Zap, AlertCircle, Users, Box, Sparkles, Wand2, Image } from 'lucide-react';
import { motion } from 'framer-motion';

const App: React.FC = () => {
  const [faceFile, setFaceFile] = useState<UploadedFile | null>(null);
  const [faceFile2, setFaceFile2] = useState<UploadedFile | null>(null); // For couple models

  // Tab State - Default to 'model' (other modes hidden)
  const [mode, setMode] = useState<'preset' | 'custom' | 'model'>('model');

  const [selectedChar, setSelectedChar] = useState<CharacterProfile | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelStyle | null>(null);
  const [customRefFile, setCustomRefFile] = useState<UploadedFile | null>(null);

  // AI Provider State - Default to NKG
  const [aiProvider, setAiProvider] = useState<AIProvider>(AIProvider.NKG);

  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Logic to determine if we can generate
  const isCoupleModel = selectedModel?.characterCount === 2;
  const canGenerate = faceFile && (
    (mode === 'preset' && selectedChar) ||
    (mode === 'custom' && customRefFile) ||
    (mode === 'model' && selectedModel && (!isCoupleModel || faceFile2))
  ) && status !== AppStatus.GENERATING;

  const handleRandomize = () => {
    const randomChar = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    // Create a new object to ensure react re-renders if same char picked
    setSelectedChar({ ...randomChar, quote: randomQuote });
  };

  const handleRandomizeModel = () => {
    const randomModel = MODEL_STYLES[Math.floor(Math.random() * MODEL_STYLES.length)];
    setSelectedModel(randomModel);
  };

  const handleGenerate = async () => {
    if (!faceFile) return;

    setStatus(AppStatus.GENERATING);
    setErrorMsg(null);
    setResultUrl(null);

    try {
      // Select the appropriate generation function based on provider
      const generateFn = aiProvider === AIProvider.NKG ? generateCompositeNKG : generateComposite;

      // Determine what to pass based on mode
      let refImage = null;
      let charProfile = null;
      let modelStyle = null;

      if (mode === 'custom') {
        refImage = customRefFile;
      } else if (mode === 'preset') {
        charProfile = selectedChar;
      } else if (mode === 'model') {
        modelStyle = selectedModel;
      }

      const result = await generateFn(
        faceFile,
        refImage,
        charProfile,
        modelStyle,
        isCoupleModel ? faceFile2 : null // Pass second face for couple models
      );

      setResultUrl(result);
      setStatus(AppStatus.SUCCESS);
    } catch (error: any) {
      console.error(error);
      setStatus(AppStatus.ERROR);
      setErrorMsg(error.message || "Failed to generate image. Please try again.");
    }
  };

  const resetAll = () => {
    setFaceFile(null);
    setFaceFile2(null);
    setCustomRefFile(null);
    setSelectedChar(null);
    setSelectedModel(null);
    setResultUrl(null);
    setStatus(AppStatus.IDLE);
    setAiProvider(AIProvider.NKG);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col font-sans bg-oriental-gradient text-zinc-100 selection:bg-feudal-red/30">
      {/* Compact Header for Mobile */}
      <header className="sticky top-0 z-50 bg-feudal-dark/95 border-b border-feudal-gold/30 backdrop-blur-md">
        <div className="px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-feudal-gold bg-feudal-red flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              <Sparkles className="text-feudal-gold w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl lg:text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-feudal-gold to-feudal-goldLight">
                Huyền Tình Dạ Trạch
              </h1>
              <span className="hidden sm:block text-[9px] sm:text-[10px] text-feudal-gold/60 tracking-[0.15em] uppercase font-serif">
                Cinematic Experience
              </span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-feudal-red/20 border border-feudal-gold/20">
            <Sparkles size={12} className="text-feudal-gold animate-pulse" />
            <span className="text-[10px] sm:text-xs text-feudal-gold/80 font-serif italic">Đài truyền hình Hà Nội</span>
          </div>
        </div>
      </header>

      {/* Main Content - Mobile-First Layout */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-2 sm:p-4 lg:p-6">

          {/* Intro Section - Hidden on mobile, visible on tablet+ */}
          <div className="hidden sm:block text-center mb-4 lg:mb-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-feudal-gold mb-2 drop-shadow-md">
              Hoá Thân Cốt Cách
            </h2>
            <p className="text-zinc-400 font-serif italic text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
              "Ngược dòng thời gian, tìm lại bản ngã trong thế giới Huyền Tình Dạ Trạch"
            </p>
          </div>

          {/* Mobile: Stacked Layout | Desktop: Side by Side */}
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-6">

            {/* LEFT PANEL: Controls */}
            <div className="lg:w-[420px] flex flex-col gap-2 sm:gap-3 lg:gap-4">

              {/* Section 1: Upload Photos */}
              <div className="bg-feudal-dark/60 rounded-lg border border-feudal-gold/30 p-3 sm:p-4">
                <h3 className="text-xs sm:text-sm lg:text-base font-display font-bold text-feudal-gold mb-2 sm:mb-3 flex items-center gap-1.5">
                  <Image size={14} className="sm:w-4 sm:h-4" />
                  <span>{isCoupleModel ? '1. Tải ảnh (2 người)' : '1. Tải ảnh chân dung'}</span>
                </h3>
                <p className="hidden sm:block text-[11px] lg:text-xs text-zinc-500 font-serif italic mb-3">
                  {isCoupleModel ? 'Upload 2 ảnh rõ mặt của 2 người bạn muốn hoá thân' : 'Upload ảnh chân dung rõ mặt của bạn'}
                </p>

                {isCoupleModel ? (
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <UploadZone
                      id="face-upload-1"
                      label="👤 Người 1"
                      subLabel="Nam / Cha"
                      file={faceFile}
                      onFileSelect={setFaceFile}
                      minimal={true}
                      compact={true}
                    />
                    <UploadZone
                      id="face-upload-2"
                      label="👤 Người 2"
                      subLabel="Nữ / Con"
                      file={faceFile2}
                      onFileSelect={setFaceFile2}
                      minimal={true}
                      compact={true}
                    />
                  </div>
                ) : (
                  <UploadZone
                    id="face-upload"
                    label="Chọn ảnh"
                    subLabel="Ảnh rõ mặt"
                    file={faceFile}
                    onFileSelect={setFaceFile}
                    minimal={true}
                    compact={true}
                  />
                )}
              </div>

              {/* Section 2: Model Selection - Compact Grid */}
              <div className="bg-feudal-dark/60 rounded-lg border border-feudal-gold/30 p-3 sm:p-4 flex-1 min-h-0">
                <h3 className="text-xs sm:text-sm lg:text-base font-display font-bold text-feudal-gold mb-1 sm:mb-2 flex items-center gap-1.5">
                  <Users size={14} className="sm:w-4 sm:h-4" />
                  <span>2. Chọn nhân vật hoá thân</span>
                </h3>
                <p className="hidden sm:block text-[11px] lg:text-xs text-zinc-500 font-serif italic mb-3">
                  Chọn nhân vật bạn muốn hoá thân trong thế giới cổ trang
                </p>

                <div className="h-[180px] sm:h-[240px] lg:h-[320px] overflow-y-auto custom-scrollbar">
                  <ModelStyleSelector
                    selectedId={selectedModel?.id || null}
                    onSelect={setSelectedModel}
                    onRandom={handleRandomizeModel}
                  />
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className={`
                  w-full py-3 sm:py-4 rounded-lg font-display font-bold text-sm sm:text-base flex items-center justify-center gap-2 sm:gap-3
                  transition-all duration-300 shadow-lg border
                  ${canGenerate
                    ? 'bg-gradient-to-r from-feudal-red to-red-900 border-feudal-gold text-feudal-goldLight hover:brightness-110 active:scale-[0.98]'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed'
                  }
                `}
              >
                {status === AppStatus.GENERATING ? (
                  <span className="animate-pulse">Đang tạo ảnh...</span>
                ) : (
                  <>
                    <Zap size={18} className={canGenerate ? "fill-feudal-gold text-feudal-gold" : ""} />
                    <span>Khai Mở Ấn Chú</span>
                    <ArrowRight size={18} className="opacity-70" />
                  </>
                )}
              </button>

              {status === AppStatus.ERROR && (
                <div className="p-2 bg-red-950/50 border border-red-900/50 rounded-lg flex items-start gap-2">
                  <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-300">{errorMsg}</p>
                </div>
              )}
            </div>

            {/* RIGHT PANEL: Result Display */}
            <div className="flex-1 min-h-[300px] sm:min-h-[400px] lg:min-h-0">
              <div className="h-full bg-black/60 rounded-lg border border-feudal-gold/30 overflow-hidden relative">
                {/* Decorative border */}
                <div className="absolute inset-0 rounded-lg pointer-events-none border-2 border-feudal-gold/10"></div>

                <div className="h-full p-2 sm:p-4">
                  <ResultDisplay
                    imageUrl={resultUrl}
                    isLoading={status === AppStatus.GENERATING}
                    onReset={resetAll}
                    defaultText={selectedChar?.quote || ""}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Compact Footer */}
      <footer className="py-2 border-t border-feudal-gold/10 bg-black/40">
        <div className="text-center">
          <p className="text-feudal-gold/50 text-[10px]">
            Huyền Tình Dạ Trạch World © 2024 | Đài truyền hình Hà Nội
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;