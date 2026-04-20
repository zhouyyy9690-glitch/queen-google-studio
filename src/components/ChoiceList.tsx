import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { Choice } from '../types';

/**
 * 选项列表组件的属性定义
 */
interface ChoiceListProps {
  choices: Choice[]; // 可选的选项数组
  showChoices: boolean; // 是否显示选项
  selectedChoice: Choice | null; // 玩家当前选中的选项
  onChoiceClick: (choice: Choice) => void; // 点击选项的回调函数
  playSFX: (url: string, muted: boolean, volume: number) => void; // 播放音效的函数
  isMuted: boolean; // 是否静音
  sfxVolume: number; // 音效音量
  sceneId: string; // 当前页面场景ID，用于判断特殊音效
  SFX_ASSETS: { // 音效资源映射
    CLICK: string;
    DOOR_OPEN: string;
  };
}

/**
 * 选项列表组件：渲染一组剧情分支选项，并处理点击后的动画与音效
 */
export const ChoiceList = ({
  choices,
  showChoices,
  selectedChoice,
  onChoiceClick,
  playSFX,
  isMuted,
  sfxVolume,
  sceneId,
  SFX_ASSETS
}: ChoiceListProps) => {
  return (
    <AnimatePresence>
      {showChoices && (
        <motion.div 
          key="choices-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid lg:grid-cols-2 gap-4 lg:gap-6 pt-6 lg:pt-8 max-w-md lg:max-w-4xl mx-auto w-full"
        >
          {choices.map((choice, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0 }}
              animate={{ 
                // 如果已有选中项，非选中项淡出，选中项保持
                opacity: selectedChoice ? (selectedChoice === choice ? 1 : 0) : 1,
                scale: 1,
                // 非选中项在退出时向两侧偏移
                x: selectedChoice && selectedChoice !== choice ? (index % 2 === 0 ? -20 : 20) : 0
              }}
              transition={{ duration: 0.5 }}
              onClick={() => {
                if (!selectedChoice) {
                  // 处理音效逻辑
                  if (choice.sfx) {
                    playSFX(choice.sfx, isMuted, sfxVolume);
                  } else if (sceneId === 'start') {
                    playSFX(SFX_ASSETS.DOOR_OPEN, isMuted, sfxVolume);
                  } else {
                    playSFX(SFX_ASSETS.CLICK, isMuted, sfxVolume);
                  }
                  onChoiceClick(choice);
                }
              }}
              disabled={!!selectedChoice}
              className={`group relative flex items-center gap-4 md:gap-6 p-4 md:p-6 rounded-sm border-2 border-amber-900/20 bg-transparent transition-all text-left overflow-hidden ${!selectedChoice ? 'hover:border-amber-500/60 cursor-pointer' : ''}`}
            >
              <span className="relative text-neutral-500 group-hover:text-amber-500 font-display text-base md:text-xl tracking-[0.2em] uppercase transition-all duration-500">
                {choice.text}
              </span>
              <ChevronRight className="relative ml-auto w-4 h-4 md:w-5 md:h-5 text-amber-900/20 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
            </motion.button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
