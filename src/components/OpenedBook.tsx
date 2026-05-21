import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { playSFX, SFX_ASSETS } from '../audio';

interface OpenedBookProps {
  onClose: () => void;
  onSelectPath: (pathId: string) => void;
  onContinueWriting?: (pathId: string) => void;
  pausedPaths?: Record<string, string | null>;
}

// 优雅的花体字母符号组件：支持 K/D/H/S
const PathSignature = ({ symbol, onComplete }: { symbol: string, onComplete: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute -bottom-16 left-1/2 -translate-x-1/2 cursor-pointer group"
      onClick={(e) => {
        e.stopPropagation();
        onComplete();
      }}
    >
      <div className="relative flex flex-col items-center">
        <svg width="64" height="64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {symbol === 'K' && (
            <motion.path
              d="M30 20 V80 M30 50 L70 20 M30 50 L70 80"
              stroke="#3d2b1f"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          )}
          {symbol === 'D' && (
            <motion.path
              d="M30 20 V80 M30 20 Q75 20 75 50 Q75 80 30 80"
              stroke="#3d2b1f"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          )}
          {symbol === 'H' && (
            <motion.path
              d="M30 20 V80 M70 20 V80 M30 50 H70"
              stroke="#3d2b1f"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          )}
          {symbol === 'S' && (
            <motion.path
              d="M70 20 Q30 20 30 50 Q70 50 70 80 Q30 80 30 50"
              stroke="#3d2b1f"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          )}
        </svg>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-[8px] tracking-[0.4em] text-[#3d2b1f]/30 font-serif whitespace-nowrap mt-[-8px]"
        >
          INCEPTUM
        </motion.div>
      </div>
    </motion.div>
  );
};

interface PageData {
  id: string;
  title: string;
  englishTitle: string;
  content: string;
  illustration?: string;
  nextSceneId: string;
}

const PAGES: PageData[] = [
  {
    id: 'fox',
    title: '狐狸之路',
    englishTitle: 'THE PATH OF THE FOX',
    content: '你将带来，你将带去。\n你将统治，你将君临。\n哪一个才是你的未来？',
    nextSceneId: 'F1-fox',
  },
  {
    id: 'eagle',
    title: '黑鹰之路',
    englishTitle: 'THE PATH OF THE EAGLE',
    content: '篡夺者与被遗忘者。你是权力的棋子，还是破局的利刃？',
    nextSceneId: 'eagle',
  },
  {
    id: 'deer',
    title: '红鹿之路',
    englishTitle: 'THE PATH OF THE DEER',
    content: '雀鸟与铁剑，弟弟与儿子。你是女王的夜莺，还是持琴的骑士？',
    nextSceneId: 'd1-deer',
  },
  {
    id: 'destiny',
    title: '纺锤之路',
    englishTitle: 'THE PATH OF DESTINY',
    content: '在你被尊为白王之前，这里有一千零一根羊毛。作为纺织女，你需要将它们全部纺织成线？',
    nextSceneId: 'Destiny',
  }
];

export const OpenedBook: React.FC<OpenedBookProps> = ({ onClose, onSelectPath, onContinueWriting, pausedPaths = {} }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [showSignature, setShowSignature] = useState(false);

  const handleNext = () => {
    setShowSignature(false);
    if (currentPage < PAGES.length - 1) {
      setCurrentPage(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    setShowSignature(false);
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleTitleClick = () => {
    playSFX(SFX_ASSETS.DOOR_OPEN, false, 0.4);
    setShowSignature(true);
  };

  return (
    <div className="fixed inset-0 z-[1000] pointer-events-none flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1,
          filter: 'none',
          x: typeof window !== 'undefined' && window.innerWidth < 1024 ? 0 : -47,
          y: typeof window !== 'undefined' && window.innerWidth < 1024 ? 0 : 4,
          scale: typeof window !== 'undefined' && window.innerWidth < 1024 ? 0.95 : 0.68,
        }}
        exit={{ opacity: 0, filter: 'blur(15px)', y: 10 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-1/2 top-1/2 z-[800] pointer-events-auto"
        style={{
          width: typeof window !== 'undefined' && window.innerWidth < 1024 ? '92%' : '80%',
          maxWidth: '1200px',
          transformOrigin: 'center center',
          translateX: '-50%',
          translateY: '-50%',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >
      {/* 接触阴影层：极细、极深，模拟物体压在桌子上的物理感 */}
      <div className="absolute inset-0 bg-black/40 blur-md translate-y-2 scale-[0.98] pointer-events-none" />
      
      {/* 书籍主体 */}
      <div className="relative w-full aspect-[1.5/1] bg-[#e3d5ab] rounded-sm shadow-[0_4px_10px_rgba(0,0,0,0.5),0_10px_20px_rgba(0,0,0,0.3)] border-l-[14px] border-[#25160d] overflow-hidden flex ring-1 ring-black/10">
        
        {/* 左页 */}
        <div className="relative flex-1 p-4 md:p-12 flex flex-col items-center justify-center border-r border-black/[0.08] overflow-hidden">
          {/* 中缝深处阴影 */}
          <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-black/25 via-black/5 to-transparent pointer-events-none" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={`left-${currentPage}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <div className="mb-4 opacity-25 font-serif italic text-xs tracking-[0.4em] text-[#3d2b1f]">
                MS. FRAGMENT {currentPage + 1}
              </div>
              
              <div className="relative inline-block group">
                {onContinueWriting && pausedPaths[PAGES[currentPage].id] && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onContinueWriting(PAGES[currentPage].id);
                    }}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap cursor-pointer group/resume z-50 pointer-events-auto"
                  >
                    <span className="text-[10px] tracking-[0.5em] text-rose-900/60 font-latin hover:text-rose-700 transition-colors">
                      CONTINUE WRITING
                    </span>
                    <div className="h-[1px] w-0 group-hover/resume:w-full bg-rose-900/20 mx-auto transition-all duration-700" />
                  </motion.div>
                )}
                <h2 
                  onClick={handleTitleClick}
                  className="text-2xl md:text-5xl font-chinese font-bold text-[#3d2b1f]/90 tracking-[0.1em] mb-4 md:mb-6 drop-shadow-sm cursor-pointer hover:text-[#3d2b1f] transition-colors"
                >
                  {PAGES[currentPage].title}
                </h2>
                
                {showSignature && (
                  <PathSignature 
                    symbol={
                      PAGES[currentPage].id === 'fox' ? 'K' :
                      PAGES[currentPage].id === 'deer' ? 'D' :
                      PAGES[currentPage].id === 'eagle' ? 'H' : 'S'
                    } 
                    onComplete={() => onSelectPath(PAGES[currentPage].id)} 
                  />
                )}
              </div>

              <div className="text-[10px] md:text-[11px] font-display tracking-[0.6em] text-[#3d2b1f]/40 uppercase">
                {PAGES[currentPage].englishTitle}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 右页 */}
        <div className="relative flex-1 p-6 md:p-20 flex flex-col items-start justify-center bg-gradient-to-br from-[#f0e6d2]/20 to-transparent">
          {/* 中缝深处阴影 */}
          <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-black/25 via-black/5 to-transparent pointer-events-none" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={`right-${currentPage}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
               <div className="relative">
                  <p className="text-xs sm:text-sm md:text-lg font-chinese leading-[1.6] md:leading-[1.9] text-[#3d2b1f]/90 tracking-wide text-justify font-serif">
                    {PAGES[currentPage].content}
                  </p>
               </div>
               
               <div className="mt-4 md:mt-16 pt-4 md:pt-8 border-t border-[#3d2b1f]/10 flex justify-between items-center text-[10px] uppercase tracking-[0.25em] font-mono text-[#3d2b1f]/30">
                  <span className="opacity-50">DOCUMENTA / HERSHEY</span>
                  <span>PAGE 0{currentPage + 1}</span>
               </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 去 UI 化的翻页提示 */}
        <div className="absolute inset-x-0 bottom-4 md:bottom-10 flex justify-between px-6 md:px-12 pointer-events-none">
          <button 
            onClick={handlePrev}
            disabled={currentPage === 0}
            className={`pointer-events-auto transition-opacity duration-300 ${currentPage === 0 ? 'opacity-0' : 'opacity-20 hover:opacity-100'} text-[#3d2b1f]`}
          >
            <ChevronLeft size={32} strokeWidth={1} />
          </button>
          
          <button 
            onClick={handleNext}
            className="pointer-events-auto opacity-20 hover:opacity-100 transition-opacity duration-300 text-[#3d2b1f] flex items-center gap-2 group"
          >
            <span className="text-[9px] uppercase tracking-[0.4em] font-bold opacity-0 group-hover:opacity-100 transition-opacity">NEXT</span>
            <ChevronRight size={32} strokeWidth={1} />
          </button>
        </div>

        {/* 纸张纹理与微妙的反光，模拟桌面灯光 */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/old-map.png')]" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-white/10" />
      </div>

      <style>{`
        .font-chinese { font-family: "Noto Serif SC", serif; }
      `}</style>
    </motion.div>
    </div>
  );
};

