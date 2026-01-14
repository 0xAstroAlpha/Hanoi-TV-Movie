import React from 'react';
import { CHARACTERS } from '../data/characters';
import { CharacterProfile } from '../types';
import { Sparkles, Dices } from 'lucide-react';

interface CharacterSelectorProps {
  selectedId: string | null;
  onSelect: (char: CharacterProfile) => void;
  onRandom: () => void;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({ 
  selectedId, 
  onSelect,
  onRandom
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {CHARACTERS.map((char) => (
          <button
            key={char.id}
            onClick={() => onSelect(char)}
            className={`
              relative p-3 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 group
              ${selectedId === char.id 
                ? 'bg-feudal-red/20 border-feudal-gold shadow-[0_0_10px_rgba(212,175,55,0.2)]' 
                : 'bg-feudal-navy/20 border-feudal-gold/20 hover:border-feudal-gold/60 hover:bg-feudal-navy/40'
              }
            `}
          >
            <div className="text-2xl sm:text-3xl filter drop-shadow-lg group-hover:scale-110 transition-transform">
              {char.icon}
            </div>
            <div className="text-center">
              <p className={`text-xs font-bold font-display ${selectedId === char.id ? 'text-feudal-gold' : 'text-zinc-400'}`}>
                {char.name}
              </p>
              <p className="text-[10px] text-zinc-500 hidden sm:block mt-1 italic">
                {char.title}
              </p>
            </div>
            {selectedId === char.id && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-feudal-gold rounded-full flex items-center justify-center">
                    <Sparkles size={10} className="text-black" />
                </div>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={onRandom}
        className="relative overflow-hidden w-full py-3 rounded-xl border border-feudal-gold/50 group bg-gradient-to-r from-feudal-red/10 to-feudal-navy/10 hover:from-feudal-red/20 hover:to-feudal-navy/20 transition-all"
      >
        <div className="flex items-center justify-center gap-2 text-feudal-gold font-display font-bold">
            <Dices className="group-hover:rotate-180 transition-transform duration-500" />
            <span>Vận Mệnh An Bài (Random)</span>
        </div>
      </button>
    </div>
  );
};