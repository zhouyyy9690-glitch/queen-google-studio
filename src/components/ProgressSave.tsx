import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sword, Shield, History, Bookmark } from 'lucide-react';
import { OrnateCorner } from './OrnateCorner';

/**
 * 存档管理组件属性定义
 */
interface ProgressSaveProps {
  showProgress: boolean; // 是否显示存档界面
  setShowProgress: (show: boolean) => void; // 设置显示状态
  loadGame: (type: 'auto' | 'manual') => void; // 加载存档的回调
  manualSaveGame: () => void; // 手动保存当前进度的回调
}

/**
 * 存档管理组件：提供保存当前进度或从已有存档继续的功能
 * 分为「自动存档」和「手动记录（编年史之剑）」
 */
export const ProgressSave = ({
  showProgress,
  setShowProgress,
  loadGame,
  manualSaveGame
}: ProgressSaveProps) => {
  // 检查本地是否存在存档数据
  const autoSave = localStorage.getItem('hersey_save_data');
  const manualSave = localStorage.getItem('hersey_manual_save');
  
  const autoData = autoSave ? JSON.parse(autoSave) : null;
  const manualData = manualSave ? JSON.parse(manualSave) : null;

  const SaveSlot = ({ 
    type, 
    data, 
    onLoad, 
    onSave 
  }: { 
    type: 'auto' | 'manual', 
    data: any, 
    onLoad: () => void, 
    onSave?: () => void 
  }) => {
    const isManual = type === 'manual';
    
    return (
      <div className={`p-5 border ${data ? 'border-amber-900/40 bg-amber-950/5' : 'border-neutral-900 bg-transparent'} relative group transition-all`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${data ? 'bg-amber-900/20 text-amber-600' : 'bg-neutral-900 text-neutral-700'}`}>
              {isManual ? <Sword className="w-4 h-4" /> : <History className="w-4 h-4" />}
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-display text-amber-700/80">
                {isManual ? '编年史之剑 (Manual)' : '时空残影 (Auto)'}
              </h4>
              {data && (
                <p className="text-[9px] text-neutral-500 font-mono mt-1 opacity-60">
                  {new Date(data.timestamp).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {data ? (
          <div className="space-y-3">
            <button
              onClick={onLoad}
              className="w-full py-2 bg-amber-900/10 border border-amber-800/30 text-amber-600 hover:bg-amber-600 hover:text-[#0a0a0a] transition-all uppercase tracking-[0.2em] text-[9px] cursor-none"
            >
              继续这段旅程
            </button>
            {onSave && (
              <button
                onClick={() => {
                  if (confirm('是否要在此时刻刻下新的印记？这会覆盖旧的记录。')) {
                    onSave();
                  }
                }}
                className="w-full py-2 border border-amber-900/20 text-amber-900/60 hover:text-amber-600 hover:border-amber-600 transition-all uppercase tracking-[0.2em] text-[9px] cursor-none"
              >
                在这里留下印记
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 border border-dashed border-neutral-900">
            <p className="text-[9px] text-neutral-600 uppercase tracking-widest italic mb-3">虚位以待...</p>
            {onSave && (
              <button
                onClick={onSave}
                className="px-4 py-1.5 border border-amber-900/40 text-amber-900/60 hover:text-amber-600 hover:border-amber-600 transition-all uppercase tracking-widest text-[8px] cursor-none"
              >
                开始记录
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {showProgress && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, pointerEvents: 'none' }}
          className="fixed inset-0 z-[110] bg-[#0a0a0a]/98 backdrop-blur-md p-6 flex items-center justify-center"
        >
          {/* 带边框和边角装饰的容器 */}
          <div className="max-w-xl w-full p-8 md:p-12 border-2 border-amber-900/40 bg-[#0a0a0a] relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-900/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-amber-900/30 to-transparent" />
            
            <OrnateCorner position="tl" />
            <OrnateCorner position="tr" />
            <OrnateCorner position="bl" />
            <OrnateCorner position="br" />
            
            <div className="text-center space-y-8">
              <div>
                <h3 className="font-display text-2xl md:text-3xl text-amber-600 tracking-[0.4em] uppercase">Liber Fatorvm</h3>
                <p className="text-[9px] text-amber-900/40 tracking-[0.6em] uppercase mt-2">The Book of Memories</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 text-left">
                {/* 手动存档位 - 编年史之剑 */}
                <SaveSlot 
                  type="manual" 
                  data={manualData} 
                  onLoad={() => loadGame('manual')} 
                  onSave={manualSaveGame}
                />
                
                {/* 自动存档位 - 时空残影 */}
                <SaveSlot 
                  type="auto" 
                  data={autoData} 
                  onLoad={() => loadGame('auto')} 
                />
              </div>
              
              {/* 返回主标题界面的按钮 */}
              <button
                onClick={() => setShowProgress(false)}
                className="mt-8 text-neutral-600 hover:text-amber-600 transition-colors uppercase tracking-[0.3em] text-[9px] cursor-none group flex items-center gap-2 mx-auto justify-center"
              >
                <X className="w-3 h-3 group-hover:rotate-90 transition-transform" />
                关闭卷轴
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
