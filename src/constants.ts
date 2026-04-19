import { Leaf, Crown, Shield } from 'lucide-react';

export const STORAGE_KEYS = {
  SAVE_DATA: 'hersey_save_data',
  UNLOCKED_CHAPTERS: 'hersey_unlocked_chapters',
  CHAPTER_SNAPSHOTS: 'hersey_chapter_snapshots'
};

export const CHAPTERS_CONFIG = [
  {
    id: 'act1',
    number: 'PROLOGVS',
    title: '绿野王女',
    subtitle: 'THE GREENFIELD PRINCESS',
    description: '赫西之女，漂泊乡野。在那段宁静而危险的日子里，命运的齿轮悄然转动。',
    icon: Leaf,
    color: 'emerald',
    startSceneId: 'start',
    mapFocus: { x: -300, y: -200, scale: 1.8 }, // Emerald Valley focus
    regionLabels: ['翠谷 · Verdant Vale'],
    highlightLocations: ['creekwood_castle', 'grove_village', 'lancani_falls']
  },
  {
    id: 'act2',
    number: 'CAPVT I',
    title: '新的女王',
    subtitle: 'REGINA NOVA',
    description: '阔别十四载，重回王城。冠冕之下，是权谋的暗流与注定孤寂的王座。',
    icon: Crown,
    color: 'amber',
    startSceneId: 'Act2ChapterSplash',
    mapFocus: { x: 50, y: 150, scale: 2.2 }, // Capital focus
    regionLabels: ['中央河间地 · Riverlands'],
    highlightLocations: ['kase_city', 'holy_spring', 'sages_keep']
  },
  {
    id: 'act3',
    number: 'CAPVT II',
    title: '冠冕与誓言',
    subtitle: 'CORONA ET VOTVM',
    description: '（筹备中）古老的誓言在铁神面前重燃，唯有牺牲方能换取真正的救赎。',
    icon: Shield,
    color: 'rose',
    startSceneId: 'act3-start',
    mapFocus: { x: -100, y: -500, scale: 1.5 }, // Northern Fortress focus
    regionLabels: ['北境 · The North'],
    highlightLocations: ['iron_peaks', 'north_plateau']
  }
];
