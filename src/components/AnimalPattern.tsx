import React from 'react';

/**
 * 动物图腾组件 Props 接口
 */
interface AnimalPatternProps {
  type?: 'fox' | 'deer' | 'eagle';
}

/**
 * AnimalPattern 组件 - 动物图腾背景
 * 在选择路径（狐狸、鹿或鹰）时，作为背景装饰显示对应的图腾，增强仪式感。
 */
export const AnimalPattern: React.FC<AnimalPatternProps> = ({ type }) => {
  // 如果未传递类型，则不渲染任何内容
  if (!type) return null;
  
  /**
   * 图腾 SVG 路径数据定义
   * 为简化视觉风格，使用极简主义线条勾勒动物形态
   */
  const paths = {
    // 狐狸图腾路径（灵巧与计谋）
    fox: "M50 20C40 20 30 30 30 45C30 60 40 80 50 80C60 80 70 60 70 45C70 30 60 20 50 20ZM50 30C55 30 60 35 60 40C60 45 55 50 50 50C45 50 40 45 40 40C40 35 45 30 50 30Z",
    // 鹿图腾路径（优雅与野性）
    deer: "M50 10L40 30H60L50 10ZM50 35C40 35 30 45 30 60C30 75 40 90 50 90C60 90 70 75 70 60C70 45 60 35 50 35Z",
    // 鹰图腾路径（视野与霸权）
    eagle: "M10 40C30 30 50 30 90 40C70 50 50 50 10 40ZM50 40C45 40 40 45 40 50C40 55 45 60 50 60C55 60 60 55 60 50C60 45 55 40 50 40Z"
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none overflow-hidden">
      {/* 渲染对应类型的 SVG 图腾，采用全局琥珀色调 */}
      <svg viewBox="0 0 100 100" className="w-[150%] h-[150%] text-amber-600">
        <path d={paths[type]} fill="currentColor" />
      </svg>
    </div>
  );
};
