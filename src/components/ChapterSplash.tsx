import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ChapterSplashProps {
  chapterNumber: string;
  chapterTitle: string;
  chapterSubtitle?: string;
  onContinue: () => void;
}

const DetailedOrnateCorner = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => {
  const rotations = {
    tl: 'rotate-0',
    tr: 'rotate-90',
    bl: 'rotate-270',
    br: 'rotate-180'
  };
  const positions = {
    tl: 'top-0 left-0',
    tr: 'top-0 right-0',
    bl: 'bottom-0 left-0',
    br: 'bottom-0 right-0'
  };

  return (
    <div className={`absolute ${positions[position]} ${rotations[position]} w-32 h-32 md:w-48 md:h-48 pointer-events-none`}>
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-amber-950/40">
        {/* Main Elaborate Curvature */}
        <path d="M20 20C20 20 60 25 80 40M20 20C20 20 25 60 40 80" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M40 20C40 20 50 35 70 45M20 40C20 40 35 50 45 70" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
        <path d="M30 30C35 45 60 55 100 60" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 4"/>
        <path d="M30 30C45 35 55 60 60 100" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 4"/>
        
        {/* Spirals */}
        <path d="M50 50C55 45 60 45 65 50C70 55 70 60 65 65C60 70 55 70 50 65" stroke="currentColor" strokeWidth="0.5"/>
        
        {/* Floral/Classic Motifs */}
        <circle cx="20" cy="20" r="5" fill="currentColor"/>
        <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="0.5"/>
        
        {/* Outer Accent Lines */}
        <path d="M12 12H160M12 12V160" stroke="currentColor" strokeWidth="4" strokeLinecap="square" className="opacity-40"/>
        <path d="M8 8H170M8 8V170" stroke="currentColor" strokeWidth="1" className="opacity-30"/>
        <path d="M4 4H180M4 4V180" stroke="currentColor" strokeWidth="0.5" className="opacity-10"/>
      </svg>
    </div>
  );
};

// 章节转场/标题页组件：当玩家进入新章节时显示的华丽全屏封面
export const ChapterSplash: React.FC<ChapterSplashProps> = ({ 
  chapterNumber, 
  chapterTitle, 
  chapterSubtitle,
  onContinue 
}) => {
  const [isExiting, setIsExiting] = useState(false); // 控制退出动画的状态

  // 处理点击退出：触发华丽的消失动画并在延迟后继续游戏
  const handleStartExit = () => {
    if (isExiting) return;
    setIsExiting(true);
    // 动画时间调整为 1.8 秒，以便在墨水/渐隐效果最明显时跳转
    setTimeout(onContinue, 1800);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a] cursor-pointer"
      onClick={handleStartExit}
    >
      {/* 羊皮纸底层背景与纹理叠加 */}
      <div className="absolute inset-0 bg-[#e3bc6a] opacity-90" />
      <div className="absolute inset-0 opacity-40 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/old-map.png')]" />
      <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
      
      {/* 华丽的边框装饰结构 */}
      <motion.div 
        animate={isExiting ? { scale: 1.02, opacity: 0, filter: "blur(20px)" } : { scale: 1, opacity: 1 }}
        transition={{ duration: 2.0, ease: "easeInOut" }}
        className="absolute inset-6 md:inset-12 border border-amber-950/20 flex items-center justify-center"
      >
        <DetailedOrnateCorner position="tl" />
        <DetailedOrnateCorner position="tr" />
        <DetailedOrnateCorner position="bl" />
        <DetailedOrnateCorner position="br" />
      </motion.div>

      {/* 中心文字内容区域 */}
      <div className="relative z-10 text-center max-w-2xl px-8 select-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isExiting 
            ? { 
                opacity: [1, 0.7, 0.4, 0.1, 0], 
                scale: 1.35, 
                filter: ["blur(0px)", "blur(15px)", "blur(35px)", "blur(55px)", "blur(75px)"],
                y: -10
              } 
            : { opacity: 1, y: 0 }
          }
          transition={isExiting 
            ? { duration: 3.0, ease: [0.22, 1, 0.36, 1] } 
            : { delay: 0.5, duration: 2 }
          }
          className="space-y-12"
        >
          {/* 章节页眉：拉丁语标题与罗马数字 */}
          <div className="flex flex-col items-center">
            <div className={`w-12 h-px bg-amber-950/40 mb-6 transition-all duration-1200 ${isExiting ? 'w-80 opacity-0' : ''}`} />
            <h4 className="font-typewriter italic text-amber-950/60 tracking-[0.4em] uppercase text-sm md:text-base">
              Incipit Liber (卷首)
            </h4>
            <h2 className="font-typewriter text-5xl md:text-7xl text-amber-950 tracking-[0.2em] mt-2 mb-2">
              {chapterNumber}
            </h2>
            <div className={`w-12 h-px bg-amber-950/40 mt-4 transition-all duration-1200 ${isExiting ? 'w-80 opacity-0' : ''}`} />
          </div>

          {/* 章节主、副标题：带有墨水晕开效果的渐变动画 */}
          <div className="space-y-4">
            <motion.h1 
              animate={isExiting ? { letterSpacing: "0.3em", opacity: 0.6 } : {}}
              transition={{ duration: 2.5 }}
              className="font-typewriter text-4xl md:text-6xl text-amber-900 tracking-tight leading-none"
            >
              {chapterTitle}
            </motion.h1>
            {chapterSubtitle && (
              <p className="font-typewriter italic text-amber-800/70 text-xl md:text-2xl tracking-widest uppercase">
                {chapterSubtitle}
              </p>
            )}
          </div>

          {/* 交互提示词 */}
          <AnimatePresence>
            {!isExiting && (
              <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: [0, 1, 0] }}
                 exit={{ opacity: 0 }}
                 transition={{ repeat: Infinity, duration: 4, delay: 3 }}
                 className="pt-20"
              >
                <p className="font-typewriter text-amber-950/40 text-[10px] tracking-[0.4em] uppercase">
                  点击屏幕，揭开命运的篇章 · Tap to unroll the destiny
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      
      {/* 装饰边框与阴影叠加 */}
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.6)_100%)] shadow-inner" />
    </motion.div>
  );
};
