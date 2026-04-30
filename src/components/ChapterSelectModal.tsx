import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Play, RotateCcw, ChevronLeft, ChevronRight, MapPin, BookOpen, ScrollText, Bird } from 'lucide-react';
import { LunarPhaseIndicator } from './LunarPhaseIndicator';
import { OrnateCorner } from './OrnateCorner';
import { ChapterInsightsView } from './ChapterInsightsView';
import { CHAPTERS_CONFIG, ROADS_CONFIG } from '../constants';
import { locations } from '../locations';
import { insights } from '../insights';

interface ChapterSelectModalProps {
  unlockedChapters: string[];
  unlockedLocations: string[];
  unlockedInsights: Set<string>;
  history: string[];
  onSelect: (chapterId: string) => void;
  onClose: () => void;
  onReset: () => void;
}

// --------------------------------------------------------------------------------
// 章节星座图组件 (Chapter Constellation)
// --------------------------------------------------------------------------------
const ChapterConstellation = ({ chapter, history }: { chapter: any; history: string[] }) => {
  if (!chapter || !chapter.constellation || chapter.constellation.length === 0) return null;

  const nodeCount = chapter.constellation.length;
  // 动态生成连线逻辑
  const connections: [number, number][] = [];
  for (let i = 0; i < nodeCount - 1; i++) {
    connections.push([i, i + 1]);
  }

  // 节点坐标 (百分比) - 模拟天体轨迹 (根据节点数动态分布或使用预设)
  const defaultCoords = [
    { x: 20, y: 30 }, { x: 35, y: 25 }, { x: 50, y: 40 }, 
    { x: 65, y: 20 }, { x: 80, y: 35 }, { x: 70, y: 60 }, { x: 85, y: 75 }
  ];
  const coords = defaultCoords.slice(0, nodeCount);

  // 生成四角星路径 (中心点坐标，半径)
  const getStarPath = (cx: number, cy: number, rOuter: number, rInner: number) => {
    const points = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i * 45) * Math.PI / 180;
      const r = (i % 2 === 0) ? rOuter : rInner;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return `M ${points.join(' L ')} Z`;
  };

  return (
    <div className="absolute top-1/2 -right-8 md:right-0 -translate-y-1/2 w-40 md:w-56 h-64 md:h-80 pointer-events-none opacity-80 z-20 overflow-visible">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {/* 连线 */}
        {connections.map(([from, to], i) => {
          const fromNode = chapter.constellation[from];
          const toNode = chapter.constellation[to];
          if (!fromNode || !toNode) return null;

          const isFromLit = history.some(id =>
            fromNode.matchScenes.some((m: string) => id.includes(m))
          );
          const isToLit = history.some(id =>
            toNode.matchScenes.some((m: string) => id.includes(m))
          );
          const isLineLit = isFromLit && isToLit;

          return (
            <line
              key={`line-${i}`}
              x1={coords[from].x}
              y1={coords[from].y}
              x2={coords[to].x}
              y2={coords[to].y}
              stroke={isLineLit ? "#D4AF37" : "#4A3B30"}
              strokeWidth="0.5"
              strokeDasharray="1,1"
              opacity={0.6}
            />
          );
        })}

        {/* 星星节点 */}
        {chapter.constellation.map((node: any, i: number) => {
          const isLit = history.some(id =>
            node.matchScenes.some((match: string) => id.includes(match))
          );
          const pos = coords[i];
          if (!pos) return null;
          const isMoon = node.id === 'night' || node.icon === 'moon';
          const starColor = isLit ? "#D4AF37" : "#6B5B4B";
          const centerX = pos.x;
          const centerY = pos.y;
          const size = isMoon ? 0 : 6; ;

          return (
            <g key={node.id}>
              {isMoon ? (
                <text
                  x={centerX}
                  y={centerY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isLit ? "#D4AF37" : "#6B5B4B"}
                  className="text-[6px] font-serif"
                  style={{ fontFamily: 'serif', transform: 'translate(0, -1px)' }}
                >
                  ☾
                </text>
              ) : (
                <g transform={`translate(${pos.x}, ${pos.y})`}>
                  <path
                    d={getStarPath(0, 0, 3, 1.2)}
                    fill={starColor}
                    stroke={isLit ? "#D4AF37" : "#6B5B4B"}
                    strokeWidth="0.2"
                  />
                </g>
              )}

              {/* 标签：只有点亮才显示 */}
              {isLit && (
                <text
                  x={pos.x}
                  y={pos.y + 5}
                  textAnchor="middle"
                  className="fill-amber-100/70 text-[2.5px] tracking-[0.2em] font-chinese font-light pointer-events-none"
                >
                  {node.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// --------------------------------------------------------------------------------
// 章节地图预览组件
// --------------------------------------------------------------------------------
const ChapterMapPreview = ({ chapter, isUnlocked, unlockedLocations }: { chapter: any, isUnlocked: boolean, unlockedLocations: string[] }) => {
  const { x, y, scale } = chapter.mapFocus;
  
  const activeLocations = useMemo(() => 
    locations.filter(loc => chapter.highlightLocations?.includes(loc.id)),
    [chapter.highlightLocations]
  );

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0c0c0c] shadow-2xl">
      <motion.div 
        animate={{ 
          scale: [scale, scale * 1.05, scale],
          x: [x * 0.9, x * 1.1, x * 0.9],
          y: [y * 0.9, y * 1.1, y * 0.9]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 select-none will-change-transform"
      >
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?auto=format&fit=crop&q=80')`,
            backgroundSize: '200% 200%',
            filter: isUnlocked ? 'sepia(0.6) brightness(0.7) contrast(1.2)' : 'grayscale(1) brightness(0.3)',
          }}
        />

        {chapter.regionLabels?.map((label: string, i: number) => (
          <div key={i} className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="font-typewriter text-4xl md:text-8xl text-amber-950/20 uppercase tracking-[0.8em] select-none -rotate-12 translate-y-20 blur-[1px]">
              {label}
            </span>
          </div>
        ))}

        <div className="absolute inset-0 pointer-events-none">
          {activeLocations.map((loc) => {
            const isMarkerLit = unlockedLocations.includes(loc.id);
            const left = loc.x;
            const top = loc.y;
            const chapterLocIndex = chapter.highlightLocations.indexOf(loc.id);

            return (
              <div key={loc.id} style={{ left: `${left}%`, top: `${top}%` }} className="absolute">
                <div className="relative -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  {isMarkerLit && isUnlocked && (
                    <motion.div
                      animate={{ scale: [1, 2.5, 1], opacity: [0, 0.3, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute w-20 h-20 bg-amber-500 rounded-full blur-2xl"
                    />
                  )}
                  
                  <div className={`w-2 h-2 rounded-full border transition-all duration-700 ${isMarkerLit && isUnlocked ? 'bg-amber-500 shadow-[0_0_15px_#f59e0b] border-amber-400' : 'bg-neutral-900 border-amber-950/40 opacity-40'}`} />
                  
                  <div className={`mt-3 px-3 py-1 border transition-all duration-700 ${isMarkerLit && isUnlocked ? 'bg-black/70 border-amber-900/10' : 'bg-black/20 border-white/5 opacity-20'}`}>
                    <span className={`font-typewriter text-[9px] uppercase tracking-[0.3em] whitespace-nowrap flex items-center gap-2 ${isMarkerLit && isUnlocked ? 'text-amber-500' : 'text-neutral-800'}`}>
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
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <Lock className="w-16 h-16 text-white/10" />
          </motion.div>
        </div>
      )}
      <div className="absolute inset-0 border-[16px] border-amber-950/10 pointer-events-none z-40" />
    </div>
  );
};

// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// 塔罗意象插图 (Tarot Woodcut Illustrations)
// --------------------------------------------------------------------------------
const TarotIllustration = ({ type, color }: { type: string, color: string }) => {
  const baseClass = "w-full h-full opacity-60";
  
  if (type === 'fox') { // THE CHARIOT (战车)
    return (
      <svg viewBox="0 0 100 120" className={baseClass} fill="none" stroke={color}>
        <path d="M20 45 L80 45 L75 25 L25 25 Z" strokeWidth="1" /> {/* Canopy */}
        <circle cx="30" cy="95" r="12" strokeWidth="1.5" />
        <circle cx="70" cy="95" r="12" strokeWidth="1.5" />
        <path d="M15 85 L85 85" strokeWidth="0.5" strokeDasharray="2 2" />
        <path d="M50 15 L50 35" strokeWidth="2" strokeLinecap="round" />
        <path d="M35 55 L45 75 M65 55 L55 75" strokeWidth="1" />
        <circle cx="50" cy="20" r="3" fill={color} />
      </svg>
    );
  }
  if (type === 'deer') { // KNIGHT OF CUPS (圣杯骑士)
    return (
      <svg viewBox="0 0 100 120" className={baseClass} fill="none" stroke={color}>
        <path d="M35 85 L65 85 L60 105 L40 105 Z" strokeWidth="1" />
        <path d="M30 40 C30 80 70 80 70 40 C70 30 30 30 30 40" strokeWidth="1.5" />
        <path d="M20 30 Q50 10 80 30" strokeWidth="0.5" opacity="0.3" />
        <path d="M50 50 Q60 40 50 30 Q40 40 50 50" fill={color} opacity="0.4" />
        <circle cx="50" cy="65" r="3" fill={color} />
      </svg>
    );
  }
  if (type === 'eagle') { // KING OF SWORDS (REVERSED / 逆位宝剑国王)
    return (
      <svg viewBox="0 0 100 120" className={baseClass} fill="none" stroke={color}>
        <g transform="rotate(180, 50, 60)">
          <path d="M50 20 L50 90" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M30 35 L70 35" strokeWidth="2" />
          <path d="M45 15 L55 15 L50 10 Z" fill={color} />
          <path d="M25 95 L75 95" strokeWidth="0.5" opacity="0.4" />
          <circle cx="50" cy="65" r="15" strokeWidth="0.5" strokeDasharray="3 3" />
        </g>
      </svg>
    );
  }
  if (type === 'spindle') { // WHEEL OF FORTUNE (命运之轮)
    return (
      <svg viewBox="0 0 100 120" className={baseClass} fill="none" stroke={color}>
        <circle cx="50" cy="60" r="35" strokeWidth="1.5" />
        <circle cx="50" cy="60" r="28" strokeWidth="0.5" strokeDasharray="4 2" />
        <circle cx="50" cy="60" r="5" fill={color} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
          <line key={a} x1="50" y1="60" x2={50 + Math.cos(a * Math.PI / 180) * 35} y2={60 + Math.sin(a * Math.PI / 180) * 35} strokeWidth="1" />
        ))}
        <path d="M50 15 L50 30 M40 20 L60 20" strokeWidth="1" opacity="0.6" />
        <path d="M50 105 L50 90" strokeWidth="1" opacity="0.6" />
      </svg>
    );
  }
  return null;
};

// --------------------------------------------------------------------------------
// 塔罗卡牌配置
// --------------------------------------------------------------------------------
const TAROT_MAP: Record<string, { latinName: string, arcana: string, isReversed?: boolean }> = {
  fox: { 
    latinName: "THE CHARIOT", 
    arcana: "VII"
  },
  deer: { 
    latinName: "KNIGHT OF CUPS", 
    arcana: "KNIGHT"
  },
  eagle: { 
    latinName: "KING OF SWORDS", 
    arcana: "KING",
    isReversed: true
  },
  spindle: { 
    latinName: "WHEEL OF FORTUNE", 
    arcana: "X"
  }
};

// --------------------------------------------------------------------------------
// 路线选择视图 (Tarot Carousel)
// --------------------------------------------------------------------------------
const RoadSelectionView = ({ onSelectRoad }: { onSelectRoad: (roadId: string) => void }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const roads = ROADS_CONFIG;

  const nextCard = () => setActiveIndex((prev) => (prev + 1) % roads.length);
  const prevCard = () => setActiveIndex((prev) => (prev - 1 + roads.length) % roads.length);

  return (
    <div className="w-full h-full flex flex-col pt-6 md:pt-10 pb-4 relative z-20 overflow-hidden bg-[#0d0d0d]">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] opacity-[0.08] pointer-events-none" />
      
      <div className="text-center mb-6 md:mb-10 flex flex-col items-center shrink-0 z-30">
        <span className="font-typewriter text-amber-900/40 text-[9px] md:text-[11px] tracking-[1.2em] uppercase block mb-3">— ARCHIVVM FATORVM —</span>
        <h2 className="font-serif text-2xl md:text-5xl text-amber-50/70 tracking-[0.6em] font-light italic">
          ORACLVM
        </h2>
        <div className="w-48 h-px bg-gradient-to-r from-transparent via-amber-900/40 to-transparent mt-4" />
      </div>

      <div className="relative flex-grow flex items-center justify-center perspective-1000">
        <button 
          onClick={prevCard}
          className="absolute left-6 md:left-20 z-50 p-4 rounded-full border border-amber-900/10 text-amber-900/30 hover:text-amber-500 hover:border-amber-500/30 transition-all backdrop-blur-md group"
        >
          <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
        </button>
        
        <button 
          onClick={nextCard}
          className="absolute right-6 md:right-20 z-50 p-4 rounded-full border border-amber-900/10 text-amber-900/30 hover:text-amber-500 hover:border-amber-500/30 transition-all backdrop-blur-md group"
        >
          <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="relative w-full h-full flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            {roads.map((road, index) => {
              const tarot = TAROT_MAP[road.id];
              const isCenter = index === activeIndex;
              const isPrev = index === (activeIndex - 1 + roads.length) % roads.length;
              const isNext = index === (activeIndex + 1) % roads.length;

              if (!isCenter && !isPrev && !isNext) return null;

              return (
                <motion.div
                  key={road.id}
                  initial={{ opacity: 0, x: isNext ? 400 : -400, scale: 0.8 }}
                  animate={{ 
                    opacity: isCenter ? 1 : 0.25,
                    x: isCenter ? 0 : (isNext ? 380 : -380),
                    scale: isCenter ? 1 : 0.65,
                    rotateY: isCenter ? 0 : (isNext ? -25 : 25),
                    zIndex: isCenter ? 40 : 20
                  }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", stiffness: 180, damping: 22 }}
                  className={`absolute w-[260px] md:w-[320px] lg:w-[350px] max-h-[80vh] aspect-[1/1.6] flex flex-col pointer-events-${isCenter ? 'auto' : 'none'}`}
                >
                  <div className="relative h-full flex flex-col bg-[#dfd4bd] shadow-[0_45px_100px_-20px_rgba(0,0,0,0.9)] border-[4px] border-[#8b7355]/40 overflow-hidden rounded-[2px]">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] opacity-45 mix-blend-multiply pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20" />
                    
                    <div className="relative h-full flex flex-col p-5">
                      <div className="flex justify-between items-center mb-4 border-b border-black/10 pb-2">
                        <span className="font-serif text-base font-bold text-amber-950/40 italic">{tarot.arcana}</span>
                        <span className="font-typewriter text-[10px] tracking-[0.25em] text-amber-950/60 font-bold">{tarot.latinName}</span>
                      </div>

                      <div className="flex-grow flex items-center justify-center relative mb-6">
                        <div className="w-full h-full max-h-[180px] md:max-h-[240px]">
                           <TarotIllustration type={road.id} color="#4a3721" />
                        </div>
                        <div className="absolute bottom-2 text-[28px] font-serif text-black/[0.03] italic pointer-events-none select-none uppercase tracking-[0.2em] whitespace-nowrap">
                          Destinatum
                        </div>
                      </div>

                      {/* 底部按钮：拉丁文 REVELARE FATVM */}
                      <div className="h-24 flex flex-col items-center justify-center relative bg-black/[0.03] -mx-5 -mb-5 border-t border-black/10">
                        <motion.button
                          onClick={() => onSelectRoad(road.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex flex-col items-center justify-center cursor-pointer group/fate transition-all"
                        >
                          <span className="font-serif text-xl md:text-2xl text-red-900/80 tracking-[0.3em] font-bold drop-shadow-sm group-hover/fate:text-red-700 transition-colors uppercase">
                            REVELARE FATVM
                          </span>
                          <div className="w-24 h-px bg-red-900/20 mt-2 scale-x-50 group-hover/fate:scale-x-100 transition-transform duration-500" />
                          <span className="mt-2 font-typewriter text-[7px] tracking-[0.5em] text-amber-950/30 uppercase opacity-40 group-hover/fate:opacity-100 transition-opacity whitespace-nowrap">
                            Sortem Aperire
                          </span>
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {isCenter && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute -bottom-28 left-0 right-0 text-center pointer-events-none px-4"
                    >
                       <h4 className="font-serif text-[10px] text-amber-900/40 uppercase tracking-[0.3em] mb-2">{road.subtitle}</h4>
                       <p className="text-[11px] md:text-xs text-neutral-500 font-serif leading-relaxed italic tracking-widest mx-auto opacity-60">
                        — {road.description} —
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <div className="shrink-0 flex justify-center gap-6 mt-12 mb-4">
        {roads.map((_, i) => (
          <div 
            key={i} 
            className={`w-1.5 h-1.5 rotate-45 transition-all ${i === activeIndex ? 'bg-amber-600 scale-150' : 'bg-amber-900/20'}`} 
          />
        ))}
      </div>
    </div>
  );
};



// --------------------------------------------------------------------------------
// 章节选择模态框主体
// --------------------------------------------------------------------------------
export const ChapterSelectModal: React.FC<ChapterSelectModalProps> = ({
  unlockedChapters,
  unlockedLocations,
  unlockedInsights,
  history,
  onSelect,
  onClose,
  onReset
}) => {
  const [viewMode, setViewMode] = useState<'roads' | 'chapters'>('roads');
  const [selectedRoad, setSelectedRoad] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [subPageView, setSubPageView] = useState<0 | 1>(0); // 0: Summary, 1: Insights
  const [pageTrigger, setPageTrigger] = useState(0);
  const [pageDirection, setPageDirection] = useState<'next' | 'prev'>('next');

  // 根据选中的路线筛选章节
  const filteredChapters = useMemo(() => {
    if (!selectedRoad) return [];
    return CHAPTERS_CONFIG.filter(ch => ch.roadId === selectedRoad);
  }, [selectedRoad]);

  const currentChapter = filteredChapters[currentPage];
  const isUnlocked = currentChapter ? unlockedChapters.includes(currentChapter.id) : false;

  const handleSelectRoad = (roadId: string) => {
    setSelectedRoad(roadId);
    setCurrentPage(0);
    setSubPageView(0);
    setViewMode('chapters');
  };

  const handleBackToRoads = () => {
    setViewMode('roads');
  };

  const nextPage = () => {
    if (filteredChapters.length === 0) return;
    setPageDirection('next');
    setPageTrigger(prev => prev + 1);
    if (subPageView === 0) {
      setSubPageView(1);
    } else {
      setSubPageView(0);
      setCurrentPage(prev => (prev + 1) % filteredChapters.length);
    }
  };
  
  const prevPage = () => {
    if (filteredChapters.length === 0) return;
    setPageDirection('prev');
    setPageTrigger(prev => prev + 1);
    if (subPageView === 1) {
      setSubPageView(0);
    } else {
      setSubPageView(1);
      setCurrentPage(prev => (prev - 1 + filteredChapters.length) % filteredChapters.length);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, pointerEvents: 'none' }}
      className="fixed inset-0 z-[600] bg-[#050505] flex items-center justify-center overflow-hidden p-4 md:p-8"
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,20,10,0.4)_0%,transparent_100%)] pointer-events-none" />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full h-full lg:w-[1400px] lg:max-h-[90vh] lg:h-[800px] shadow-[0_60px_120px_-20px_rgba(0,0,0,1)] flex flex-col md:flex-row bg-[#0c0c0c] border border-amber-900/10 overflow-hidden will-change-transform"
      >
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-48 bg-gradient-to-r from-transparent via-black/40 to-transparent z-40 pointer-events-none hidden md:block" />

        <div className="z-[71] pointer-events-none">
          <OrnateCorner position="tl" />
          <OrnateCorner position="tr" />
          <OrnateCorner position="bl" />
          <OrnateCorner position="br" />
        </div>

        {/* Global Navigation Buttons - Always Visible and Stable */}
        {viewMode === 'chapters' && (
          <div className="absolute inset-0 z-[120] pointer-events-none flex items-center justify-between px-4 md:px-8">
            <motion.button 
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevPage}
              className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-black/40 md:bg-white/5 backdrop-blur-md border border-white/10 text-white/50 hover:text-amber-500 hover:border-amber-500/50 transition-all pointer-events-auto group"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 group-hover:-translate-x-1 transition-transform" />
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextPage}
              className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-black/40 md:bg-white/5 backdrop-blur-md border border-white/10 text-white/50 hover:text-amber-500 hover:border-amber-500/50 transition-all pointer-events-auto group"
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        )}

        <AnimatePresence mode="wait" initial={false} custom={pageDirection}>
          {viewMode === 'roads' ? (
            <motion.div
              key="road-selection"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col flex-grow order-1 md:order-1"
            >
               <RoadSelectionView onSelectRoad={handleSelectRoad} />
            </motion.div>
          ) : (
            <motion.div
              key={`${selectedRoad}-${currentPage}-${subPageView}`}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                const threshold = 100;
                if (info.offset.x < -threshold) {
                  nextPage();
                } else if (info.offset.x > threshold) {
                  prevPage();
                }
              }}
              style={{ transformOrigin: pageDirection === 'next' ? 'center right' : 'center left' }}
              initial={{ 
                opacity: 0, 
                rotateY: pageDirection === 'next' ? 45 : -45,
                x: pageDirection === 'next' ? 100 : -100,
                scale: 0.9
              }}
              animate={{ 
                opacity: 1, 
                rotateY: 0,
                x: 0,
                scale: 1
              }}
              exit={{ 
                opacity: 0, 
                rotateY: pageDirection === 'next' ? -45 : 45,
                x: pageDirection === 'next' ? -100 : 100,
                scale: 0.9
              }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex-grow order-1 md:order-1 h-full overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing perspective-1000"
            >
              {subPageView === 0 ? (
                <div className="w-full h-full flex flex-col md:flex-row">
                  {/* Left Column: Text Content */}
                  <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col p-8 md:p-16 lg:p-20 relative bg-[#0e0e0e] border-b md:border-b-0 md:border-r border-amber-900/10 z-10">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-[0.03] pointer-events-none" />
                    
                    <AnimatePresence mode="wait">
                      {currentChapter && (
                        <motion.div
                          key={currentChapter.id}
                          initial={{ x: -30, opacity: 0, filter: 'blur(10px)' }}
                          animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
                          exit={{ x: 30, opacity: 0, filter: 'blur(10px)' }}
                          transition={{ duration: 0.4 }}
                          className="h-full flex flex-col"
                        >
                          <button 
                            onClick={handleBackToRoads}
                            className="flex items-center gap-2 text-amber-900/40 hover:text-amber-600 transition-colors text-[9px] uppercase tracking-[0.4em] mb-8 group"
                          >
                            <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                            返回分册 · Path Index
                          </button>

                          <div className="flex flex-col mb-6 md:mb-10">
                            <span className="font-chinese italic text-amber-900/40 text-sm md:text-lg lg:text-xl tracking-[0.3em] font-medium mb-4 italic">
                              {currentChapter.number}
                            </span>
                            <h1 className={`font-chinese text-3xl md:text-5xl lg:text-7xl tracking-tighter leading-tight font-medium ${isUnlocked ? 'text-amber-100/90' : 'text-neutral-800'}`}>
                              {currentChapter.title}
                            </h1>

                            <ChapterConstellation chapter={currentChapter} history={history} />
                            <p className="font-typewriter text-[8px] md:text-[10px] lg:text-xs text-amber-900/60 uppercase tracking-[0.5em] mt-3 md:mt-4 mb-8">
                              {currentChapter.subtitle}
                            </p>

                            {isUnlocked && (
                              <div className="flex items-center gap-5">
                                 {currentChapter.roadId === 'fox' ? (
                                   <LunarPhaseIndicator 
                                     progress={(currentChapter.highlightLocations?.filter(id => unlockedLocations.includes(id)).length || 0) / (currentChapter.highlightLocations?.length || 1)} 
                                     size={32}
                                     color="#D4AF37"
                                     className="drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]"
                                   />
                                 ) : (
                                   <ScrollText className="w-8 h-8 text-amber-600/40" />
                                 )}
                                 <div className="flex flex-col">
                                   <span className="text-[7px] text-amber-900/40 uppercase tracking-[0.3em] mb-1">
                                     {currentChapter.roadId === 'fox' ? 'Divine Presence / 神圣在场' : 'Exploration Progress / 探索进度'}
                                   </span>
                                   <span className="font-typewriter text-[14px] md:text-[18px] text-amber-600/80 tracking-[0.2em] leading-none">
                                    {currentChapter.highlightLocations?.filter(id => unlockedLocations.includes(id)).length || 0}
                                    <span className="mx-1 text-amber-900/40 text-[10px] md:text-[12px]">/</span>
                                    {currentChapter.highlightLocations?.length || 0}
                                  </span>
                                 </div>
                              </div>
                            )}
                          </div>

                          <div className="flex-grow space-y-6 md:space-y-10 overflow-y-auto no-scrollbar mobile-no-scrollbar">
                            <p className={`text-sm md:text-base lg:text-xl font-serif italic leading-[1.8] max-w-lg border-l border-amber-900/10 pl-6 ${isUnlocked ? 'text-neutral-400' : 'text-neutral-800'}`}>
                              {currentChapter.description}
                            </p>

                            {isUnlocked ? (
                              <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: 'rgba(217, 119, 6, 0.05)' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onSelect(currentChapter.id)}
                                className="flex items-center gap-4 md:gap-5 px-8 md:px-10 py-3 md:py-5 bg-amber-900/10 border border-amber-900/20 hover:border-amber-600/60 text-amber-600 uppercase tracking-[0.4em] text-[8px] md:text-xs font-chinese font-medium transition-all group mt-6 md:mt-16 shadow-lg"
                              >
                                <Play className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                                由此章开始 · Start Chapter
                              </motion.button>
                            ) : (
                              <div className="flex items-center gap-4 px-8 md:px-10 py-3 md:py-5 bg-white/[0.01] border border-white/5 text-neutral-800 uppercase tracking-[0.4em] text-[8px] md:text-xs mt-6 md:mt-16 cursor-not-allowed">
                                <Lock className="w-3 h-3 md:w-4 md:h-4 opacity-50" />
                                尚未解锁 · Bound by Fate
                              </div>
                            )}
                          </div>

                          <div className="mt-auto flex items-center justify-between font-typewriter text-[8px] md:text-[9px] uppercase tracking-[0.6em] text-amber-900/20 pt-4 md:pt-8 border-t border-amber-900/5">
                            <span>Folio {currentPage + 1}</span>
                            <div className="flex items-center gap-2">
                              <span>P.1</span>
                              <div className="w-1 h-1 rounded-full bg-amber-600" />
                              <span className="opacity-40">P.2</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Right Column: Visual Content */}
                  <div className="w-full md:w-1/2 h-1/2 md:h-full relative bg-[#050505] overflow-hidden">
                    <AnimatePresence mode="wait">
                      {currentChapter && (
                        <motion.div
                          key={currentChapter.id}
                          initial={{ scale: 1.05, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.98, opacity: 0 }}
                          transition={{ duration: 0.8 }}
                          className="w-full h-full"
                        >
                          <ChapterMapPreview 
                            chapter={currentChapter} 
                            isUnlocked={isUnlocked} 
                            unlockedLocations={unlockedLocations}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="absolute top-6 md:top-12 right-6 md:right-12 z-30 text-right">
                      <h3 className="font-typewriter text-[8px] md:text-[10px] text-amber-600/60 tracking-[0.8em] uppercase mb-1">Topography</h3>
                      <div className="h-px w-20 md:w-32 bg-amber-900/20 ml-auto" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full relative">
                   <ChapterInsightsView 
                     chapter={currentChapter}
                     insights={insights}
                     unlockedInsights={unlockedInsights}
                     locations={locations}
                     pageDirection={pageDirection}
                     pageTrigger={pageTrigger}
                   />
                   
                   {/* Raven hint in bottom corner */}
                   <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-[60] flex items-center gap-4 text-neutral-800/30">
                      <div className="text-right">
                        <p className="text-[9px] uppercase tracking-[0.3em] font-display">Folio {currentPage + 1}</p>
                        <div className="flex items-center justify-end gap-2 mt-1">
                          <span className="opacity-40">P.1</span>
                          <div className="w-1 h-1 rounded-full bg-neutral-900/20" />
                          <span className="text-rose-900 font-bold">P.2</span>
                        </div>
                      </div>
                      <Bird className="w-8 h-8 opacity-20" />
                   </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer Interface */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:gap-4 z-[110]">
        <button onClick={onReset} className="group flex items-center gap-2 text-rose-900/30 hover:text-rose-600 transition-colors uppercase tracking-[0.2em] text-[8px] md:text-[10px] cursor-pointer">
          <RotateCcw className="w-3 h-3 group-hover:rotate-[-45deg] transition-transform" />
          Reset Chronicles
        </button>
        
        <button onClick={onClose} className="flex items-center gap-3 text-white/20 hover:text-white/60 transition-all uppercase tracking-[0.6em] text-[8px] md:text-[10px] cursor-pointer group">
          <div className="w-6 md:w-8 h-px bg-white/10 group-hover:w-12 transition-all" />
          Close Tome
          <div className="w-6 md:w-8 h-px bg-white/10 group-hover:w-12 transition-all" />
        </button>
      </div>
    </motion.div>
  );
};
