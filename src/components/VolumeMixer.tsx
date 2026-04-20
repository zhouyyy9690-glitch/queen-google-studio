import React from 'react';
import { motion } from 'motion/react';
import { Music, Zap, X } from 'lucide-react';
import { FlameSlider } from './FlameSlider';
import { OrnateCorner } from './OrnateCorner';

/**
 * 音量调音台组件属性定义
 */
interface VolumeMixerProps {
  bgmVolume: number; // 背景音乐音量
  sfxVolume: number; // 音效音量
  onBgmChange: (val: number) => void; // 音乐音量改变回调
  onSfxChange: (val: number) => void; // 音效音量改变回调
  onClose: () => void; // 关闭调音台的回调
}

/**
 * 音量调音台组件：控制背景音乐和音效的全局音量
 * 采用全屏遮罩设计，配合复古纹理和烛光滑动条，维持游戏的神秘氛围
 */
export const VolumeMixer = ({ 
  bgmVolume, 
  sfxVolume, 
  onBgmChange, 
  onSfxChange, 
  onClose 
}: VolumeMixerProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] bg-[#0a0a0a] overflow-y-auto px-6 py-12 md:p-12"
    >
      <div className="min-h-full flex flex-col items-center justify-center relative">
        {/* 背景纹理与光晕 */}
        <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-30 pointer-events-none" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,119,6,0.05)_0%,rgba(0,0,0,0.9)_100%)] pointer-events-none" />
        
        {/* 装饰边框与边角花纹 */}
        <div className="fixed inset-4 md:inset-16 border-2 border-double border-amber-900/20 pointer-events-none" />
        <OrnateCorner position="tl" />
        <OrnateCorner position="tr" />
        <OrnateCorner position="bl" />
        <OrnateCorner position="br" />

        {/* 关闭按钮 - 带悬浮文字提示 */}
        <button 
          onClick={onClose}
          className="fixed top-6 right-6 md:top-12 md:right-12 z-50 group flex items-center gap-3 md:gap-4 text-neutral-500 hover:text-amber-500 transition-all cursor-pointer"
        >
          <span className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">Return to Hersey</span>
          <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border border-amber-900/20 rounded-full group-hover:border-amber-600/40 group-active:scale-95 transition-all bg-[#0a0a0a]">
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </button>

        {/* 内容容器 */}
        <div className="relative z-10 w-full max-w-xl text-center space-y-10 md:space-y-16 py-8">
          <header className="space-y-4">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="font-display text-xl md:text-3xl uppercase tracking-[0.5em] text-amber-600 drop-shadow-[0_0_15px_rgba(217,119,6,0.3)]">
                Audio Ritual
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-2 md:gap-4"
            >
              <div className="h-px w-8 md:w-12 bg-amber-900/30" />
              <p className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-neutral-500 max-w-[200px] md:max-w-none">Harmonize the atmosphere of your journey</p>
              <div className="h-px w-8 md:w-12 bg-amber-900/30" />
            </motion.div>
          </header>

          {/* 音量控制滑块组 */}
          <div className="space-y-10 md:space-y-12">
            <FlameSlider 
              label="BGM Volume" 
              icon={Music} 
              value={bgmVolume} 
              onChange={onBgmChange} 
              delay={0.5} 
            />
            <FlameSlider 
              label="SFX Volume" 
              icon={Zap} 
              value={sfxVolume} 
              onChange={onSfxChange} 
              delay={0.6} 
            />
          </div>

          <footer className="pt-8 md:pt-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-px h-12 md:h-16 bg-gradient-to-b from-amber-900/50 to-transparent" />
              <div className="px-6 md:px-8 py-2 md:py-3 bg-amber-900/5 border border-amber-900/20 rounded-full backdrop-blur-sm">
                <div className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-amber-700/60 flex items-center gap-3">
                  <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-amber-600 animate-pulse shadow-[0_0_8px_rgba(217,119,6,0.5)]" />
                  Master Audio Stream Active
                </div>
              </div>
            </motion.div>
          </footer>
        </div>
      </div>
    </motion.div>
  );
};
