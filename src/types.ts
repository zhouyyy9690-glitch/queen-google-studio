// --- 核心数据结构定义 ---

// 玩家选项接口：定义了剧情分支、解释说明及相关的逻辑标记
export interface Choice {
  text: string;           // 选项显示的文本
  nextSceneId?: string;   // 选择后跳转到的场景 ID
  nextStageId?: string;   // 选择后跳转到的阶段 ID (用于 Event 模式)
  explanation?: string;   // 选项背后的深层含义解释 (用于显示解释弹窗)
  animalType?: 'fox' | 'deer' | 'eagle' | 'destiny'; // 选项归属的路径属性
  condition?: string | any | ((state: any) => boolean);      // 触发该选项需要满足的标记条件
  setFlags?: Record<string, any>; // 选择后需设置的状态标记
  affect?: Record<string, number>; // 快速增减角色好感度 (如 { finn: 5, george: -2 })
  actions?: any[];        // 选择后执行的结构化动作列表
  onSelect?: (state: any) => void; // 选择后的回调逻辑
  sfx?: string;           // 选择时的音效
}

export interface Stage {
  id: string;
  desc: string[];
  choices: Choice[];
}

export interface EventConfig {
  startStage: string;
  stages: Record<string, Stage>;
  onComplete: string;
}

export interface Paragraph {
  text: string;
  isDialogue?: boolean;
  isThought?: boolean;
}

export interface TextSegment {
  text: string;
  className?: string;
  isDialogue?: boolean;
}

export type ParticleType = 'snow' | 'dust' | 'evening' | 'nature' | 'ink' | 'none';

// 场景定义接口：描述了游戏中的每一个环节，包括文本、立绘风格、环境粒子等
export interface Scene {
  id: string;             // 场景唯一标识符
  title: string;          // 场景标题
  description?: string;    // 场景背景描述
  explanation?: string;   // 场景整体的隐藏解释
  paragraphs?: Paragraph[]; // 场景内的段落文本
  event?: EventConfig;    // 复杂的交互事件配置 (如多阶段选择)
  choices?: Choice[];     // 该场景下的玩家可选项
  onEnter?: (state: any) => void; // 进入场景时的回调逻辑
  isEnding?: boolean;     // 标记是否为结局场景
  isChapter?: boolean;    // 标记是否为章节标题封面
  chapterNumber?: string; // 章节编号 (如 "CAPVT I")
  chapterSubtitle?: string; // 章节副标题
  bgm?: string;           // 背景音乐标识 (通用/旧版兼容)
  music?: string;         // 情感旋律层 (用于特定心理描写或关键转折)
  ambience?: string;      // 环境背景层 (用于地理环境、自然音效)
  particleType?: ParticleType; // 环境粒子特效类型
}

export interface CharacterUpdate {
  atScene: string;
  description: string;
  title?: string;
  name?: string;
  nameEn?: string;
}

// 角色定义接口：用于在“人物志”中显示
export interface Character {
  id: string;             // 角色 ID
  name: string;           // 中文名
  nameEn: string;         // 英文名/头衔
  title: string;          // 主标题
  description: string;    // 基础背景描述
  updates?: CharacterUpdate[]; // 随着剧情推进而解锁的额外描述
  unlockedAt: string | string[]; // 解锁该角色的场景 ID
  iconType: 'fox' | 'sword' | 'eagle' | 'bear' | 'tiger' | 'ring' | 'user' | 'scroll' | 'shield' | 'heart' | 'moon'; // 显示的图标类型
  path?: 'fox' | 'deer' | 'eagle' | 'destiny' | 'all' | 'common'; // 所属剧情路径
  matchNames?: string[];  // 剧情文本中用于自动高亮的匹配词
  
  // NEW: 关系网扩展
  relations?: {
    to: string;       // 目标角色 ID
    type: 'kin' | 'ally' | 'enemy' | 'vassal' | 'spouse' | 'master' | 'friend';
    label: string;    // 关系显示标签 (如 "血亲", "政治盟友")
  }[];
  positionHint?: { x: number; y: number }; // 在关系网中的大致坐标 (0-100)
}

// 地点定义接口：用于地图显示与地点志
export interface Location {
  id: string;             // 地点 ID
  name: string;           // 地点名称
  faction: string;        // 所属势力
  description: string;    // 地点志描述
  ruler?: string;         // 统治者
  x: number;              // 地图 X 坐标 (0-100 百分比)
  y: number;              // 地图 Y 坐标 (0-100 百分比)
  path?: 'fox' | 'deer' | 'eagle' | 'all'; // 所属剧情路径
  region?: 'North' | 'West' | 'South' | 'East' | 'Central'; // 所属大区
  parentId?: string;      // 父级区域 ID (用于归属关系显示)
  isRegionLabel?: boolean; // 是否仅作为大区标签使用
  isSubRegion?: boolean;  // 是否为子区域/领地
  matchNames?: string[];  // 剧情文本中用于自动高亮的匹配词
}

export interface GameData {
  initialScene: string;
  scenes: Record<string, Scene>;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  matchPatterns: string[];
  locationId?: string; // Optional: Link to a specific location on the map
}
