import React from 'react';

/**
 * 带有凹凸感的首字母组件属性定义
 */
interface EmbossedInitialProps {
  nameEn: string; // 英文名称，用于提取首字母
  className?: string; // 自定义样式类名
}

/**
 * 带有凹凸感的首字母组件：用于人物志或地名志的装饰展示
 * 通过 textShadow 模拟浮雕或凹陷的视觉效果
 */
export const EmbossedInitial = ({ nameEn, className = "" }: EmbossedInitialProps) => {
  // 提取首字母，默认为 'U'
  const initial = (nameEn || 'U').charAt(0).toUpperCase();
  
  return (
    <div className={`font-display flex items-center justify-center select-none ${className}`}>
      <span 
        className="text-transparent"
        style={{
          // 通过多个细微的阴影叠加，营造出在深色背景上的凹陷/雕刻感
          textShadow: `
            1.5px 1.5px 1px rgba(0,0,0,0.9),
            -0.5px -0.5px 1px rgba(255,255,255,0.15),
            0 0 5px rgba(217,119,6,0.05)
          `,
          WebkitTextStroke: "0.5px rgba(217,119,6,0.1)",
          filter: "drop-shadow(2px 2px 3px rgba(0,0,0,0.4))",
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
        }}
      >
        {initial}
      </span>
    </div>
  );
};
