import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Button } from './Button';

/**
 * 结局数据接口
 */
interface Ending {
  id: string;
  title: string;
  text: string;
}

/**
 * 结局画廊组件 Props 接口
 */
interface EndingGalleryProps {
  showGallery: boolean;
  setShowGallery: (show: boolean) => void;
  unlockedEndings: Ending[];
}

/**
 * EndingGallery 组件 - 结局画廊
 * 用于展示玩家在游戏中已达成的所有剧情结局。
 */
export const EndingGallery: React.FC<EndingGalleryProps> = ({ 
  showGallery, 
  setShowGallery, 
  unlockedEndings 
}) => {
  return (
    <AnimatePresence>
      {showGallery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] bg-[#0a0a0a]/98 backdrop-blur-md p-8 overflow-y-auto"
        >
          <div className="max-w-4xl mx-auto pt-16">
            {/* 顶栏：标题与关闭按钮 */}
            <div className="flex justify-between items-center mb-16 border-b border-amber-900/20 pb-6">
              <h3 className="font-display text-4xl text-amber-600 tracking-[0.2em] uppercase">Ending Gallery</h3>
              <Button 
                onClick={() => setShowGallery(false)}
                className="text-neutral-500 hover:text-amber-600 uppercase tracking-widest text-xs group flex items-center gap-2"
              >
                <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                Close
              </Button>
            </div>
            
            {/* 内容区：如果尚未达成结局，显示提示信息 */}
            {unlockedEndings.length === 0 ? (
              <div className="text-center py-24 space-y-6">
                <div className="text-neutral-600 italic text-xl">
                  尚未达成任何结局。您的故事仍在书写中...
                </div>
                <p className="text-amber-900/40 text-sm uppercase tracking-widest">
                  通过不同的抉择，开启属于凯瑟琳的多种命运
                </p>
              </div>
            ) : (
              /* 结局网格展示 */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-24">
                {unlockedEndings.map((ending, i) => (
                  <motion.div
                    key={ending.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 border border-amber-900/20 bg-neutral-900/20 rounded-sm space-y-4 hover:border-amber-600/40 transition-colors group"
                  >
                    <h4 className="font-display text-xl text-amber-700 group-hover:text-amber-600 tracking-widest uppercase">
                      {ending.title}
                    </h4>
                    <div className="w-12 h-px bg-amber-900/20" />
                    <p className="text-sm text-neutral-400 leading-relaxed font-serif italic line-clamp-4">
                      {ending.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
