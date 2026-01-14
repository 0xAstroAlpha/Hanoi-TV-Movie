import React, { useState, useRef, useEffect } from 'react';
import { Download, RefreshCw, Wand2, Type, ImagePlus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Draggable } from './Draggable';
import { fileToBase64 } from '../services/fileUtils';

interface ResultDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  onReset: () => void;
  defaultText?: string;
}

interface OverlayState {
  text: string;
  logo: string | null; // Base64
  textPos: { x: number; y: number };
  logoPos: { x: number; y: number };
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  imageUrl, 
  isLoading, 
  onReset,
  defaultText = "" 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [overlays, setOverlays] = useState<OverlayState>({
    text: '',
    logo: null,
    textPos: { x: 50, y: 50 },
    logoPos: { x: 50, y: 50 }
  });
  const [showTools, setShowTools] = useState(false);
  const [isProcessingDownload, setIsProcessingDownload] = useState(false);

  // Reset overlays when a new image is generated
  useEffect(() => {
    if (imageUrl) {
      setOverlays({
        text: defaultText,
        logo: null,
        textPos: { x: 50, y: 400 }, // Position lower for quotes
        logoPos: { x: 50, y: 50 }
      });
      setShowTools(true);
    } else {
      setShowTools(false);
    }
  }, [imageUrl, defaultText]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await fileToBase64(e.target.files[0]);
        const mime = e.target.files[0].type;
        setOverlays(prev => ({ ...prev, logo: `data:${mime};base64,${base64}` }));
      } catch (err) {
        console.error("Logo upload failed", err);
      }
    }
  };

  const handleDownloadComposite = async () => {
    if (!imageRef.current || !imageUrl) return;
    setIsProcessingDownload(true);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mainImg = new Image();
    mainImg.crossOrigin = "anonymous";
    mainImg.src = imageUrl;

    await new Promise((resolve) => { mainImg.onload = resolve; });

    canvas.width = mainImg.naturalWidth;
    canvas.height = mainImg.naturalHeight;

    ctx.drawImage(mainImg, 0, 0);

    if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const scaleX = canvas.width / containerRect.width;
        const scaleY = canvas.height / containerRect.height;

        // Draw Text
        if (overlays.text) {
            const fontSize = 42 * scaleX; 
            ctx.font = `bold italic ${fontSize}px "Playfair Display", serif`;
            ctx.fillStyle = "#FDE68A"; // Gold Light
            ctx.textAlign = "center";
            
            // Glow effect
            ctx.shadowColor = "#7F1D1D"; // Red glow
            ctx.shadowBlur = 15;
            ctx.fillText(overlays.text, overlays.textPos.x * scaleX, (overlays.textPos.y * scaleY) + fontSize);
            
            ctx.shadowBlur = 0;
            ctx.lineWidth = 2 * scaleX;
            ctx.strokeStyle = '#2a0a0a';
            ctx.strokeText(overlays.text, overlays.textPos.x * scaleX, (overlays.textPos.y * scaleY) + fontSize);
        }

        if (overlays.logo) {
            const logoImg = new Image();
            logoImg.src = overlays.logo;
            await new Promise((resolve) => { logoImg.onload = resolve; });
            
            const logoWidth = 120 * scaleX; 
            const logoHeight = (logoImg.naturalHeight / logoImg.naturalWidth) * logoWidth;
            
            ctx.drawImage(logoImg, overlays.logoPos.x * scaleX, overlays.logoPos.y * scaleY, logoWidth, logoHeight);
        }
    }

    const link = document.createElement('a');
    link.download = 'huyen-tinh-da-trach-card.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    setIsProcessingDownload(false);
  };

  if (!imageUrl && !isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-12 text-feudal-gold/30 border-2 border-dashed border-feudal-gold/20 rounded-xl bg-black/20">
        <Wand2 size={48} className="mb-4 opacity-50" />
        <p className="text-lg font-display">Chưa có kết quả</p>
        <p className="text-sm font-serif italic text-zinc-500">Vui lòng tải ảnh và chọn nhân vật để bắt đầu</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="w-24 h-24 border-4 border-feudal-gold/20 border-t-feudal-gold rounded-full animate-spin mb-6 shadow-[0_0_20px_rgba(212,175,55,0.2)]"></div>
        <h3 className="text-xl font-display font-bold text-feudal-gold mb-2 animate-pulse">Đang Kết Nối Tiền Kiếp...</h3>
        <p className="text-sm text-zinc-400 font-serif italic">Thần thái đang được tái tạo.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative flex-1 min-h-0 group"
      >
        <div ref={containerRef} className="relative w-full h-full overflow-hidden rounded-lg shadow-2xl">
          <img 
            ref={imageRef}
            src={imageUrl!} 
            alt="Generated result" 
            className="w-full h-full object-contain mx-auto pointer-events-none"
          />

          {overlays.logo && (
            <Draggable 
              containerRef={containerRef} 
              initialPos={overlays.logoPos}
              onPosChange={(pos) => setOverlays(prev => ({ ...prev, logoPos: pos }))}
              className="z-20 group/logo"
            >
              <div className="relative">
                <img 
                  src={overlays.logo} 
                  alt="Logo Overlay" 
                  className="w-32 h-auto drop-shadow-lg" 
                  draggable={false}
                />
                <button 
                  onClick={() => setOverlays(p => ({ ...p, logo: null }))}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover/logo:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            </Draggable>
          )}

          {overlays.text && (
            <Draggable 
              containerRef={containerRef} 
              initialPos={overlays.textPos}
              onPosChange={(pos) => setOverlays(prev => ({ ...prev, textPos: pos }))}
              className="z-30 group/text w-full text-center px-8"
            >
              <div className="relative">
                <p 
                  className="text-2xl md:text-3xl font-serif font-bold italic text-feudal-goldLight whitespace-pre-wrap select-none cursor-move text-center"
                  style={{
                    textShadow: `
                      0 2px 4px rgba(0,0,0,0.9),
                      0 0 10px rgba(127, 29, 29, 0.8)
                    `,
                    fontFamily: '"Playfair Display", serif'
                  }}
                >
                  “{overlays.text}”
                </p>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-feudal-gold text-[10px] px-2 rounded opacity-0 group-hover/text:opacity-100 whitespace-nowrap pointer-events-none">
                    Kéo để di chuyển
                </div>
              </div>
            </Draggable>
          )}
        </div>
      </motion.div>

      {/* Editing Toolbar */}
      <AnimatePresence>
        {showTools && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row gap-4 bg-feudal-dark/80 backdrop-blur-md p-3 rounded-xl border border-feudal-gold/30"
          >
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-feudal-gold" size={16} />
                <input 
                  type="text" 
                  placeholder="Nhập trích dẫn..."
                  value={overlays.text}
                  onChange={(e) => setOverlays(p => ({ ...p, text: e.target.value }))}
                  className="w-full bg-black/40 border border-feudal-gold/20 rounded-lg pl-10 pr-4 py-2 text-sm text-feudal-goldLight focus:outline-none focus:border-feudal-gold placeholder:text-zinc-600 font-serif"
                />
              </div>
            </div>

            <div className="flex gap-2">
               <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-feudal-red/20 hover:bg-feudal-red/40 rounded-lg text-sm text-feudal-gold transition-colors border border-feudal-gold/20">
                 <ImagePlus size={16} />
                 <span>Logo</span>
                 <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
               </label>
            </div>

            <div className="w-px bg-feudal-gold/20 hidden sm:block"></div>

            <div className="flex gap-2">
                <button 
                  onClick={handleDownloadComposite}
                  disabled={isProcessingDownload}
                  className="flex items-center gap-2 px-5 py-2 bg-feudal-gold text-black rounded-lg font-bold font-display hover:bg-yellow-500 transition-colors shadow-lg"
                >
                  {isProcessingDownload ? (
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  ) : (
                    <Download size={18} />
                  )}
                  <span>Lưu Ảnh</span>
                </button>
                <button 
                  onClick={onReset}
                  className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-lg transition-colors border border-zinc-700"
                  title="Làm mới"
                >
                  <RefreshCw size={18} />
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};