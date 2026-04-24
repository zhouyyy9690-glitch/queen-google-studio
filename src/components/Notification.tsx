import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationItem {
  id: string;
  title: string;
  type?: 'ending' | 'character' | 'location' | 'insight';
}

interface NotificationProps {
  notifications: NotificationItem[];
}

/**
 * Notification 组件 - 全局通知浮层 (复古丝帛标签风格)
 * 支持多条消息堆叠展示，避免信息被遮挡。
 */
export const Notification: React.FC<NotificationProps> = ({ notifications }) => {
  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[1000] flex flex-col items-center gap-4 pointer-events-none w-full max-w-sm">
      <AnimatePresence mode="popLayout">
        {notifications.map((note) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: -20, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: -10, filter: 'blur(5px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-center justify-center py-3 px-10 group"
          >
            {/* 丝帛/宣纸底层背景 */}
            <div className={`absolute inset-0 shadow-[0_10px_30px_rgba(0,0,0,0.8)] opacity-95 ${
              note.type === 'location' ? 'bg-[#1a2f23]' : 
              note.type === 'character' ? 'bg-[#2a1a1a]' : 
              note.type === 'insight' ? 'bg-[#1a1a2a]' :
              'bg-[#2d1810]'
            }`} 
            style={{
              clipPath: 'polygon(0% 15%, 10% 0%, 90% 0%, 100% 15%, 100% 85%, 90% 100%, 10% 100%, 0% 85%)',
              border: note.type === 'location' ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(180,83,9,0.4)'
            }}>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] opacity-30 mix-blend-overlay" />
              {/* 装饰边框内线 */}
              <div className="absolute inset-1 border border-white/5 pointer-events-none" style={{ clipPath: 'inherit' }} />
            </div>

            {/* 装饰侧边流苏或铜扣感 */}
            <div className={`absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full border border-white/20 ${
              note.type === 'location' ? 'bg-emerald-700' : 
              note.type === 'insight' ? 'bg-indigo-700' : 
              'bg-amber-700'
            }`} />
            
            <div className={`absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full border border-white/20 ${
              note.type === 'location' ? 'bg-emerald-700' : 
              note.type === 'insight' ? 'bg-indigo-700' : 
              'bg-amber-700'
            }`} />

            {/* 通知主文本 */}
            <div className="relative z-10 flex flex-col items-center py-1">
              <span className={`font-serif italic text-[7px] md:text-[8px] tracking-[0.5em] uppercase mb-1.5 ${
                note.type === 'location' ? 'text-emerald-500/60' : 
                note.type === 'insight' ? 'text-indigo-400/60' : 
                'text-amber-600/60'
              }`}>
                {note.type === 'character' ? '— Archive Entry —' : 
                 note.type === 'location' ? '— Cartography —' : 
                 note.type === 'insight' ? '— Secret Observation —' : '— Fate Altered —'}
              </span>
              
              <h4 className={`font-chinese text-sm md:text-lg tracking-[0.3em] font-medium drop-shadow-md ${
                note.type === 'location' ? 'text-emerald-100/90' : 
                note.type === 'insight' ? 'text-indigo-100/90' : 
                'text-amber-50/90'
              }`}>
                {note.title}
              </h4>
            </div>

            {/* 顶部的装饰性“吊绳” */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-px h-2 bg-amber-900/20" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
