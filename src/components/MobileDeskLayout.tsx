import React from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Map, 
  History, 
  Award, 
  FileText,
  ChevronLeft,
  Sparkles
} from 'lucide-react';

interface MobileDeskLayoutProps {
  isNarrativeMode: boolean;
  onEntryClick: () => void;
  onCompendiumClick: () => void;
  onChapterClick: () => void;
  onMapClick: () => void;
  onEndingClick: () => void;
  onReturn?: () => void;
  unlockedEndingsCount?: number;
}

/**
 * 移动端专属桌面重构组件 (Route C)
 * 完美解决 16:9 桌面缩放后在手机端缩成一团、难以触控的问题
 * 功能：
 * 1. 在书房（非游玩状态）展示华丽的“圣教圣物卡片群组” (1主 + 4副)，黄金、皮革、手稿感
 * 2. 在游玩状态（叙事模式）下，提供精致的“蜡封悬浮羽毛信”以实现“返回书房”交互
 * 3. 严格遵循双平台隔离，不对 PC 页面产生任何样式干扰
 */
export const MobileDeskLayout: React.FC<MobileDeskLayoutProps> = ({
  isNarrativeMode,
  onEntryClick,
  onCompendiumClick,
  onChapterClick,
  onMapClick,
  onEndingClick,
  onReturn,
  unlockedEndingsCount = 0
}) => {

  // 1. 如果在叙事游玩中：展示极简但充满中世纪氛围的“返回书房”蜡封悬浮交互钮
  if (isNarrativeMode) {
    if (!onReturn) return null;
    return (
      <div className="absolute inset-x-0 top-24 z-[1200] pointer-events-none flex justify-center">
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReturn}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full border border-rose-900/30 bg-[#1e0707]/90 active:bg-[#320a0a] text-[#b38b5d] shadow-[0_4px_15px_rgba(0,0,0,0.6)] backdrop-blur-md"
        >
          {/* 古雅的火漆蜡印造型微缩图标 */}
          <div className="w-4 h-4 rounded-full bg-rose-800 border border-rose-400/20 shadow-inner flex items-center justify-center">
            <ChevronLeft className="w-3 h-3 text-rose-100" />
          </div>
          <span className="font-chinese text-xs tracking-widest font-medium text-[#e2c18d]">
            返回书房
          </span>
          <span className="font-latin text-[10px] uppercase opacity-40 font-light italic tracking-widest pl-1 border-l border-[#b38b5d]/20">
            Study
          </span>
        </motion.button>
      </div>
    );
  }

  // 2. 如果在书房主页：提供一个1大+4小的中世纪皮质圣置台面板，完美适应移动端单手操作
  return (
    <div className="absolute inset-x-0 bottom-4 z-[950] px-4 pointer-events-none flex flex-col justify-end max-h-[42vh] gap-3">
      
      {/* 圣盘容器，采用微晶皮质质感与金色切边 */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto w-full max-w-md mx-auto p-4 rounded-xl border border-[#c39c65]/20 bg-gradient-to-b from-[#140e0e]/95 to-[#0b0707]/98 shadow-[0_15px_40px_rgba(0,0,0,0.9)] backdrop-blur-md flex flex-col gap-3 relative overflow-hidden"
      >
        {/* 背景金丝蕾丝暗纹 */}
        <div className="absolute inset-0 bg-[#c39c65]/[0.02] bg-[radial-gradient(#c39c65_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#c39c65]/40 to-transparent pointer-events-none" />

        {/* 主按钮：圣仪红书 / 宿命开始键 */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onEntryClick}
          className="w-full relative py-3.5 px-4 rounded-lg bg-gradient-to-b from-[#4a0a0a] to-[#250303] border-2 border-[#d5b065]/40 shadow-[inset_0_1px_3px_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-between group"
        >
          {/* 金边脉冲微光 */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#d5b065]/0 via-[#d5b065]/5 to-[#d5b065]/0 -translate-x-full animate-[shimmer_3s_infinite]" />
          
          <div className="flex items-center gap-3">
            {/* 书架式高亮火漆圣印 */}
            <div className="w-9 h-9 rounded-md bg-[#5c0d0d] border border-[#d5b065]/30 flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5 text-[#f3d99d]" strokeWidth={1.5} />
            </div>
            <div className="text-left">
              <h3 className="font-chinese text-sm font-bold text-[#f3d99d] tracking-[0.2em] uppercase">
                启程 · 圣仪红书
              </h3>
              <p className="font-chinese text-[10px] text-[#e2c18d]/70 tracking-wider">
                抉择凯瑟琳长大的宿命
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span className="font-latin text-xs font-light text-[#d5b065] tracking-widest uppercase animate-pulse">
              START
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#d5b065] animate-pulse" />
          </div>
        </motion.button>

        {/* 2x2 精美复古方卡，对应其余四样圣物 */}
        <div className="grid grid-cols-2 gap-2.5">
          
          {/* 白书：七神圣谱 */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onCompendiumClick}
            className="p-2.5 rounded bg-[#1e1711] border border-[#b38b5d]/15 flex items-center gap-2 text-left active:bg-[#2c221a]"
          >
            <div className="w-7 h-7 rounded bg-[#ebe5d5]/10 border border-[#b38b5d]/20 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-[#ebe5d5]" strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="font-chinese text-xs font-semibold text-[#ebe5d5] tracking-wider">神谱图鉴</h4>
              <span className="font-latin text-[9px] text-[#b38b5d]/60 block uppercase">Compendium</span>
            </div>
          </motion.button>

          {/* 黑书：旧世段章 */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onChapterClick}
            className="p-2.5 rounded bg-[#151515] border border-white/[0.05] flex items-center gap-2 text-left active:bg-[#202020]"
          >
            <div className="w-7 h-7 rounded bg-[#111] border border-white/[0.1] flex items-center justify-center flex-shrink-0">
              <History className="w-4 h-4 text-[#a3a3a3]" strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="font-chinese text-xs font-semibold text-[#d4d4d4] tracking-wider">断章重温</h4>
              <span className="font-latin text-[9px] text-[#737373] block uppercase">Chapters</span>
            </div>
          </motion.button>

          {/* 卷轴：帝国辖境 */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onMapClick}
            className="p-2.5 rounded bg-[#1f1a14] border border-[#a88253]/15 flex items-center gap-2 text-left active:bg-[#2d251d]"
          >
            <div className="w-7 h-7 rounded bg-[#baa180]/10 border border-[#baa180]/20 flex items-center justify-center flex-shrink-0">
              <Map className="w-4 h-4 text-[#dfccb3]" strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="font-chinese text-xs font-semibold text-[#dfccb3] tracking-wider">领地舆图</h4>
              <span className="font-latin text-[9px] text-[#a88253]/60 block uppercase">Map Scroll</span>
            </div>
          </motion.button>

          {/* 手稿：终末画卷 */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onEndingClick}
            className="p-2.5 rounded bg-[#1a0f12] border border-[#9f1239]/15 flex items-center gap-2 text-left active:bg-[#28181b]"
          >
            <div className="w-7 h-7 rounded bg-[#9f1239]/10 border border-[#9f1239]/30 flex items-center justify-center flex-shrink-0 relative">
              <Award className="w-4 h-4 text-rose-300" strokeWidth={1.5} />
              {unlockedEndingsCount > 0 && (
                <div className="absolute -top-1 -right-1 px-1 bg-rose-600 text-white text-[8px] rounded-full scale-90">
                  {unlockedEndingsCount}
                </div>
              )}
            </div>
            <div>
              <h4 className="font-chinese text-xs font-semibold text-rose-200 tracking-wider">宿命画卷</h4>
              <span className="font-latin text-[9px] text-rose-400/50 block uppercase">Endings</span>
            </div>
          </motion.button>

        </div>
      </motion.div>

      {styleElement}
    </div>
  );
};

// 微弱光芒划过动画效果
const styleElement = (
  <style>{`
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      50% { transform: translateX(100%); }
      100% { transform: translateX(100%); }
    }
  `}</style>
);
