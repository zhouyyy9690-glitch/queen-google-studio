import React from 'react';
import { Scroll, Music, Volume2, VolumeX, History, RotateCcw } from 'lucide-react';

/**
 * 游戏顶栏组件 Props 接口
 */
interface GameHeaderProps {
  showVolumeMixer: boolean;
  setShowVolumeMixer: (show: boolean) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  setShowHistory: (show: boolean) => void;
  showHistory: boolean;
  returnToTitle: () => void;
}

/**
 * GameHeader 组件 - 顶部导航与功能栏
 * 包含章节标题显示、音量调音台开关、静音切换、历史记录查看以及返回标题页的功能按钮。
 */
export const GameHeader: React.FC<GameHeaderProps> = ({
  showVolumeMixer,
  setShowVolumeMixer,
  isMuted,
  setIsMuted,
  setShowHistory,
  showHistory,
  returnToTitle
}) => {
  return (
    <header className="mb-6 lg:mb-10 flex items-center justify-between border-b-2 border-double border-amber-900/30 pb-3 lg:pb-5 relative z-10 gap-2">
      {/* 左侧：系列标题与徽章 */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <Scroll className="w-3.5 h-3.5 md:w-5 md:h-5 text-amber-700/60" />
        <span className="font-display text-[9px] md:text-sm tracking-[0.15em] md:tracking-[0.3em] text-amber-700/80 uppercase truncate max-w-[100px] md:max-w-none">
          Chronicles
        </span>
      </div>
      
      {/* 右侧：功能控制区按钮组 */}
      <div className="flex items-center gap-2 md:gap-4 overflow-x-auto overflow-y-hidden no-scrollbar">
        {/* 音量调音台按钮 */}
        <button 
          onClick={() => setShowVolumeMixer(!showVolumeMixer)}
          title="音量设置"
          className="group flex items-center gap-1.5 md:gap-2 text-[8px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] text-neutral-600 hover:text-amber-600 transition-all cursor-pointer shrink-0"
        >
          <Music className="w-2.5 h-2.5 md:w-3 h-3 group-hover:drop-shadow-[0_0_3px_rgba(217,119,6,0.8)] transition-all" />
          <span className="hidden sm:inline">Mixer</span>
        </button>
        
        {/* 静音快速切换按钮 */}
        <button 
          onClick={() => setIsMuted(!isMuted)}
          title={isMuted ? "取消静音" : "静音"}
          className="group flex items-center gap-1.5 md:gap-2 text-[8px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] text-neutral-600 hover:text-amber-600 transition-all cursor-pointer shrink-0"
        >
          {isMuted ? (
            <VolumeX className="w-2.5 h-2.5 md:w-3 h-3 group-hover:drop-shadow-[0_0_3px_rgba(217,119,6,0.8)] transition-all" />
          ) : (
            <Volume2 className="w-2.5 h-2.5 md:w-3 h-3 group-hover:drop-shadow-[0_0_3px_rgba(217,119,6,0.8)] transition-all" />
          )}
          <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Music'}</span>
        </button>

        {/* 历史记录按钮 */}
        <button 
          onClick={() => setShowHistory(!showHistory)}
          title="查看历史对话"
          className="group flex items-center gap-1.5 md:gap-2 text-[8px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] text-neutral-600 hover:text-amber-600 transition-all cursor-pointer shrink-0"
        >
          <History className="w-2.5 h-2.5 md:w-3 h-3 group-hover:drop-shadow-[0_0_3px_rgba(217,119,6,0.8)] transition-all" />
          <span className="hidden sm:inline">Log</span>
        </button>

        {/* 返回标题按钮 */}
        <button 
          onClick={returnToTitle}
          title="返回标题界面"
          className="group flex items-center gap-1.5 md:gap-2 text-[8px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] text-neutral-600 hover:text-amber-600 transition-all cursor-pointer shrink-0"
        >
          <RotateCcw className="w-2.5 h-2.5 md:w-3 h-3 group-hover:rotate-[-45deg] group-hover:drop-shadow-[0_0_3px_rgba(217,119,6,0.8)] transition-all" />
          <span className="hidden sm:inline">Title</span>
        </button>
      </div>
    </header>
  );
};
