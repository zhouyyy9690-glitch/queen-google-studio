/**
 * 🏰 《绯红女王》音效与背景音乐管理系统
 * 
 * 此文件负责管理游戏中所有的音频资源映射、淡入淡出逻辑及播放控制。
 */

// --- 1. 音频资源库 (Assets Library) ---

// 使用静音数据 URI 作为占位符，防止 403 错误干扰测试
const SILENT_SOUND = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";

export const BGM_ASSETS = {
  // 由于本地上传文件损坏/为空，切换至高品质云端古典乐 (肖邦/史诗风格)
  // 这首曲子非常符合《绛红女王》的宫廷权谋氛围
  MAIN_THEME: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  
  // 推荐：教堂/神秘感 (仪式/重要转折)
  MYSTERY: SILENT_SOUND, 
};

export const SFX_ASSETS = {
  // 暂时使用静音，直到您上传自己的音效
  CLICK: SILENT_SOUND,
  PAGE_TURN: SILENT_SOUND,
};

// --- 2. 场景与 BGM 对应表 (Scene BGM Mapping) ---
// 如果场景中没有定义 bgm，系统会优先从此表查找。
// 这样你可以在一个地方统一管理所有场景的配乐。

export const SCENE_BGM_CONFIG: Record<string, string> = {
  "start": BGM_ASSETS.MAIN_THEME,
  
  // 狐狸之路
  "F1-fox": BGM_ASSETS.MAIN_THEME,
  
  // 红鹿之路
  "d1-deer": BGM_ASSETS.MAIN_THEME,
  
  // 示例：特定场景使用神秘音乐
  // "F29-AutoKnight": BGM_ASSETS.MYSTERY,
};

// --- 3. 音频处理逻辑 (Audio Logic) ---

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
 * 播放单次音效
 */
export const playSFX = (url: string, isMuted: boolean) => {
  if (isMuted) return;
  const sfx = new Audio(url);
  sfx.volume = 0.3; // SFX 默认音量
  sfx.play().catch((e) => console.log("SFX play blocked:", e));
};
