/**
 * 🏰 《绯红女王》音频资源与逻辑管理中心
 * 
 * 这里的逻辑遵循：特定设置优先 > 章节主题保底。
 */

// --- 1. 核心音效资源 (SFX) ---
export const SFX_ASSETS = {
  CLICK: "https://cdn.pixabay.com/audio/2022/03/10/audio_017c747e3d.mp3",
  PAGE_TURN: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==",
  DOOR_OPEN: "https://cdn.pixabay.com/audio/2025/12/19/audio_af89e72c6a.mp3",
  UNLOCK: "https://cdn.pixabay.com/audio/2021/08/04/audio_3d98d2495d.mp3", // 清脆的竖琴拨弦
};

// --- 2. 背景音乐资源库 (BGM Assets Library) ---
export const BGM_ASSETS = {
  // 【各路线 核心主题曲】
  MAIN_THEME: "https://cdn.pixabay.com/audio/2024/08/31/audio_2120f21e75.mp3",
  FOX_CH0_THEME: "https://cdn.pixabay.com/audio/2026/03/23/audio_87a13308bf.mp3",
  FOX_CH2_THEME: "https://cdn.pixabay.com/audio/2025/10/27/audio_dc93b69db8.mp3",
  DEER_THEME: "https://cdn.pixabay.com/audio/2026/03/19/audio_54cbf38413.mp3",
  SPINDLE_THEME: "https://cdn.pixabay.com/audio/2025/10/10/audio_970460aa1a.mp3",
  EAGLE_THEME: "https://cdn.pixabay.com/audio/2024/09/01/audio_7335689da6.mp3",

  // 【芬因相关】
  FAIN_THEME: "https://cdn.pixabay.com/audio/2024/06/14/audio_a23f5f75f7.mp3",
  GARDEN_MEET: "https://cdn.pixabay.com/audio/2025/09/01/audio_c3ad9d51a7.mp3",
  DINNER_PARTY: "https://cdn.pixabay.com/audio/2023/06/16/audio_bb02473d94.mp3",

  // 【特定场景/功能 气氛音乐】
  MYSTERY: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==",
  CHAPTER2_DROST_MELODY: "https://cdn.pixabay.com/audio/2025/06/13/audio_c45365ddc9.mp3",
  CHAPTER2_RUMOR_MELODY: "https://cdn.pixabay.com/audio/2025/06/26/audio_a252a9ac32.mp3",
  CHAPTER2_FERRY_MELODY: "https://cdn.pixabay.com/audio/2025/05/16/audio_967a4a358c.mp3",
  // 🏰 红堡夜晚与黄昏的主旋律（Capvt I / Chapter 1 新的女王），用于深夜和晚宴后的探索场景
  RED_KEEP_NIGHT: "https://cdn.pixabay.com/audio/2024/01/26/audio_60ecf8aaea.mp3",
};

// --- 3. 特定场景音乐映射 (Override Config) ---
// 如果场景希望播放非主题曲，请在此处按章节归类添加。
export const SCENE_BGM_CONFIG: Record<string, string> = {
  // [主界面]
  "start": BGM_ASSETS.MAIN_THEME,

  // [狐狸序章 (Chapter 1) 特定音乐]
  // "F29-Specific": BGM_ASSETS.MYSTERY,
  "F29-AutoKnight": BGM_ASSETS.FAIN_THEME,
  "F30-KnightCeremony": BGM_ASSETS.FAIN_THEME,
  "F39-FainGoodnight": BGM_ASSETS.FAIN_THEME,

  // [新的女王 (Chapter 2) 特定音乐]
  "F117-FainVigil": BGM_ASSETS.FAIN_THEME,
  "F77-HammondDinner": BGM_ASSETS.DINNER_PARTY,
  "F103-1-withRoderickThorn": BGM_ASSETS.DINNER_PARTY,
  "F103-2-withCorbinMide": BGM_ASSETS.DINNER_PARTY,
  "F104-DinnerStart": BGM_ASSETS.DINNER_PARTY,
  "F104-1-Unbelievable": BGM_ASSETS.DINNER_PARTY,
  "F104-2-probe": BGM_ASSETS.DINNER_PARTY,
  "F104-3-yourresponse": BGM_ASSETS.DINNER_PARTY,
  "F104-4-youravoidance": BGM_ASSETS.DINNER_PARTY,
  "F97-Garden": BGM_ASSETS.GARDEN_MEET,
  "F111-CaydeEncounter": BGM_ASSETS.GARDEN_MEET,
  "F112-CorbinEncounter": BGM_ASSETS.GARDEN_MEET,
  "F113-RodrikEncounter": BGM_ASSETS.GARDEN_MEET,
  "F114-JasperEncounter": BGM_ASSETS.GARDEN_MEET,
  "F136-DarianGarden": BGM_ASSETS.GARDEN_MEET,
  "F49-ThreeRiddlesFerry": BGM_ASSETS.CHAPTER2_FERRY_MELODY,
  "F56-HammondTopic": BGM_ASSETS.CHAPTER2_RUMOR_MELODY,
  "F53-OuterCityArrival": BGM_ASSETS.CHAPTER2_DROST_MELODY,
  "F53-1-Welcome": BGM_ASSETS.CHAPTER2_DROST_MELODY,
  "F54-ArchbishopWords": BGM_ASSETS.CHAPTER2_DROST_MELODY,
};

// --- 4. 章节识别与主题曲自动分配逻辑 ---
/**
 * 获取场景背景音乐。
 * 优先级：SCENE_BGM_CONFIG 特定配置 > 章节/路线 自动分配 > 主题曲保底。
 */
export const getChapterTheme = (sceneId: string): string => {
  // 1. 优先检查特定场景映射
  if (SCENE_BGM_CONFIG[sceneId]) {
    return SCENE_BGM_CONFIG[sceneId];
  }

  if (sceneId === 'start') return BGM_ASSETS.MAIN_THEME;

  // --- 狐狸线 (Fox Path) ---
  if (sceneId.startsWith('F') || sceneId === 'Act2ChapterSplash') {
    const numMatch = sceneId.match(/F(\d+)/);
    const num = numMatch ? parseInt(numMatch[1]) : 0;
    
    // 【狐狸线・序章 (Prologvs)：从 F1 到 F47】
    // 逻辑：绿野王女 (Chapter 0) 自动播放 FOX_CH0_THEME
    if (num > 0 && num < 48) {
      return BGM_ASSETS.FOX_CH0_THEME;
    }

    // 【狐狸线・第一章 (Capvt I)：从 F48 到 F100+】
    // 逻辑：新的女王 (Chapter 1)
    // 1. 白天时间段播放 Capvt I 主题音乐 (FOX_CH2_THEME)。
    // 2. 从黄昏/夜晚（第一天傍晚 F102~117，以及第二天晚间 F137 及之后）自动切入红堡黑夜主旋律 (RED_KEEP_NIGHT)。
    // 3. 同时保持所有用户预先设定好的特殊音乐（例如晚宴 DINNER_PARTY、花园邂逅 GARDEN_MEET、深夜守夜 FAIN_THEME），这些会被最外层的 SCENE_BGM_CONFIG 或 Scene.bgm 直接优先覆盖。
    if (num >= 48 || sceneId === 'Act2ChapterSplash') {
      const isNight = (num >= 102 && num <= 117) || (num >= 137);
      return isNight ? BGM_ASSETS.RED_KEEP_NIGHT : BGM_ASSETS.FOX_CH2_THEME;
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
