/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef, WheelEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Book, 
  ChevronRight, 
  RotateCcw, 
  Scroll,
  ChevronDown,
  History,
  Download,
  X,
  User,
  Shield,
  Crown,
  Sword,
  Bird,
  PawPrint,
  Heart,
  Volume2,
  VolumeX,
  Flower,
  Flower2,
  MapPin,
  Map
} from 'lucide-react';
import { gameData } from './gameData';
import { Scene, Stage, Choice, Character, Location as GameLocation, Paragraph } from './types';
import { characters } from './characters';
import { locations } from './locations';
import { fadeAudio, playSFX, SCENE_BGM_CONFIG, SFX_ASSETS } from './audio';

// Medieval Corner Decoration Component
const OrnateCorner = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => {
  const rotations = {
    tl: 'rotate-0',
    tr: 'rotate-90',
    bl: 'rotate-270',
    br: 'rotate-180'
  };
  const positions = {
    tl: 'top-4 left-4',
    tr: 'top-4 right-4',
    bl: 'bottom-4 left-4',
    br: 'bottom-4 right-4'
  };

  return (
    <div className={`absolute ${positions[position]} ${rotations[position]} w-16 h-16 md:w-24 md:h-24 pointer-events-none opacity-50`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-amber-700/40">
        <path d="M10 10H45M10 10V45M10 10L35 35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M25 15C25 15 20 25 30 25C40 25 35 15 35 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M15 25C15 25 25 20 25 30C25 40 15 35 15 35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="10" cy="10" r="3" fill="currentColor"/>
        <circle cx="50" cy="10" r="1.5" fill="currentColor"/>
        <circle cx="10" cy="50" r="1.5" fill="currentColor"/>
        <path d="M60 10C60 10 65 5 70 10M10 60C10 60 5 65 10 70" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    </div>
  );
};

interface TextSegment {
  text: string;
  className?: string;
  isDialogue?: boolean;
}

// Typewriter Component for Segments
const TypewriterText = ({ segments, speed = 80, onComplete }: { segments: TextSegment[], speed?: number, onComplete?: () => void }) => {
  const [dialogueCharCount, setDialogueCharCount] = useState(0);
  const dialogueSegments = useMemo(() => segments.filter(s => s.isDialogue), [segments]);
  const totalDialogueChars = useMemo(() => dialogueSegments.reduce((acc, s) => acc + s.text.length, 0), [dialogueSegments]);

  useEffect(() => {
    setDialogueCharCount(0);
    if (totalDialogueChars === 0) {
      onComplete?.();
      return;
    }

    let count = 0;
    const interval = setInterval(() => {
      if (count < totalDialogueChars) {
        count++;
        setDialogueCharCount(count);
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [segments, speed, totalDialogueChars, onComplete]);

  let currentDialoguePos = 0;
  return (
    <>
      {segments.map((s, i) => {
        if (!s.isDialogue) {
          return <span key={i} className={s.className}>{s.text}</span>;
        }

        const start = currentDialoguePos;
        const end = currentDialoguePos + s.text.length;
        currentDialoguePos = end;

        if (dialogueCharCount <= start) {
          // Reserve space but hide
          return <span key={i} className={`${s.className} opacity-0`}>{s.text}</span>;
        }
        
        const visibleText = s.text.slice(0, dialogueCharCount - start);
        const hiddenText = s.text.slice(dialogueCharCount - start);
        
        return (
          <span key={i} className={s.className}>
            {visibleText}
            <span className="opacity-0">{hiddenText}</span>
          </span>
        );
      })}
    </>
  );
};

// Flower Bloom Effect for specific scenes
const FlowerBloomEffect = () => {
  return null;
};

// Animal Pattern Background Component
const AnimalPattern = ({ type }: { type?: 'fox' | 'deer' | 'eagle' }) => {
  if (!type) return null;
  
  const paths = {
    fox: "M50 20C40 20 30 30 30 45C30 60 40 80 50 80C60 80 70 60 70 45C70 30 60 20 50 20ZM50 30C55 30 60 35 60 40C60 45 55 50 50 50C45 50 40 45 40 40C40 35 45 30 50 30Z", // Simplified Fox-ish
    deer: "M50 10L40 30H60L50 10ZM50 35C40 35 30 45 30 60C30 75 40 90 50 90C60 90 70 75 70 60C70 45 60 35 50 35Z", // Simplified Deer-ish
    eagle: "M10 40C30 30 50 30 90 40C70 50 50 50 10 40ZM50 40C45 40 40 45 40 50C40 55 45 60 50 60C55 60 60 55 60 50C60 45 55 40 50 40Z" // Simplified Eagle-ish
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none overflow-hidden">
      <svg viewBox="0 0 100 100" className="w-[150%] h-[150%] text-amber-600">
        <path d={paths[type]} fill="currentColor" />
      </svg>
    </div>
  );
};

// Scene Display Component to isolate state during transitions
const SceneDisplay = ({ 
  sceneTitle, 
  stageId, 
  paraObj, 
  onNext, 
  showChoices, 
  showEnding, 
  showStartTrigger, 
  onStart,
  choices,
  selectedChoice,
  onChoiceClick,
  playSFX,
  isMuted,
  renderTextWithDialogue,
  isMenuExpanded,
  setIsMenuExpanded,
  setShowGallery,
  setShowProgress,
  setShowMap
}: { 
  sceneTitle: string, 
  stageId: string | null, 
  paraObj: Paragraph | undefined, 
  onNext: () => void,
  showChoices: boolean,
  showEnding: boolean,
  showStartTrigger: boolean,
  onStart: () => void,
  choices: Choice[],
  selectedChoice: Choice | null,
  onChoiceClick: (choice: Choice) => void,
  playSFX: (url: string, isMuted: boolean) => void,
  isMuted: boolean,
  renderTextWithDialogue: (text: string, isThought?: boolean) => TextSegment[],
  isMenuExpanded: boolean,
  setIsMenuExpanded: (v: boolean) => void,
  setShowGallery: (v: boolean) => void,
  setShowProgress: (v: boolean) => void,
  setShowMap: (v: boolean) => void
}) => {
  return (
    <div className="space-y-12">
      <div className="text-left">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-3xl md:text-5xl text-amber-600/90 tracking-wider leading-tight mb-2 text-center">
            {sceneTitle}
            {stageId && <span className="block text-xs md:text-sm text-amber-900/40 mt-2 tracking-[0.5em] uppercase">— {stageId} —</span>}
          </h2>
          <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-transparent via-amber-900/40 to-transparent mx-auto mb-8 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border border-amber-900/60 bg-[#0a0a0a]" />
          </div>
        </motion.div>

        <div className="min-h-[150px] md:min-h-[200px] flex items-center justify-center">
          {paraObj && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg md:text-2xl leading-relaxed font-serif text-justify whitespace-pre-wrap max-w-xl mx-auto px-2 md:px-0"
            >
              <TypewriterText segments={renderTextWithDialogue(paraObj.text, paraObj.isThought)} />
            </motion.p>
          )}
        </div>
      </div>

      {!showChoices && !showEnding && !showStartTrigger && (
        <div className="flex flex-col items-center gap-6 mt-12">
          <button
            onClick={onNext}
            className="flex items-center gap-2 text-amber-700/60 hover:text-amber-600 transition-colors uppercase tracking-[0.3em] text-xs cursor-pointer group"
          >
            Continue
            <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      )}

      {showStartTrigger && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 2 }}
          className="flex flex-col items-center gap-12 mt-16"
        >
          <button
            onClick={onStart}
            className="group relative py-2 px-8 text-amber-900/40 hover:text-amber-600 transition-all duration-1000 cursor-pointer"
          >
            <span className="font-display text-lg tracking-[0.8em] uppercase">Start Writing</span>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-amber-600 group-hover:w-full transition-all duration-1000" />
          </button>

          {/* Crown & Sword Menu */}
          <div className="relative h-32 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {!isMenuExpanded ? (
                <motion.button
                  key="collapsed"
                  layoutId="menu-icon"
                  onClick={() => setIsMenuExpanded(true)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2, rotate: 90 }}
                  whileHover={{ scale: 1.1 }}
                  className="relative w-20 h-20 flex items-center justify-center cursor-pointer group"
                >
                  <div className="absolute inset-0 border-2 border-amber-900/20 rounded-full group-hover:border-amber-600/40 transition-colors shadow-[0_0_15px_rgba(0,0,0,0.5)]" />
                  <div className="absolute inset-1 border border-amber-900/10 rounded-full" />
                  <div className="absolute inset-[2px] border border-amber-900/5 rounded-full" />
                  
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Crown className="w-10 h-10 text-amber-700/80 absolute -translate-y-2 -translate-x-1 rotate-[-15deg] group-hover:text-amber-600 transition-colors drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]" />
                    <Sword className="w-10 h-10 text-amber-800/60 absolute translate-y-2 translate-x-1 rotate-[165deg] group-hover:text-amber-700 transition-colors drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]" />
                  </div>
                  
                  {/* Decorative Glow */}
                  <div className="absolute inset-0 bg-amber-600/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              ) : (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-16 items-center relative"
                >
                  {/* Invisible backdrop to close menu */}
                  <div 
                    className="fixed inset-0 z-[-1] cursor-pointer" 
                    onClick={() => setIsMenuExpanded(false)}
                  />
                  
                  {/* Crown Button (Gallery) */}
                  <motion.button
                    layoutId="menu-crown"
                    onClick={() => {
                      setShowGallery(true);
                      setIsMenuExpanded(false);
                    }}
                    whileHover={{ 
                      scale: 1.1,
                      filter: "brightness(1.3) drop-shadow(0 0 12px rgba(217, 119, 6, 0.6))"
                    }}
                    whileTap={{ 
                      scale: 0.9,
                      filter: "brightness(1.5) drop-shadow(0 0 20px rgba(217, 119, 6, 0.8))"
                    }}
                    className="flex flex-col items-center gap-3 group cursor-pointer"
                  >
                    <div className="w-20 h-20 rounded-full border-2 border-amber-900/40 flex items-center justify-center bg-neutral-900/60 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] group-hover:border-amber-600 transition-all">
                      <Crown className="w-10 h-10 text-amber-600 group-hover:text-amber-400 transition-colors" />
                    </div>
                    <span className="text-[10px] font-display uppercase tracking-[0.5em] text-amber-900/60 group-hover:text-amber-600 transition-colors">Gallery</span>
                  </motion.button>

                  {/* Sword Button (Progress) */}
                  <motion.button
                    layoutId="menu-sword"
                    onClick={() => {
                      setShowProgress(true);
                      setIsMenuExpanded(false);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ 
                      rotate: [-20, 20, -20, 20, 0],
                      transition: { duration: 0.4 }
                    }}
                    className="flex flex-col items-center gap-3 group cursor-pointer"
                  >
                    <div className="w-20 h-20 rounded-full border-2 border-amber-900/40 flex items-center justify-center bg-neutral-900/60 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] group-hover:border-amber-600 transition-all">
                      <motion.div
                        whileHover={{ 
                          rotate: [45, 35, 55, 45],
                          transition: { repeat: Infinity, duration: 1 }
                        }}
                      >
                        <Sword className="w-10 h-10 text-amber-700 group-hover:text-amber-500 transition-colors rotate-[45deg]" />
                      </motion.div>
                    </div>
                    <span className="text-[10px] font-display uppercase tracking-[0.5em] text-amber-900/60 group-hover:text-amber-600 transition-colors">Progress</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Choices */}
      <AnimatePresence>
        {showChoices && (
          <motion.div 
            key="choices-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-6 pt-12 max-w-md mx-auto w-full"
          >
            {choices.map((choice, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: selectedChoice ? (selectedChoice === choice ? 1 : 0) : 1,
                  scale: selectedChoice === choice ? 1.05 : 1,
                  x: selectedChoice && selectedChoice !== choice ? (index % 2 === 0 ? -20 : 20) : 0
                }}
                transition={{ duration: 0.5 }}
                onClick={() => {
                  if (!selectedChoice) {
                    playSFX(SFX_ASSETS.CLICK, isMuted);
                    onChoiceClick(choice);
                  }
                }}
                disabled={!!selectedChoice}
                className={`group relative flex items-center gap-4 md:gap-6 p-4 md:p-6 rounded-sm border-2 border-amber-900/20 bg-neutral-900/20 transition-all text-left overflow-hidden ${!selectedChoice ? 'hover:bg-amber-950/10 hover:border-amber-950/40 hover:border-amber-900/60 cursor-pointer' : ''}`}
              >
                <div className="absolute inset-0 bg-amber-600/0 group-hover:bg-amber-600/5 transition-colors" />
                <span className="relative text-neutral-400 group-hover:text-neutral-100 font-display text-base md:text-xl tracking-widest uppercase transition-colors">
                  {choice.text}
                </span>
                <ChevronRight className="relative ml-auto w-4 h-4 md:w-5 md:h-5 text-amber-900/20 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const EndingDisplay = ({ 
  scene, 
  paraIndex, 
  onNext, 
  onReturn, 
  renderTextWithDialogue 
}: { 
  scene: Scene, 
  paraIndex: number, 
  onNext: () => void, 
  onReturn: () => void,
  renderTextWithDialogue: (text: string, isThought?: boolean) => TextSegment[]
}) => {
  const isLastPara = paraIndex === (scene.paragraphs?.length || 0) - 1;
  const currentPara = scene.paragraphs?.[paraIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center p-8 overflow-hidden"
    >
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-20 pointer-events-none" />
      <div className="absolute inset-4 md:inset-8 border-2 border-double border-amber-900/20 pointer-events-none" />
      
      <OrnateCorner position="tl" />
      <OrnateCorner position="tr" />
      <OrnateCorner position="bl" />
      <OrnateCorner position="br" />

      <div className="relative max-w-2xl w-full text-center space-y-12 md:space-y-16">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="space-y-4"
        >
          <h2 className="font-display text-3xl md:text-6xl text-amber-600 tracking-[0.2em] uppercase">
            ENDING：{scene.title}
          </h2>
          <div className="w-16 md:w-24 h-px bg-amber-900/40 mx-auto" />
        </motion.div>

        <div className="min-h-[200px] flex items-center justify-center w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={paraIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.8 }}
              className="text-base md:text-xl text-neutral-400 leading-relaxed font-serif italic text-left whitespace-pre-wrap max-w-xl mx-auto px-8 border-l-2 border-amber-900/20"
            >
              {currentPara && <TypewriterText segments={renderTextWithDialogue(currentPara.text, currentPara.isThought)} />}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-center gap-8">
          {isLastPara ? (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={onReturn}
              className="group relative py-2 px-8 text-amber-900/40 hover:text-amber-600 transition-all duration-1000 cursor-pointer"
            >
              <span className="font-display text-lg tracking-[0.8em] uppercase">AGAIN WRITING</span>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-amber-600 group-hover:w-full transition-all duration-1000" />
            </motion.button>
          ) : (
            <button
              onClick={onNext}
              className="flex items-center gap-2 text-amber-700/60 hover:text-amber-600 transition-colors uppercase tracking-[0.3em] text-xs cursor-pointer group"
            >
              继续阅读
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [currentSceneId, setCurrentSceneId] = useState<string>(gameData.initialScene);
  const [currentStageId, setCurrentStageId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [currentParaIndex, setCurrentParaIndex] = useState(0);
  const [currentPath, setCurrentPath] = useState<'fox' | 'deer' | 'eagle' | null>(null);
  const [flags, setFlags] = useState<Record<string, any>>({});
  const [showHistory, setShowHistory] = useState(false);
  const [showCompendium, setShowCompendium] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [unlockedCharacters, setUnlockedCharacters] = useState<Set<string>>(new Set());
  const [newlyUnlockedCharacterIds, setNewlyUnlockedCharacterIds] = useState<Set<string>>(new Set());
  const [seenCharacterNames, setSeenCharacterNames] = useState<Set<string>>(new Set());
  const [unlockedLocations, setUnlockedLocations] = useState<Set<string>>(new Set());
  const [newlyUnlockedLocationIds, setNewlyUnlockedLocationIds] = useState<Set<string>>(new Set());
  const [seenLocationNames, setSeenLocationNames] = useState<Set<string>>(new Set());
  const [visitedTexts, setVisitedTexts] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Selection & Explanation States
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // New States for Gallery and Progress
  const [unlockedEndings, setUnlockedEndings] = useState<{id: string, title: string, text: string}[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapScale, setMapScale] = useState(1);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);

  const handleMapZoom = (e: WheelEvent) => {
    if (e.deltaY < 0) {
      setMapScale(prev => Math.min(prev + 0.2, 4));
    } else {
      setMapScale(prev => Math.max(prev - 0.2, 0.5));
    }
  };

  const selectedLocation = useMemo(() => 
    locations.find(l => l.id === selectedLocationId),
    [selectedLocationId]
  );
  const [notification, setNotification] = useState<{title: string, visible: boolean, type?: 'ending' | 'character' | 'location'}>({ title: '', visible: false });

  // Endings are now session-only (cleared on refresh/close)
  const saveEnding = (id: string, title: string, text: string) => {
    setUnlockedEndings(prev => {
      if (prev.find(e => e.id === id)) return prev;
      const next = [...prev, { id, title, text }];
      return next;
    });
  };

  const saveGame = () => {
    const gameState = {
      currentSceneId,
      currentStageId,
      history,
      currentParaIndex,
      currentPath,
      flags,
      unlockedCharacters: Array.from(unlockedCharacters),
      seenCharacterNames: Array.from(seenCharacterNames),
      unlockedLocations: Array.from(unlockedLocations),
      seenLocationNames: Array.from(seenLocationNames),
      visitedTexts,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('hersey_save_data', JSON.stringify(gameState));
  };

  const loadGame = () => {
    const saved = localStorage.getItem('hersey_save_data');
    if (saved) {
      const data = JSON.parse(saved);
      setCurrentSceneId(data.currentSceneId);
      setCurrentStageId(data.currentStageId);
      setHistory(data.history);
      setCurrentParaIndex(data.currentParaIndex);
      setCurrentPath(data.currentPath);
      setFlags(data.flags);
      setUnlockedCharacters(new Set(data.unlockedCharacters));
      if (data.seenCharacterNames) setSeenCharacterNames(new Set(data.seenCharacterNames));
      if (data.unlockedLocations) setUnlockedLocations(new Set(data.unlockedLocations));
      if (data.seenLocationNames) setSeenLocationNames(new Set(data.seenLocationNames));
      setVisitedTexts(data.visitedTexts);
      setIsStarting(true);
      setShowProgress(false);
      setIsMenuExpanded(false);
    }
  };

  const returnToTitle = () => {
    saveGame();
    setIsStarting(false);
    resetGame();
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Handle Auto-Transitions
  useEffect(() => {
    if (currentSceneId === 'F19-CheckWhoElse') {
      if (flags.talkedToNun && flags.talkedToKnight && flags.talkedToScholar && flags.toldFain) {
        setCurrentSceneId('F29-AutoKnight');
      }
    }
  }, [currentSceneId, flags]);

  // Handle Event Initialization
  useEffect(() => {
    const scene = gameData.scenes[currentSceneId];
    if (scene?.event) {
      setCurrentStageId(scene.event.startStage);
    } else {
      setCurrentStageId(null);
    }
  }, [currentSceneId]);

  // Add scene title to visited texts
  useEffect(() => {
    const scene = gameData.scenes[currentSceneId];
    setVisitedTexts(prev => [...prev, `--- ${scene.title} ---`]);
  }, [currentSceneId]);

  // 初始化音频实例（仅一次）
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }
  }, []);

  // Track desired BGM URL so click handler can start it
  const pendingBgmRef = useRef<string | null>(null);

  // Handle BGM Change - only preload, don't try to play before interaction
  useEffect(() => {
    const scene = gameData.scenes[currentSceneId];
    const bgmUrl = SCENE_BGM_CONFIG[currentSceneId] || scene?.bgm;

    if (!bgmUrl || !audioRef.current) return;

    const audio = audioRef.current;

    // 检查 src 是否真的改变了
    const normalizedTarget = new URL(bgmUrl, window.location.href).href;
    const normalizedCurrent = audio.src ? new URL(audio.src, window.location.href).href : '';

    if (normalizedCurrent !== normalizedTarget) {
      pendingBgmRef.current = bgmUrl;

      const switchBGM = async () => {
        // 如果正在播放，先淡出
        if (!audio.paused) {
          fadeAudio(audio, 0, 500);
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        audio.src = bgmUrl;
        audio.load();
        audio.volume = 0;

        // Only attempt playback if user has already interacted
        if (hasInteracted) {
          audio.muted = isMuted;
          try {
            await audio.play();
            pendingBgmRef.current = null;
            if (!isMuted) {
              fadeAudio(audio, 0.4, 1500);
            }
          } catch (e) {
            console.log("BGM play blocked:", e);
          }
        }
      };
      switchBGM();
    }
  }, [currentSceneId, hasInteracted]);

  // Sync mute state (no play calls here - those happen in click handler)
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    if (isMuted) {
      fadeAudio(audio, 0, 500);
      setTimeout(() => {
        if (isMuted) audio.muted = true;
      }, 500);
    } else if (hasInteracted && !audio.paused) {
      audio.muted = false;
      fadeAudio(audio, 0.4, 1000);
    }
  }, [isMuted]);

  useEffect(() => {
    setCurrentParaIndex(0);
  }, [currentSceneId, currentStageId]);

  useEffect(() => {
    const handleGlobalClick = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
      }
      // CRITICAL: audio.play() MUST be called synchronously inside the click
      // handler to satisfy browser autoplay policy. useEffect runs async and
      // loses the user-gesture context, so we cannot rely on it.
      const audio = audioRef.current;
      if (audio && !isMuted) {
        audio.muted = false;
        audio.play().then(() => {
          fadeAudio(audio, 0.4, 1000);
        }).catch(() => {});
      }
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [isMuted, hasInteracted]);

  const currentScene: Scene = gameData.scenes[currentSceneId] || gameData.scenes[gameData.initialScene];
  const currentStage: Stage | null = (currentScene.event && currentStageId) 
    ? currentScene.event.stages[currentStageId] 
    : null;

  const checkCondition = (condition?: string): boolean => {
    if (!condition) return true;

    // Support OR (||) first, then AND (&&)
    return condition.split('||').some(orPart => {
      return orPart.split('&&').every(andPart => {
        const trimmed = andPart.trim();
        
        // Handle equality: key === value
        if (trimmed.includes('===')) {
          const [key, value] = trimmed.split('===').map(s => s.trim());
          const flagValue = flags[key];
          if (value === 'true') return flagValue === true;
          if (value === 'false') return flagValue === false || flagValue === undefined;
          return String(flagValue) === value;
        }
        
        // Handle negation: !key
        if (trimmed.startsWith('!')) {
          const key = trimmed.substring(1).trim();
          return !flags[key];
        }
        
        // Handle simple existence: key
        return !!flags[trimmed];
      });
    });
  };

  const activeParagraphs: Paragraph[] = currentStage 
    ? currentStage.desc.map(t => ({ text: t })) 
    : (currentScene.paragraphs || []);
  const activeChoices = (currentStage ? currentStage.choices : (currentScene.choices || []))
    .filter(choice => checkCondition(choice.condition));

  // Scan current paragraph for character and location unlocks
  useEffect(() => {
    const currentPara = activeParagraphs[currentParaIndex];
    if (!currentPara) return;

    // Only start recognition from fox path or deer path act1-p1 scenes
    const isFoxPath = currentSceneId.startsWith('F') || currentPath === 'fox';
    const isDeerPath = currentSceneId.startsWith('d') || currentPath === 'deer';
    if (!isFoxPath && !isDeerPath) return;

    const currentText = currentPara.text;

    // Character unlocks
    characters.forEach(char => {
      if (!unlockedCharacters.has(char.id) && currentText.includes(char.name)) {
        setUnlockedCharacters(prev => {
          const next = new Set(prev);
          next.add(char.id);
          return next;
        });
        setNewlyUnlockedCharacterIds(prev => {
          const next = new Set(prev);
          next.add(char.id);
          return next;
        });
        setSeenCharacterNames(prev => {
          const next = new Set(prev);
          next.add(char.name);
          return next;
        });
        setNotification({ 
          title: `${char.name} 已解锁`, 
          visible: true, 
          type: 'character' 
        });
        setTimeout(() => setNotification(prev => ({ ...prev, visible: false })), 4000);
      }
    });

    // Location unlocks
    locations.forEach(loc => {
      const isMatch = currentText.includes(loc.name) || (loc.matchNames?.some(m => currentText.includes(m)));
      if (!unlockedLocations.has(loc.id) && isMatch) {
        setUnlockedLocations(prev => {
          const next = new Set(prev);
          next.add(loc.id);
          return next;
        });
        setNewlyUnlockedLocationIds(prev => {
          const next = new Set(prev);
          next.add(loc.id);
          return next;
        });
        setSeenLocationNames(prev => {
          const next = new Set(prev);
          next.add(loc.name);
          return next;
        });
        setNotification({ 
          title: `${loc.name} 已解锁`, 
          visible: true, 
          type: 'location' 
        });
        setTimeout(() => setNotification(prev => ({ ...prev, visible: false })), 4000);
      }
    });
  }, [currentParaIndex, currentSceneId, isStarting, activeParagraphs]);

  const handleChoiceClick = (choice: Choice) => {
    setSelectedChoice(choice);
    
    // Play SFX if provided in choice data
    if (choice.sfx) {
      playSFX(choice.sfx, isMuted);
    }

    if (choice.explanation) {
      setTimeout(() => setShowExplanation(true), 800);
    } else {
      setTimeout(() => proceedWithChoice(choice), 800);
    }
  };

  const proceedWithChoice = (choice: Choice) => {
    // Reset paragraph index and other states synchronously with scene/stage changes
    // to prevent "flashing" old state on new content
    setSelectedChoice(null);
    setShowExplanation(false);
    setIsStarting(false);

    if (choice.animalType) {
      setCurrentPath(choice.animalType);
    }

    if (choice.setFlags) {
      setFlags(prev => ({ ...prev, ...choice.setFlags }));
    }

    if (choice.nextStageId) {
      setCurrentStageId(choice.nextStageId);
    } else if (choice.nextSceneId) {
      setHistory([...history, currentSceneId]);
      setCurrentSceneId(choice.nextSceneId);
    } else if (currentScene.event?.onComplete) {
      setHistory([...history, currentSceneId]);
      setCurrentSceneId(currentScene.event.onComplete);
    }
  };

  const resetGame = () => {
    setHistory([]);
    setVisitedTexts([]);
    setUnlockedCharacters(new Set());
    setSeenCharacterNames(new Set());
    setUnlockedLocations(new Set());
    setSeenLocationNames(new Set());
    setCurrentPath(null);
    setFlags({});
    setCurrentSceneId(gameData.initialScene);
    setCurrentStageId(null);
    setCurrentParaIndex(0);
  };

  const nextParagraph = () => {
    if (currentParaIndex < activeParagraphs.length - 1) {
      const currentPara = activeParagraphs[currentParaIndex];
      const currentText = currentPara.text;
      
      // Before moving to next, mark all names in current text as "seen"
      characters.forEach(char => {
        if (currentText.includes(char.name)) {
          setSeenCharacterNames(prev => {
            const next = new Set(prev);
            next.add(char.name);
            return next;
          });
        }
      });
      locations.forEach(loc => {
        if (currentText.includes(loc.name)) {
          setSeenLocationNames(prev => {
            const next = new Set(prev);
            next.add(loc.name);
            return next;
          });
        }
      });

      setVisitedTexts(prev => [...prev, currentText]);
      setCurrentParaIndex(prev => prev + 1);

      // If we just reached the last paragraph of an ending, save it
      if (currentParaIndex + 1 === activeParagraphs.length - 1 && currentScene.isEnding) {
        const lastText = activeParagraphs[activeParagraphs.length - 1].text;
        saveEnding(currentSceneId, currentScene.title, lastText);
      }
    }
  };

  // Clear newly unlocked highlights when moving to next paragraph or scene
  // We use a ref to track the last seen para/scene to avoid clearing immediately after unlocking
  const lastParaRef = useRef<string>("");
  
  useEffect(() => {
    const paraKey = `${currentSceneId}-${currentParaIndex}`;
    if (lastParaRef.current !== paraKey) {
      setNewlyUnlockedCharacterIds(new Set());
      setNewlyUnlockedLocationIds(new Set());
      lastParaRef.current = paraKey;
    }
  }, [currentParaIndex, currentSceneId]);

  const renderTextWithDialogue = (text: string, isThought?: boolean): TextSegment[] => {
    // Split by dialogue markers
    const parts = text.split(/([“”""][^“”""]*[“”""])/g);
    const segments: TextSegment[] = [];
    
    // Track which characters have already been highlighted in this entire text block (paragraph)
    const highlightedInThisText = new Set<string>();

    parts.forEach((part) => {
      if (!part) return;

      if (part.match(/^[“”""]/)) {
        // Dialogue part - also check for character names here if needed
        segments.push({
          text: part,
          className: "text-amber-500 font-dialogue text-xl md:text-3xl not-italic align-middle mx-1",
          isDialogue: true
        });
      } else {
        // Split by character names to highlight them if they were just unlocked
        let subSegments: TextSegment[] = [{ text: part, isDialogue: false }];

        characters.forEach(char => {
          const newSubSegments: TextSegment[] = [];
          subSegments.forEach(seg => {
            if (seg.isDialogue || seg.className?.includes('text-amber-600') || seg.className?.includes('border-amber-900/30')) {
              newSubSegments.push(seg);
              return;
            }

            const nameParts = seg.text.split(new RegExp(`(${char.name})`, 'g'));
            nameParts.forEach(namePart => {
              if (namePart === char.name && newlyUnlockedCharacterIds.has(char.id) && !highlightedInThisText.has(char.id)) {
                // Highlight ONLY if this is the first time we see the name in this paragraph/render
                highlightedInThisText.add(char.id);
                newSubSegments.push({
                  text: namePart,
                  className: "font-bold border-b-2 border-amber-600 px-0.5 text-amber-600",
                  isDialogue: false
                });
              } else if (namePart) {
                newSubSegments.push({ text: namePart, isDialogue: false });
              }
            });
          });
          subSegments = newSubSegments;
        });

        // Split by location names to highlight them if they were just unlocked
        const highlightedLocationsInThisText = new Set<string>();

        locations.forEach(loc => {
          const newSubSegments: TextSegment[] = [];
          subSegments.forEach(seg => {
            if (seg.isDialogue || seg.className?.includes('text-amber-600') || seg.className?.includes('text-emerald-500')) {
              newSubSegments.push(seg);
              return;
            }

            const nameParts = seg.text.split(new RegExp(`(${loc.name})`, 'g'));
            nameParts.forEach(namePart => {
              if (namePart === loc.name && newlyUnlockedLocationIds.has(loc.id) && !highlightedLocationsInThisText.has(loc.id)) {
                // Highlight ONLY if this is the first time we see the location name in this paragraph
                highlightedLocationsInThisText.add(loc.id);
                newSubSegments.push({
                  text: namePart,
                  className: "font-bold border-b-2 border-emerald-600 px-0.5 text-emerald-600",
                  isDialogue: false
                });
              } else if (namePart) {
                newSubSegments.push({ text: namePart, isDialogue: false });
              }
            });
          });
          subSegments = newSubSegments;
        });

        subSegments.forEach(seg => {
          if (seg.className?.includes('border-amber-600') || seg.className?.includes('border-emerald-600')) {
            segments.push(seg);
          } else {
            segments.push({
              text: seg.text,
              className: isThought 
                ? "text-rose-400/90 font-serif italic font-medium tracking-wide" 
                : "text-neutral-400 font-serif italic",
              isDialogue: false
            });
          }
        });
      }
    });

    return segments;
  };

  if (!isLoaded) return null;

  const isLastPara = currentParaIndex === activeParagraphs.length - 1;
  const isStartScene = currentSceneId === gameData.initialScene;
  const showChoices = isLastPara && !currentScene.isEnding && (!isStartScene || isStarting);
  const showStartTrigger = isStartScene && isLastPara && !isStarting;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#d4d4d8] font-serif selection:bg-amber-900/40 overflow-x-hidden">
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
      
      <AnimatePresence mode="wait">
        {currentScene.isEnding ? (
          <EndingDisplay 
            scene={currentScene}
            paraIndex={currentParaIndex}
            onNext={nextParagraph}
            onReturn={returnToTitle}
            renderTextWithDialogue={renderTextWithDialogue}
          />
        ) : (
          <main key="main-content" className="relative max-w-2xl mx-auto px-6 md:px-8 py-12 md:py-24 flex flex-col min-h-screen">
        <div className="absolute inset-2 md:inset-4 border-[1px] border-amber-900/20 pointer-events-none" />
        <div className="absolute inset-4 md:inset-6 border-[1px] border-amber-900/10 pointer-events-none" />
        
        <OrnateCorner position="tl" />
        <OrnateCorner position="tr" />
        <OrnateCorner position="bl" />
        <OrnateCorner position="br" />

        {/* Header */}
        <header className="mb-12 md:mb-16 flex items-center justify-between border-b-2 border-double border-amber-900/30 pb-6 relative z-10">
          <div className="flex items-center gap-2 md:gap-4">
            <Scroll className="w-4 h-4 md:w-5 md:h-5 text-amber-700/60" />
            <span className="font-display text-[10px] md:text-sm tracking-[0.2em] md:tracking-[0.3em] text-amber-700/80 uppercase">
              Chronicles of Hersey
            </span>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-600 hover:text-amber-600 transition-all cursor-pointer"
            >
              {isMuted ? (
                <VolumeX className="w-3 h-3 group-hover:drop-shadow-[0_0_3px_rgba(217,119,6,0.8)] transition-all" />
              ) : (
                <Volume2 className="w-3 h-3 group-hover:drop-shadow-[0_0_3px_rgba(217,119,6,0.8)] transition-all" />
              )}
              {isMuted ? 'Muted' : 'Music'}
            </button>
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-600 hover:text-amber-600 transition-all cursor-pointer"
            >
              <History className="w-3 h-3 group-hover:drop-shadow-[0_0_3px_rgba(217,119,6,0.8)] transition-all" />
              History
            </button>
            <button 
              onClick={returnToTitle}
              className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-600 hover:text-amber-600 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 group-hover:rotate-[-45deg] group-hover:drop-shadow-[0_0_3px_rgba(217,119,6,0.8)] transition-all" />
              Title
            </button>
          </div>
        </header>

        {/* Game Content */}
        <div className="flex-grow flex flex-col justify-center relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSceneId + '-' + (currentStageId || 'base') + '-' + currentParaIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <SceneDisplay 
                sceneTitle={currentScene.title}
                stageId={currentStageId}
                paraObj={activeParagraphs[currentParaIndex]}
                onNext={nextParagraph}
                showChoices={showChoices}
                showEnding={false}
                showStartTrigger={showStartTrigger}
                onStart={() => {
                  setHasInteracted(true);
                  resetGame();
                  setIsStarting(true);

                  // 在点击事件中同步调用 play() 以满足浏览器自动播放策略
                  playSFX(SFX_ASSETS.CLICK, isMuted);
                  if (audioRef.current) {
                    const audio = audioRef.current;
                    audio.muted = isMuted;
                    audio.play().then(() => {
                      if (!isMuted) {
                        fadeAudio(audio, 0.4, 1000);
                      }
                    }).catch(e => console.log("Manual play failed:", e));
                  }
                }}
                choices={activeChoices}
                selectedChoice={selectedChoice}
                onChoiceClick={handleChoiceClick}
                playSFX={playSFX}
                isMuted={isMuted}
                renderTextWithDialogue={renderTextWithDialogue}
                isMenuExpanded={isMenuExpanded}
                setIsMenuExpanded={setIsMenuExpanded}
                setShowGallery={setShowGallery}
                setShowProgress={setShowProgress}
                setShowMap={setShowMap}
              />
              
              {!showChoices && !showStartTrigger && activeParagraphs.length > 1 && currentParaIndex < activeParagraphs.length - 1 && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => {
                      const remaining = activeParagraphs.slice(currentParaIndex, activeParagraphs.length - 1);
                      setVisitedTexts(prev => [...prev, ...remaining]);
                      setCurrentParaIndex(activeParagraphs.length - 1);
                    }}
                    className="text-[10px] text-neutral-600 hover:text-amber-900/40 transition-colors uppercase tracking-[0.2em] cursor-pointer"
                  >
                    Skip to Choices
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Explanation Overlay */}
        <AnimatePresence>
          {showExplanation && selectedChoice && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-[#0a0a0a]/90 backdrop-blur-md"
            >
              <div className="relative max-w-lg w-full p-8 md:p-12 border-2 border-amber-900/40 bg-[#0a0a0a] text-center overflow-hidden">
                <AnimalPattern type={selectedChoice.animalType} />
                <div className="relative z-10 space-y-6 md:space-y-8">
                  <h3 className="font-display text-2xl md:text-3xl text-amber-600 tracking-[0.3em] uppercase">{selectedChoice.text}</h3>
                  <div className="w-16 h-px bg-amber-900/40 mx-auto" />
                  <p className="text-lg md:text-xl text-neutral-300 italic leading-relaxed">
                    {selectedChoice.explanation}
                  </p>
                  <button
                    onClick={() => proceedWithChoice(selectedChoice)}
                    className="mt-8 px-8 py-3 border border-amber-900/40 text-amber-700 hover:text-amber-500 hover:border-amber-700 transition-all uppercase tracking-widest text-xs cursor-pointer"
                  >
                    Enter the Path
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification Toast */}
        <AnimatePresence>
          {notification.visible && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] px-8 py-4 bg-neutral-900 border-2 border-amber-600 shadow-[0_0_30px_rgba(217,119,6,0.2)] flex items-center gap-4"
            >
              <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse" />
              <span className="font-display text-amber-600 tracking-[0.2em] uppercase text-sm">
                {notification.type === 'character' ? '人物解锁：' : notification.type === 'location' ? '地点解锁：' : '新的收录：'}
                {notification.title}
              </span>
              <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ending Gallery Overlay */}
        <AnimatePresence>
          {showGallery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] bg-[#0a0a0a]/98 backdrop-blur-md p-8 overflow-y-auto"
            >
              <div className="max-w-4xl mx-auto pt-16">
                <div className="flex justify-between items-center mb-16 border-b border-amber-900/20 pb-6">
                  <h3 className="font-display text-4xl text-amber-600 tracking-[0.2em] uppercase">Ending Gallery</h3>
                  <button 
                    onClick={() => setShowGallery(false)}
                    className="text-neutral-500 hover:text-amber-600 transition-colors uppercase tracking-widest text-xs cursor-pointer group flex items-center gap-2"
                  >
                    <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    Close
                  </button>
                </div>
                
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

        {/* Progress Overlay */}
        <AnimatePresence>
          {showProgress && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] bg-[#0a0a0a]/98 backdrop-blur-md p-8 flex items-center justify-center"
            >
              <div className="max-w-md w-full p-12 border-2 border-amber-900/40 bg-[#0a0a0a] relative">
                <OrnateCorner position="tl" />
                <OrnateCorner position="tr" />
                <OrnateCorner position="bl" />
                <OrnateCorner position="br" />
                
                <div className="text-center space-y-8">
                  <h3 className="font-display text-3xl text-amber-600 tracking-[0.2em] uppercase">Game Progress</h3>
                  <div className="w-16 h-px bg-amber-900/40 mx-auto" />
                  
                  {localStorage.getItem('hersey_save_data') ? (
                    <div className="space-y-6">
                      <p className="text-neutral-400 italic">
                        A saved chronicle exists from: <br/>
                        <span className="text-amber-700 not-italic">
                          {new Date(JSON.parse(localStorage.getItem('hersey_save_data')!).timestamp).toLocaleString()}
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
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-[#0a0a0a] p-4 md:p-8 overflow-y-auto"
            >
              <div className="max-w-2xl mx-auto pt-12 md:pt-16">
                <div className="flex justify-between items-center mb-8 md:mb-12 border-b border-amber-900/20 pb-6">
                  <h3 className="font-display text-xl md:text-2xl text-amber-600 tracking-widest uppercase">Chronicle History</h3>
                  <button 
                    onClick={() => setShowHistory(false)}
                    className="text-neutral-500 hover:text-neutral-100 transition-colors uppercase tracking-widest text-[10px] md:text-xs cursor-pointer p-2"
                  >
                    Close
                  </button>
                </div>
                <div className="space-y-6 md:space-y-8 pb-24">
                  {visitedTexts.map((text, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(i * 0.05, 1) }}
                      className={text.startsWith('---') 
                        ? "text-center py-4 text-amber-900/40 font-display text-xs md:text-sm tracking-[0.3em] md:tracking-[0.5em] uppercase"
                        : "text-base md:text-lg text-neutral-400 leading-relaxed font-serif italic border-l-2 border-amber-900/10 pl-4 md:pl-6"
                      }
                    >
                      {text.startsWith('---') ? text.replace(/---/g, '') : text}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Character Compendium Overlay */}
        <AnimatePresence>
          {showCompendium && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-[#0a0a0a]/95 p-8 overflow-y-auto"
            >
              <div className="max-w-4xl mx-auto pt-16">
                <div className="flex justify-between items-center mb-12 border-b border-amber-900/20 pb-6">
                  <div className="flex items-center gap-4">
                    <Crown className="w-6 h-6 text-amber-600" />
                    <h3 className="font-display text-2xl text-amber-600 tracking-widest uppercase">人物志 · Character Compendium</h3>
                  </div>
                  <button 
                    onClick={() => setShowCompendium(false)}
                    className="text-neutral-500 hover:text-neutral-100 transition-colors uppercase tracking-widest text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-24">
                  {unlockedCharacters.size === 0 ? (
                    <div className="col-span-full py-24 text-center space-y-4">
                      <p className="text-neutral-600 italic text-lg">目前尚无人物记录。</p>
                      <p className="text-amber-900/30 text-xs uppercase tracking-[0.3em]">在旅途中邂逅他人以解锁人物志</p>
                    </div>
                  ) : characters
                    .filter(c => !c.path || c.path === 'all' || c.path === currentPath)
                    .map((char) => {
                      const isUnlocked = unlockedCharacters.has(char.id);
                      
                      // Calculate current title and description based on history
                      let currentTitle = char.title;
                      let currentDescription = char.description;
                      
                      if (char.updates) {
                        // Check history and current scene for updates
                        const allVisitedScenes = [...history, currentSceneId];
                        char.updates.forEach(update => {
                          if (allVisitedScenes.includes(update.atScene)) {
                            currentDescription = update.description;
                            if (update.title) currentTitle = update.title;
                          }
                        });
                      }

                      const getIcon = (type: string) => {
                      switch (type) {
                        case 'fox': return <PawPrint className="w-16 h-16 text-amber-600" />;
                        case 'sword': return <Sword className="w-16 h-16 text-amber-600" />;
                        case 'eagle': return <Bird className="w-16 h-16 text-amber-600" />;
                        case 'bear': return <PawPrint className="w-16 h-16 text-amber-600" />;
                        case 'tiger': return <PawPrint className="w-16 h-16 text-amber-600" />;
                        case 'ring': return <Crown className="w-16 h-16 text-amber-600" />;
                        case 'scroll': return <Scroll className="w-16 h-16 text-amber-600" />;
                        case 'shield': return <Shield className="w-16 h-16 text-amber-600" />;
                        case 'heart': return <Heart className="w-16 h-16 text-amber-600" />;
                        default: return <User className="w-16 h-16 text-amber-600" />;
                      }
                    };

                    return (
                      <motion.div
                        key={char.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`relative p-8 border border-amber-900/20 bg-neutral-900/20 rounded-sm group overflow-hidden ${!isUnlocked && 'grayscale opacity-50'}`}
                      >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          {getIcon(char.iconType)}
                        </div>
                        
                        <div className="relative z-10 space-y-4">
                          <div className="space-y-1">
                            <span className="text-[10px] text-amber-900/60 uppercase tracking-[0.3em] font-display">
                              {isUnlocked ? currentTitle : 'Unknown Title'}
                            </span>
                            <h4 className="text-2xl text-amber-600 font-display tracking-wider">
                              {isUnlocked ? char.name : '？？？'}
                            </h4>
                          </div>
                          
                          <p className="text-sm text-neutral-400 leading-relaxed font-serif italic">
                            {isUnlocked ? currentDescription : '此人物的命运尚未与您交织。继续您的书写以解锁更多信息。'}
                          </p>

                          {!isUnlocked && (
                            <div className="pt-4 flex items-center gap-2 text-[10px] text-amber-900/40 uppercase tracking-widest">
                              <X className="w-3 h-3" />
                              Locked in History
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* World Map Overlay */}
        <AnimatePresence>
          {showMap && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-[#0a0a0a] p-4 md:p-8 overflow-hidden flex flex-col"
            >
              <div className="max-w-6xl mx-auto w-full flex-grow flex flex-col pt-12 md:pt-16">
                <div className="flex justify-between items-center mb-6 md:mb-8 border-b border-amber-900/20 pb-4 md:pb-6">
                  <div className="flex items-center gap-4">
                    <Scroll className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                    <h3 className="font-display text-xl md:text-2xl text-emerald-600 tracking-widest uppercase">征服王国全图 · World Map</h3>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-3 text-[10px] text-amber-900/40 uppercase tracking-widest">
                      <span>滚轮缩放 / Zoom with Wheel</span>
                      <span className="w-px h-3 bg-amber-900/20" />
                      <span>拖拽移动 / Drag to Pan</span>
                    </div>
                    <button 
                      onClick={() => {
                        setShowMap(false);
                        setMapScale(1);
                        setSelectedLocationId(null);
                      }}
                      className="text-neutral-500 hover:text-neutral-100 transition-colors uppercase tracking-widest text-[10px] md:text-xs cursor-pointer p-2"
                    >
                      Close
                    </button>
                  </div>
                </div>

                <div 
                  className="flex-grow relative bg-[#f4d088] border-2 border-amber-900/40 rounded-sm overflow-hidden shadow-[inset_0_0_150px_rgba(139,69,19,0.3)] cursor-grab active:cursor-grabbing"
                  onWheel={handleMapZoom}
                >
                  <motion.div 
                    drag
                    dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
                    dragElastic={0.1}
                    animate={{ scale: mapScale }}
                    className="w-full h-full relative origin-center"
                    style={{ minWidth: '100%', minHeight: '100%' }}
                  >
                    <div className="absolute inset-0 min-w-[1200px] min-h-[900px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      {unlockedLocations.size === 0 && (
                        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40">
                          <div className="text-center space-y-4 p-8 border border-amber-900/20 bg-[#0a0a0a]/80">
                            <p className="text-neutral-500 italic">地图尚未开启。</p>
                            <p className="text-amber-900/40 text-[10px] uppercase tracking-widest">随着您的探索，王国的疆域将逐渐显现</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Parchment Texture Overlay */}
                      <div className="absolute inset-0 opacity-50 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/old-map.png')]" />
                      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
                      
                      {/* Map Grid/Lines */}
                      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                        <defs>
                          <pattern id="grid" width="120" height="120" patternUnits="userSpaceOnUse">
                            <path d="M 120 0 L 0 0 0 120" fill="none" stroke="#8b4513" strokeWidth="0.5" strokeDasharray="4 4"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                        
                        {/* Hand-Drawn Landmass Outline (Conquest Kingdom) */}
                        <path 
                          d="M 300 200 c 50 -50 150 -20 200 -50 s 100 -80 200 -50 s 150 50 200 100 s 50 150 0 250 s -100 200 -200 250 s -200 50 -300 100 s -150 -50 -200 -150 s -50 -200 0 -300 s 50 -100 100 -150" 
                          fill="#fdf5e6" 
                          stroke="#5d4037" 
                          strokeWidth="3" 
                          strokeLinejoin="round"
                          className="opacity-40"
                        />

                        {/* Medieval Terrain - Mountains (North & East) */}
                        <g className="text-[#5d4037]/60" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          {/* North Mountains */}
                          {[
                            {x: 420, y: 120}, {x: 450, y: 100}, {x: 480, y: 130},
                            {x: 550, y: 90}, {x: 580, y: 110}, {x: 610, y: 80}
                          ].map((p, i) => (
                            <g key={`mtn-n-${i}`} transform={`translate(${p.x}, ${p.y})`}>
                              <path d="M -15 20 L 0 -15 L 15 20" />
                              <path d="M -5 5 L 5 5 M -3 10 L 3 10" strokeWidth="0.5" />
                            </g>
                          ))}
                          
                          {/* East Mountains */}
                          {[
                            {x: 850, y: 420}, {x: 870, y: 450}, {x: 840, y: 480}
                          ].map((p, i) => (
                            <g key={`mtn-e-${i}`} transform={`translate(${p.x}, ${p.y})`}>
                              <path d="M -12 18 L 0 -12 L 12 18" />
                              <path d="M -4 4 L 4 4" strokeWidth="0.5" />
                            </g>
                          ))}
                        </g>

                        {/* Medieval Terrain - Rivers */}
                        <g className="text-[#4e342e]/30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M 520 380 c 20 40 -10 80 30 130 s 0 100 40 150" />
                          <path d="M 480 420 c -30 30 10 70 -20 110" />
                        </g>

                        {/* Medieval Terrain - Forests (Lollipop style) */}
                        <g className="text-[#3e2723]/40">
                          {[
                            {x: 410, y: 760}, {x: 435, y: 775}, {x: 460, y: 755},
                            {x: 540, y: 830}, {x: 565, y: 845}, {x: 590, y: 825},
                            {x: 780, y: 550}, {x: 805, y: 565}
                          ].map((p, i) => (
                            <g key={`tree-${i}`} transform={`translate(${p.x}, ${p.y})`}>
                              <line x1="0" y1="0" x2="0" y2="12" stroke="currentColor" strokeWidth="1.5" />
                              <circle cx="0" cy="0" r="5" fill="currentColor" stroke="none" />
                            </g>
                          ))}
                        </g>

                        {/* Medieval Terrain - Waves */}
                        <g className="text-[#5d4037]/30" fill="none" stroke="currentColor" strokeWidth="1">
                          {[
                            {x: 100, y: 350}, {x: 150, y: 380}, {x: 120, y: 420},
                            {x: 1050, y: 320}, {x: 1100, y: 350}, {x: 1080, y: 400},
                            {x: 200, y: 150}, {x: 950, y: 750}
                          ].map((p, i) => (
                            <path key={`wave-${i}`} d={`M ${p.x} ${p.y} c 5 -3 10 3 15 0 m 5 0 c 5 -3 10 3 15 0`} />
                          ))}
                        </g>

                        {/* Decorative Elements - Ship */}
                        <g transform="translate(250, 650) scale(0.8)" className="text-[#5d4037]/50" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M 0 20 L 60 20 L 50 40 L 10 40 Z" fill="currentColor" fillOpacity="0.1" />
                          <line x1="30" y1="20" x2="30" y2="-20" />
                          <path d="M 30 -20 L 60 10 L 30 10 Z" fill="currentColor" fillOpacity="0.2" />
                        </g>

                        {/* Decorative Elements - Whirlpool */}
                        <g transform="translate(100, 550) scale(0.6)" className="text-[#5d4037]/30" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M 0 0 c 20 -20 40 0 20 40 s -60 20 -60 -20 s 40 -60 80 -20 s 20 80 -40 100" />
                        </g>

                        {/* Map Border */}
                        <rect x="20" y="20" width="1160" height="860" fill="none" stroke="#5d4037" strokeWidth="4" className="opacity-20" />
                        <rect x="30" y="30" width="1140" height="840" fill="none" stroke="#5d4037" strokeWidth="1" className="opacity-10" />
                      </svg>

                      {/* Locations & Region Labels */}
                      {locations
                        .filter(loc => !loc.path || loc.path === 'all' || loc.path === currentPath)
                        .map((loc) => {
                          const isUnlocked = unlockedLocations.has(loc.id);
                          
                          // Logic: Region labels are always shown (grayed out if not unlocked)
                          // Specific locations only shown if unlocked
                          if (!loc.isRegionLabel && !isUnlocked) return null;

                          return (
                            <motion.div
                              key={loc.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              style={{ 
                                left: `${loc.x}%`, 
                                top: `${loc.y}%` 
                              }}
                              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                            >
                              <button 
                                onClick={() => isUnlocked && setSelectedLocationId(loc.id)}
                                className={`relative flex flex-col items-center group transition-all ${isUnlocked ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
                              >
                                {loc.isRegionLabel ? (
                                  <div className={`px-4 py-2 border-y transition-colors duration-500 ${isUnlocked ? 'border-[#5d4037]/40 bg-[#8b4513]/5' : 'border-neutral-800 bg-black/10 grayscale opacity-40'}`}>
                                    <h2 className={`text-lg md:text-xl font-display tracking-[0.4em] uppercase whitespace-nowrap ${isUnlocked ? 'text-[#5d4037]' : 'text-neutral-600'}`}>
                                      {loc.name}
                                    </h2>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center">
                                    <div className={`w-1.5 h-1.5 rounded-full mb-1 ${isUnlocked ? 'bg-[#5d4037]' : 'bg-neutral-600'}`} />
                                    <p className={`text-[10px] md:text-xs font-display tracking-widest uppercase whitespace-nowrap drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)] ${isUnlocked ? 'text-[#5d4037]' : 'text-neutral-600'}`}>
                                      {loc.name}
                                    </p>
                                    <div className={`w-0 h-px transition-all duration-300 ${isUnlocked ? 'bg-[#5d4037]/40 group-hover:w-full' : ''}`} />
                                  </div>
                                )}
                              </button>
                            </motion.div>
                          );
                        })}

                      {/* Map Decorations - Compass Rose */}
                      <div className="absolute top-12 left-12 opacity-40 pointer-events-none">
                        <svg width="140" height="140" viewBox="0 0 100 100" className="text-[#5d4037]">
                          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
                          {/* Main Points */}
                          <path d="M 50 10 L 55 45 L 50 50 L 45 45 Z" fill="currentColor" />
                          <path d="M 50 90 L 55 55 L 50 50 L 45 55 Z" fill="currentColor" />
                          <path d="M 90 50 L 55 55 L 50 50 L 55 45 Z" fill="currentColor" />
                          <path d="M 10 50 L 45 55 L 50 50 L 45 45 Z" fill="currentColor" />
                          {/* Sub Points */}
                          <path d="M 25 25 L 50 50 L 30 30 Z" fill="currentColor" opacity="0.5" />
                          <path d="M 75 25 L 50 50 L 70 30 Z" fill="currentColor" opacity="0.5" />
                          <path d="M 25 75 L 50 50 L 30 70 Z" fill="currentColor" opacity="0.5" />
                          <path d="M 75 75 L 50 50 L 70 70 Z" fill="currentColor" opacity="0.5" />
                          
                          <text x="50" y="8" textAnchor="middle" fontSize="10" fill="currentColor" className="font-display font-bold">N</text>
                          <text x="50" y="98" textAnchor="middle" fontSize="10" fill="currentColor" className="font-display font-bold">S</text>
                          <text x="96" y="54" textAnchor="middle" fontSize="10" fill="currentColor" className="font-display font-bold">E</text>
                          <text x="4" y="54" textAnchor="middle" fontSize="10" fill="currentColor" className="font-display font-bold">W</text>
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                <div className="mt-8 text-center pb-8">
                  <p className="text-[10px] text-amber-900/40 font-display uppercase tracking-[0.5em]">
                    — 随着你的脚步，王国的疆域正逐渐清晰 —
                  </p>
                </div>
              </div>

              {/* Location Detail Overlay */}
              <AnimatePresence>
                {selectedLocation && (
                  <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    className="fixed top-0 right-0 bottom-0 w-full md:w-96 bg-[#0a0a0a] border-l border-amber-900/20 z-[110] shadow-2xl p-8 flex flex-col"
                  >
                    <button 
                      onClick={() => setSelectedLocationId(null)}
                      className="absolute top-8 right-8 text-neutral-500 hover:text-neutral-100 transition-colors p-2"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="mt-16 space-y-8">
                      <div className="space-y-2">
                        <span className="text-[10px] text-emerald-500/60 uppercase tracking-[0.3em] font-display">
                          {selectedLocation.faction}
                        </span>
                        <h4 className="text-4xl text-amber-600 font-display tracking-wider">
                          {selectedLocation.name}
                        </h4>
                      </div>

                      <div className="h-px bg-gradient-to-r from-amber-900/40 to-transparent" />

                      <div className="space-y-6">
                        <div className="flex items-center gap-3 text-amber-900/60">
                          <Shield className="w-4 h-4" />
                          <span className="text-xs uppercase tracking-widest">势力归属 · Faction</span>
                        </div>
                        <p className="text-neutral-300 font-serif italic text-lg leading-relaxed">
                          {selectedLocation.faction}
                        </p>
                      </div>

                      {selectedLocation.region && (
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 text-amber-900/60">
                            <MapPin className="w-4 h-4" />
                            <span className="text-xs uppercase tracking-widest">所属区域 · Region</span>
                          </div>
                          <p className="text-neutral-300 font-serif italic text-lg leading-relaxed">
                            {selectedLocation.region}
                          </p>
                        </div>
                      )}

                      <div className="space-y-6">
                        <div className="flex items-center gap-3 text-amber-900/60">
                          <Book className="w-4 h-4" />
                          <span className="text-xs uppercase tracking-widest">地点志 · Description</span>
                        </div>
                        <p className="text-neutral-400 font-serif italic leading-relaxed text-base">
                          {selectedLocation.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto pt-12">
                      <div className="p-6 border border-amber-900/10 bg-amber-900/5 rounded-sm">
                        <p className="text-[10px] text-amber-900/40 uppercase tracking-widest leading-relaxed">
                          此地的历史已与您的旅程交织。每一个被踏足的角落，都见证了权力的更迭与命运的流转。
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Info */}
        <footer className="mt-24 pt-8 border-t border-amber-900/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.3em] text-neutral-600 relative z-10">
          <div className="flex items-center gap-2">
            <Book className="w-3 h-3" />
            <span>The Crimson Queen</span>
          </div>
          <div className="flex gap-8 items-center">
            <button
              onClick={() => setShowCompendium(true)}
              className="group relative px-6 py-2 border border-amber-900/30 text-amber-900/60 hover:text-amber-600 hover:border-amber-700/50 transition-all uppercase tracking-[0.4em] text-[10px] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-3 h-3" />
                人物志 · Compendium
              </div>
            </button>
            <button
              onClick={() => setShowMap(true)}
              className="group relative px-6 py-2 border border-emerald-900/30 text-emerald-900/60 hover:text-emerald-500 hover:border-emerald-700/50 transition-all uppercase tracking-[0.4em] text-[10px] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Scroll className="w-3 h-3" />
                世界地图 · World Map
              </div>
            </button>
            <span className="text-amber-900/40">{currentScene.id}</span>
          </div>
        </footer>
          </main>
        )}
      </AnimatePresence>
    </div>
  );
}

