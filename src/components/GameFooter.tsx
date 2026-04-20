import React from 'react';
import { Shield, Scroll } from 'lucide-react';

/**
 * 游戏页脚组件 Props 接口
 */
interface GameFooterProps {
  setShowChapterSelect: (show: boolean) => void;
  setShowCompendium: (show: boolean) => void;
  setShowMap: (show: boolean) => void;
  currentSceneId: string;
}

/**
 * GameFooter 组件 - 底部导航与状态栏
 * 包含游戏主标题（可点击进入章节选择）、全局交互按钮（人物志、地图）以及底部的场景 ID 标识。
 */
export const GameFooter: React.FC<GameFooterProps> = ({
  setShowChapterSelect,
  setShowCompendium,
  setShowMap,
  currentSceneId
}) => {
  return (
    <footer className="mt-20 md:mt-32 pt-12 md:pt-16 relative z-10 w-full group/footer flex flex-col items-center px-8 md:px-16 lg:px-24">
      {/* 标题装饰线与可点击的游戏标题 */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-center gap-4 md:gap-8 px-8 md:px-16 lg:px-24">
        <div className="flex-grow h-px bg-amber-900/15" />
        <div className="transition-all duration-1000 group-hover/footer:px-8 group-hover/footer:text-amber-600/60 overflow-visible text-center">
          <button 
            onClick={() => setShowChapterSelect(true)}
            className="group/chapter-btn relative focus:outline-none"
          >
            <h1 className="font-display text-[10px] md:text-sm lg:text-lg tracking-[0.4em] text-amber-800/20 uppercase transition-all duration-1000 group-hover/footer:tracking-[0.8em] group-hover/footer:text-amber-600/60 cursor-pointer leading-none whitespace-nowrap">
              The Crimson Queen
            </h1>
            {/* 悬停时的发光指示线 */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-px bg-amber-600/40 group-hover/chapter-btn:w-2/3 transition-all duration-700" />
          </button>
        </div>
        <div className="flex-grow h-px bg-amber-900/15" />
      </div>
      
      {/* 功能按钮组：人物志与地图 */}
      <div className="flex flex-col items-center gap-6 md:gap-8 w-full">
        <div className="flex items-center justify-center gap-4 md:gap-12">
          {/* 人物志入口 */}
          <button
            onClick={() => setShowCompendium(true)}
            className="group/btn relative px-3 py-1.5 md:px-8 md:py-2.5 border border-amber-900/20 text-amber-900/40 hover:text-amber-600 hover:border-amber-700/50 transition-all uppercase tracking-[0.2em] md:tracking-[0.4em] text-[7px] md:text-[10px] cursor-pointer"
          >
            <div className="flex items-center justify-center gap-1.5 md:gap-3">
              <Shield className="w-2.5 h-2.5 md:w-3 h-3 opacity-40 group-hover/btn:opacity-100 transition-opacity" />
              <span className="whitespace-nowrap hidden sm:inline">人物志 · Compendium</span>
              <span className="whitespace-nowrap sm:hidden">人物志</span>
            </div>
          </button>
          
          {/* 地图入口 */}
          <button
            onClick={() => setShowMap(true)}
            className="group/btn relative px-3 py-1.5 md:px-8 md:py-2.5 border border-emerald-900/20 text-emerald-900/40 hover:text-emerald-500 hover:border-emerald-700/50 transition-all uppercase tracking-[0.2em] md:tracking-[0.4em] text-[7px] md:text-[10px] cursor-pointer"
          >
            <div className="flex items-center justify-center gap-1.5 md:gap-3">
              <Scroll className="w-2.5 h-2.5 md:w-3 h-3 opacity-40 group-hover/btn:opacity-100 transition-opacity" />
              <span className="whitespace-nowrap hidden sm:inline">地图 · World Map</span>
              <span className="whitespace-nowrap sm:hidden">地图</span>
            </div>
          </button>
        </div>
        
        {/* 精简的场景 ID 标识（页脚最底部） */}
        <div className="flex items-center gap-4 opacity-5">
          <div className="h-px w-6 bg-amber-900/40" />
          <span className="text-[6px] md:text-[8px] uppercase tracking-[0.5em] font-mono">{currentSceneId}</span>
          <div className="h-px w-6 bg-amber-900/40" />
        </div>
      </div>
    </footer>
  );
};
