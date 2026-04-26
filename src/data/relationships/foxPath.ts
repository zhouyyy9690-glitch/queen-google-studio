/**
 * 狐狸线人际关系注册表 (Fox Path Relationship Registry)
 * 用于追踪狐狸线角色的好感度、特殊事件及关系演变。
 */

export interface RelationshipRegistry {
  [characterId: string]: {
    baseAffinity: number;
    milestones: string[];
    currentPerception: string;
    hiddenTags?: string[];
  };
}

export const foxRelationships: RelationshipRegistry = {
  'melisande': {
    baseAffinity: 22,
    milestones: ['新的女王 - 伴归之路'],
    currentPerception: '作为瓦列家的长女，她正以同龄人少有的沉稳陪伴在侧。'
  },
  'finn': {
    baseAffinity: 25,
    milestones: ['绿野时光', '新的女王 - 红袍卫士'],
    currentPerception: '来自绿野的挚友。无论在何处，他始终是你唯一的温暖。'
  },
  'valantir': {
    baseAffinity: 3,
    milestones: ['新的女王 - 车队起程'],
    currentPerception: '深不可测的总主教，目前对你仅维持着公事公办的敬意。'
  },
  'durin': {
    baseAffinity: 0,
    milestones: ['新的女王 - 北境的回响'],
    currentPerception: '尚未谋面的北境公爵。从少女们的闲谈中，你对他勾勒出了一个沉默、高大且传统的模糊轮廓。'
  },
  'quintis': {
    baseAffinity: 0,
    milestones: ['新的女王 - 欢迎归家'],
    currentPerception: '慈爱的执事大主教。他在所有人面前展露出的温厚与虔诚，总让你联想到被蜜糖包裹的陷阱。'
  },
  'roderick': {
    baseAffinity: 1,
    milestones: ['新的女王 - 猩红卫士'],
    currentPerception: '红袍卫队的指挥官。他的忠诚似乎比钢铁还要冰冷，但也正如钢铁般难以撼动。'
  },
  'cayane': {
    baseAffinity: 2,
    milestones: ['新的女王 - 红堡之门'],
    currentPerception: '肤色特别的红袍卫士，琥珀色的眼睛里总是带着一丝懒散和玩世不恭。'
  },
  'jasper': {
    baseAffinity: 1,
    milestones: ['新的女王 - 红堡之门'],
    currentPerception: '沉默寡言，且脸上带有醒目伤疤的男人。他是米瑞斯马雷侯爵的长子，却选择了红袍。'
  },
  'corbin': {
    baseAffinity: 1,
    milestones: ['新的女王 - 红堡之门'],
    currentPerception: '气质温和的红袍卫士。在这一众严肃或怪异的同僚中，他的存在让你感到难得的安心。'
  },
  'hammond': {
    baseAffinity: 0,
    milestones: ['新的女王 - 枢密院门前'],
    currentPerception: '前任枢密院大臣，以公正和古板闻名。他似乎对你这位“从天而降”的女王抱有某种审视的态度。'
  },
  'augustin': {
    baseAffinity: 0,
    milestones: ['新的女王 - 枢密院'],
    currentPerception: '礼仪大臣，负责筹备加冕典礼。他是一个对细节近乎偏执的男人。'
  },
  'gregor': {
    baseAffinity: 0,
    milestones: ['新的女王 - 枢密院'],
    currentPerception: '财务大臣。他的目光总是像在计算每颗宝石的价值。'
  },
  'aldous': {
    baseAffinity: 0,
    milestones: ['新的女王 - 枢密院'],
    currentPerception: '刑律大臣。他的冷峻甚至超过了圣堂的石砖。'
  },
  'alice': {
    baseAffinity: 5,
    milestones: ['新的女王 - 午餐'],
    currentPerception: '你的贴身女仆。她总是能精准地捕捉到你微小的情绪波动。'
  },
  'samia': {
    baseAffinity: 2,
    milestones: ['新的女王 - 休息室'],
    currentPerception: '萨米娅修女。她温和的面容下似乎隐藏着某些不为人知的秘密。'
  }
};
