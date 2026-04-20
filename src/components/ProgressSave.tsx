import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { OrnateCorner } from './OrnateCorner';

/**
 * 存档管理组件属性定义
 */
interface ProgressSaveProps {
  showProgress: boolean; // 是否显示存档界面
  setShowProgress: (show: boolean) => void; // 设置显示状态
  loadGame: () => void; // 加载存档的回调
  saveGame: () => void; // 保存存档的回调
}

/**
 * 存档管理组件：提供保存当前进度或从已有存档继续的功能
 * 使用精致的边框装饰，增强仪式的严肃感
 */
export const ProgressSave = ({
  showProgress,
  setShowProgress,
  loadGame,
  saveGame
}: ProgressSaveProps) => {
  // 检查本地是否存在存档数据
  const hasSaveData = !!localStorage.getItem('hersey_save_data');
  const saveData = hasSaveData ? JSON.parse(localStorage.getItem('hersey_save_data')!) : null;

  return (
    <AnimatePresence>
      {showProgress && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] bg-[#0a0a0a]/98 backdrop-blur-md p-8 flex items-center justify-center"
        >
          {/* 带边框和边角装饰的容器 */}
          <div className="max-w-md w-full p-12 border-2 border-amber-900/40 bg-[#0a0a0a] relative">
            <OrnateCorner position="tl" />
            <OrnateCorner position="tr" />
            <OrnateCorner position="bl" />
            <OrnateCorner position="br" />
            
            <div className="text-center space-y-8">
              <h3 className="font-display text-3xl text-amber-600 tracking-[0.2em] uppercase">Game Progress</h3>
              <div className="w-16 h-px bg-amber-900/40 mx-auto" />
              
              {hasSaveData ? (
                <div className="space-y-6">
                  <p className="text-neutral-400 italic">
                    A saved chronicle exists from: <br/>
                    <span className="text-amber-700 not-italic">
                      {new Date(saveData.timestamp).toLocaleString()}
                    </span>
                  </p>
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={loadGame}
                      className="w-full py-3 border border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-[#0a0a0a] transition-all uppercase tracking-widest text-xs cursor-pointer"
                    >
                      Continue Journey
                    </button>
                    <button
                      onClick={() => {
                        // 覆盖存档前的确认提示
                        if (confirm('This will overwrite your current save. Are you sure?')) {
                          saveGame();
                          setShowProgress(false);
                        }
                      }}
                      className="w-full py-3 border border-amber-900/40 text-amber-900/60 hover:text-amber-600 hover:border-amber-600 transition-all uppercase tracking-widest text-xs cursor-pointer"
                    >
                      Save Current Progress
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-neutral-600 italic">No saved chronicle found.</p>
                  <button
                    onClick={() => {
                      saveGame();
                      setShowProgress(false);
                    }}
                    className="w-full py-3 border border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-[#0a0a0a] transition-all uppercase tracking-widest text-xs cursor-pointer"
                  >
                    Save Current Progress
                  </button>
                </div>
              )}
              
              {/* 返回主标题界面的按钮 */}
              <button
                onClick={() => setShowProgress(false)}
                className="mt-8 text-neutral-500 hover:text-amber-600 transition-colors uppercase tracking-widest text-[10px] cursor-pointer group flex items-center gap-2 mx-auto justify-center"
              >
                <X className="w-3 h-3 group-hover:rotate-90 transition-transform" />
                Back to Title
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
