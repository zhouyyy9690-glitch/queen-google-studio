import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface GameIntroTextProps {
  isVisible?: boolean;
}

export const GameIntroText: React.FC<GameIntroTextProps> = ({ isVisible = true }) => {
  return (
    <div className="absolute inset-0 z-[600] flex items-center justify-center pointer-events-none select-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div 
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(15px)' }}
            transition={{ duration: 1.5 }}
            className="flex flex-col items-center text-center px-8 max-w-3xl mix-blend-screen"
          >
            {/* 主标题：绛红女王 */}
            <div className="relative mb-10">
              <h1 className="text-5xl md:text-7xl font-chinese font-black tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-b from-[#c92a2a] via-[#8c0505] to-[#4a0000] drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                绛红女王
              </h1>
              <div className="mt-4 text-xs md:text-sm font-display tracking-[0.8em] text-[#b38b5d]/80 uppercase italic">
                The Crimson Queen
              </div>
              
              {/* 华丽装饰线 */}
              <div className="relative mt-6 h-[1px] w-full max-w-[240px] mx-auto overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" />
                <div className="absolute inset-0 bg-white/5 opacity-10" />
              </div>
            </div>

            {/* 叙事段落 */}
            <div className="space-y-8 relative">
              <div className="space-y-4">
                <p className="text-lg md:text-xl font-chinese leading-relaxed text-[#fdfaf3]/90 tracking-[0.15em] font-light">
                  <span className="opacity-60 italic mr-2">—</span>
                  自古以来，狐狸奔跑大地，黑鹰飞翔天空，红鹿踱步林间。
                </p>
                <p className="text-base md:text-lg font-chinese leading-relaxed text-[#c9c1af]/80 tracking-widest">
                  直到劳顿·赫西与伊莎贝拉·赫西的女儿——
                </p>
                <p className="text-xl md:text-2xl font-chinese font-medium leading-relaxed text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#e2c18d] tracking-[0.25em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                  征服王国的公主，凯瑟琳·赫西诞生。
                </p>
              </div>

              {/* 英文翻译 */}
              <div className="pt-6 border-t border-white/5 space-y-3 max-w-xl mx-auto">
                <p className="text-[9px] md:text-[10px] font-display uppercase tracking-[0.2em] leading-relaxed text-[#b38b5d]/50 italic">
                  Since time immemorial, the fox has roamed the earth, the black eagle has soared high, and the red deer has wandered through the woods.
                </p>
                <p className="text-[9px] md:text-[10px] font-display uppercase tracking-[0.2em] leading-relaxed text-[#b38b5d]/50 italic">
                  Until the daughter of Lord Hussey and Isabella Hussey — Princess Catherine Hussey, conqueror of realms — came into this world.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
