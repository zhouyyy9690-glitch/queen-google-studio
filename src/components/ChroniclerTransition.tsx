import React, { ReactNode } from 'react';
import { motion } from 'motion/react';

/**
 * 转场包裹组件 Props 接口
 */
interface ChroniclerTransitionProps {
  children: ReactNode;
  keyStr: string;
}

/**
 * ChroniclerTransition 组件 - 编年史篇章切换特效
 * 为场景切换提供独特的“书页翻转”与“笔墨滑过”的视觉体验。
 * 使用 Framer Motion 的 clipPath 和 filter 实现复杂的动效。
 */
export const ChroniclerTransition: React.FC<ChroniclerTransitionProps> = ({ children, keyStr }) => {
  return (
    <motion.div
      key={keyStr}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        // 初始状态：从右侧向内切开，带有模糊和亮度提升
        initial: { 
          clipPath: 'inset(0 100% 0 0)',
          opacity: 0,
          scale: 0.96,
          skewY: 2,
          filter: 'blur(8px) brightness(1.2)'
        },
        // 展入状态：完整显示内容
        animate: { 
          clipPath: 'inset(0 0% 0 0)',
          opacity: 1,
          scale: 1,
          skewY: 0,
          filter: 'blur(0px) brightness(1)'
        },
        // 退出状态：向左侧消失，带有反向倾斜和变暗效果
        exit: { 
          clipPath: 'inset(0 0 0 100%)',
          opacity: 0,
          scale: 1.04,
          skewY: -2,
          filter: 'blur(8px) brightness(0.8)'
        }
      }}
      transition={{ 
        duration: 0.9, 
        ease: [0.4, 0, 0.2, 1] 
      }}
      className="relative w-full h-full flex flex-col justify-center"
    >
      {/* 墨迹滑过的动态阴影层：模拟新篇章翻开时的光影流转 */}
      <motion.div
        variants={{
          initial: { left: '-10%', opacity: 0 },
          animate: { left: '110%', opacity: [0, 0.6, 0] },
          exit: { left: '-10%', opacity: 0 }
        }}
        transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
        className="absolute top-0 w-32 h-full bg-gradient-to-r from-transparent via-amber-900/60 to-transparent blur-2xl z-20 pointer-events-none"
      />
      {children}
    </motion.div>
  );
};
