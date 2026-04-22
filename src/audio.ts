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
// 如果场景中没有定义 bgm，系统会优先从此表查找。
// 这样你可以在一个地方统一管理所有场景的配乐。

export const SCENE_BGM_CONFIG: Record<string, string> = {
  "start": BGM_ASSETS.MAIN_THEME,
  
  // 狐狸之路
  "F1-fox": BGM_ASSETS.MAIN_THEME,
  
  // 红鹿之路 (Deer Path)
  "d1-deer": BGM_ASSETS.DEER_THEME,
  "d2-CarriageTalk": BGM_ASSETS.DEER_THEME,
  "d2-1-DeanHammond": BGM_ASSETS.DEER_THEME,
  "d2-2-GeorgeHammond": BGM_ASSETS.DEER_THEME,
  "d3-Dissatisfied": BGM_ASSETS.DEER_THEME,
  "d3-1-ScholarNeed": BGM_ASSETS.DEER_THEME,
  "d4-EnterCity": BGM_ASSETS.DEER_THEME,
  "d4-EnterCity-1": BGM_ASSETS.DEER_THEME,
  
  // 纺锤之路 (Spindle Path)
  "Destiny": BGM_ASSETS.SPINDLE_THEME,
  
  // 示例：特定场景使用神秘音乐
  // "F29-AutoKnight": BGM_ASSETS.MYSTERY,
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
