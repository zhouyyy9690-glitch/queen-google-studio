/**
 * 🏰 《绯红女王》音频资源与逻辑管理中心
 * 
 * 这里的逻辑遵循：特定设置优先 > 章节主题保底。
 */

// --- 1. 核心音效资源 (SFX) ---
export const SFX_ASSETS = {
  CLICK: "https://cdn.pixabay.com/audio/2022/03/10/audio_017c747e3d.mp3",
  PAGE_TURN: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==",
  DOOR_OPEN: "https://cdn.pixabay.com/download/audio/2025/12/19/audio_af89e72c6a.mp3?filename=dragon-studio-open-door-stock-sfx-454246.mp3",
  UNLOCK: "https://cdn.pixabay.com/audio/2021/08/04/audio_3d98d2495d.mp3", // 清脆的竖琴拨弦
};

// --- 2. 背景音乐资源库 (BGM Assets Library) ---
export const BGM_ASSETS = {
  // 【各路线 核心主题曲】
  MAIN_THEME: "https://cdn.pixabay.com/download/audio/2024/08/31/audio_2120f21e75.mp3?filename=deuslower-medieval-ambient-236809.mp3",
  FOX_CH2_THEME: "https://cdn.pixabay.com/audio/2025/10/27/audio_dc93b69db8.mp3",
  DEER_THEME: "https://cdn.pixabay.com/download/audio/2026/03/19/audio_54cbf38413.mp3?filename=watermelon_beats-medieval-folk-music-505203.mp3",
  SPINDLE_THEME: "https://cdn.pixabay.com/audio/2025/10/10/audio_970460aa1a.mp3",
  EAGLE_THEME: "https://cdn.pixabay.com/download/audio/2024/09/01/audio_7335689da6.mp3?filename=dark-medieval-ambient-237070.mp3",

  // 【特定场景/功能 气氛音乐】
  MYSTERY: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==",
  CHAPTER2_DROST_MELODY: "https://cdn.pixabay.com/audio/2025/06/13/audio_c45365ddc9.mp3",
  CHAPTER2_RUMOR_MELODY: "https://cdn.pixabay.com/audio/2025/06/26/audio_a252a9ac32.mp3",
  CHAPTER2_FERRY_MELODY: "https://cdn.pixabay.com/audio/2025/05/16/audio_967a4a358c.mp3",
};

// --- 3. 特定场景音乐映射 (Override Config) ---
// 如果场景希望播放非主题曲，请在此处按章节归类添加。
export const SCENE_BGM_CONFIG: Record<string, string> = {
  // [主界面]
  "start": BGM_ASSETS.MAIN_THEME,

  // [狐狸序章 (Chapter 1) 特定音乐]
  // "F29-Specific": BGM_ASSETS.MYSTERY,

  // [新的女王 (Chapter 2) 特定音乐]
  "F49-ThreeRiddlesFerry": BGM_ASSETS.CHAPTER2_FERRY_MELODY,
  "F56-HammondTopic": BGM_ASSETS.CHAPTER2_RUMOR_MELODY,
  "F53-OuterCityArrival": BGM_ASSETS.CHAPTER2_DROST_MELODY,
  "F53-1-Welcome": BGM_ASSETS.CHAPTER2_DROST_MELODY,
  "F54-ArchbishopWords": BGM_ASSETS.CHAPTER2_DROST_MELODY,
};

// --- 4. 章节识别与主题曲自动分配逻辑 ---
/**
 * 根据场景 ID 或路线标识，明确划分章节边界。
 * 您可以随时告诉我调整 ID 的范围。
 */
export const getChapterTheme = (sceneId: string): string => {
  if (sceneId === 'start') return BGM_ASSETS.MAIN_THEME;

  // --- 狐狸线 (Fox Path) ---
  if (sceneId.startsWith('F') || sceneId === 'Act2ChapterSplash') {
    const numMatch = sceneId.match(/F(\d+)/);
    const num = numMatch ? parseInt(numMatch[1]) : 0;
    
    // 【狐狸线・序章 (Prologvs)：从 F1 到 F47】
    // 逻辑：绿野王女 (Chapter 0) 自动播放 MAIN_THEME
    if (num > 0 && num < 48) {
      return BGM_ASSETS.MAIN_THEME;
    }

    // 【狐狸线・第一章 (Capvt I)：从 F48 到 F100+】
    // 逻辑：新的女王 (Chapter 1) 自动播放 FOX_CH2_THEME
    if (num >= 48 || sceneId === 'Act2ChapterSplash') {
      return BGM_ASSETS.FOX_CH2_THEME;
    }
  }

  // --- 红鹿线 (Deer Path) ---
  // 常驻前缀为 'd'
  if (sceneId.startsWith('d')) {
    return BGM_ASSETS.DEER_THEME;
  }

  // --- 纺锤线 (Spindle Path) ---
  // 前缀为 'S' 或特定 ID
  if (sceneId.startsWith('S') || sceneId === 'Destiny' || sceneId === 'Spindle') {
    return BGM_ASSETS.SPINDLE_THEME;
  }

  // --- 黑鹰线 (Black Eagle Path) ---
  // 前缀为 'e' 或 'Eagle'
  if (sceneId.startsWith('e') || sceneId.startsWith('Eagle')) {
    return BGM_ASSETS.EAGLE_THEME;
  }

  // 万能保底：游戏主题曲
  return BGM_ASSETS.MAIN_THEME;
};

// --- 5. 音频播放与控制逻辑 (Audio Engine) ---
const sfxPool: Record<string, HTMLAudioElement[]> = {};

export const fadeAudio = (audio: HTMLAudioElement, targetVolume: number, duration = 1000) => {
  const startVolume = audio.volume;
  const diff = targetVolume - startVolume;
  const startTime = performance.now();
  const step = (currentTime: number) => {
    const progress = Math.max(0, Math.min((currentTime - startTime) / duration, 1));
    audio.volume = Math.max(0, Math.min(1, startVolume + diff * progress));
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

export const playSFX = (url: string, isMuted: boolean, volume = 0.3) => {
  if (isMuted || !url || url.includes("base64")) return;
  if (!sfxPool[url]) sfxPool[url] = [];
  let sfx = sfxPool[url].find(a => !a.paused && !a.ended);
  if (sfx) {
    sfx.currentTime = 0;
    sfx.volume = volume;
    sfx.play().catch(() => {});
    return;
  }
  sfx = sfxPool[url].find(a => a.paused || a.ended);
  if (!sfx) {
    sfx = new Audio(url);
    sfx.preload = "auto";
    sfxPool[url].push(sfx);
  }
  sfx.currentTime = 0;
  sfx.volume = volume;
  sfx.play().catch((e) => console.log("SFX error:", e));
};
