export interface Choice {
  text: string;
  nextSceneId?: string;
  nextStageId?: string;
  explanation?: string;
  animalType?: 'fox' | 'deer' | 'eagle' | 'destiny';
  condition?: string;
  setFlags?: Record<string, any>;
  sfx?: string;
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

export interface Scene {
  id: string;
  title: string;
  description: string;
  explanation?: string;
  paragraphs?: Paragraph[];
  event?: EventConfig;
  choices?: Choice[];
  isEnding?: boolean;
  bgm?: string;
}

export interface CharacterUpdate {
  atScene: string;
  description: string;
  title?: string;
}

export interface Character {
  id: string;
  name: string;
  title: string;
  description: string;
  updates?: CharacterUpdate[];
  unlockedAt: string | string[];
  iconType: 'fox' | 'sword' | 'eagle' | 'bear' | 'tiger' | 'ring' | 'user' | 'scroll' | 'shield' | 'heart';
  path?: 'fox' | 'deer' | 'eagle' | 'all' | 'common';
}

export interface Location {
  id: string;
  name: string;
  faction: string;
  description: string;
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
  path?: 'fox' | 'deer' | 'eagle' | 'all';
}

export interface GameData {
  initialScene: string;
  scenes: Record<string, Scene>;
}
