import React from 'react';
import { motion } from 'motion/react';

/**
 * 蜡烛火焰组件属性定义
 */
interface CandleFlameProps {
  size?: "sm" | "md"; // 火焰大小
  isActive?: boolean; // 是否处于活跃状态（如正在拖动滑块时），活跃状态下动画更剧烈
}

/**
 * 蜡烛火焰组件：用于音量调节器或进度条的视觉反馈，带有呼吸感和轻微摇摆的 SVG 动画
 */
export const CandleFlame = ({ size = "md", isActive = false }: CandleFlameProps) => (
  <motion.div 
    className={`relative flex items-center justify-center shrink-0 ${size === "sm" ? "w-2.5 h-4" : "w-3 h-5"}`}
    animate={{ 
      // 模拟火焰的不规则跳动
      scaleY: isActive ? [1, 1.2, 0.9, 1.1, 1] : [1, 1.1, 0.95, 1.05, 1],
      scaleX: isActive ? [1, 0.85, 1.15, 0.9, 1] : [1, 0.95, 1.05, 0.95, 1],
      opacity: isActive ? [1, 0.7, 1, 0.8, 1] : [0.9, 0.7, 0.9, 0.8, 0.9],
      rotate: isActive ? [0, -3, 3, -1.5, 0] : [0, -1, 1, -0.5, 0]
    }}
    transition={{ 
      duration: isActive ? 2 : 4,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    {/* 内部光晕效果 */}
    <div className={`absolute inset-0 bg-amber-400 blur-[4px] rounded-full opacity-40 ${isActive ? 'animate-pulse' : ''}`} />
    
    <svg viewBox="0 0 10 16" className={`${isActive ? 'fill-amber-400' : 'fill-amber-600/80'} drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] w-full h-full`}>
      {/* 经典的水滴状火焰路径 */}
      <path d="M5 16C5 16 0 14 0 9C0 5 5 0 5 0C5 0 10 5 10 9C10 14 5 16 5 16Z" />
    </svg>
    
    {/* 底部微弱的光影 */}
    <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-amber-600/30 blur-sm rounded-full ${isActive ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
  </motion.div>
);
