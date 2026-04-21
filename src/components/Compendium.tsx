import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, X, User, Network, List } from 'lucide-react';
import { Character } from '../types';
import { EmbossedInitial } from './EmbossedInitial';
import { InfluenceWeb } from './InfluenceWeb';

/**
 * 人物志组件属性定义
 */
interface CompendiumProps {
  showCompendium: boolean; // 是否显示人物志界面
  setShowCompendium: (show: boolean) => void; // 设置显示状态的回调
  unlockedCharacters: Set<string>; // 已解锁角色的ID集合
  characters: Character[]; // 所有角色数据
  filteredCharacters: Character[]; // 当前筛选后的角色列表
  selectedCharacter: Character | undefined; // 当前选中的角色
  setSelectedCharacterId: (id: string) => void; // 设置选中角色ID的回调
  history: string[]; // 游戏剧情历史记录，用于根据进度显示不同的角色介绍
  currentSceneId: string; // 当前场景ID
}

/**
 * 人物志（Bestiary）组件：展示已解锁角色的详细背景、身份和故事进度
 * 现在支持“列表模式”与“命运之网”模式的切换。
 */
export const Compendium = ({
  showCompendium,
  setShowCompendium,
  unlockedCharacters,
  characters,
  filteredCharacters,
  selectedCharacter,
  setSelectedCharacterId,
  history,
  currentSceneId
}: CompendiumProps) => {
  const [viewMode, setViewMode] = React.useState<'list' | 'web'>('web'); // 默认为命运之网

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-[#0a0a0a]/98 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 overflow-hidden pointer-events-auto"
    >
      <div className="w-full max-w-7xl h-full max-h-[90vh] flex flex-col border border-amber-900/20 bg-[#0a0a0a] relative overflow-hidden">
        {/* 背景纹理 */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-10 pointer-events-none" />
        
        {/* 头部区域 */}
        <div className="relative z-10 flex justify-between items-center p-6 md:p-8 border-b border-amber-900/20 bg-[#0a0a0a]/50">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 mr-8">
              <Crown className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
              <h3 className="font-display text-lg md:text-2xl text-amber-600 tracking-[0.2em] uppercase">人物志 · Bestiary</h3>
            </div>

            {/* 视图切换按钮 */}
            <div className="flex items-center bg-black/40 border border-amber-900/10 rounded-full p-1 h-10">
              <button
                onClick={() => setViewMode('web')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all text-[10px] uppercase tracking-widest ${viewMode === 'web' ? 'bg-amber-900/30 text-amber-500 shadow-[0_0_10px_rgba(139,94,52,0.2)]' : 'text-neutral-600 hover:text-neutral-400'}`}
              >
                <Network className="w-3 h-3" />
                <span>Influence Web</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all text-[10px] uppercase tracking-widest ${viewMode === 'list' ? 'bg-amber-900/30 text-amber-500 shadow-[0_0_10px_rgba(139,94,52,0.2)]' : 'text-neutral-600 hover:text-neutral-400'}`}
              >
                <List className="w-3 h-3" />
                <span>Soul Records</span>
              </button>
            </div>
          </div>

          <button 
            onClick={() => setShowCompendium(false)}
            className="text-neutral-500 hover:text-amber-500 transition-all uppercase tracking-[0.2em] text-[10px] md:text-xs cursor-pointer group flex items-center gap-2"
          >
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            Close
          </button>
        </div>

        <div className="flex-grow flex flex-col md:flex-row overflow-hidden relative z-10">
          {viewMode === 'list' ? (
            <>
              {/* 侧边栏 - 角色列表 */}
              <div className="w-full md:w-80 lg:w-96 border-r border-amber-900/10 flex flex-col bg-black/20">
                <div className="p-4 md:p-6 text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-neutral-600 font-display flex items-center justify-between">
                  <span>Soul Records (List View)</span>
                  <span className="text-amber-900/40">{unlockedCharacters.size} / {characters.length}</span>
                </div>
                <div className="flex-grow overflow-y-auto no-scrollbar px-4 pb-8 space-y-2">
                  {filteredCharacters.map((char) => {
                    const isUnlocked = unlockedCharacters.has(char.id);
                    const isSelected = selectedCharacter?.id === char.id;
                    
                    return (
                      <button
                        key={char.id}
                        onClick={() => isUnlocked && setSelectedCharacterId(char.id)}
                        className={`w-full text-left p-4 rounded-sm transition-all duration-500 relative group flex items-center gap-4 ${
                          isSelected 
                            ? 'bg-amber-900/10 border border-amber-900/30' 
                            : 'hover:bg-amber-900/5 active:scale-[0.98]'
                        } ${!isUnlocked && 'opacity-30 cursor-not-allowed grayscale'}`}
                      >
                        {isSelected && (
                          <motion.div 
                            layoutId="candle-aura"
                            className="absolute inset-0 bg-amber-600/5 blur-md"
                            animate={{ 
                              opacity: [0.1, 0.3, 0.15, 0.4, 0.1],
                              scale: [1, 1.02, 0.98, 1.01, 1]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          />
                        )}

                        <div className="relative shrink-0">
                           <div className={`w-10 h-10 md:w-12 md:h-12 border flex items-center justify-center transition-colors duration-700 ${
                             isSelected ? 'border-amber-600/40' : 'border-amber-900/20 group-hover:border-amber-600/20'
                           }`}>
                             {isUnlocked ? (
                               <EmbossedInitial nameEn={char.nameEn} className="text-xl md:text-2xl" />
                             ) : (
                               <X className="w-3 h-3 text-neutral-800" />
                             )}
                           </div>
                           {isSelected && (
                             <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.5)]" />
                           )}
                        </div>

                        <div className="flex-grow min-w-0">
                          <div className={`text-[10px] md:text-xs truncate font-display tracking-wider transition-colors duration-500 ${isSelected ? 'text-amber-600' : 'text-neutral-500'}`}>
                            {isUnlocked ? char.name : 'Unknown Identity'}
                          </div>
                          <div className="text-[7px] md:text-[8px] uppercase tracking-[0.2em] text-amber-900/30 truncate">
                            {isUnlocked ? char.nameEn : 'Wait for encounter'}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 主内容区域 - 选中角色的详细资料 */}
              <div className="flex-grow relative overflow-y-auto no-scrollbar">
                {selectedCharacter && unlockedCharacters.has(selectedCharacter.id) ? (
                  <motion.div 
                    key={selectedCharacter.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-8 md:p-16 flex flex-col items-center text-center space-y-8 md:space-y-12"
                  >
                    {/* 详情内容 */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-amber-600/10 blur-3xl animate-pulse rounded-full" />
                      <div className="w-32 h-32 md:w-48 md:h-48 border-2 border-double border-amber-900/30 flex items-center justify-center relative ring-1 ring-amber-600/5 group-hover:border-amber-600/40 transition-all duration-1000">
                         <div className="scale-[2.5] transition-all duration-1000 transform group-hover:scale-[2.6]">
                            <EmbossedInitial nameEn={selectedCharacter.nameEn} className="w-full h-full text-4xl md:text-6xl" />
                         </div>
                         <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-amber-600/30" />
                         <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-amber-600/30" />
                         <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-amber-600/30" />
                         <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-amber-600/30" />
                      </div>
                    </div>

                    <div className="space-y-4 md:space-y-6 max-w-2xl px-4">
                      <header className="space-y-2">
                        <motion.span 
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           transition={{ delay: 0.2 }}
                           className="text-[10px] md:text-xs text-amber-900/60 uppercase tracking-[0.4em] font-display"
                        >
                          {selectedCharacter.nameEn}
                        </motion.span>
                        <motion.h4 
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: 0.3 }}
                           className="text-3xl md:text-5xl text-amber-600 font-display tracking-widest uppercase"
                        >
                          {selectedCharacter.name}
                        </motion.h4>
                      </header>

                      <div className="w-24 md:w-32 h-px bg-gradient-to-r from-transparent via-amber-900/40 to-transparent mx-auto" />

                      <motion.p 
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         transition={{ delay: 0.5 }}
                         className="text-base md:text-xl text-neutral-400 leading-relaxed font-serif italic text-left md:text-center"
                      >
                        <span className="text-amber-700/60 block mb-3 text-[10px] md:text-xs tracking-[0.3em] not-italic uppercase font-display border-b border-amber-900/10 pb-2">
                          「 {(selectedCharacter.updates && selectedCharacter.updates.find(u => [...history, currentSceneId].includes(u.atScene))?.title) || selectedCharacter.title} 」
                        </span>
                        {(selectedCharacter.updates && selectedCharacter.updates.find(u => [...history, currentSceneId].includes(u.atScene))?.description) || selectedCharacter.description}
                      </motion.p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 opacity-20">
                     <div className="w-24 h-24 border border-dashed border-amber-900/40 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-amber-900/40" />
                     </div>
                     <p className="text-amber-900/40 uppercase tracking-widest text-xs">此处人物的命运之书尚未开启</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-grow relative flex flex-col overflow-hidden">
              {/* Web Mode View */}
              <div className="flex-grow bg-black/40">
                <InfluenceWeb 
                  unlockedCharacters={unlockedCharacters}
                  characters={characters}
                  setSelectedCharacterId={setSelectedCharacterId}
                  selectedCharacterId={selectedCharacter?.id}
                  history={history}
                />
              </div>
              
              {/* 悬浮的人物简介弹窗 (当在网格模式选中时展示) */}
              <AnimatePresence>
                {selectedCharacter && unlockedCharacters.has(selectedCharacter.id) && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xl bg-black/80 backdrop-blur-md border border-amber-900/30 p-6 md:p-8 flex items-start gap-6 pointer-events-auto shadow-2xl z-20"
                  >
                    <div className="shrink-0 w-16 h-16 md:w-20 md:h-20 border border-amber-900/30 flex items-center justify-center">
                      <EmbossedInitial nameEn={selectedCharacter.nameEn} className="text-3xl md:text-4xl" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-amber-600 font-display text-lg uppercase tracking-widest truncate">{selectedCharacter.name}</h4>
                        <span className="text-[8px] text-amber-900/60 uppercase tracking-[0.2em]">{selectedCharacter.nameEn}</span>
                      </div>
                      <div className="text-amber-700/60 text-[9px] uppercase tracking-widest mb-2 pb-1 border-b border-amber-900/10">
                        「 {(selectedCharacter.updates && selectedCharacter.updates.find(u => [...history, currentSceneId].includes(u.atScene))?.title) || selectedCharacter.title} 」
                      </div>
                      <p className="text-neutral-400 text-xs md:text-sm italic font-serif line-clamp-3">
                        {(selectedCharacter.updates && selectedCharacter.updates.find(u => [...history, currentSceneId].includes(u.atScene))?.description) || selectedCharacter.description}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* 底部装饰线 */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-900/20 to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
};
