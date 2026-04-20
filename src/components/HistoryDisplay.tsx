import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * 剧情历史记录组件属性定义
 */
interface HistoryDisplayProps {
  showHistory: boolean; // 是否显示历史记录界面
  setShowHistory: (show: boolean) => void; // 设置显示状态的回调
  visitedTexts: string[]; // 已读文本数组（包含段落内容和章节标题）
}

/**
 * 剧情历史记录组件：展示玩家在本次冒险中经历的所有文本记录
 * 采用全屏垂直滚动的羊皮纸风格，方便回顾剧情
 */
export const HistoryDisplay = ({
  showHistory,
  setShowHistory,
  visitedTexts
}: HistoryDisplayProps) => {
  return (
    <AnimatePresence>
      {showHistory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] bg-[#0a0a0a] p-4 md:p-8 overflow-y-auto"
        >
          <div className="max-w-2xl lg:max-w-4xl mx-auto pt-12 md:pt-16">
            {/* 头部标题与关闭按钮 */}
            <div className="flex justify-between items-center mb-8 md:mb-12 border-b border-amber-900/20 pb-6">
              <h3 className="font-display text-xl md:text-2xl text-amber-600 tracking-widest uppercase">Chronicle History</h3>
              <button 
                onClick={() => setShowHistory(false)}
                className="text-neutral-500 hover:text-neutral-100 transition-colors uppercase tracking-widest text-[10px] md:text-xs cursor-pointer p-2"
              >
                Close
              </button>
            </div>

            {/* 历史记录内容列表 */}
            <div className="space-y-6 md:space-y-8 pb-24">
              {visitedTexts.map((item, i) => {
                // 防御性处理：确保 item 是字符串，如果是对象则提取 text 属性
                let text = typeof item === 'string' ? item : (item as any)?.text || '';
                
                // 清理标记：移除 [C:名字] 和 [L:地点] 标记，只保留内部文字，使其与正文显示一致
                if (text.includes('[C') || text.includes('[L')) {
                  text = text.replace(/\[C[:：]([^\]]+)\]/g, '$1');
                  text = text.replace(/\[L[:：]([^\]]+)\]/g, '$1');
                }

                return (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.05, 1) }}
                    className={text.startsWith('---') 
                      // 样式判断：以 '---' 开头的是章节/小节标题，采用居中展示
                      ? "text-center py-4 text-amber-900/40 font-display text-xs md:text-sm tracking-[0.3em] md:tracking-[0.5em] uppercase"
                      // 普通段落文本：采用带左侧边框的引用风格
                      : "text-base md:text-lg text-neutral-400 leading-relaxed font-serif italic border-l-2 border-amber-900/10 pl-4 md:pl-6"
                    }
                  >
                    {/* 渲染时移除占位符 '---' */}
                    {text.startsWith('---') ? text.replace(/---/g, '') : text}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
