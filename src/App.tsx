/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef, WheelEvent, type ReactNode, type MutableRefObject } from 'react';
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
import { Scene, Stage, Choice, Character, Location as GameLocation, Paragraph, TextSegment, ParticleType, Insight } from './types';
import { characters } from './characters';
import { locations } from './locations';
import { insights } from './insights';
import { fadeAudio, playSFX, SCENE_BGM_CONFIG, SFX_ASSETS, BGM_ASSETS, getChapterTheme } from './audio';
import { TypewriterText } from './components/TypewriterText';
import { SceneDisplay } from './components/SceneDisplay';
import { EndingDisplay } from './components/EndingDisplay';
import { ChoiceList } from './components/ChoiceList';
import { Button } from './components/Button';
import { EmbossedInitial } from './components/EmbossedInitial';
import { Compendium } from './components/Compendium';
import { VolumeMixer } from './components/VolumeMixer';
import { HistoryDisplay } from './components/HistoryDisplay';
import { ProgressSave } from './components/ProgressSave';
import { WorldMap } from './components/WorldMap';
import { Notification } from './components/Notification';
import { EndingGallery } from './components/EndingGallery';
import { AnimalPattern } from './components/AnimalPattern';
import { ChroniclerTransition } from './components/ChroniclerTransition';
import { GameHeader } from './components/GameHeader';
import { GameFooter } from './components/GameFooter';
import { IntroScreen } from './components/IntroScreen';
import ParticleBackground from './components/ParticleBackground';
import CustomCursor from './components/CustomCursor';

// --- 基础 UI 组件与工具函数 ---


export default function App() {
  // --- 测试模式探测 ---
  // 通过 URL 参数 ?testMode=true 激活。为了防止页面自动刷新导致后缀丢失，
  // 我们会将其记录在 localStorage 中。如果发现 localStorage 中有而在 URL 中没有，我们会尝试补回 URL。
  const isTestMode = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get('testMode');
    
    if (urlParam === 'true') {
      localStorage.setItem('hersey_test_mode_active', 'true');
    } else if (urlParam === 'false') {
      localStorage.setItem('hersey_test_mode_active', 'false');
    }
    
    const active = localStorage.getItem('hersey_test_mode_active') === 'true';
    
    // 如果激活了测试模式但 URL 里没了（例如代码更新重启后），尝试补回 URL 方便查看
    if (active && urlParam !== 'true' && window.history.replaceState) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('testMode', 'true');
      window.history.replaceState({}, '', newUrl.toString());
    }
    
    return active;
  }, []);

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
  const [showIntro, setShowIntro] = useState(!isTestMode); // 测试模式下默认跳过开场动画

  // 引用管理：音频实例与通知计时器
  const mainAudioRef = useRef<HTMLAudioElement | null>(null);
  const ambienceAudioRef = useRef<HTMLAudioElement | null>(null);
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);
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
    }, 5000); 
  };

  // 监听全局交互以解锁音频
  useEffect(() => {
    const handleGlobalClick = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
      }
    };
    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('touchstart', handleGlobalClick);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('touchstart', handleGlobalClick);
    };
  }, [hasInteracted]);

  // 极简初始化：确保 Audio 实例在组件生命周期内唯一且尽早创建
  useEffect(() => {
    if (typeof Audio !== 'undefined') {
      if (!mainAudioRef.current) {
        mainAudioRef.current = new Audio();
        mainAudioRef.current.loop = true;
      }
      if (!ambienceAudioRef.current) {
        ambienceAudioRef.current = new Audio();
        ambienceAudioRef.current.loop = true;
      }
      if (!musicAudioRef.current) {
        musicAudioRef.current = new Audio();
        musicAudioRef.current.loop = true;
      }
    }
  }, []);

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
    if (!selectedCharacterId) return null;
    return characters.find(c => c.id === selectedCharacterId) || null;
  }, [selectedCharacterId]);

  const [notification, setNotification] = useState<{title: string, visible: boolean, type?: 'ending' | 'character' | 'location' | 'insight'}>({ title: '', visible: false });

  // --- 数据持久化与生命周期 (Persistence & Lifecycle) ---

  // 保存当前游戏状态到本地存储 (自动存档)
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

  // 1. 手动存档逻辑
  const manualSaveGame = () => {
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
    localStorage.setItem('hersey_manual_save', JSON.stringify(gameState));
    triggerNotification('进度已记录至「编年史之剑」', 'insight');
  };

  // 2. 加载指定类型的存档
  const loadSaveData = (type: 'auto' | 'manual') => {
    const key = type === 'manual' ? 'hersey_manual_save' : 'hersey_save_data';
    const saved = localStorage.getItem(key);
    if (saved) {
      const data = JSON.parse(saved);
      setCurrentSceneId(data.currentSceneId);
      setCurrentStageId(data.currentStageId);
      setHistory(data.history || []);
      setCurrentParaIndex(data.currentParaIndex);
      setCurrentPath(data.currentPath);
      setFlags(data.flags || {});
      setUnlockedCharacters(new Set(data.unlockedCharacters || []));
      if (data.seenCharacterNames) setSeenCharacterNames(new Set(data.seenCharacterNames));
      if (data.unlockedLocations) setUnlockedLocations(new Set(data.unlockedLocations));
      if (data.seenLocationNames) setSeenLocationNames(new Set(data.seenLocationNames));
      if (data.unlockedInsights) setUnlockedInsights(new Set(data.unlockedInsights));
      if (data.unlockedChapters) setUnlockedChapters(data.unlockedChapters);
      if (data.chapterSnapshots) setChapterSnapshots(data.chapterSnapshots);
      setVisitedTexts(data.visitedTexts || []);
      setIsStarting(true);
      setShowProgress(false);
      setIsMenuExpanded(false);
      console.log(`🛠️ [测试模式] ${type === 'manual' ? '手动' : '自动'}进度已成功恢复`);
    }
  };

  // 从本地存储加载游戏状态
  const loadGame = () => loadSaveData('auto');

  // 返回标题画面并重置临时状态
  const returnToTitle = () => {
    saveGame();
    setIsStarting(false);
    resetGame();
  };

  // --- 测试模式生命周期管理 ---
  useEffect(() => {
    if (isTestMode) {
      loadGame();
    } else {
      console.log("🎮 正常模式：游戏将从头开始");
    }
    setIsLoaded(true);
  }, [isTestMode]);

  // 测试模式下的自动保存：当核心进度更新时自动存盘
  useEffect(() => {
    if (isTestMode && isLoaded) {
      saveGame();
    }
  }, [
    currentSceneId, 
    currentStageId, 
    currentParaIndex, 
    currentPath, 
    flags, 
    unlockedChapters, 
    isLoaded
  ]);

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

  // 分层音频管理：处理场景切换时的平滑过渡（独占优先级模式）
  useEffect(() => {
    const scene = gameData.scenes[currentSceneId];
    if (!scene) return;

    // 2. 核心 BGM 抉择逻辑：
    // - 优先级：显式设置 (music/ambience/bgm) > 章节默认主题 (getChapterTheme)
    const musicUrl = scene.music;
    const ambienceUrl = scene.ambience;
    let bgmUrl = scene.bgm || SCENE_BGM_CONFIG[currentSceneId];
    
    // 如果没有显示设置任何音频轨道，则回退到章节主题曲
    if (!bgmUrl && !musicUrl && !ambienceUrl) {
      bgmUrl = getChapterTheme(currentSceneId);
    }

    const manageExclusiveLayer = async (targetRef: MutableRefObject<HTMLAudioElement | null>, url: string | undefined, defaultVolume: number) => {
      const audio = targetRef.current;
      if (!audio) return false;

      const normalizedTarget = url ? new URL(url, window.location.href).href : '';
      const normalizedCurrent = audio.src ? new URL(audio.src, window.location.href).href : '';

      if (normalizedTarget && normalizedCurrent === normalizedTarget) {
        if (audio.paused && hasInteracted && !isMuted) {
          audio.play().catch(() => {});
          fadeAudio(audio, defaultVolume, 1000);
        }
        return true; 
      }

      if (normalizedTarget) {
        audio.pause();
        audio.src = url!;
        audio.load();
        audio.loop = true;
        audio.volume = 0;
        if (hasInteracted && !isMuted) {
          try {
            await audio.play();
            fadeAudio(audio, defaultVolume, 1000);
          } catch(e) { console.error("Layer switch failed", e); }
        }
        return true;
      }
      return false;
    };

    const stopLayer = (ref: MutableRefObject<HTMLAudioElement | null>) => {
      const audio = ref.current;
      if (audio && !audio.paused) {
        fadeAudio(audio, 0, 500);
        setTimeout(() => {
          // 再次检查此时是否真的不需要该轨道，防止快速切换导致误删
          audio.pause();
          audio.src = '';
        }, 500);
      }
    };

    // 执行优先级逻辑：只会有一个物理轨道处于激活状态
    if (musicUrl) {
      manageExclusiveLayer(musicAudioRef, musicUrl, bgmVolume * 1.1);
      stopLayer(ambienceAudioRef);
      stopLayer(mainAudioRef);
    } else if (ambienceUrl) {
      manageExclusiveLayer(ambienceAudioRef, ambienceUrl, bgmVolume * 0.8);
      stopLayer(musicAudioRef);
      stopLayer(mainAudioRef);
    } else if (bgmUrl) {
      manageExclusiveLayer(mainAudioRef, bgmUrl, bgmVolume);
      stopLayer(musicAudioRef);
      stopLayer(ambienceAudioRef);
    } else {
      stopLayer(mainAudioRef);
      stopLayer(ambienceAudioRef);
      stopLayer(musicAudioRef);
    }
  }, [currentSceneId, hasInteracted, isMuted, bgmVolume]);

  // Handle Global Mute/Unmute
  useEffect(() => {
    const audios = [mainAudioRef.current, ambienceAudioRef.current, musicAudioRef.current];
    audios.forEach(audio => {
      if (!audio) return;
      if (hasInteracted && !isMuted) {
        audio.muted = false;
      } else {
        audio.muted = true;
      }
    });
  }, [hasInteracted, isMuted]);

  useEffect(() => {
    setCurrentParaIndex(0);
  }, [currentSceneId, currentStageId]);

  useEffect(() => {
    const handleGlobalClick = () => {
      setHasInteracted(true);
      const audios = [mainAudioRef.current, ambienceAudioRef.current, musicAudioRef.current];
      if (!isMuted) {
        audios.forEach(audio => {
          if (audio && audio.src) {
            audio.play().catch(() => {});
          }
        });
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
  const showChoices = isLastPara && !currentScene.isEnding && (!isStartScene || isStarting) && (currentScene.choices && currentScene.choices.length > 0);
  const showStartTrigger = isStartScene && isLastPara && !isStarting;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#d4d4d8] font-serif selection:bg-amber-900/40 overflow-x-hidden no-scrollbar lg:cursor-none">
      {/* 自定义鼠标指针组件 */}
      <CustomCursor />
      
      {/* 开场动画层 */}
      <AnimatePresence>
        {showIntro && (
          <IntroScreen onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      {/* 墨水失真与羊皮纸滤镜：通过 SVG filter 实现复古质感 */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <filter id="ink-distortion">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" />
        </filter>
      </svg>
      {/* 全局背景纹理与阴影渐变 */}
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/parchment.png')] opacity-15 pointer-events-none mix-blend-overlay" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
      
      {/* 动态粒子背景：渲染尘埃、雪花或萤火虫 */}
      <ParticleBackground type={currentParticleType} />
      
      <AnimatePresence>
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
        <GameHeader 
          showVolumeMixer={showVolumeMixer}
          setShowVolumeMixer={setShowVolumeMixer}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          setShowHistory={setShowHistory}
          showHistory={showHistory}
          returnToTitle={returnToTitle}
        />

        {/* 核心剧情展示区域 */}
        <div className="flex-grow flex flex-col justify-center relative z-10 pointer-events-auto">
          <AnimatePresence>
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
                  const audios = [mainAudioRef.current, ambienceAudioRef.current, musicAudioRef.current];
                  audios.forEach(audio => {
                    if (audio && audio.src) {
                      audio.muted = false;
                      audio.play()
                        .then(() => console.log("✅ 音频成功解锁"))
                        .catch(e => console.log("❌ 仍然被拦截", e));
                    }
                  });
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
                  <Button
                    onClick={() => {
                      const remaining = activeParagraphs.slice(currentParaIndex, activeParagraphs.length - 1).map(p => p.text);
                      setVisitedTexts(prev => [...prev, ...remaining]);
                      setCurrentParaIndex(activeParagraphs.length - 1);
                    }}
                    className="text-[10px] text-neutral-600 hover:text-amber-900/40 uppercase tracking-[0.2em]"
                  >
                    Skip to Choices
                  </Button>
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
                  <Button
                    onClick={() => proceedWithChoice(selectedChoice)}
                    className="mt-8 px-8 py-3 border border-amber-900/40 text-amber-700 hover:text-amber-500 hover:border-amber-700 uppercase tracking-widest text-xs"
                  >
                    Enter the Path
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 全局通知浮层：解锁角色、地点或传闻时的顶部提示 */}
        <Notification notification={notification} />

        {/* 结局画廊：查看已达成的所有剧情结局 */}
        <EndingGallery 
          showGallery={showGallery}
          setShowGallery={setShowGallery}
          unlockedEndings={unlockedEndings}
        />

        {/* 存档界面遮罩：处理保存和加载进度 */}
        <ProgressSave 
          showProgress={showProgress}
          setShowProgress={setShowProgress}
          loadGame={loadSaveData}
          manualSaveGame={manualSaveGame}
        />

        {/* 音量调音台遮罩 */}
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

        <HistoryDisplay 
          showHistory={showHistory}
          setShowHistory={setShowHistory}
          visitedTexts={visitedTexts}
        />

        {/* 人物志：查看已解锁角色的背景与状态 */}
        <AnimatePresence>
          {showCompendium && (
            <Compendium 
              showCompendium={showCompendium}
              setShowCompendium={setShowCompendium}
              unlockedCharacters={unlockedCharacters}
              characters={characters}
              filteredCharacters={filteredCharacters}
              selectedCharacter={selectedCharacter}
              setSelectedCharacterId={setSelectedCharacterId}
              history={history}
              currentSceneId={currentSceneId}
            />
          )}
        </AnimatePresence>

        <WorldMap 
          showMap={showMap}
          setShowMap={setShowMap}
          unlockedLocations={unlockedLocations}
          locations={locations}
          currentPath={currentPath}
          mapRef={mapRef}
          handleMapZoom={handleMapZoom}
          mapX={mapX}
          mapY={mapY}
          mapScale={mapScale}
          mapScaleSpring={mapScaleSpring}
          mapTilt={mapTilt}
          mapPerspectiveOffset={mapPerspectiveOffset}
          cloudX={cloudX}
          cloudY={cloudY}
          labelX={labelX}
          labelY={labelY}
          mapObjectHeight={mapObjectHeight}
          mapObjectOpacity={mapObjectOpacity}
          mapObjectScale={mapObjectScale}
          setSelectedLocationId={setSelectedLocationId}
          selectedLocationId={selectedLocationId}
          selectedLocation={selectedLocation}
          insights={insights}
          unlockedInsights={unlockedInsights}
        />

        {/* 底部页脚：包含全局导航（人物志、地图）和游戏标题 */}
        <GameFooter 
          setShowChapterSelect={setShowChapterSelect}
          setShowCompendium={setShowCompendium}
          setShowMap={setShowMap}
          currentSceneId={currentSceneId}
        />

        {/* 章节选择模态框：用于跨章节跳转 */}
        <AnimatePresence>
          {showChapterSelect && (
            <ChapterSelectModal
              unlockedChapters={unlockedChapters}
              unlockedLocations={Array.from(unlockedLocations)}
              unlockedInsights={unlockedInsights}
              history={history}
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

