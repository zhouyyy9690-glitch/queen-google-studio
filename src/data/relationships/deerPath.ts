/**
 * 鹿线人际关系注册表 (Deer Path Relationship Registry)
 * 用于追踪鹿线角色的好感度、特殊事件及关系演变。
 */

export interface RelationshipRegistry {
  [characterId: string]: {
    baseAffinity: number;
    milestones: string[];
    currentPerception: string;
    hiddenTags?: string[];
  };
}

export const deerRelationships: RelationshipRegistry = {
  // 用户后续填充内容
};
