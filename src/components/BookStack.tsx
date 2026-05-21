import React from 'react';
import { motion } from 'motion/react';

import { Lock } from 'lucide-react';

interface BookStackProps {
  onEntryClick: () => void;
  onCompendiumClick: () => void;
  onChapterClick: () => void;
  onMapClick: () => void;
  onEndingClick: () => void;
  unlockedEndingsCount?: number;
  isEntryLocked?: boolean;
}

/**
 * 桌面最终组合组件 - 已锁定
 * 视觉交互仅保留烛光微闪，移除位移与旋转悬停动画。
 * 层级：手稿(100) < 黑书(200) < 白书(300) < 红书(400)
 */
export const BookStack: React.FC<BookStackProps> = ({ 
  onEntryClick, 
  onCompendiumClick, 
  onChapterClick, 
  onMapClick, 
  onEndingClick,
  isEntryLocked
}) => {
  // --- 1. 已锁死的坐标配置 ---
  const FIXED_CONFIG = {
    paper:  { right: -0.7,  top: -54, rotate: 127, z: 100 },
    black:  { right: -13.9, top: -11, rotate: -22, z: 200 },
    white:  { right: -12.5, top: 74,  rotate: -58, z: 300 },
    scroll: { right: 45.9,  top: 6,   rotate: 167, z: 350 },
    red:    { right: -12.7, top: -16, rotate: -29, z: 400 },
    ink:    { right: 94.2,  top: 195, rotate: 0,   z: 450 },
    lamp:   { right: 86.3,  top: -13, rotate: 0,   z: 500 },
  };

  // 烛光滤镜：仅改变光亮感，不产生物理变形
  const flickerAnimation = {
    filter: [
      "brightness(1) contrast(1)",
      "brightness(1.05) contrast(1.02)",
      "brightness(0.98) contrast(0.99)",
      "brightness(1.08) contrast(1.05)",
      "brightness(1.02) contrast(1.01)"
    ],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const }
  };

  return (
    <div className="absolute inset-0 z-[500] pointer-events-none select-none overflow-visible">
      
      {/* 墨水瓶 */}
      <motion.div
        animate={flickerAnimation}
        className="absolute pointer-events-auto"
        style={{
          right: `${FIXED_CONFIG.ink.right}%`,
          top: `${FIXED_CONFIG.ink.top}px`,
          transform: `rotate(${FIXED_CONFIG.ink.rotate}deg)`,
          width: '140px',
          height: '140px',
          zIndex: FIXED_CONFIG.ink.z,
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-white/5 backdrop-blur-[2px] border-2 border-white/20 shadow-2xl flex items-center justify-center relative overflow-hidden">
             <div className="w-[85%] h-[85%] rounded-full bg-gradient-to-br from-[#050505] via-[#111] to-[#050505] shadow-inner relative">
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/4 bg-white/5 blur-md rounded-full rotate-[-30deg]" />
             </div>
             <div className="absolute inset-0 m-auto w-10 h-10 rounded-full border border-white/30 bg-white/5 shadow-inner flex items-center justify-center">
                <div className="w-6 h-6 rounded-full border border-white/10 bg-black/40" />
             </div>
          </div>
          <div className="absolute bottom-[-5px] w-28 h-10 bg-black/60 blur-3xl rounded-full -z-10" />
        </div>
      </motion.div>

      {/* 油灯 */}
      <div
        className="absolute"
        style={{
          right: `${FIXED_CONFIG.lamp.right}%`,
          top: `${FIXED_CONFIG.lamp.top}px`,
          transform: `rotate(${FIXED_CONFIG.lamp.rotate}deg)`,
          width: '180px',
          height: '180px',
          zIndex: FIXED_CONFIG.lamp.z
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute w-[180px] h-[180px] rounded-full shadow-2xl border border-amber-900/20"
                 style={{ background: 'radial-gradient(circle at 40% 30%, #6b5a3e, #2e2210 80%)', boxShadow: 'inset 0 8px 12px rgba(0,0,0,0.8), inset 0 -8px 12px rgba(200,160,80,0.3), 0 12px 24px rgba(0,0,0,0.7)' }} />
            <div className="absolute w-[130px] h-[130px] rounded-full shadow-inner z-[2]"
                 style={{ background: 'radial-gradient(circle at 50% 40%, #1a0f05, #0d0703)', boxShadow: 'inset 0 0 25px rgba(0,0,0,0.9)' }} />
            
            {/* 七星圣纹核心：替代原有火焰 */}
            <div className="absolute w-[80px] h-[80px] z-[5] flex items-center justify-center"
                 style={{ top: '50%', left: '50%', transform: 'translate(-50%, -60%)' }}>
                
                {/* 扩散光晕 */}
                <div className="absolute w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(255,180,20,0.12)_0%,transparent_60%)] animate-[pulse_3s_infinite_ease-in-out]" />
                
                {/* 圣纹核心：中心菱形 */}
                <div className="relative w-6 h-6 border border-amber-400 rotate-45 shadow-[0_0_15px_rgba(251,146,60,0.6)] flex items-center justify-center bg-amber-500/10">
                    <div className="w-2 h-2 rounded-full bg-amber-200 blur-[1px] animate-pulse" />
                </div>

                {/* 环绕的七颗星辰 */}
                {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute"
                      style={{
                        transform: `rotate(${(i * 360) / 7}deg) translateY(-22px)`
                      }}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full bg-amber-400/80 shadow-[0_0_8px_rgba(251,146,60,0.4)] animate-[flicker_${0.2 + i * 0.1}s_infinite_alternate]`} />
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* 红书 (Entry) */}
      <motion.div
        animate={flickerAnimation}
        onClick={() => !isEntryLocked && onEntryClick()}
        className="absolute pointer-events-auto cursor-pointer group"
        style={{
          right: `${FIXED_CONFIG.red.right}%`,
          top: `${FIXED_CONFIG.red.top}px`,
          transform: `rotate(${FIXED_CONFIG.red.rotate}deg)`,
          width: '280px',
          height: '340px',
          zIndex: FIXED_CONFIG.red.z,
          transformStyle: 'preserve-3d',
          perspective: '1200px'
        }}
      >
        <div className="relative w-full h-full bg-[#3d0808] rounded-[2px] shadow-[35px_35px_90px_rgba(0,0,0,0.85)] border border-amber-600/15 overflow-hidden">
           <div className="absolute inset-0 opacity-40 shadow-inner" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/dark-leather.png')" }} />
           
           {/* 古典艺术：当红书未解锁锁死时，在封面中央展示优雅的金色“START”作为进入游戏/翻页的指引提示 */}
           {!isEntryLocked && (
             <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span 
                 id="red-book-start-text"
                 className="text-[#d5b065]/70 group-hover:text-[#f3d99d] text-4xl font-serif tracking-[0.25em] font-light uppercase select-none transition-all duration-500 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
               >
                 Start
               </span>
               {/* 纤细的双渐变工艺金线，强化古典典雅感，悬浮时同样响应微光变亮 */}
               <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#d5b065]/40 to-transparent mt-3 group-hover:via-[#f3d99d]/60 transition-all duration-500" />
             </div>
           )}
           
           {/* 锁的图案 */}
           {isEntryLocked && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]"
             >
               <div className="p-4 rounded-full border-2 border-amber-500/30 bg-amber-950/20 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                 <Lock className="w-12 h-12 text-amber-500 opacity-80" strokeWidth={1.5} />
               </div>
             </motion.div>
           )}
        </div>
      </motion.div>

      {/* 白书 (Compendium) */}
      <motion.div
        animate={flickerAnimation}
        onClick={onCompendiumClick}
        className="absolute pointer-events-auto cursor-pointer group"
        style={{
          right: `${FIXED_CONFIG.white.right}%`,
          top: `${FIXED_CONFIG.white.top}px`,
          transform: `rotate(${FIXED_CONFIG.white.rotate}deg)`,
          width: '290px',
          height: '370px',
          zIndex: FIXED_CONFIG.white.z,
          transformStyle: 'preserve-3d',
          perspective: '1200px'
        }}
      >
        <div 
          className="relative w-full h-full bg-[#fcfcfc] rounded shadow-[20px_20px_60px_rgba(0,0,0,0.4)] border border-black/5 overflow-hidden"
          style={{ transform: 'rotateX(5deg) rotateY(-2deg)' }}
        >
          <div className="absolute inset-0 opacity-10 shadow-inner" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')" }} />
          <div className="absolute left-0 h-full w-[18px] bg-[#f0f0f0] border-r border-black/5 shadow-inner" />
        </div>
      </motion.div>

      {/* 卷轴 (Map) */}
      <motion.div
        animate={flickerAnimation}
        onClick={onMapClick}
        className="absolute pointer-events-auto cursor-pointer group"
        style={{
          right: `${FIXED_CONFIG.scroll.right}%`,
          top: `${FIXED_CONFIG.scroll.top}px`,
          transform: `rotate(${FIXED_CONFIG.scroll.rotate}deg)`,
          width: '380px',
          height: '100px',
          zIndex: FIXED_CONFIG.scroll.z,
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative w-[320px] h-16 bg-[#e3d5b8] shadow-[15px_15px_40px_rgba(0,0,0,0.4)] border-y border-amber-900/10 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-30 shadow-inner" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')" }} />
            <div className="absolute top-0 w-full h-1 bg-white/10" />
            <div className="absolute bottom-0 w-full h-1 bg-black/5" />
            <div className="w-3 h-full bg-[#4a2c1a] shadow-md z-10" />
          </div>
          <div className="absolute left-0 h-24 w-6 bg-gradient-to-r from-[#2a1810] to-[#42291d] rounded shadow-lg border-x border-amber-950/20" />
          <div className="absolute right-0 h-24 w-6 bg-gradient-to-l from-[#2a1810] to-[#42291d] rounded shadow-lg border-x border-amber-950/20" />
        </div>
      </motion.div>

      {/* 黑书 (Chapters) */}
      <motion.div
        animate={flickerAnimation}
        onClick={onChapterClick}
        className="absolute pointer-events-auto cursor-pointer group"
        style={{
          right: `${FIXED_CONFIG.black.right}%`,
          top: `${FIXED_CONFIG.black.top}px`,
          transform: `rotate(${FIXED_CONFIG.black.rotate}deg)`,
          width: '320px',
          height: '420px',
          zIndex: FIXED_CONFIG.black.z
        }}
      >
        <div className="relative w-full h-full bg-[#111] rounded-[4px] shadow-[40px_40px_100px_rgba(0,0,0,0.9)] border border-white/[0.05] overflow-hidden">
           <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/dark-leather.png')" }} />
        </div>
      </motion.div>

      {/* 手稿 (Ending Gallery) */}
      <motion.div
        animate={flickerAnimation}
        onClick={onEndingClick}
        className="absolute pointer-events-auto cursor-pointer group"
        style={{
          right: `${FIXED_CONFIG.paper.right}%`,
          top: `${FIXED_CONFIG.paper.top}px`,
          transform: `rotate(${FIXED_CONFIG.paper.rotate}deg)`,
          width: '320px',
          height: '400px',
          zIndex: FIXED_CONFIG.paper.z
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div 
            key={`ms-${i}`} 
            className="absolute inset-0 bg-[#fdfaf3] shadow-[15px_15px_40px_rgba(0,0,0,0.2)] border border-amber-900/10 origin-center"
            style={{ 
              transform: `rotate(${(i - 1.5) * 4}deg) translate(${i * 2}px, ${-i * 1.5}px)`, 
              zIndex: 4 - i 
            }}
          >
             <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')" }} />
          </div>
        ))}
      </motion.div>

      <style>{`
        @keyframes flicker {
            0% { transform: translate(-50%, -60%) scale(1, 1); }
            25% { transform: translate(-48%, -58%) scale(0.95, 1.05); }
            50% { transform: translate(-50%, -60%) scale(1.02, 0.98); }
            75% { transform: translate(-52%, -62%) scale(0.98, 1.03); }
            100% { transform: translate(-50%, -60%) scale(1, 1); }
        }
        @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};
