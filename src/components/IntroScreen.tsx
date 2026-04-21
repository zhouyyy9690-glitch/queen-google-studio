import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface IntroScreenProps {
  onComplete: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'title' | 'tips'>('title');
  const [titleFinished, setTitleFinished] = useState(false);

  useEffect(() => {
    if (stage === 'title') {
      // 标题动画总时长 8 秒
      const titleTimer = setTimeout(() => {
        setTitleFinished(true);
        // 标题完全隐没后再等待 1.5 秒切换到注意事项（原 5 秒，缩短为 1.5 秒）
        const waitTimer = setTimeout(() => {
          setStage('tips');
        }, 1500);
        return () => clearTimeout(waitTimer);
      }, 8000);
      return () => clearTimeout(titleTimer);
    }
  }, [stage]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="fixed inset-0 z-[5000] bg-black flex flex-col items-center justify-center text-center overflow-hidden cursor-none"
      onClick={() => {
        if (stage === 'title') {
          // 点击跳过标题阶段，直接等待1.5秒后进入提示页
          setTitleFinished(true);
          setTimeout(() => setStage('tips'), 1500);
        } else {
          onComplete();
        }
      }}
    >
      <AnimatePresence mode="wait">
        {stage === 'title' ? (
          <motion.div
            key="title-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center w-full h-full bg-black relative"
          >
            <div className="relative z-10">
              {/* 主标题 */}
              <motion.h1 
                className="font-gothic text-5xl md:text-7xl lg:text-8xl font-black tracking-widest uppercase text-[#5a0a0a]"
                initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                animate={{ 
                  opacity: [0, 1, 1, 0],
                  scale: [0.9, 1, 1.05, 1.05],
                  filter: ["blur(10px)", "blur(0px)", "blur(0px)", "blur(20px)"]
                }}
                transition={{ 
                  duration: 8,
                  times: [0, 0.25, 0.75, 1],
                  ease: "easeInOut"
                }}
              >
                The Crimson Queen
              </motion.h1>

              {/* 中文标题（与主标题同步动画） */}
              <motion.div 
                className="font-gothic text-base md:text-xl tracking-[0.6em] text-[#8a6e4b] mt-8"
                initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
                animate={{ 
                  opacity: [0, 1, 1, 0],
                  y: [20, 0, -5, -10],
                  filter: ["blur(5px)", "blur(0px)", "blur(0px)", "blur(15px)"]
                }}
                transition={{ 
                  duration: 8,
                  times: [0, 0.3, 0.7, 1],
                  ease: "easeInOut"
                }}
              >
                ✦ 绛红女王 ✦
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="tips-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="flex flex-col items-center justify-center w-full h-full bg-black"
          >
            {/* 平铺电影风格提示文字 */}
            <div className="max-w-md px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                <p className="text-white/70 text-sm md:text-base leading-relaxed font-serif tracking-wide mb-4">
                  本故事纯属虚构
                </p>
                <p className="text-white/50 text-xs md:text-sm leading-relaxed font-serif tracking-wide">
                  涉及政治、情感与成人内容，请斟酌体验。
                </p>
                <div className="mt-12 flex justify-center gap-2 text-[10px] text-white/30 font-mono tracking-widest">
                  <span>✦</span>
                  <span>INITIALIZING CHRONICLE</span>
                  <motion.span 
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 跳过提示 */}
      <div className="absolute bottom-10 right-10 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onComplete();
          }}
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#333] hover:text-[#aa6f6f] transition-colors cursor-none flex items-center gap-2 group"
        >
          <span className="group-hover:translate-x-1 transition-transform">⏵</span>
          跳过 · Skip
        </button>
      </div>
    </motion.div>
  );
};