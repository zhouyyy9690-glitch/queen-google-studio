import React from 'react';
import { ICP_CONFIG } from '../config/icp';

/**
 * ICP 备案信息脚注组件
 * 
 * 样式说明：
 * - 文字颜色较淡 (opacity-40)，不干扰游戏沉浸感
 * - 只有在配置开启时才会显示
 */
export const ICPFooter: React.FC = () => {
  if (!ICP_CONFIG.ENABLED) return null;

  return (
    <footer className="w-full py-4 flex flex-col items-center justify-center gap-1 text-[10px] text-white/40 font-sans tracking-wider mt-auto select-none pointer-events-none">
      <div className="flex items-center gap-2 pointer-events-auto">
        <a 
          href={ICP_CONFIG.LINK} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-white/60 transition-colors"
        >
          {ICP_CONFIG.NUMBER}
        </a>
      </div>
      
      {ICP_CONFIG.GOV_BADGE_ID && (
        <div className="flex items-center gap-2 pointer-events-auto">
          <a 
            href={ICP_CONFIG.GOV_BADGE_LINK} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white/60 transition-colors"
          >
            {ICP_CONFIG.GOV_BADGE_ID}
          </a>
        </div>
      )}
    </footer>
  );
};
