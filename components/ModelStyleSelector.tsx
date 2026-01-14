import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ModelStyle } from '../types';
import { getSingleModels, getCoupleModels } from '../data/modelStyles';
import { User, Users, ChevronDown, Check } from 'lucide-react';

interface ModelStyleSelectorProps {
    selectedId: string | null;
    onSelect: (model: ModelStyle) => void;
    onRandom: () => void;
}

export const ModelStyleSelector: React.FC<ModelStyleSelectorProps> = ({
    selectedId,
    onSelect,
    onRandom
}) => {
    const [tab, setTab] = useState<'single' | 'couple'>('single');
    const [showScrollHint, setShowScrollHint] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    const singleModels = getSingleModels();
    const coupleModels = getCoupleModels();
    const currentModels = tab === 'single' ? singleModels : coupleModels;

    // Auto-select first model when switching tabs
    const handleTabChange = (newTab: 'single' | 'couple') => {
        setTab(newTab);
        const models = newTab === 'single' ? singleModels : coupleModels;
        if (models.length > 0) {
            onSelect(models[0]);
        }
    };

    // Handle random selection
    const handleRandomClick = () => {
        const randomModel = currentModels[Math.floor(Math.random() * currentModels.length)];
        onSelect(randomModel);
    };

    // Check scroll position to hide hint
    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            // Hide hint if scrolled more than 20px or near bottom
            setShowScrollHint(scrollTop < 20 && scrollHeight > clientHeight + 50);
        }
    };

    useEffect(() => {
        const scrollEl = scrollRef.current;
        if (scrollEl) {
            scrollEl.addEventListener('scroll', handleScroll);
            // Initial check
            handleScroll();
            return () => scrollEl.removeEventListener('scroll', handleScroll);
        }
    }, [tab]);

    return (
        <div className="flex flex-col h-full">
            {/* Tabs: Single vs Couple */}
            <div className="flex p-0.5 sm:p-1 bg-black/40 rounded-lg mb-2 sm:mb-3 border border-white/5">
                <button
                    onClick={() => handleTabChange('single')}
                    className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-1.5 sm:py-2 rounded-md text-[10px] sm:text-xs font-bold transition-all ${tab === 'single'
                        ? 'bg-feudal-gold text-black shadow-lg'
                        : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                >
                    <User size={12} className="sm:w-[14px] sm:h-[14px]" />
                    <span>Đơn ({singleModels.length})</span>
                </button>
                <button
                    onClick={() => handleTabChange('couple')}
                    className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-1.5 sm:py-2 rounded-md text-[10px] sm:text-xs font-bold transition-all ${tab === 'couple'
                        ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg'
                        : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                >
                    <Users size={12} className="sm:w-[14px] sm:h-[14px]" />
                    <span>Đôi ({coupleModels.length})</span>
                </button>
            </div>

            {/* Header with Random Button */}
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-[9px] sm:text-[10px] text-zinc-500">
                    {tab === 'couple' ? '⚡ Cần 2 ảnh' : `${currentModels.length} mẫu`}
                </span>
                <button
                    onClick={handleRandomClick}
                    className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-black/40 border border-feudal-gold/30
                     text-[9px] sm:text-[10px] font-bold text-feudal-gold/80
                     hover:bg-feudal-gold/10 transition-all flex items-center gap-1"
                >
                    <span>🎲</span>
                    <span className="hidden sm:inline">Ngẫu Nhiên</span>
                    <span className="sm:hidden">Ngẫu nhiên</span>
                </button>
            </div>

            {/* Scrollable Model Grid - with scroll indicator */}
            <div className="flex-1 relative min-h-0">
                <div
                    ref={scrollRef}
                    className="absolute inset-0 overflow-y-auto pr-0.5 custom-scrollbar"
                >
                    {/* Grid: 4 cols mobile/tablet, allows seeing more options at once */}
                    <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-1 sm:gap-1.5">
                        {currentModels.map((model) => (
                            <button
                                key={model.id}
                                onClick={() => onSelect(model)}
                                className={`
                                    relative group rounded-md sm:rounded-lg overflow-hidden border transition-all duration-200
                                    aspect-square bg-black/40
                                    ${selectedId === model.id
                                        ? 'border-feudal-gold ring-1 sm:ring-2 ring-feudal-gold/50 scale-105 z-10'
                                        : 'border-white/10 hover:border-feudal-gold/50 active:scale-95'
                                    }
                                `}
                                title={model.name}
                            >
                                {/* Model Thumbnail */}
                                <img
                                    src={model.thumbPath || model.imagePath}
                                    alt={model.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover"
                                />

                                {/* Always show name on mobile for better discovery */}
                                <div className={`
                                    absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent 
                                    p-0.5 sm:p-1 transition-opacity
                                    ${selectedId === model.id ? 'opacity-100' : 'sm:opacity-0 sm:group-hover:opacity-100'}
                                `}>
                                    <span className="text-[7px] sm:text-[9px] font-bold text-feudal-gold leading-tight line-clamp-1">
                                        {model.name}
                                    </span>
                                </div>

                                {/* Selected Indicator with animation */}
                                {selectedId === model.id && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="absolute top-0.5 right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-feudal-gold rounded-full flex items-center justify-center shadow-lg"
                                    >
                                        <Check className="text-black w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={3} />
                                    </motion.div>
                                )}

                                {/* Couple Badge */}
                                {model.characterCount === 2 && (
                                    <div className="absolute top-0.5 left-0.5 px-0.5 sm:px-1 py-0.5 bg-pink-500/90 rounded text-[6px] sm:text-[7px] font-bold text-white">
                                        2P
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scroll hint overlay - fade at bottom */}
                {showScrollHint && currentModels.length > 10 && (
                    <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-feudal-dark/90 to-transparent pointer-events-none flex items-end justify-center pb-1">
                        <div className="flex items-center gap-1 text-[9px] text-feudal-gold/70 animate-bounce">
                            <ChevronDown size={12} />
                            <span>Cuộn xem thêm</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Selected Model Info - Compact */}
            {selectedId && (
                <div className="mt-1.5 sm:mt-2 p-1.5 sm:p-2 bg-black/40 rounded-lg border border-feudal-gold/20">
                    {[...singleModels, ...coupleModels].filter(m => m.id === selectedId).map(model => (
                        <div key={model.id} className="flex items-center gap-1.5 sm:gap-2">
                            <img
                                src={model.thumbPath || model.imagePath}
                                alt={model.name}
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded object-cover"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1">
                                    <h4 className="text-[10px] sm:text-xs font-display font-bold text-feudal-gold truncate">{model.name}</h4>
                                    {model.characterCount === 2 && (
                                        <span className="px-1 py-0.5 bg-pink-500/80 rounded text-[7px] sm:text-[8px] font-bold text-white shrink-0">2 ảnh</span>
                                    )}
                                </div>
                                <p className="text-[9px] sm:text-[10px] text-zinc-500 truncate">{model.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
