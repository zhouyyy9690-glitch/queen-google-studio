import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { CandleFlame } from './CandleFlame';

/**
 * 火焰滑块组件属性定义
 */
interface FlameSliderProps {
  label: string; // 滑块标签（如：音乐、音效）
  icon: LucideIcon; // 图标组件
  value: number; // 当前数值 (0-1)
  onChange: (val: number) => void; // 数值改变时的回调
  delay?: number; // 进场动画延迟
}

/**
 * 蜡烛火焰进度条组件：自定义的音量滑块封装
 * 以蜡烛火焰作为滑块的手柄（Thumb），增强游戏的复古奇幻氛围
 */
export const FlameSlider = ({ 
  label, 
  icon: Icon, 
  value, 
  onChange, 
  delay = 0 
}: FlameSliderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="space-y-4 md:space-y-6"
    >
      {/* 标签与百分比数值展示 */}
      <div className="flex justify-between items-end px-2 text-amber-700/80">
        <div className="flex items-center gap-3 md:gap-4">
          <Icon className="w-4 h-4 md:w-5 md:h-5" />
          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-medium">{label}</span>
        </div>
        <span className="font-mono text-lg md:text-xl text-amber-600/60 leading-none">{Math.round(value * 100)}%</span>
      </div>
      
      {/* 滑块轨道区域 */}
      <div className="relative h-12 flex items-center group">
        {/* 轨道背景与填充进度 */}
        <div className="absolute left-0 right-0 h-1 bg-amber-900/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-900/40 via-amber-600/40 to-amber-400/20"
            style={{ width: `${value * 100}%` }}
          />
        </div>

        {/* 蜡烛火焰手柄（Thumb） */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-150 ease-out"
          style={{ left: `calc(${value * 100}% - 12px)` }}
        >
          <div className="relative -top-1">
            <CandleFlame size="md" isActive={isDragging} />
            {/* 火焰底部的扩散光晕 */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-amber-600/30 blur-sm rounded-full" />
          </div>
        </div>

        {/* 隐藏的真实 range 输入框：用于处理原生交互 */}
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="relative w-full h-full opacity-0 cursor-pointer z-10"
        />
      </div>
    </motion.div>
  );
};
