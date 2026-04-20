import { Insight } from './types';

export const insights: Insight[] = [
  // --- General Lore ---
  {
    id: 'fox_legend',
    title: '白狐传略',
    description: '关于白狐在北境雪原出没的古老传说，被视为祥瑞或灾厄的征兆。',
    matchPatterns: ['白狐', '极北高原的传说']
  },
  {
    id: 'kings_illness',
    title: '征服王的病情',
    description: '有关征服王赫西身体状况的各种揣测，由于王室封锁消息，真相扑朔迷离。',
    matchPatterns: ['国王的病情', '老国王的情况']
  },
  {
    id: 'black_river_poetry',
    title: '黑河诗篇',
    description: '南境流传的描写黑河景致的诗词，常被文人墨客引为感怀之作。',
    matchPatterns: ['黑河的诗', '达里安的诗句']
  },
  {
    id: 'forbidden_ritual',
    title: '学术界的禁忌',
    description: '学士会议中被明令禁止研究的失禁仪式，据说涉及灵魂的禁锢。',
    matchPatterns: ['禁断仪式', '失传的古籍']
  },

  // --- Location Rumors (Migrated from locations.ts) ---
  {
    id: 'rumor_kase_1',
    title: '王储之争的暗流',
    description: '据说老国王的病情正在恶化，王位继承权的阴影笼罩着凯斯。',
    matchPatterns: ['继承权', '病情正在恶化', '王储'],
    locationId: 'kase_city'
  },
  {
    id: 'rumor_kase_2',
    title: '凯斯城的陌生客',
    description: '王都的地下街区最近出现了一些陌生的异邦人。',
    matchPatterns: ['异邦人', '地下街区', '陌生的面孔'],
    locationId: 'kase_city'
  },
  {
    id: 'rumor_holy_1',
    title: '圣所的黑影',
    description: '有人看到深夜里有黑影出入大教堂的地下圣所。',
    matchPatterns: ['地下圣所', '圣所的影', '深夜的访客'],
    locationId: 'holy_spring'
  },
  {
    id: 'rumor_sage_1',
    title: '失落的仪式研究',
    description: '学士们正在秘密研究某种失传已久的禁断仪式。',
    matchPatterns: ['秘密研究', '失传已久', '贤者堡的秘密'],
    locationId: 'sages_keep'
  },
  {
    id: 'rumor_velis_1',
    title: '银岸的军备',
    description: '哈蒙德公爵正暗中扩充雇佣军规模。',
    matchPatterns: ['扩充雇佣军', '维利斯的兵力', '雇佣兵'],
    locationId: 'velis_capital'
  },
  {
    id: 'rumor_creek_1',
    title: '溪木堡的贵客',
    description: '听说这里居住着一位身份高贵的小姐。',
    matchPatterns: ['高贵的小姐', '溪木堡的秘密', '公主殿下'],
    locationId: 'creekwood_castle'
  },
  {
    id: 'rumor_valles_1',
    title: '频繁的渡鸦',
    description: '瓦列堡的渡鸦最近往返凯斯的次数异常频繁。',
    matchPatterns: ['往返凯斯', '渡鸦', '密信传递'],
    locationId: 'valles_keep'
  },
  {
    id: 'rumor_lesdos_1',
    title: '丰收的愁绪',
    description: '今年的葡萄收成很好，但伯爵似乎并不开心。',
    matchPatterns: ['伯爵似乎并不开心', '雷斯多伯爵的忧虑'],
    locationId: 'lesdos_territory'
  },
  {
    id: 'rumor_iron_1',
    title: '霜之子的幻影',
    description: '有人声称在积雪深处看到了传说中的霜之子。',
    matchPatterns: ['霜之子', '雪原的白影', '铁脊峰的传说'],
    locationId: 'iron_peaks'
  },
  {
    id: 'rumor_plateau_1',
    title: '高原的祭典',
    description: '高原上的部落正在举行不同寻常的大规模祭祀。',
    matchPatterns: ['大规模祭祀', '祭礼', '部落的动向'],
    locationId: 'north_plateau'
  },
  {
    id: 'rumor_ridge_1',
    title: '银脊的走私线',
    description: '山脉中的哨岗报告发现了不少形迹可疑的走私者。',
    matchPatterns: ['走私者', '哨岗报告', '银脊山的阴影'],
    locationId: 'silver_ridge'
  },
  {
    id: 'rumor_sea_1',
    title: '移动之岛的传说',
    description: '水手们流传着关于黎明海深处有一座会移动的岛屿的说法。',
    matchPatterns: ['会移动的岛屿', '海上的传说', '消失的岛'],
    locationId: 'dawn_sea'
  }
];
