import React from 'react';
import { Scroll, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-feudal-dark/90 border-b border-feudal-gold/30 backdrop-blur-md shadow-lg shadow-black/50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-feudal-gold bg-feudal-red flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <Scroll className="text-feudal-gold w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-feudal-gold to-feudal-goldLight tracking-wide">
              Huyền Tình Dạ Trạch
            </h1>
            <span className="text-[10px] text-feudal-gold/60 tracking-[0.2em] uppercase font-serif">
              Cinematic Experience
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-feudal-red/20 border border-feudal-gold/20">
            <Sparkles size={14} className="text-feudal-gold animate-pulse" />
            <span className="text-xs text-feudal-gold/80 font-serif italic">Đài truyền hình Hà Nội</span>
          </div>
        </div>
      </div>
      {/* Decorative Line */}
      <div className="h-[1px] w-full bg-gold-border opacity-50"></div>
    </header>
  );
};