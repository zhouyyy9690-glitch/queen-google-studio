import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * 全局通知系统 Props 接口
 * @interface NotificationProps
 * @property {object} notification - 通知状态对象
 * @property {string} notification.title - 通知的标题内容
 * @property {boolean} notification.visible - 是否显示通知
 * @property {string} [notification.type] - 通知的类型（结局、人物、地点、见闻）
 */
interface NotificationProps {
  notification: {
    title: string;
    visible: boolean;
    type?: 'ending' | 'character' | 'location' | 'insight';
  };
}

/**
 * Notification 组件 - 全局通知浮层
 * 当玩家解锁新的角色、地点、传闻或达成结局时，在屏幕顶部显示提示
 */
export const Notification: React.FC<NotificationProps> = ({ notification }) => {
  return (
    <AnimatePresence>
      {notification.visible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 md:top-8 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 z-[200] px-4 py-3 md:px-8 md:py-4 bg-[#0d0d0d] border-b-2 md:border-2 shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex items-center justify-center md:justify-start gap-3 md:gap-4 backdrop-blur-md ${
            notification.type === 'location' ? 'border-emerald-500' : 
            notification.type === 'insight' ? 'border-indigo-400' : 
            'border-amber-600'
          }`}
        >
          {/* 左侧脉冲圆点指示器 */}
          <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse shrink-0 ${
            notification.type === 'location' ? 'bg-emerald-500' : 
            notification.type === 'insight' ? 'bg-indigo-400' : 
            'bg-amber-600'
          }`} />

          {/* 通知文本内容 */}
          <span className={`font-display tracking-[0.15em] md:tracking-[0.2em] uppercase text-[10px] md:text-sm whitespace-nowrap overflow-hidden text-ellipsis ${
            notification.type === 'location' ? 'text-emerald-500' : 
            notification.type === 'insight' ? 'text-indigo-400' : 
            'text-amber-600'
          }`}>
            <span className="opacity-60">
              {/* 根据通知类型显示前缀 */}
              {notification.type === 'character' ? '人物解锁 · ' : 
               notification.type === 'location' ? '地点解锁 · ' : 
               ''}
            </span>
            {notification.title}
            <span className="opacity-60">
              {/* 见闻通知的后缀 */}
              {notification.type === 'insight' ? ' · 已记录' : ''}
            </span>
          </span>

          {/* 右侧脉冲圆点指示器 */}
          <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse shrink-0 ${
            notification.type === 'location' ? 'bg-emerald-500' : 
            notification.type === 'insight' ? 'bg-indigo-400' : 
            'bg-amber-600'
          }`} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
