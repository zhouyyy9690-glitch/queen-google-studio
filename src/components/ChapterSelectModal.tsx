import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Play, RotateCcw, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { OrnateCorner } from './OrnateCorner';
import { CHAPTERS_CONFIG } from '../constants';
import { locations } from '../locations';

interface ChapterSelectModalProps {
  unlockedChapters: string[];
  unlockedLocations: string[];
  onSelect: (chapterId: string) => void;
  onClose: () => void;
  onReset: () => void;
}

const ChapterMapPreview = ({ chapter, isUnlocked, unlockedLocations }: { chapter: any, isUnlocked: boolean, unlockedLocations: string[] }) => {
  const { x, y, scale } = chapter.mapFocus;
  
  // Find location details for highlighting
  const activeLocations = locations.filter(loc => 
    chapter.highlightLocations?.includes(loc.id)
  );

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0c0c0c] shadow-2xl">
      {/* Animated Map Context Layer */}
      <motion.div 
        animate={{ 
          scale: [scale, scale * 1.05, scale],
          x: [x * 0.9, x * 1.1, x * 0.9],
          y: [y * 0.9, y * 1.1, y * 0.9]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 select-none"
      >
        {/* Base Map Texture */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?auto=format&fit=crop&q=80')`,
            backgroundSize: '200% 200%',
            filter: isUnlocked ? 'sepia(0.6) brightness(0.7) contrast(1.2)' : 'grayscale(1) brightness(0.3)',
          }}
        />

        {/* Embedded Region Labels - Deeply integrated into the background */}
        {chapter.regionLabels?.map((label: string, i: number) => (
          <div
             key={i}
             className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <span className="font-typewriter text-4xl md:text-8xl text-amber-950/20 uppercase tracking-[0.8em] select-none -rotate-12 translate-y-20 blur-[1px]">
              {label}
            </span>
          </div>
        ))}

        {/* Contextual Location Highlights - Now synced with map movement */}
        <div className="absolute inset-0 pointer-events-none">
          {activeLocations.map((loc) => {
            const isMarkerLit = unlockedLocations.includes(loc.id);
            // In the map's coordinate system (0-100)
            const left = loc.x;
            const top = loc.y;

            const chapterLocIndex = chapter.highlightLocations.indexOf(loc.id);

            return (
              <div
                key={loc.id}
                style={{ left: `${left}%`, top: `${top}%` }}
                className="absolute"
              >
                <div className="relative -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  {/* Breathing Beacon for Unlocked Locations */}
                  {isMarkerLit && isUnlocked && (
                    <motion.div
                      animate={{ scale: [1, 2.5, 1], opacity: [0, 0.3, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute w-20 h-20 bg-amber-500 rounded-full blur-2xl"
                    />
                  )}
                  
                  {/* Marker Dot - Different styles for discovered/undiscovered */}
                  <div className={`
                    w-2 h-2 rounded-full border transition-all duration-700
                    ${isMarkerLit && isUnlocked 
                      ? 'bg-amber-500 shadow-[0_0_15px_#f59e0b] border-amber-400' 
                      : 'bg-neutral-900 border-amber-950/40 opacity-40'}
                  `}>
                    {!isMarkerLit && isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-0.5 h-0.5 bg-amber-900/20 rounded-full" />
                      </div>
                    )}
                  </div>
                  
                  {/* Label - Different styles for discovered/undiscovered */}
                  <div className={`
                    mt-3 px-3 py-1 backdrop-blur-sm border transition-all duration-700
                    ${isMarkerLit && isUnlocked 
                      ? 'bg-black/40 border-amber-900/10' 
                      : 'bg-black/10 border-white/5 opacity-20'}
                  `}>
                    <span className={`
                      font-typewriter text-[9px] uppercase tracking-[0.3em] whitespace-nowrap flex items-center gap-2
                      ${isMarkerLit && isUnlocked ? 'text-amber-500' : 'text-neutral-800'}
                    `}>
                      {isMarkerLit && isUnlocked ? (
                        <>
                          <span className="text-[7px] opacity-40">0{chapterLocIndex + 1}</span>
                          {loc.name}
                        </>
                      ) : (
                        <>
                          <Lock className="w-2 h-2" />
                          <span className="blur-[1px]">UNDISCOVERED</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
      
      {/* Global Environmental Overlays (Non-moving) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 pointer-events-none" />

      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <Lock className="w-16 h-16 text-white/10" />
          </motion.div>
        </div>
      )}

      {/* Frame */}
      <div className="absolute inset-0 border-[16px] border-amber-950/10 pointer-events-none z-40" />
    </div>
  );
};

export const ChapterSelectModal: React.FC<ChapterSelectModalProps> = ({
  unlockedChapters,
  unlockedLocations,
  onSelect,
  onClose,
  onReset
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const currentChapter = CHAPTERS_CONFIG[currentPage];
  const isUnlocked = unlockedChapters.includes(currentChapter.id);

  const nextPage = () => setCurrentPage(prev => (prev + 1) % CHAPTERS_CONFIG.length);
  const prevPage = () => setCurrentPage(prev => (prev - 1 + CHAPTERS_CONFIG.length) % CHAPTERS_CONFIG.length);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[600] bg-[#050505] flex items-center justify-center overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,20,10,0.4)_0%,transparent_100%)] pointer-events-none" />
      
      {/* The Great Tome */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full h-full lg:w-[1400px] lg:h-[800px] shadow-[0_60px_120px_-20px_rgba(0,0,0,1)] flex flex-col md:flex-row bg-[#0c0c0c] border border-amber-900/10 overflow-hidden md:m-12"
      >
        {/* Book Spine Shadow */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-48 bg-gradient-to-r from-transparent via-black/60 to-transparent z-40 pointer-events-none hidden md:block" />

        <OrnateCorner position="tl" />
        <OrnateCorner position="tr" />
        <OrnateCorner position="bl" />
        <OrnateCorner position="br" />

        {/* Left/Top Page: Narrative (Above on mobile) */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col p-8 md:p-16 lg:p-20 relative bg-[#0e0e0e] border-b md:border-b-0 md:border-r border-amber-900/10 z-10 order-1 md:order-1">
          {/* Paper Texture Overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-[0.03] pointer-events-none" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentChapter.id}
              initial={{ x: -30, opacity: 0, filter: 'blur(10px)' }}
              animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ x: 30, opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="h-full flex flex-col relative z-20"
            >
              <div className="flex flex-col mb-6 md:mb-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-typewriter italic text-amber-900/40 text-sm md:text-lg lg:text-xl tracking-[0.3em]">
                    {currentChapter.number}
                  </span>
                  
                  {/* Discovery Progress Counter */}
                  {isUnlocked && (
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-3 bg-amber-950/10 px-3 py-1.5 border border-amber-900/10 rounded-sm"
                    >
                      <div className="flex flex-col items-end">
                        <span className="text-[7px] text-amber-900/40 uppercase tracking-[0.2em] mb-0.5">Found</span>
                        <span className="font-typewriter text-[10px] text-amber-600/80 tracking-widest leading-none">
                          {currentChapter.highlightLocations?.filter(id => unlockedLocations.includes(id)).length || 0}/{currentChapter.highlightLocations?.length || 0}
                        </span>
                      </div>
                      <div className="w-6 h-6 rounded-full border border-amber-900/20 flex items-center justify-center relative overflow-hidden bg-black/20">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${((currentChapter.highlightLocations?.filter(id => unlockedLocations.includes(id)).length || 0) / (currentChapter.highlightLocations?.length || 1)) * 100}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="absolute bottom-0 left-0 right-0 bg-amber-600/30"
                        />
                        <div className="relative z-10 w-1 h-1 rounded-full bg-amber-600/40 shadow-[0_0_5px_rgba(217,119,6,0.3)]" />
                      </div>
                    </motion.div>
                  )}
                </div>
                
                <div className="w-12 md:w-16 h-px bg-amber-900/30 mb-4 md:mb-8" />
                
                <h1 className={`font-typewriter text-3xl md:text-5xl lg:text-7xl tracking-tighter leading-tight ${isUnlocked ? 'text-amber-100/90' : 'text-neutral-800'}`}>
                  {currentChapter.title}
                </h1>
                <p className="font-typewriter text-[8px] md:text-[10px] lg:text-xs text-amber-900/60 uppercase tracking-[0.5em] mt-3 md:mt-6 mb-6 md:mb-10">
                  {currentChapter.subtitle}
                </p>
              </div>

              <div className="flex-grow space-y-6 md:space-y-10 overflow-y-auto scrollbar-hide">
                <div className="relative pl-6 md:pl-8">
                  <p className={`text-sm md:text-base lg:text-xl font-serif italic leading-[1.8] max-w-lg ${isUnlocked ? 'text-neutral-400' : 'text-neutral-800'}`}>
                    {currentChapter.description}
                  </p>
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-900/30 to-transparent" />
                </div>

                {isUnlocked ? (
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(217, 119, 6, 0.05)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelect(currentChapter.id)}
                    className="flex items-center gap-4 md:gap-5 px-6 md:px-10 py-3 md:py-5 bg-amber-900/10 border border-amber-900/20 hover:border-amber-600/60 text-amber-600 uppercase tracking-[0.4em] text-[8px] md:text-xs transition-all group mt-6 md:mt-16 shadow-lg"
                  >
                    <Play className="w-3 h-3 md:w-4 md:h-4 fill-current group-hover:text-amber-400 transition-colors" />
                    揭开记忆 · Recall the Path
                  </motion.button>
                ) : (
                  <div className="flex items-center gap-4 md:gap-5 px-6 md:px-10 py-3 md:py-5 bg-white/[0.01] border border-white/5 text-neutral-800 uppercase tracking-[0.4em] text-[8px] md:text-xs mt-6 md:mt-16 cursor-not-allowed">
                    <Lock className="w-3 h-3 md:w-4 md:h-4 opacity-50" />
                    尚未解锁 · Bound by Fate
                  </div>
                )}
              </div>

              {/* Page Numbering Footer */}
              <div className="mt-auto flex items-center justify-between font-typewriter text-[8px] md:text-[9px] uppercase tracking-[0.6em] text-amber-900/20 pt-4 md:pt-8 border-t border-amber-900/5">
                <span>Folio {currentPage + 1}</span>
                <span>The Chronicles of Hersey</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right/Bottom Page: Visual (Below on mobile) */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full relative bg-[#050505] overflow-hidden order-2 md:order-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentChapter.id}
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="w-full h-full"
            >
              <ChapterMapPreview 
                chapter={currentChapter} 
                isUnlocked={isUnlocked} 
                unlockedLocations={unlockedLocations}
              />
            </motion.div>
          </AnimatePresence>

          {/* Map Title Vignette */}
          <div className="absolute top-6 md:top-12 right-6 md:right-12 z-30 text-right">
            <h3 className="font-typewriter text-[8px] md:text-[10px] text-amber-600/60 tracking-[0.8em] uppercase mb-1">Topography</h3>
            <div className="h-px w-20 md:w-32 bg-amber-900/20 ml-auto" />
          </div>
        </div>

        {/* Tactical Navigation Arrows */}
        <div className="absolute bottom-8 md:bottom-auto md:top-1/2 left-0 right-0 md:-translate-y-1/2 flex justify-center md:justify-between px-8 md:px-12 pointer-events-none gap-12 md:gap-0 z-[100]">
          <button 
            onClick={(e) => { e.stopPropagation(); prevPage(); }}
            className="w-10 h-10 md:w-20 md:h-20 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-amber-900/20 text-amber-900/50 hover:text-amber-500 hover:border-amber-600 hover:scale-110 active:scale-95 transition-all pointer-events-auto group"
          >
            <ChevronLeft className="w-6 h-6 md:w-10 md:h-10 transition-transform group-hover:-translate-x-1" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); nextPage(); }}
            className="w-10 h-10 md:w-20 md:h-20 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-amber-900/20 text-amber-900/50 hover:text-amber-500 hover:border-amber-600 hover:scale-110 active:scale-95 transition-all pointer-events-auto group"
          >
            <ChevronRight className="w-6 h-6 md:w-10 md:h-10 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </motion.div>

      {/* Global Interface Actions */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:gap-4 z-[110]">
        <button
          onClick={onReset}
          className="group flex items-center gap-2 text-rose-900/30 hover:text-rose-600 transition-colors uppercase tracking-[0.2em] text-[8px] md:text-[10px] cursor-pointer"
        >
          <RotateCcw className="w-3 h-3 group-hover:rotate-[-45deg] transition-transform" />
          Reset Chronicles
        </button>
        
        <button 
          onClick={onClose}
          className="flex items-center gap-3 text-white/20 hover:text-white/60 transition-all uppercase tracking-[0.6em] text-[8px] md:text-[10px] cursor-pointer group"
        >
          <div className="w-6 md:w-8 h-px bg-white/10 group-hover:w-12 md:group-hover:w-16 transition-all" />
          Close Tome
          <div className="w-6 md:w-8 h-px bg-white/10 group-hover:w-12 md:group-hover:w-16 transition-all" />
        </button>
      </div>
    </motion.div>
  );
};
