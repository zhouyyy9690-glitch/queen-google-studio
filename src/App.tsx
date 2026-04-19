/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef, WheelEvent, type ReactNode } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';
import { CHAPTERS_CONFIG, STORAGE_KEYS } from './constants';
import { ChapterSelectModal } from './components/ChapterSelectModal';
import { ChapterSplash } from './components/ChapterSplash';
import { OrnateCorner } from './components/OrnateCorner';
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
  Map,
  MessageSquare,
  Zap,
  Music
} from 'lucide-react';
import { gameData } from './gameData';
import { commonScenes } from './data/01-commonScenes';
import { Scene, Stage, Choice, Character, Location as GameLocation, Paragraph } from './types';
import { characters } from './characters';
import { locations } from './locations';
import { insights, Insight } from './insights';
import { fadeAudio, playSFX, SCENE_BGM_CONFIG, SFX_ASSETS } from './audio';
import ParticleBackground, { ParticleType } from './components/ParticleBackground';
import CustomCursor from './components/CustomCursor';

// --- 基础 UI 组件与工具函数 ---

// 装饰性组件：地图上的流动云朵，增强氛围感
const FloatingClouds = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen opacity-20">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{ 
            position: 'absolute',
            left: `${Math.random() * 100}%`, 
            top: `${Math.random() * 100}%`,
            transform: `scale(${1 + Math.random() * 1.5})`,
            opacity: 0.3 + Math.random() * 0.5
          }}
          className="w-64 h-32 bg-white blur-[60px] rounded-[100%]"
        />
      ))}
    </div>
  );
};

// UI 组件：地图战争迷雾，用于遮盖未探索区域
const MapFogOfWar = ({ unlockedLocations, locations }: { unlockedLocations: Set<string>, locations: any[] }) => {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
      <defs>
        <mask id="fog-mask">
          <rect width="100%" height="100%" fill="white" />
          {locations
            .filter(loc => unlockedLocations.has(loc.id))
            .map((loc) => (
              <circle
                key={`hole-${loc.id}`}
                cx={`${loc.x}%`}
                cy={`${loc.y}%`}
                r="100" // Reduced radius slightly for perf
                fill="black"
                className="blur-2xl" // Reduced blur to lower GPU load
              />
            ))}
        </mask>
      </defs>
      <rect 
        width="100%" 
        height="100%" 
        fill="#2a2a2a" 
        mask="url(#fog-mask)" 
        className="opacity-80 mix-blend-multiply"
      />
      {/* Dynamic Mist Layer */}
      <rect 
        width="100%" 
        height="100%" 
        fill="url(#mist-pattern)" 
        mask="url(#fog-mask)" 
        className="opacity-40"
      />
      <defs>
        <pattern id="mist-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
          <circle cx="100" cy="100" r="80" fill="white" className="opacity-10 blur-2xl" />
        </pattern>
      </defs>
    </svg>
  );
};


interface TextSegment {
  text: string;
  className?: string;
  isDialogue?: boolean;
}

// 打字机文本组件：处理剧情文本的分段渲染序列
const TypewriterText = ({ segments, onComplete }: { segments: TextSegment[], onComplete?: () => void }) => {
  const totalChars = useMemo(() => segments.reduce((acc, s) => acc + s.text.length, 0), [segments]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onComplete?.();
    }, totalChars * 50 + 1000); // Increased multiplier for slower speed
    return () => clearTimeout(timeout);
  }, [totalChars, onComplete]);

  let runningCharIndex = 0;

  return (
    <span className="inline">
      {segments.map((seg, i) => {
        const isChar = seg.className?.includes('text-amber-600');
        const isLoc = seg.className?.includes('text-emerald-500');
        const isDialogue = seg.isDialogue;
        
        const charsInSeg = Array.from(seg.text);

        return (
          <span 
            key={i} 
            className={`${seg.className || ''} inline relative`}
          >
            {charsInSeg.map((char, j) => {
              const delay = runningCharIndex * 0.05; // Slower stagger (from 0.02 to 0.05)
              runningCharIndex++;
              
              return (
                <motion.span
                  key={j}
                  initial={{ opacity: 0, filter: "blur(12px)", y: 6 }} 
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{
                    duration: 1.2, 
                    delay: delay,
                    ease: [0.2, 0, 0.2, 1]
                  }}
                  className={`inline whitespace-pre-wrap ${
                    isDialogue ? 'drop-shadow-[0_0_8px_rgba(251,191,36,0.2)]' : ''
                  } ${
                    (isChar || isLoc) ? (isChar ? 'animate-[glow-pulse_3s_infinite]' : 'animate-[glow-pulse_4s_infinite]') : ''
                  }`}
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
};

// 场景花瓣绽放特效（预留组件）
const FlowerBloomEffect = () => {
  return null;
};

// 动物图腾背景组件：在选择路径时显示对应的狐狸、鹿或鹰的背景
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

// 蜡烛火焰组件：用于音量调节器的视觉反馈，带有呼吸和摇摆动画
const CandleFlame = ({ size = "md", isActive = false }: { size?: "sm" | "md", isActive?: boolean }) => (
  <motion.div 
    className={`relative flex items-center justify-center shrink-0 ${size === "sm" ? "w-2.5 h-4" : "w-3 h-5"}`}
    animate={{ 
      scaleY: isActive ? [1, 1.2, 0.9, 1.1, 1] : [1, 1.1, 0.95, 1.05, 1],
      scaleX: isActive ? [1, 0.85, 1.15, 0.9, 1] : [1, 0.95, 1.05, 0.95, 1],
      opacity: isActive ? [1, 0.7, 1, 0.8, 1] : [0.9, 0.7, 0.9, 0.8, 0.9],
      rotate: isActive ? [0, -3, 3, -1.5, 0] : [0, -1, 1, -0.5, 0]
    }}
    transition={{ 
      duration: isActive ? 2 : 4,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    {/* Inner Flame Glow */}
    <div className={`absolute inset-0 bg-amber-400 blur-[4px] rounded-full opacity-40 ${isActive ? 'animate-pulse' : ''}`} />
    
    <svg viewBox="0 0 10 16" className={`${isActive ? 'fill-amber-400' : 'fill-amber-600/80'} drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] w-full h-full`}>
      <path d="M5 16C5 16 0 14 0 9C0 5 5 0 5 0C5 0 10 5 10 9C10 14 5 16 5 16Z" />
    </svg>
    
    {/* Core */}
    <div className={`absolute top-[60%] w-1 h-1 bg-white blur-[1px] rounded-full ${isActive ? 'opacity-90' : 'opacity-40'}`} />
  </motion.div>
);

// 带有凹凸感的首字母组件：用于人物志或地名志的装饰
const EmbossedInitial = ({ nameEn, className = "" }: { nameEn: string, className?: string }) => {
  const initial = (nameEn || 'U').charAt(0).toUpperCase();
  return (
    <div className={`font-display flex items-center justify-center select-none ${className}`}>
      <span 
        className="text-transparent"
        style={{
          textShadow: `
            1.5px 1.5px 1px rgba(0,0,0,0.9),
            -0.5px -0.5px 1px rgba(255,255,255,0.15),
            0 0 5px rgba(217,119,6,0.05)
          `,
          WebkitTextStroke: "0.5px rgba(217,119,6,0.1)",
          filter: "drop-shadow(2px 2px 3px rgba(0,0,0,0.4))"
        }}
      >
        {initial}
      </span>
    </div>
  );
};

// 蜡烛火焰进度条组件：自定义的音量滑块
const FlameSlider = ({ 
  label, 
  icon: Icon, 
  value, 
  onChange, 
  delay 
}: { 
  label: string, 
  icon: any, 
  value: number, 
  onChange: (v: number) => void,
  delay: number
}) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div 
      initial={{ x: delay % 2 === 0 ? -20 : 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay }}
      className="space-y-4 md:space-y-6"
    >
      <div className="flex justify-between items-end px-2 text-amber-700/80">
        <div className="flex items-center gap-3 md:gap-4">
          <Icon className="w-4 h-4 md:w-5 md:h-5" />
          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-medium">{label}</span>
        </div>
        <span className="font-mono text-lg md:text-xl text-amber-600/60 leading-none">{Math.round(value * 100)}%</span>
      </div>
      
      <div className="relative h-12 flex items-center group">
        {/* The Track */}
        <div className="absolute left-0 right-0 h-1 bg-amber-900/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-900/40 via-amber-600/40 to-amber-400/20"
            style={{ width: `${value * 100}%` }}
          />
        </div>

        {/* The Flame Thumb */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-150 ease-out"
          style={{ left: `calc(${value * 100}% - 12px)` }}
        >
          <div className="relative -top-1">
            <CandleFlame size="md" isActive={isDragging} />
            {/* Base of the flame light */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-amber-600/30 blur-sm rounded-full" />
          </div>
        </div>

        {/* Invisible Real Input */}
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="relative w-full h-full opacity-0 cursor-pointer z-10"
        />
      </div>
    </motion.div>
  );
};

// 音量调音台组件：控制背景音乐和音效的音量
const VolumeMixer = ({ 
  bgmVolume, 
  sfxVolume, 
  onBgmChange, 
  onSfxChange, 
  onClose 
}: { 
  bgmVolume: number; 
  sfxVolume: number; 
  onBgmChange: (val: number) => void;
  onSfxChange: (val: number) => void;
  onClose: () => void;
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] bg-[#0a0a0a] overflow-y-auto px-6 py-12 md:p-12"
    >
      <div className="min-h-full flex flex-col items-center justify-center relative">
        {/* Background Textures */}
        <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-30 pointer-events-none" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,119,6,0.05)_0%,rgba(0,0,0,0.9)_100%)] pointer-events-none" />
        
        {/* Ornate Frame */}
        <div className="fixed inset-4 md:inset-16 border-2 border-double border-amber-900/20 pointer-events-none" />
        <OrnateCorner position="tl" />
        <OrnateCorner position="tr" />
        <OrnateCorner position="bl" />
        <OrnateCorner position="br" />

        {/* Close Button - Responsive Position */}
        <button 
          onClick={onClose}
          className="fixed top-6 right-6 md:top-12 md:right-12 z-50 group flex items-center gap-3 md:gap-4 text-neutral-500 hover:text-amber-500 transition-all cursor-pointer"
        >
          <span className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">Return to Hersey</span>
          <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border border-amber-900/20 rounded-full group-hover:border-amber-600/40 group-active:scale-95 transition-all bg-[#0a0a0a]">
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </button>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-xl text-center space-y-10 md:space-y-16 py-8">
          <header className="space-y-4">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="font-display text-xl md:text-3xl uppercase tracking-[0.5em] text-amber-600 drop-shadow-[0_0_15px_rgba(217,119,6,0.3)]">
                Audio Ritual
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-2 md:gap-4"
            >
              <div className="h-px w-8 md:w-12 bg-amber-900/30" />
              <p className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-neutral-500 max-w-[200px] md:max-w-none">Harmonize the atmosphere of your journey</p>
              <div className="h-px w-8 md:w-12 bg-amber-900/30" />
            </motion.div>
          </header>

          <div className="space-y-10 md:space-y-12">
            <FlameSlider 
              label="BGM Volume" 
              icon={Music} 
              value={bgmVolume} 
              onChange={onBgmChange} 
              delay={0.5} 
            />
            <FlameSlider 
              label="SFX Volume" 
              icon={Zap} 
              value={sfxVolume} 
              onChange={onSfxChange} 
              delay={0.6} 
            />
          </div>

          <footer className="pt-8 md:pt-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-px h-12 md:h-16 bg-gradient-to-b from-amber-900/50 to-transparent" />
              <div className="px-6 md:px-8 py-2 md:py-3 bg-amber-900/5 border border-amber-900/20 rounded-full backdrop-blur-sm">
                <div className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-amber-700/60 flex items-center gap-3">
                  <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-amber-600 animate-pulse shadow-[0_0_8px_rgba(217,119,6,0.5)]" />
                  Master Audio Stream Active
                </div>
              </div>
            </motion.div>
          </footer>
        </div>
      </div>
    </motion.div>
  );
};

// 核心场景显示组件：处理舞台、文本、选项、时间印记等界面的核心渲染
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
  sfxVolume,
  renderTextWithDialogue,
  isMenuExpanded,
  setIsMenuExpanded,
  setShowGallery,
  setShowProgress,
  setShowMap,
  sceneId,
  skipTypewriter,
  particleType
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
  playSFX: (url: string, isMuted: boolean, volume?: number) => void,
  isMuted: boolean,
  sfxVolume: number,
  renderTextWithDialogue: (text: string, isThought?: boolean) => TextSegment[],
  isMenuExpanded: boolean,
  setIsMenuExpanded: (v: boolean) => void,
  setShowGallery: (v: boolean) => void,
  setShowProgress: (v: boolean) => void,
  setShowMap: (v: boolean) => void,
  sceneId: string,
  skipTypewriter?: boolean,
  particleType?: ParticleType
}) => {
  const textSegments = paraObj ? renderTextWithDialogue(paraObj.text, paraObj.isThought) : [];
  
  const timeInfo = useMemo(() => {
    switch (particleType) {
      case 'dust': return { label: 'Aurea Mane', subLabel: '正午' };
      case 'evening': return { label: 'Vesperis', subLabel: '暮色' };
      case 'nature': return { label: 'Silen Nocte', subLabel: '寂静之夜' };
      default: return null;
    }
  }, [particleType]);

  const isKillScene = [
    'ForgottenPrincess-kill', 'ForgottenPrincess-kill1',
    'MoonlightEscape-kill', 'MoonlightEscape-kill1',
    'LegendoftheGreenValley-kill', 'LegendoftheGreenValley-kill2',
    'F41_TrapDeath-1'
  ].includes(sceneId);

  return (
    <div className="space-y-8 lg:space-y-6 relative">
      <div className="text-left relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ 
            opacity: 1, 
            y: 0,
          }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="font-display text-3xl md:text-5xl lg:text-4xl text-amber-600 tracking-wider leading-tight mb-2 text-center"
          >
            {sceneTitle}
            {stageId && (
              <div className="space-y-4 mt-2">
                <span className="block text-xs md:text-sm text-amber-900/40 tracking-[0.5em] uppercase">— {stageId} —</span>
                
                {timeInfo && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-3"
                  >
                    {/* Seven Stars Symbol */}
                    <div className="flex items-center gap-2 text-amber-900/40">
                      {[0.3, 0.5, 0.8].map((op, i) => (
                        <div key={`star-l-${i}`} className="w-1 h-1 rounded-full bg-current" style={{ opacity: op }} />
                      ))}
                      <div className="w-2.5 h-2.5 rotate-45 border border-amber-900/60 flex items-center justify-center">
                        <div className="w-1 h-1 bg-amber-600 rounded-full blur-[1px]" />
                      </div>
                      {[0.8, 0.5, 0.3].map((op, i) => (
                        <div key={`star-r-${i}`} className="w-1 h-1 rounded-full bg-current" style={{ opacity: op }} />
                      ))}
                    </div>

                    <div className="flex flex-col items-center">
                      <span className={`font-mono text-[9px] tracking-[0.4em] uppercase ${isKillScene ? 'text-rose-600' : 'text-amber-900/30'}`}>
                        {timeInfo.label}
                      </span>
                      <span className={`font-typewriter text-[10px] tracking-[0.2em] mt-1 ${isKillScene ? 'text-rose-600/60' : 'text-amber-900/20'}`}>
                        {timeInfo.subLabel}
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </motion.h2>
          <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-transparent via-amber-900/40 to-transparent mx-auto mb-6 lg:mb-4 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border border-amber-900/60 bg-[#0a0a0a]" />
          </div>
        </motion.div>

        <div className="min-h-[120px] lg:min-h-[150px] flex items-center justify-center">
          {paraObj && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={skipTypewriter ? 'static' : 'animated'}
              className="text-lg md:text-2xl lg:text-2xl leading-relaxed font-serif text-justify whitespace-pre-wrap max-w-xl lg:max-w-3xl mx-auto px-2 md:px-0"
            >
              {skipTypewriter ? (
                textSegments.map((seg, i) => (
                  <span key={i} className={seg.className}>
                    {seg.text}
                  </span>
                ))
              ) : (
                <TypewriterText segments={textSegments} />
              )}
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
            className="grid lg:grid-cols-2 gap-4 lg:gap-6 pt-6 lg:pt-8 max-w-md lg:max-w-4xl mx-auto w-full"
          >
            {choices.map((choice, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: selectedChoice ? (selectedChoice === choice ? 1 : 0) : 1,
                  scale: 1,
                  x: selectedChoice && selectedChoice !== choice ? (index % 2 === 0 ? -20 : 20) : 0
                }}
                transition={{ duration: 0.5 }}
                onClick={() => {
                  if (!selectedChoice) {
                    playSFX(SFX_ASSETS.CLICK, isMuted, sfxVolume);
                    onChoiceClick(choice);
                  }
                }}
                disabled={!!selectedChoice}
                className={`group relative flex items-center gap-4 md:gap-6 p-4 md:p-6 rounded-sm border-2 border-amber-900/20 bg-transparent transition-all text-left overflow-hidden ${!selectedChoice ? 'hover:border-amber-500/60 cursor-pointer' : ''}`}
              >
                <span className="relative text-neutral-500 group-hover:text-amber-500 font-display text-base md:text-xl tracking-[0.2em] uppercase transition-all duration-500">
                  {choice.text}
                </span>
                <ChevronRight className="relative ml-auto w-4 h-4 md:w-5 md:h-5 text-amber-900/20 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 结局展示组件：当玩家达到故事终点时触发，提供沉浸式的结局叙事体验
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
  const isLastPara = paraIndex === (scene.paragraphs?.length || 0) - 1; // 判断是否为结局的最后一段
  const currentPara = scene.paragraphs?.[paraIndex]; // 当前显示的结局段落

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center p-8 overflow-hidden"
    >
      {/* 纹理背景与装饰框架 */}
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-20 pointer-events-none" />
      <div className="absolute inset-4 md:inset-8 border-2 border-double border-amber-900/20 pointer-events-none" />
      
      <OrnateCorner position="tl" />
      <OrnateCorner position="tr" />
      <OrnateCorner position="bl" />
      <OrnateCorner position="br" />

      <div className="relative max-w-2xl lg:max-w-4xl w-full text-center space-y-12 md:space-y-16">
        {/* 结局标题展示 */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="space-y-4"
        >
          <motion.h2 
            animate={{ 
              textShadow: [
                "0 0 10px rgba(217,119,6,0.2)",
                "0 0 25px rgba(217,119,6,0.5)",
                "0 0 10px rgba(217,119,6,0.2)"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="font-display text-3xl md:text-6xl lg:text-7xl text-amber-600 tracking-[0.2em] uppercase"
          >
            ENDING：{scene.title}
          </motion.h2>
          <div className="w-16 md:w-24 lg:w-32 h-px bg-amber-900/40 mx-auto" />
        </motion.div>

        {/* 结局文本区域（打字机效果） */}
        <div className="min-h-[200px] flex items-center justify-center w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={paraIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.8 }}
              className="text-base md:text-xl lg:text-2xl text-neutral-400 leading-relaxed font-serif italic text-left whitespace-pre-wrap max-w-xl lg:max-w-3xl mx-auto px-8 border-l-2 border-amber-900/20"
            >
              {currentPara && <TypewriterText segments={renderTextWithDialogue(currentPara.text, currentPara.isThought)} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 交互按钮区域 */}
        <div className="flex flex-col items-center gap-8">
          {isLastPara ? (
            /* 结局结束，返回起始页 */
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={onReturn}
              className="group relative py-2 px-8 text-amber-900/40 hover:text-amber-600 transition-all duration-1000 cursor-pointer"
            >
              <span className="font-display text-lg tracking-[0.8em] uppercase">AGAIN WRITING (再次谱写)</span>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-amber-600 group-hover:w-full transition-all duration-1000" />
            </motion.button>
          ) : (
            /* 翻阅下一段结局文本 */
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

const ChroniclerTransition = ({ children, keyStr }: { children: ReactNode, keyStr: string }) => {
  return (
    <motion.div
      key={keyStr}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        initial: { 
          clipPath: 'inset(0 100% 0 0)',
          opacity: 0,
          scale: 0.96,
          skewY: 2,
          filter: 'blur(8px) brightness(1.2)'
        },
        animate: { 
          clipPath: 'inset(0 0% 0 0)',
          opacity: 1,
          scale: 1,
          skewY: 0,
          filter: 'blur(0px) brightness(1)'
        },
        exit: { 
          clipPath: 'inset(0 0 0 100%)',
          opacity: 0,
          scale: 1.04,
          skewY: -2,
          filter: 'blur(8px) brightness(0.8)'
        }
      }}
      transition={{ 
        duration: 0.9, 
        ease: [0.4, 0, 0.2, 1] 
      }}
      className="relative w-full h-full flex flex-col justify-center"
    >
      {/* Dynamic Page/Ink Shadow Wipe */}
      <motion.div
        variants={{
          initial: { left: '-10%', opacity: 0 },
          animate: { left: '110%', opacity: [0, 0.6, 0] },
          exit: { left: '-10%', opacity: 0 }
        }}
        transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
        className="absolute top-0 w-32 h-full bg-gradient-to-r from-transparent via-amber-900/60 to-transparent blur-2xl z-20 pointer-events-none"
      />
      {children}
    </motion.div>
  );
};

export default function App() {
  // --- 核心状态 (Core States) ---
  // 当前场景 ID，初始为 gameData 中定义的初始场景
  const [currentSceneId, setCurrentSceneId] = useState<string>(gameData.initialScene);
  // 当前舞台 ID（用于同一场景内的多级对话/事件）
  const [currentStageId, setCurrentStageId] = useState<string | null>(null);
  // 历史记录：存储玩家经历过的场景 ID
  const [history, setHistory] = useState<string[]>([]);
  // 加载状态，用于确保初始化完成
  const [isLoaded, setIsLoaded] = useState(false);
  
  // 当前文本段落索引
  const [currentParaIndex, setCurrentParaIndex] = useState(0);
  // 当前选择的动物路径（狐狸、鹿、鹰）
  const [currentPath, setCurrentPath] = useState<'fox' | 'deer' | 'eagle' | null>(null);
  // 剧情旗标（Flags）：存储玩家的选择和触发的事件，影响后续剧情
  const [flags, setFlags] = useState<Record<string, any>>({});
  
  // UI 显示控制状态
  const [showHistory, setShowHistory] = useState(false);
  const [showCompendium, setShowCompendium] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  
  // 解锁系统：角色、地点、传闻、已读文本
  const [unlockedCharacters, setUnlockedCharacters] = useState<Set<string>>(new Set());
  const [seenCharacterNames, setSeenCharacterNames] = useState<Set<string>>(new Set());
  const [unlockedLocations, setUnlockedLocations] = useState<Set<string>>(new Set());
  const [seenLocationNames, setSeenLocationNames] = useState<Set<string>>(new Set());
  const [unlockedInsights, setUnlockedInsights] = useState<Set<string>>(new Set());
  const [visitedTexts, setVisitedTexts] = useState<string[]>([]);
  
  // 通用 UI 状态：地图、音频、菜单
  const [showMap, setShowMap] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [bgmVolume, setBgmVolume] = useState(0.4);
  const [sfxVolume, setSfxVolume] = useState(0.3);
  const [showVolumeMixer, setShowVolumeMixer] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // 引用管理：音频实例与通知计时器
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 触发全局通知（解锁角色/地点等）
  const triggerNotification = (title: string, type: 'ending' | 'character' | 'location' | 'insight') => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    setNotification({ title, visible: true, type });
    notificationTimeoutRef.current = setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
      notificationTimeoutRef.current = null;
    }, 5000); // Set to 5 seconds for all types
  };

  // 极简初始化：确保 Audio 实例在组件生命周期内唯一且尽早创建
  if (!audioRef.current && typeof Audio !== 'undefined') {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
  }

  // Selection & Explanation States
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // New States for Gallery and Progress
  const [unlockedEndings, setUnlockedEndings] = useState<{id: string, title: string, text: string}[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  // Optimized Performance Values
  const mapRef = useRef<HTMLDivElement>(null);
  const mapScale = useMotionValue(1);
  const mapScaleSpring = useSpring(mapScale, { stiffness: 100, damping: 20, bounce: 0 });
  const mapTilt = useTransform(mapScaleSpring, [1, 3.5], [0, 45]);
  const mapPerspectiveOffset = useTransform(mapScaleSpring, [1, 3.5], [1000, 1500]);
  const mapObjectHeight = useTransform(mapScaleSpring, [1, 2.5], [0, 80]); 
  
  // NEW: Symbolic Emergence Factors
  const mapObjectOpacity = useTransform(mapScaleSpring, [1.4, 2.2], [0, 1]);
  const mapObjectScale = useTransform(mapScaleSpring, [1.4, 2.5], [0.3, 1]);
  
  // Safe Drag Constraints based on zoom
  const dragLimit = useTransform(mapScaleSpring, s => Math.max(800, 800 * s));
  
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);

  // Chapter Progress States
  const [unlockedChapters, setUnlockedChapters] = useState<string[]>(['act1']);
  const [showChapterSelect, setShowChapterSelect] = useState(false);
  const [chapterSnapshots, setChapterSnapshots] = useState<Record<string, any>>({});

  // Separation Logic handled by CSS Variables to avoid React re-renders
  useEffect(() => {
    return mapScaleSpring.on("change", (latest) => {
      if (mapRef.current) {
        // High-performance separation factor update
        const spreadCurve = Math.pow(Math.max(0, latest - 0.5), 1.5) * 2.5;
        mapRef.current.style.setProperty('--map-scale-val', `${latest}`);
        mapRef.current.style.setProperty('--map-sep-factor', `${spreadCurve}`);
      }
    });
  }, [mapScaleSpring]);

  // Parallax Motion Values
  const mapX = useMotionValue(0);
  const mapY = useMotionValue(0);
  const bgX = useTransform(mapX, x => x * 0.4);
  const bgY = useTransform(mapY, y => y * 0.4);
  
  // PERFORMANCE FIX: Decouple expensive 3D transforms from generic motion values
  const labelX = useTransform(mapX, x => x * 0.05);
  const labelY = useTransform(mapY, y => y * 0.05);
  const cloudX = useTransform(mapX, x => x * 0.1);
  const cloudY = useTransform(mapY, y => y * 0.1);

  const handleMapZoom = (e: WheelEvent) => {
    const currentScale = mapScale.get();
    if (e.deltaY < 0) {
      mapScale.set(Math.min(currentScale + 0.3, 4));
    } else {
      mapScale.set(Math.max(currentScale - 0.3, 0.5));
    }
  };

  const selectedLocation = useMemo(() => 
    locations.find(l => l.id === selectedLocationId),
    [selectedLocationId]
  );

  const filteredCharacters = useMemo(() => 
    characters.filter(c => 
      unlockedCharacters.has(c.id) || 
      (!c.path || c.path === 'all' || c.path === 'common' || c.path === currentPath)
    ),
    [currentPath, unlockedCharacters]
  );

  const selectedCharacter = useMemo(() => {
    const char = characters.find(c => c.id === selectedCharacterId);
    if (!char && filteredCharacters.length > 0) return filteredCharacters[0];
    return char || filteredCharacters[0];
  }, [selectedCharacterId, filteredCharacters]);

  const [notification, setNotification] = useState<{title: string, visible: boolean, type?: 'ending' | 'character' | 'location' | 'insight'}>({ title: '', visible: false });

  // --- 数据持久化与生命周期 (Persistence & Lifecycle) ---

  // 保存当前游戏状态到本地存储
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
      unlockedInsights: Array.from(unlockedInsights),
      visitedTexts,
      unlockedChapters,
      chapterSnapshots,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('hersey_save_data', JSON.stringify(gameState));
  };

  // 从本地存储加载游戏状态
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
      if (data.unlockedInsights) setUnlockedInsights(new Set(data.unlockedInsights));
      if (data.unlockedChapters) setUnlockedChapters(data.unlockedChapters);
      if (data.chapterSnapshots) setChapterSnapshots(data.chapterSnapshots);
      setVisitedTexts(data.visitedTexts);
      setIsStarting(true);
      setShowProgress(false);
      setIsMenuExpanded(false);
    }
  };

  // 返回标题画面并重置临时状态
  const returnToTitle = () => {
    saveGame();
    setIsStarting(false);
    resetGame();
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // 处理剧情自动转场：满足特定标志位时自动移动到新场景
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

  // 环境音/背景音乐 (BGM) 管理：处理场景切换时的平滑过渡
  useEffect(() => {
    const scene = gameData.scenes[currentSceneId];
    const bgmUrl = SCENE_BGM_CONFIG[currentSceneId] || scene?.bgm;
    
    if (!bgmUrl || !audioRef.current) return;

    const audio = audioRef.current;
    
    // 调试日志：检查 URL 类型和内容
    console.log("🎵 BGM 切换请求:", {
      type: typeof bgmUrl,
      url: bgmUrl,
      sceneId: currentSceneId
    });

    if (typeof bgmUrl !== 'string') {
      console.error("❌ 错误: BGM URL 不是字符串类型，请检查导入配置。");
      return;
    }

    // 检查 src 是否真的改变了
    let normalizedTarget = '';
    try {
      normalizedTarget = new URL(bgmUrl, window.location.href).href;
    } catch (e) {
      console.error("❌ 无法解析 BGM URL:", bgmUrl, e);
      return;
    }
    const normalizedCurrent = audio.src ? new URL(audio.src, window.location.href).href : '';

    if (normalizedCurrent !== normalizedTarget) {
      console.log("🎵 尝试切换 BGM 到:", bgmUrl);
      const switchBGM = async () => {
        try {
          // 如果正在播放，先淡出
          if (!audio.paused) {
            fadeAudio(audio, 0, 500);
            await new Promise(resolve => setTimeout(resolve, 500));
          }

          // 彻底重置音频对象，防止旧状态干扰
          audio.pause();
          audio.removeAttribute('src'); 
          audio.load();

          // 重新设置新源
          audio.src = bgmUrl;
          audio.load(); // 强制触发加载过程
          
          audio.volume = 0;
          audio.muted = !hasInteracted || isMuted;

          // 只有在用户交互后才尝试播放
          if (hasInteracted) {
            await audio.play();
            if (!isMuted) {
              audio.muted = false;
              fadeAudio(audio, 0.4, 1500);
            }
          }
        } catch (e) {
          console.error("❌ BGM 播放失败详情:", {
            error: e,
            url: bgmUrl,
            networkState: audio.networkState,
            readyState: audio.readyState
          });
        }
      };
      switchBGM();
    }
  }, [currentSceneId]);

  // Handle Interaction & Mute Sync
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    if (hasInteracted && !isMuted) {
      if (audio.paused) {
        audio.play().catch(() => {});
      }
      audio.muted = false;
      fadeAudio(audio, bgmVolume, 1000);
    } else {
      fadeAudio(audio, 0, 500);
      // 不要立即 pause，等淡出后再静音
      setTimeout(() => {
        if (isMuted) audio.muted = true;
      }, 500);
    }
  }, [hasInteracted, isMuted, bgmVolume]);

  useEffect(() => {
    setCurrentParaIndex(0);
  }, [currentSceneId, currentStageId]);

  useEffect(() => {
    const handleGlobalClick = () => {
      setHasInteracted(true);
      if (audioRef.current && !isMuted) {
        audioRef.current.play().catch(() => {});
      }
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [isMuted]);

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

  // Ref to track current paragraph for highlighting lifecycle
  const lastProcessedParaKey = useRef<string>("");

  // Combined effect to handle unlocking
  useEffect(() => {
    const currentPara = activeParagraphs[currentParaIndex];
    if (!currentPara) return;

    // Unlocks still happen logically for the compendium
    const isCommonScene = Object.keys(commonScenes).includes(currentSceneId);
    if (isCommonScene) return;

    const currentText = currentPara.text;

    // Character unlocks via tags [C:Name]
    characters.forEach(char => {
      const searchNames = [char.name, ...(char.matchNames || [])];
      const isTagged = searchNames.some(name => 
        currentText.includes(`[C:${name}]`) || currentText.includes(`[C：${name}]`)
      );
      
      if (!unlockedCharacters.has(char.id) && isTagged) {
        setUnlockedCharacters(prev => {
          const next = new Set(prev);
          next.add(char.id);
          return next;
        });
        triggerNotification(char.name, 'character');
      }
    });

    // Location unlocks via tags [L:Name]
    locations.forEach(loc => {
      const searchNames = [loc.name, ...(loc.matchNames || [])];
      const isTagged = searchNames.some(name => 
        currentText.includes(`[L:${name}]`) || currentText.includes(`[L：${name}]`)
      );
      
      if (!unlockedLocations.has(loc.id) && isTagged) {
        setUnlockedLocations(prev => {
          const next = new Set(prev);
          next.add(loc.id);
          return next;
        });
        triggerNotification(loc.name, 'location');
      }
    });

    // 5. Insight unlocks
    insights.forEach(insight => {
      const isMatch = insight.matchPatterns.some(p => currentText.includes(p));
      if (!unlockedInsights.has(insight.id) && isMatch) {
        setUnlockedInsights(prev => {
          const next = new Set(prev);
          next.add(insight.id);
          return next;
        });
        triggerNotification(insight.title, 'insight');
      }
    });
  }, [currentParaIndex, currentSceneId, isStarting, activeParagraphs, unlockedCharacters, unlockedLocations]);

  // 保存结局至画廊并触发全局通知
  const saveEnding = (id: string, title: string, text: string) => {
    setUnlockedEndings(prev => {
      // 避免重复记录同一结局
      if (prev.find(e => e.id === id)) return prev;
      triggerNotification(`结局已达成: ${title}`, 'ending');
      return [...prev, { id, title, text }];
    });
  };

  const handleChoiceClick = (choice: Choice) => {
    setSelectedChoice(choice);
    
    // Play SFX if provided in choice data
    if (choice.sfx) {
      playSFX(choice.sfx, isMuted, sfxVolume);
    } else if (currentSceneId === 'start') {
      // 核心修正：点击四条道路选项立即播放开门声，确保点击即响
      playSFX(SFX_ASSETS.DOOR_OPEN, isMuted, sfxVolume);
    } else {
      // 默认点击音效
      playSFX(SFX_ASSETS.CLICK, isMuted, sfxVolume);
    }

    if (choice.explanation) {
      setTimeout(() => setShowExplanation(true), 150); // Faster feedback
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
      const nextId = choice.nextSceneId;
      setHistory([...history, currentSceneId]);
      setCurrentSceneId(nextId);

      // Chapter Unlock Logic
      if (nextId === 'Act2ChapterSplash' && !unlockedChapters.includes('act2')) {
        setUnlockedChapters(prev => [...prev, 'act2']);
        setChapterSnapshots(prev => ({
          ...prev,
          'act2': {
            currentSceneId: nextId,
            currentStageId: null,
            history: [...history, currentSceneId],
            currentPath: currentPath,
            flags: { ...flags, ...choice.setFlags },
            unlockedCharacters: Array.from(unlockedCharacters),
            unlockedLocations: Array.from(unlockedLocations),
            unlockedInsights: Array.from(unlockedInsights),
            visitedTexts: [...visitedTexts]
          }
        }));
      }
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

  const resetAllProgress = () => {
    localStorage.removeItem('hersey_save_data');
    setUnlockedChapters(['act1']);
    setChapterSnapshots({});
    resetGame();
    setIsStarting(false);
    setShowChapterSelect(false);
  };

  const loadFromChapter = (chapterId: string) => {
    const config = CHAPTERS_CONFIG.find(c => c.id === chapterId);
    if (!config) return;

    // Use snapshot if exists, otherwise default setup
    const snapshot = chapterSnapshots[chapterId];
    
    if (snapshot) {
      setCurrentSceneId(snapshot.currentSceneId);
      setCurrentStageId(snapshot.currentStageId);
      setHistory(snapshot.history || []);
      setCurrentParaIndex(0);
      setCurrentPath(snapshot.currentPath);
      setFlags(snapshot.flags || {});
      setUnlockedCharacters(new Set(snapshot.unlockedCharacters || []));
      setUnlockedLocations(new Set(snapshot.unlockedLocations || []));
      setUnlockedInsights(new Set(snapshot.unlockedInsights || []));
      setVisitedTexts(snapshot.visitedTexts || []);
    } else {
      // Default jump for specific chapters if no snapshot
      setCurrentSceneId(config.startSceneId);
      setCurrentStageId(null);
      setCurrentParaIndex(0);
      setHistory([]);
      setVisitedTexts([]);
      setFlags({});
      setCurrentPath(null);
    }

    setIsStarting(true);
    setShowChapterSelect(false);
    setShowMap(false);
    setShowCompendium(false);
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

  // Clear newly unlocked highlights when moving to next paragraph or scene handled in main effect above

  const renderTextWithDialogue = (text: string, isThought?: boolean): TextSegment[] => {
    // 1. First split by dialogue markers
    const parts = text.split(/([“”""][^“”""]*[“”""])/g);
    const segments: TextSegment[] = [];
    
    parts.forEach((part) => {
      if (!part) return;

      const isDialoguePart = part.match(/^[“”""]/);
      
      // 2. Process Manual Highlighting Tags within both narrative and dialogue
      // Pattern: [C:Name] or [C：Name] for Characters, [L:Location] or [L：Location] for Locations
      const tagParts = part.split(/(\[C[:：][^\]]+\]|\[L[:：][^\]]+\])/g);
      
      tagParts.forEach(tagPart => {
        if (!tagPart) return;

        if (tagPart.startsWith('[C') && tagPart.endsWith(']')) {
          // Character Manual Highlight
          const name = tagPart.substring(3, tagPart.length - 1);
          segments.push({
            text: name,
            className: "text-amber-600 font-bold",
            isDialogue: !!isDialoguePart
          });
        } else if (tagPart.startsWith('[L') && tagPart.endsWith(']')) {
          // Location Manual Highlight
          const locName = tagPart.substring(3, tagPart.length - 1);
          segments.push({
            text: locName,
            className: "text-emerald-500 font-bold",
            isDialogue: !!isDialoguePart
          });
        } else {
          // Normal segment (either dialogue or narrative)
          if (isDialoguePart) {
            segments.push({
              text: tagPart,
              className: "text-amber-100/90 font-dialogue drop-shadow-[0_0_5px_rgba(251,191,36,0.2)]",
              isDialogue: true
            });
          } else {
            segments.push({
              text: tagPart,
              className: isThought 
                ? "text-rose-400/90 font-serif italic font-medium tracking-wide" 
                : "text-neutral-400 font-serif",
              isDialogue: false
            });
          }
        }
      });
    });

    return segments;
  };

  // 环境光效/粒子效果管理：根据地理位置、时间、特定剧情决定背景粒子 (尘埃、雪、夕阳、萤火虫)
  const currentParticleType = useMemo(() => {
    // 1. Manually check specific ranges/IDs requested by user
    if (currentScene.isEnding) return 'none'; // User requested act1 endings to be none

    const scenesToNature = [
      'ForgottenPrincess-kill', 'ForgottenPrincess-kill1',
      'MoonlightEscape-kill', 'MoonlightEscape-kill1',
      'LegendoftheGreenValley-kill', 'LegendoftheGreenValley-kill2'
    ];
    if (scenesToNature.includes(currentSceneId)) return 'nature';

    // Handle ranges for Fox Path (F2-F12, F13, F14-F39, F41)
    if (currentSceneId.startsWith('F')) {
      // Regex to extract the number after 'F'
      const match = currentSceneId.match(/^F(\d+)/);
      if (match) {
        const num = parseInt(match[1]);
        if (num >= 2 && num <= 12) return 'dust'; // Daylight
        if (num === 13) return 'evening'; // Evening Transition
        if (num >= 14 && num <= 39) return 'nature'; // Night (Fireflies)
        if (num >= 41) return 'dust'; // Leave with Fain / Day again
      }
    }

    // 2. Default heuristic logic
    if (currentScene.particleType) return currentScene.particleType;
    if (Object.keys(commonScenes).includes(currentSceneId)) return 'none';
    
    const allParagraphsText = currentScene.paragraphs?.map(p => p.text).join(' ') || '';
    const searchSpace = (currentSceneId + ' ' + currentScene.title + ' ' + currentScene.description + ' ' + allParagraphsText).toLowerCase();
    
    if (searchSpace.includes('北境') || searchSpace.includes('雪') || searchSpace.includes('高原')) return 'snow';
    if (searchSpace.includes('王城') || searchSpace.includes('凯斯') || searchSpace.includes('贤者堡') || searchSpace.includes('大教堂')) return 'dust';
    
    const isNight = searchSpace.includes('night') || searchSpace.includes('夜') || searchSpace.includes('今夜') || searchSpace.includes('深夜');
    if (isNight && (searchSpace.includes('溪木堡') || searchSpace.includes('森林') || searchSpace.includes('翠谷') || searchSpace.includes('绿野'))) return 'nature';
    
    return 'none';
  }, [currentScene, currentSceneId]);

  if (!isLoaded) return null;

  const isLastPara = currentParaIndex === activeParagraphs.length - 1;
  const isStartScene = currentSceneId === gameData.initialScene;
  const showChoices = isLastPara && !currentScene.isEnding && (!isStartScene || isStarting);
  const showStartTrigger = isStartScene && isLastPara && !isStarting;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#d4d4d8] font-serif selection:bg-amber-900/40 overflow-x-hidden no-scrollbar lg:cursor-none">
      {/* 自定义鼠标指针组件 */}
      <CustomCursor />
      
      {/* 墨水失真与羊皮纸滤镜：通过 SVG filter 实现复古质感 */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <filter id="ink-distortion">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" />
        </filter>
      </svg>
      {/* 全局背景纹理与阴影渐变 */}
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
      
      {/* 动态粒子背景：渲染尘埃、雪花或萤火虫 */}
      <ParticleBackground type={currentParticleType} />
      
      <AnimatePresence mode="wait">
        {currentScene.isEnding ? (
          /* 结局展示界面：当场景标记为 isEnding 时触发 */
          <EndingDisplay 
            scene={currentScene}
            paraIndex={currentParaIndex}
            onNext={nextParagraph}
            onReturn={returnToTitle}
            renderTextWithDialogue={renderTextWithDialogue}
          />
        ) : (
          /* 主游戏容器：处理剧情、地图、人物志等所有核心交互 */
          <main key="main-content" className="relative max-w-2xl lg:max-w-5xl xl:max-w-6xl mx-auto px-6 md:px-12 lg:px-24 py-12 lg:py-16 flex flex-col min-h-screen transition-all duration-700">
        {/* 装饰边框 */}
        <div className="absolute inset-2 md:inset-4 lg:inset-8 border-[1px] border-amber-900/20 pointer-events-none" />
        <div className="absolute inset-4 md:inset-6 lg:inset-12 border-[1px] border-amber-900/10 pointer-events-none" />
        
        {/* 四角的中世纪装饰纹样 */}
        <OrnateCorner position="tl" />
        <OrnateCorner position="tr" />
        <OrnateCorner position="bl" />
        <OrnateCorner position="br" />

        {/* 顶部页眉：显示标题、音量调节器、历史记录等 */}
        <header className="mb-6 lg:mb-10 flex items-center justify-between border-b-2 border-double border-amber-900/30 pb-3 lg:pb-5 relative z-10 gap-2">
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <Scroll className="w-3.5 h-3.5 md:w-5 md:h-5 text-amber-700/60" />
            <span className="font-display text-[9px] md:text-sm tracking-[0.15em] md:tracking-[0.3em] text-amber-700/80 uppercase truncate max-w-[100px] md:max-w-none">
              Chronicles
            </span>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4 overflow-x-auto overflow-y-hidden no-scrollbar">
            <button 
              onClick={() => setShowVolumeMixer(!showVolumeMixer)}
              title=""
              className="group flex items-center gap-1.5 md:gap-2 text-[8px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] text-neutral-600 hover:text-amber-600 transition-all cursor-pointer shrink-0"
            >
              <Music className="w-2.5 h-2.5 md:w-3 h-3 group-hover:drop-shadow-[0_0_3px_rgba(217,119,6,0.8)] transition-all" />
              <span className="hidden sm:inline">Mixer</span>
            </button>
            
            <button 
              onClick={() => setIsMuted(!isMuted)}
              title=""
              className="group flex items-center gap-1.5 md:gap-2 text-[8px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] text-neutral-600 hover:text-amber-600 transition-all cursor-pointer shrink-0"
            >
              {isMuted ? (
                <VolumeX className="w-2.5 h-2.5 md:w-3 h-3 group-hover:drop-shadow-[0_0_3px_rgba(217,119,6,0.8)] transition-all" />
              ) : (
                <Volume2 className="w-2.5 h-2.5 md:w-3 h-3 group-hover:drop-shadow-[0_0_3px_rgba(217,119,6,0.8)] transition-all" />
              )}
              <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Music'}</span>
            </button>
 
            <button 
              onClick={() => setShowHistory(!showHistory)}
              title=""
              className="group flex items-center gap-1.5 md:gap-2 text-[8px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] text-neutral-600 hover:text-amber-600 transition-all cursor-pointer shrink-0"
            >
              <History className="w-2.5 h-2.5 md:w-3 h-3 group-hover:drop-shadow-[0_0_3px_rgba(217,119,6,0.8)] transition-all" />
              <span className="hidden sm:inline">Log</span>
            </button>
 
            <button 
              onClick={returnToTitle}
              title=""
              className="group flex items-center gap-1.5 md:gap-2 text-[8px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] text-neutral-600 hover:text-amber-600 transition-all cursor-pointer shrink-0"
            >
              <RotateCcw className="w-2.5 h-2.5 md:w-3 h-3 group-hover:rotate-[-45deg] group-hover:drop-shadow-[0_0_3px_rgba(217,119,6,0.8)] transition-all" />
              <span className="hidden sm:inline">Title</span>
            </button>
          </div>
        </header>

        {/* 核心剧情展示区域 */}
        <div className="flex-grow flex flex-col justify-center relative z-20 pointer-events-auto">
          <AnimatePresence mode="wait">
            {currentScene.isChapter ? (
              /* 章节转场/标题页：显示“第一章”等大标题 */
              <ChapterSplash 
                key={currentSceneId}
                chapterNumber={currentScene.chapterNumber || "I"}
                chapterTitle={currentScene.title}
                chapterSubtitle={currentScene.chapterSubtitle}
                onContinue={() => {
                  if (activeChoices.length > 0) {
                    handleChoiceClick(activeChoices[0]);
                  }
                }}
              />
            ) : (
              /* 剧情场景页：显示对话、旁白和玩家选项 */
              <ChroniclerTransition keyStr={currentSceneId + '-' + (currentStageId || 'base') + '-' + currentParaIndex + '-' + isStarting}>
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
                  
                  // 强制解锁音频：在用户点击的瞬间执行 play()
                  playSFX(SFX_ASSETS.CLICK, isMuted, sfxVolume);
                  if (audioRef.current) {
                    const audio = audioRef.current;
                    audio.muted = false;
                    audio.volume = bgmVolume;
                    audio.play()
                      .then(() => console.log("✅ 音频成功解锁"))
                      .catch(e => console.log("❌ 仍然被拦截", e));
                  }
                }}
                choices={activeChoices}
                selectedChoice={selectedChoice}
                onChoiceClick={handleChoiceClick}
                playSFX={playSFX}
                isMuted={isMuted}
                sfxVolume={sfxVolume}
                renderTextWithDialogue={renderTextWithDialogue}
                isMenuExpanded={isMenuExpanded}
                setIsMenuExpanded={setIsMenuExpanded}
                setShowGallery={setShowGallery}
                setShowProgress={setShowProgress}
                setShowMap={setShowMap}
                sceneId={currentSceneId}
                skipTypewriter={Object.keys(commonScenes).includes(currentSceneId)}
                particleType={currentParticleType}
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
            </ChroniclerTransition>
          )}
          </AnimatePresence>
        </div>

        {/* 选项解释弹窗：当玩家选择路径时，显示该选择的深层含义 */}
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

        {/* 全局通知浮层：解锁角色、地点或传闻时的顶部提示 */}
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
              <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse shrink-0 ${
                notification.type === 'location' ? 'bg-emerald-500' : 
                notification.type === 'insight' ? 'bg-indigo-400' : 
                'bg-amber-600'
              }`} />
              <span className={`font-display tracking-[0.15em] md:tracking-[0.2em] uppercase text-[10px] md:text-sm whitespace-nowrap overflow-hidden text-ellipsis ${
                notification.type === 'location' ? 'text-emerald-500' : 
                notification.type === 'insight' ? 'text-indigo-400' : 
                'text-amber-600'
              }`}>
                <span className="opacity-60">
                  {notification.type === 'character' ? '人物解锁 · ' : 
                   notification.type === 'location' ? '地点解锁 · ' : 
                   ''}
                </span>
                {notification.title}
                <span className="opacity-60">
                  {notification.type === 'insight' ? ' · 已记录' : ''}
                </span>
              </span>
              <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse shrink-0 ${
                notification.type === 'location' ? 'bg-emerald-500' : 
                notification.type === 'insight' ? 'bg-indigo-400' : 
                'bg-amber-600'
              }`} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 结局画廊：查看已达成的所有剧情结局 */}
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

        {/* 存档/加载系统弹窗 */}
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
          {showVolumeMixer && (
            <VolumeMixer 
              bgmVolume={bgmVolume}
              sfxVolume={sfxVolume}
              onBgmChange={setBgmVolume}
              onSfxChange={setSfxVolume}
              onClose={() => setShowVolumeMixer(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] bg-[#0a0a0a] p-4 md:p-8 overflow-y-auto"
            >
              <div className="max-w-2xl lg:max-w-4xl mx-auto pt-12 md:pt-16">
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

        {/* 人物志：查看已解锁角色的背景与状态 */}
        <AnimatePresence>
          {showCompendium && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] bg-[#0a0a0a]/98 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 overflow-hidden"
            >
              <div className="w-full max-w-7xl h-full max-h-[90vh] flex flex-col border border-amber-900/20 bg-[#0a0a0a] relative overflow-hidden">
                {/* Background Textures */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-10 pointer-events-none" />
                
                {/* Header */}
                <div className="relative z-10 flex justify-between items-center p-6 md:p-8 border-b border-amber-900/20 bg-[#0a0a0a]/50">
                  <div className="flex items-center gap-4">
                    <Crown className="w-5 h-5 md:w-6 md:h-6 text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.3)]" />
                    <h3 className="font-display text-lg md:text-2xl text-amber-600 tracking-[0.2em] uppercase">人物志 · Bestiary</h3>
                  </div>
                  <button 
                    onClick={() => setShowCompendium(false)}
                    className="text-neutral-500 hover:text-amber-500 transition-all uppercase tracking-[0.2em] text-[10px] md:text-xs cursor-pointer group flex items-center gap-2"
                  >
                    <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    Close
                  </button>
                </div>

                <div className="flex-grow flex flex-col md:flex-row overflow-hidden relative z-10">
                  {/* Sidebar - Characters List */}
                  <div className="w-full md:w-80 lg:w-96 border-r border-amber-900/10 flex flex-col bg-black/20">
                    <div className="p-4 md:p-6 text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-neutral-600 font-display flex items-center justify-between">
                      <span>Soul Records</span>
                      <span className="text-amber-900/40">{unlockedCharacters.size} / {characters.length}</span>
                    </div>
                    <div className="flex-grow overflow-y-auto no-scrollbar px-4 pb-8 space-y-2">
                      {filteredCharacters.map((char) => {
                        const isUnlocked = unlockedCharacters.has(char.id);
                        const isSelected = selectedCharacter?.id === char.id;
                        
                        return (
                          <button
                            key={char.id}
                            onClick={() => isUnlocked && setSelectedCharacterId(char.id)}
                            className={`w-full text-left p-4 rounded-sm transition-all duration-500 relative group flex items-center gap-4 ${
                              isSelected 
                                ? 'bg-amber-900/10 border border-amber-900/30' 
                                : 'hover:bg-amber-900/5 active:scale-[0.98]'
                            } ${!isUnlocked && 'opacity-30 cursor-not-allowed grayscale'}`}
                          >
                            {/* Selected Flicker Aura */}
                            {isSelected && (
                              <motion.div 
                                layoutId="candle-aura"
                                className="absolute inset-0 bg-amber-600/5 blur-md"
                                animate={{ 
                                  opacity: [0.1, 0.3, 0.15, 0.4, 0.1],
                                  scale: [1, 1.02, 0.98, 1.01, 1]
                                }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                              />
                            )}

                            {/* Avatar Frame - Embossed Initial */}
                            <div className="relative shrink-0">
                               <div className={`w-10 h-10 md:w-12 md:h-12 border flex items-center justify-center transition-colors duration-700 ${
                                 isSelected ? 'border-amber-600/40' : 'border-amber-900/20 group-hover:border-amber-600/20'
                               }`}>
                                 {isUnlocked ? (
                                   <EmbossedInitial nameEn={char.nameEn} className="text-xl md:text-2xl" />
                                 ) : (
                                   <X className="w-3 h-3 text-neutral-800" />
                                 )}
                               </div>
                               {/* Active Indicator (Flame Tip) */}
                               {isSelected && (
                                 <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.5)]" />
                               )}
                            </div>

                            <div className="flex-grow min-w-0">
                              <div className={`text-[10px] md:text-xs truncate font-display tracking-wider transition-colors duration-500 ${isSelected ? 'text-amber-600' : 'text-neutral-500'}`}>
                                {isUnlocked ? char.name : 'Unknown Identity'}
                              </div>
                              <div className="text-[7px] md:text-[8px] uppercase tracking-[0.2em] text-amber-900/30 truncate">
                                {isUnlocked ? char.nameEn : 'Wait for encounter'}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Main Content - Selected Character Details */}
                  <div className="flex-grow relative overflow-y-auto no-scrollbar">
                    {selectedCharacter && unlockedCharacters.has(selectedCharacter.id) ? (
                      <motion.div 
                        key={selectedCharacter.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-8 md:p-16 flex flex-col items-center text-center space-y-8 md:space-y-12"
                      >
                        {/* Big Avatar Display */}
                        <div className="relative group">
                          {/* Candlelight Glow Behind Avatar */}
                          <div className="absolute inset-0 bg-amber-600/10 blur-3xl animate-pulse rounded-full" />
                          <div className="w-32 h-32 md:w-48 md:h-48 border-2 border-double border-amber-900/30 flex items-center justify-center relative ring-1 ring-amber-600/5 group-hover:border-amber-600/40 transition-all duration-1000">
                             <div className="scale-[2.5] transition-all duration-1000 transform group-hover:scale-[2.6]">
                                <EmbossedInitial nameEn={selectedCharacter.nameEn} className="w-full h-full text-4xl md:text-6xl" />
                             </div>
                             {/* Decorative Corners for details avatar */}
                             <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-amber-600/30" />
                             <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-amber-600/30" />
                             <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-amber-600/30" />
                             <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-amber-600/30" />
                          </div>
                        </div>

                        <div className="space-y-4 md:space-y-6 max-w-2xl px-4">
                          <header className="space-y-2">
                            <motion.span 
                               initial={{ opacity: 0 }}
                               animate={{ opacity: 1 }}
                               transition={{ delay: 0.2 }}
                               className="text-[10px] md:text-xs text-amber-900/60 uppercase tracking-[0.4em] font-display"
                            >
                              {selectedCharacter.nameEn}
                            </motion.span>
                            <motion.h4 
                               initial={{ opacity: 0, y: 10 }}
                               animate={{ opacity: 1, y: 0 }}
                               transition={{ delay: 0.3 }}
                               className="text-3xl md:text-5xl text-amber-600 font-display tracking-widest uppercase"
                            >
                              {selectedCharacter.name}
                            </motion.h4>
                          </header>

                          <div className="w-24 md:w-32 h-px bg-gradient-to-r from-transparent via-amber-900/40 to-transparent mx-auto" />

                          <motion.p 
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             transition={{ delay: 0.5 }}
                             className="text-base md:text-xl text-neutral-400 leading-relaxed font-serif italic text-left md:text-center"
                          >
                            <span className="text-amber-700/60 block mb-3 text-[10px] md:text-xs tracking-[0.3em] not-italic uppercase font-display border-b border-amber-900/10 pb-2">
                              「 {(selectedCharacter.updates && selectedCharacter.updates.find(u => [...history, currentSceneId].includes(u.atScene))?.title) || selectedCharacter.title} 」
                            </span>
                            {(selectedCharacter.updates && selectedCharacter.updates.find(u => [...history, currentSceneId].includes(u.atScene))?.description) || selectedCharacter.description}
                          </motion.p>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 opacity-20">
                         <div className="w-24 h-24 border border-dashed border-amber-900/40 rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-amber-900/40" />
                         </div>
                         <p className="text-amber-900/40 uppercase tracking-widest text-xs">此处人物的命运之书尚未开启</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Decor */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-900/20 to-transparent pointer-events-none" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 交互式王国大地图 */}
        <AnimatePresence>
          {showMap && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] bg-[#0a0a0a] p-4 md:p-8 overflow-hidden flex flex-col"
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
                        mapScale.set(1);
                        setSelectedLocationId(null);
                      }}
                      className="text-neutral-500 hover:text-neutral-100 transition-colors uppercase tracking-widest text-[10px] md:text-xs cursor-pointer p-2"
                    >
                      Close
                    </button>
                  </div>
                </div>

                <div 
                  ref={mapRef}
                  className="flex-grow relative bg-[#d4a85a] border-2 border-amber-900/60 rounded-sm overflow-hidden shadow-[inset_0_0_80px_rgba(0,0,0,0.2)] cursor-grab active:cursor-grabbing"
                  onWheel={handleMapZoom}
                  style={{ 
                    perspective: '2000px',
                    WebkitFontSmoothing: 'antialiased'
                  }}
                >
                  {/* OPTIMIZED 3D INTERACTIVE SHEET: Reduced size and removed shadow-2xl for performance */}
                  <motion.div 
                    drag
                    dragConstraints={{ 
                      left: -1500, 
                      right: 1500, 
                      top: -1200, 
                      bottom: 1200 
                    }}
                    dragTransition={{ bounceStiffness: 200, bounceDamping: 30, power: 0.15 }}
                    dragElastic={0.02}
                    style={{ 
                      x: mapX, 
                      y: mapY, 
                      scale: mapScaleSpring,
                      rotateX: mapTilt,
                      perspective: mapPerspectiveOffset,
                      transformStyle: 'preserve-3d',
                      transform: 'translateZ(0)' // Force GPU acceleration
                    }}
                    className="absolute inset-[-150%] origin-center will-change-transform bg-[#e3bc6a]"
                  >
                    {/* Fixed Background Texture */}
                    <div className="absolute inset-0 pointer-events-none opacity-60 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/old-map.png')]" />
                    <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

                    {/* Map Contents - Centered coordinate space */}
                    <div className="absolute inset-0 min-w-[2000px] min-h-[1600px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ transformStyle: 'preserve-3d' }}>
                      <MapFogOfWar unlockedLocations={unlockedLocations} locations={locations} />
                      <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
                        {/* Landmass Ground Shadow for 3D Modeling Effect */}
                        <path 
                          d="M 500 400 c 100 -100 300 -40 400 -100 s 200 -160 400 -100 s 300 100 400 200 s 100 300 0 500 s -200 400 -400 500 s -400 100 -600 200 s -300 -100 -400 -300 s -100 -400 0 -600 s 100 -200 200 -300" 
                          fill="rgba(0,0,0,0.15)" 
                          className="blur-xl"
                          transform="translate(25, 25)"
                        />
                        {/* Custom Medieval Region Boundaries (Hand-drawn style) */}
                        <g className="pointer-events-none opacity-40">
                          {/* South Boundary - Wide & Organic */}
                          <path 
                            d="M 300 650 q 50 -20 200 -20 t 350 40 t 250 150 v 200 q -100 50 -300 80 t -400 -50 Z" 
                            fill="none" 
                            stroke="#8b4513" 
                            strokeWidth="1.2" 
                            strokeDasharray="10 5"
                            className="text-amber-900/10"
                          />
                          
                          {/* Verdant Vale Boundary - Irregular valley shape around its points */}
                          {unlockedLocations.has('verdant_vale') && (
                            <motion.path 
                              initial={{ pathLength: 0, opacity: 0 }}
                              animate={{ pathLength: 1, opacity: 1 }}
                              transition={{ duration: 2, ease: "easeInOut" }}
                              d="M 460 540 c -40 20 -60 60 -40 120 s 40 80 80 60 s 60 -40 40 -120 s -40 -80 -80 -60 Z" 
                              fill="url(#emerald-glow)" 
                              fillOpacity="0.03"
                              stroke="#065f46" 
                              strokeWidth="1.5" 
                              strokeDasharray="5 3"
                              className="text-emerald-900/30"
                            />
                          )}

                          {/* North, West, East, Central - Simplified medieval border lines */}
                          <path d="M 350 100 q 150 -30 350 0 t 300 50" fill="none" stroke="#8b4513" strokeWidth="1" strokeDasharray="15 10" className="opacity-10"/>
                          <path d="M 150 350 q 50 150 0 300" fill="none" stroke="#8b4513" strokeWidth="1" strokeDasharray="15 10" className="opacity-10"/>
                          <path d="M 950 300 q 80 150 0 350" fill="none" stroke="#8b4513" strokeWidth="1" strokeDasharray="15 10" className="opacity-10"/>
                        </g>

                        <defs>
                          <radialGradient id="emerald-glow">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="transparent" />
                          </radialGradient>
                          <pattern id="grid" width="120" height="120" patternUnits="userSpaceOnUse">
                            <path d="M 120 0 L 0 0 0 120" fill="none" stroke="#8b4513" strokeWidth="0.5" strokeDasharray="4 4"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                        
                        {/* Hierarchy Connecting Lines */}
                        <g className="text-[#8b4513]/40" stroke="currentColor" fill="none" strokeWidth="0.8" strokeDasharray="3 3" style={{ transformStyle: 'preserve-3d' }}>
                          {locations.map(loc => {
                            if (loc.parentId) {
                              const parent = locations.find(p => p.id === loc.parentId);
                              if (parent && unlockedLocations.has(loc.id)) {
                                return (
                                  <line 
                                    key={`link-${loc.id}`}
                                    x1={`${parent.x}%`} 
                                    y1={`${parent.y}%`}
                                    x2={`${loc.x}%`} 
                                    y2={`${loc.y}%`}
                                    className="opacity-40"
                                    style={{ transform: 'translateZ(20px)' }}
                                  />
                                );
                              }
                            }
                            return null;
                          })}
                        </g>

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
                            {x: 780, y: 550}, {x: 805, y: 565},
                            // Emerald Valley Woods
                            {x: 530, y: 580}, {x: 550, y: 600}, {x: 570, y: 570},
                            {x: 520, y: 610}, {x: 580, y: 620}
                          ].map((p, i) => (
                            <g key={`tree-${i}`} transform={`translate(${p.x}, ${p.y})`}>
                              <line x1="0" y1="0" x2="0" y2="12" stroke="currentColor" strokeWidth="1.5" />
                              <circle cx="0" cy="0" r="5" fill="currentColor" stroke="none" />
                            </g>
                          ))}
                        </g>

                        {/* Medieval Terrain - Additional Rivers/Water in Emerald Valley */}
                        <g className="text-[#4e342e]/30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 2">
                          <path d="M 500 550 q 20 40 50 20 t 40 60" className="opacity-40" />
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

                      {/* Parallax Clouds Layer (Fastest) */}
                      <motion.div style={{ x: cloudX, y: cloudY }} className="absolute inset-[-50%] pointer-events-none">
                        <FloatingClouds count={8} />
                      </motion.div>

                      {/* Locations & Region Labels */}
                      {locations
                        .filter(loc => !loc.path || loc.path === 'all' || loc.path === currentPath)
                        .map((loc) => {
                          const isUnlocked = unlockedLocations.has(loc.id);
                          
                          if (!loc.isRegionLabel && !isUnlocked) return null;

                          // 3D Separation Logic via CSS Variables
                          const parent = loc.parentId ? locations.find(p => p.id === loc.parentId) : null;
                          const vectorX = parent ? (loc.x - parent.x) : (loc.x - 50);
                          const vectorY = parent ? (loc.y - parent.y) : (loc.y - 50);
                          const zDepth = loc.isRegionLabel ? (loc.isSubRegion ? 120 : 180) : 60;

                          return (
                            <motion.div
                              key={loc.id}
                              style={{ 
                                left: `${loc.x}%`, 
                                top: `${loc.y}%`,
                                x: labelX,
                                y: labelY,
                                z: zDepth,
                                translateX: `calc(var(--map-sep-factor, 0) * ${vectorX * 2.5}px)`,
                                translateY: `calc(var(--map-sep-factor, 0) * ${vectorY * 2.5}px)`,
                                scale: `calc(1 / pow(var(--map-scale-val, 1), 0.4))`,
                                transformStyle: 'preserve-3d'
                              } as any}
                              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 will-change-transform"
                            >
                              <button 
                                onClick={() => isUnlocked && setSelectedLocationId(loc.id)}
                                className={`relative flex flex-col items-center group transition-all ${isUnlocked ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
                              >
                                {loc.isRegionLabel ? (
                                  <div className={`transition-all duration-700 ${
                                    loc.isSubRegion 
                                      ? 'px-6 py-2' 
                                      : 'px-8 py-4'
                                  } ${isUnlocked ? 'opacity-100' : 'opacity-20 grayscale'}`}>
                                    {/* Text-only label embedded in map */}
                                    <h2 className={`${
                                      loc.isSubRegion 
                                        ? 'text-[12px] md:text-sm text-emerald-900/60' 
                                        : 'text-xl md:text-2xl text-amber-950/20'
                                    } font-display tracking-[0.6em] md:tracking-[0.8em] uppercase whitespace-nowrap drop-shadow-sm select-none`}>
                                      {loc.name}
                                    </h2>
                                    {loc.isSubRegion && isUnlocked && (
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        className="h-px bg-gradient-to-r from-transparent via-emerald-800/30 to-transparent mt-1" 
                                      />
                                    )}
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center" style={{ transformStyle: 'preserve-3d' }}>
                                    {/* ABSTRACT ART RELIEF: Emerges only on deep zoom */}
                                    {isUnlocked && (
                                      <motion.div 
                                        style={{ 
                                          z: mapObjectHeight,
                                          rotateX: -mapTilt, 
                                          opacity: mapObjectOpacity,
                                          scale: mapObjectScale,
                                          transformStyle: 'preserve-3d'
                                        }}
                                        className="absolute bottom-[10%] flex items-end justify-center pointer-events-none will-change-transform"
                                      >
                                        {(loc.id.includes('castle') || loc.name.includes('堡') || loc.name.includes('都') || loc.name.includes('塞')) ? (
                                          <div className="relative flex items-end gap-1" style={{ transformStyle: 'preserve-3d' }}>
                                            {/* SYMBOLIC ARCHITECTURE: Needles of Power */}
                                            <div className="w-[1.5px] h-20 bg-gradient-to-t from-amber-950 to-transparent" />
                                            <div className="w-[2.5px] h-32 bg-gradient-to-t from-amber-950 via-amber-800 to-transparent relative">
                                               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full blur-[2px] opacity-70" />
                                            </div>
                                            <div className="w-[1.5px] h-24 bg-gradient-to-t from-amber-950 to-transparent" />
                                          </div>
                                        ) : (loc.id.includes('valley') || loc.id.includes('forest') || loc.name.includes('谷') || loc.name.includes('林')) ? (
                                          <div className="flex items-end justify-center" style={{ transformStyle: 'preserve-3d' }}>
                                            {/* SYMBOLIC TERRAIN: Crystalline Shards */}
                                            {[1, 2, 3, 4].map(i => (
                                              <div 
                                                key={i} 
                                                className="w-8 h-12 bg-emerald-950/20 border-l border-emerald-900/40" 
                                                style={{ 
                                                  clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                                                  transform: `scale(${0.4 + (i * 0.2)}) translateZ(${i * 8 - 16}px) translateX(${i * -6 + 9}px) rotateY(${i * 15}deg)`,
                                                  filter: 'contrast(1.2) brightness(0.8)',
                                                  mixBlendMode: 'multiply'
                                                }} 
                                              />
                                            ))}
                                          </div>
                                        ) : (loc.id.includes('port') || loc.name.includes('港') || loc.name.includes('码')) ? (
                                          <div className="flex flex-col items-center" style={{ transformStyle: 'preserve-3d' }}>
                                             {/* SYMBOLIC MARITIME: Minimalist Masts */}
                                             <div className="w-[1px] h-16 bg-amber-950/40 relative">
                                                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-amber-950/30" />
                                                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-6 h-[1px] bg-amber-950/30" />
                                             </div>
                                          </div>
                                        ) : (
                                          /* SYMBOLIC POI: Floating Sigil */
                                          <div className="w-[1px] h-12 bg-amber-900/20 relative">
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 border border-amber-900/40 rotate-45" />
                                          </div>
                                        )}
                                      </motion.div>
                                    )}

                                    {/* Map Marker Dot - Stays flat on parchment */}
                                    <div className="relative">
                                      <motion.div 
                                        animate={{ 
                                          scale: [1, 1.4, 1],
                                          opacity: [0.3, 0.7, 0.3]
                                        }}
                                        transition={{ 
                                          duration: 3, 
                                          repeat: Infinity,
                                          ease: "easeInOut" 
                                        }}
                                        className={`w-3 h-3 rounded-full mb-1 blur-[1.5px] ${
                                          isUnlocked ? 'bg-amber-500 shadow-[0_0_12px_rgba(251,191,36,0.9)]' : 'bg-neutral-600'
                                        }`} 
                                      />
                                      <div className={`w-1.5 h-1.5 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                                        isUnlocked ? 'bg-white' : 'bg-neutral-400'
                                      }`} />
                                    </div>
                                    <p className={`mt-1 text-[10px] md:text-sm font-display tracking-[0.2em] uppercase whitespace-nowrap drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] ${isUnlocked ? 'text-[#3e2723] font-bold' : 'text-neutral-600'}`}>
                                      {loc.name}
                                    </p>
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Location Detail Overlay */}
        <AnimatePresence>
          {selectedLocation && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="fixed top-0 right-0 bottom-0 w-full md:w-96 bg-[#0a0a0a] border-l border-amber-900/20 z-[200] shadow-2xl p-8 flex flex-col overflow-y-auto no-scrollbar"
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
                          <span className="text-xs uppercase tracking-widest">领地掌权者 · Ruler</span>
                        </div>
                        <p className="text-neutral-300 font-serif italic text-lg leading-relaxed">
                          {selectedLocation.ruler || selectedLocation.faction}
                        </p>
                      </div>

                      {insights.filter(ins => ins.locationId === selectedLocation.id).length > 0 && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-amber-900/60">
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-xs uppercase tracking-widest">领地传闻 · Rumors</span>
                          </div>
                          <ul className="space-y-4">
                            {insights
                              .filter(ins => ins.locationId === selectedLocation.id)
                              .map((insight) => {
                                if (!unlockedInsights.has(insight.id)) return null;
                                return (
                                  <li key={insight.id} className="text-neutral-400 font-serif italic text-sm leading-relaxed flex flex-col gap-1 border-l border-amber-900/10 pl-4 py-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-amber-600/60 text-[10px] uppercase tracking-widest font-display">{insight.title}</span>
                                    </div>
                                    <p className="text-neutral-300/80">{insight.description}</p>
                                  </li>
                                );
                              })}
                          </ul>
                          {insights
                            .filter(ins => ins.locationId === selectedLocation.id)
                            .every(ins => !unlockedInsights.has(ins.id)) && (
                            <p className="text-[10px] text-neutral-600 italic">暂无搜集到相关传闻。</p>
                          )}
                        </div>
                      )}

                      <div className="h-px bg-amber-900/10" />

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

        {/* 底部页脚：包含全局导航（人物志、地图）和游戏标题 */}
        <footer className="mt-20 md:mt-32 pt-12 md:pt-16 relative z-10 w-full group/footer flex flex-col items-center px-8 md:px-16 lg:px-24">
          {/* Breaking Title with Split Lines */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-center gap-4 md:gap-8 px-8 md:px-16 lg:px-24">
            <div className="flex-grow h-px bg-amber-900/15" />
            <div className="transition-all duration-1000 group-hover/footer:px-8 group-hover/footer:text-amber-600/60 overflow-visible text-center">
              <button 
                onClick={() => setShowChapterSelect(true)}
                className="group/chapter-btn relative focus:outline-none"
              >
                <h1 className="font-display text-[10px] md:text-sm lg:text-lg tracking-[0.4em] text-amber-800/20 uppercase transition-all duration-1000 group-hover/footer:tracking-[0.8em] group-hover/footer:text-amber-600/60 cursor-pointer leading-none whitespace-nowrap">
                  The Crimson Queen
                </h1>
                {/* Glowing Indicator */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-px bg-amber-600/40 group-hover/chapter-btn:w-2/3 transition-all duration-700" />
              </button>
            </div>
            <div className="flex-grow h-px bg-amber-900/15" />
          </div>
          
          {/* Centered Functional Buttons */}
          <div className="flex flex-col items-center gap-6 md:gap-8 w-full">
            <div className="flex items-center justify-center gap-4 md:gap-12">
              <button
                onClick={() => setShowCompendium(true)}
                className="group/btn relative px-3 py-1.5 md:px-8 md:py-2.5 border border-amber-900/20 text-amber-900/40 hover:text-amber-600 hover:border-amber-700/50 transition-all uppercase tracking-[0.2em] md:tracking-[0.4em] text-[7px] md:text-[10px] cursor-pointer"
              >
                <div className="flex items-center justify-center gap-1.5 md:gap-3">
                  <Shield className="w-2.5 h-2.5 md:w-3 h-3 opacity-40 group-hover/btn:opacity-100 transition-opacity" />
                  <span className="whitespace-nowrap hidden sm:inline">人物志 · Compendium</span>
                  <span className="whitespace-nowrap sm:hidden">人物志</span>
                </div>
              </button>
              
              <button
                onClick={() => setShowMap(true)}
                className="group/btn relative px-3 py-1.5 md:px-8 md:py-2.5 border border-emerald-900/20 text-emerald-900/40 hover:text-emerald-500 hover:border-emerald-700/50 transition-all uppercase tracking-[0.2em] md:tracking-[0.4em] text-[7px] md:text-[10px] cursor-pointer"
              >
                <div className="flex items-center justify-center gap-1.5 md:gap-3">
                  <Scroll className="w-2.5 h-2.5 md:w-3 h-3 opacity-40 group-hover/btn:opacity-100 transition-opacity" />
                  <span className="whitespace-nowrap hidden sm:inline">地图 · World Map</span>
                  <span className="whitespace-nowrap sm:hidden">地图</span>
                </div>
              </button>
            </div>
            
            {/* Scene ID (Subtle alignment at the very bottom) */}
            <div className="flex items-center gap-4 opacity-5">
              <div className="h-px w-6 bg-amber-900/40" />
              <span className="text-[6px] md:text-[8px] uppercase tracking-[0.5em] font-mono">{currentScene.id}</span>
              <div className="h-px w-6 bg-amber-900/40" />
            </div>
          </div>
        </footer>

        {/* 章节选择模态框：用于跨章节跳转 */}
        <AnimatePresence>
          {showChapterSelect && (
            <ChapterSelectModal
              unlockedChapters={unlockedChapters}
              unlockedLocations={Array.from(unlockedLocations)}
              onSelect={loadFromChapter}
              onClose={() => setShowChapterSelect(false)}
              onReset={resetAllProgress}
            />
          )}
        </AnimatePresence>
      </main>
    )}
  </AnimatePresence>
</div>
  );
}

