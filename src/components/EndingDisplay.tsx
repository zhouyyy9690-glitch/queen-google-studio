import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { OrnateCorner } from './OrnateCorner';
import { TypewriterText } from './TypewriterText';
import { Scene, TextSegment } from '../types';

/**
 * 结局展示组件的属性定义
 * 所有数据和回调函数都通过 props 从 App.tsx 传入
 */
interface EndingDisplayProps {
  scene: Scene; // 当前结局场景数据
  paraIndex: number; // 当前显示的结局段落索引
  onNext: () => void; // 翻阅下一段文本的回调
  onReturn: () => void; // 返回标题页的回调
  renderTextWithDialogue: (text: string, isThought?: boolean) => TextSegment[]; // 文本处理函数
}

/**
 * 结局展示组件：当玩家达到故事终点时触发，提供沉浸式的结局叙事体验
 */
export const EndingDisplay = ({ 
  scene, 
  paraIndex, 
  onNext, 
  onReturn, 
  renderTextWithDialogue 
}: EndingDisplayProps) => {
  // 判断是否为结局的最后一段
  const isLastPara = paraIndex === (scene.paragraphs?.length || 0) - 1; 
  // 获取当前显示的结局段落
  const currentPara = scene.paragraphs?.[paraIndex]; 

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center p-8 overflow-hidden"
    >
      {/* 纹理背景与装饰框架 */}
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-20 pointer-events-none" />
      <div className="absolute inset-4 md:inset-8 border-2 border-double border-amber-900/20 pointer-events-none" />
      
      {/* 四个装饰角落 */}
      <OrnateCorner position="tl" />
      <OrnateCorner position="tr" />
      <OrnateCorner position="bl" />
      <OrnateCorner position="br" />

      <div className="relative max-w-2xl lg:max-w-4xl w-full text-center space-y-12 md:space-y-16">
        {/* 结局标题展示 */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="space-y-4"
        >
          <motion.h2 
            animate={{ 
              textShadow: [
                "0 0 10px rgba(217,119,6,0.2)",
                "0 0 25px rgba(217,119,6,0.5)",
                "0 0 10px rgba(217,119,6,0.2)"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="font-display text-3xl md:text-6xl lg:text-7xl text-amber-600 tracking-[0.2em] uppercase"
          >
            ENDING：{scene.title}
          </motion.h2>
          <div className="w-16 md:w-24 lg:w-32 h-px bg-amber-900/40 mx-auto" />
        </motion.div>

        {/* 结局文本区域（使用打字机效果组件） */}
        <div className="min-h-[200px] flex items-center justify-center w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={paraIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.8 }}
              className="text-base md:text-xl lg:text-2xl text-neutral-400 leading-relaxed font-serif italic text-left whitespace-pre-wrap max-w-xl lg:max-w-3xl mx-auto px-8 border-l-2 border-amber-900/20"
            >
              {currentPara && (
                <TypewriterText 
                  segments={renderTextWithDialogue(currentPara.text, currentPara.isThought)} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 交互按钮区域 */}
        <div className="flex flex-col items-center gap-8">
          {isLastPara ? (
            /* 结局结束，显示返回起始页按钮 */
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={onReturn}
              className="group relative py-2 px-8 text-amber-900/40 hover:text-amber-600 transition-all duration-1000 cursor-pointer"
            >
              <span className="font-display text-lg tracking-[0.8em] uppercase">AGAIN WRITING (再次谱写)</span>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-amber-600 group-hover:w-full transition-all duration-1000" />
            </motion.button>
          ) : (
            /* 翻阅下一段结局文本的按钮 */
            <button
              onClick={onNext}
              className="flex items-center gap-2 text-amber-700/60 hover:text-amber-600 transition-colors uppercase tracking-[0.3em] text-xs cursor-pointer group"
            >
              继续阅读
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
