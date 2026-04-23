/**
 * 🏰 《绯红女王》音效与背景音乐管理系统
 * 
 * 此文件负责管理游戏中所有的音频资源映射、淡入淡出逻辑及播放控制。
 */

// --- 1. 音频资源库 (Assets Library) ---

// 使用静音数据 URI 作为占位符，防止 403 错误干扰测试
const SILENT_SOUND = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";

export const BGM_ASSETS = {
  // 换回您最喜欢的原始 Pixabay 音乐链接 (使用用户提供的下载直链)
  MAIN_THEME: "https://cdn.pixabay.com/download/audio/2024/08/31/audio_2120f21e75.mp3?filename=deuslower-medieval-ambient-236809.mp3",
  
  // 红鹿之路专用音乐
  DEER_THEME: "https://cdn.pixabay.com/download/audio/2026/03/19/audio_54cbf38413.mp3?filename=watermelon_beats-medieval-folk-music-505203.mp3",

  // 纺锤之路专用音乐
  SPINDLE_THEME: "https://cdn.pixabay.com/audio/2025/10/10/audio_970460aa1a.mp3",

  // 第二章：新的女王 专用
  CHAPTER2_AMBIENCE: "https://cdn.pixabay.com/audio/2025/10/27/audio_dc93b69db8.mp3",
  CHAPTER2_DROST_MELODY: "https://cdn.pixabay.com/audio/2025/06/13/audio_c45365ddc9.mp3",
  CHAPTER2_RUMOR_MELODY: "https://cdn.pixabay.com/audio/2025/06/26/audio_a252a9ac32.mp3",
  CHAPTER2_FERRY_MELODY: "https://cdn.pixabay.com/audio/2025/05/16/audio_967a4a358c.mp3",

  // 黑鹰之路专用 (目前使用占位符)
  EAGLE_THEME: "https://cdn.pixabay.com/download/audio/2024/09/01/audio_7335689da6.mp3?filename=dark-medieval-ambient-237070.mp3",

  // 推荐：教堂/神秘感 (仪式/重要转折)
  MYSTERY: SILENT_SOUND, 
};

export const SFX_ASSETS = {
  // 换回您原始的按钮音效链接
  CLICK: "https://cdn.pixabay.com/audio/2022/03/10/audio_017c747e3d.mp3",
  PAGE_TURN: SILENT_SOUND,
  // 使用您提供的 Pixabay 直链
  DOOR_OPEN: "https://cdn.pixabay.com/download/audio/2025/12/19/audio_af89e72c6a.mp3?filename=dragon-studio-open-door-stock-sfx-454246.mp3",
};

// --- 2. 场景与 BGM 对应表 (Scene BGM Mapping) ---
// 此表仅用于存放“特殊配乐设定”。
// 普通场景会自动根据章节回退到对应的主题曲（见 getChapterTheme）。

export const SCENE_BGM_CONFIG: Record<string, string> = {
  "start": BGM_ASSETS.MAIN_THEME,
  "F49-ThreeRiddlesFerry": BGM_ASSETS.CHAPTER2_FERRY_MELODY,
  "F56-HammondTopic": BGM_ASSETS.CHAPTER2_RUMOR_MELODY,
  "F53-OuterCityArrival": BGM_ASSETS.CHAPTER2_DROST_MELODY,
  "F53-1-Welcome": BGM_ASSETS.CHAPTER2_DROST_MELODY,
  "F54-ArchbishopWords": BGM_ASSETS.CHAPTER2_DROST_MELODY,
};

/**
 * 自动识别场景所属章节并返回对应的主题曲
 */
export const getChapterTheme = (sceneId: string): string => {
  // 1. 主界面
  if (sceneId === 'start') return BGM_ASSETS.MAIN_THEME;

  // 2. 狐狸线 (Fox Path)
  if (sceneId.startsWith('F') || sceneId === 'Act2ChapterSplash') {
    const numMatch = sceneId.match(/F(\d+)/);
    const num = numMatch ? parseInt(numMatch[1]) : 0;
    
    // Chapter 1 (F1-F47) -> Main Theme (和游戏主题曲一致)
    if (num > 0 && num < 48) return BGM_ASSETS.MAIN_THEME;
    // Chapter 2 (F48+) -> Chapter 2 Ambience
    if (num >= 48 || sceneId === 'Act2ChapterSplash') return BGM_ASSETS.CHAPTER2_AMBIENCE;
    
    return BGM_ASSETS.MAIN_THEME; // 默认
  }

  // 3. 红鹿线 (Deer Path)
  if (sceneId.startsWith('d')) {
    return BGM_ASSETS.DEER_THEME;
  }

  // 4. 纺锤线 (Spindle Path)
  if (sceneId === 'Destiny' || sceneId === 'Spindle' || sceneId.startsWith('S')) {
    return BGM_ASSETS.SPINDLE_THEME;
  }

  // 5. 黑鹰线 (Black Eagle Path)
  if (sceneId.startsWith('e') || sceneId.startsWith('Eagle')) {
    return BGM_ASSETS.EAGLE_THEME;
  }

  return BGM_ASSETS.MAIN_THEME;
};

// --- 3. 音频处理逻辑 (Audio Logic) ---

// 音频对象池，避免重复创建 Audio 实例导致的延迟
const sfxPool: Record<string, HTMLAudioElement[]> = {};

/**
 * 平滑淡入淡出音量
 */
export const fadeAudio = (audio: HTMLAudioElement, targetVolume: number, duration = 1000) => {
  const startVolume = audio.volume;
  const diff = targetVolume - startVolume;
  const startTime = performance.now();

  const step = (currentTime: number) => {
    const progress = Math.max(0, Math.min((currentTime - startTime) / duration, 1));
    audio.volume = Math.max(0, Math.min(1, startVolume + diff * progress));

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

/**
 * 播放单次音效 (优化版：低延迟对象池 + 智能中断)
 */
export const playSFX = (url: string, isMuted: boolean, volume = 0.3) => {
  if (isMuted || !url || url.includes("base64")) return;
  
  if (!sfxPool[url]) sfxPool[url] = [];
  
  // 对于 CLICK 这类频繁触发的音效，我们寻找是否已有正在播放的实例
  // 如果有，强行重置，防止声音堆叠导致听感混乱
  let sfx = sfxPool[url].find(a => !a.paused && !a.ended);
  
  if (sfx) {
    sfx.currentTime = 0; // 强行拉回起点，实现“重置”而不是“堆叠”
    sfx.volume = volume;
    sfx.play().catch(() => {});
    return;
  }

  // 如果没有正在播放的，则找一个空闲的或者创建新的
  sfx = sfxPool[url].find(a => a.paused || a.ended);
  
  if (!sfx) {
    sfx = new Audio(url);
    sfx.preload = "auto";
    sfxPool[url].push(sfx);
  }
  
  sfx.currentTime = 0;
  sfx.volume = volume;
  sfx.play().catch((e) => console.log("SFX play blocked or pending:", e));
};
