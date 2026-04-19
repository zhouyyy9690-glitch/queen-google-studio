import { Location } from './types';

// 地点数据定义：包含所有在地图上显示的区域标签与具体地点
export const locations: Location[] = [
  // --- 区域标签 (REGION LABELS) ---
  // 这些数据主要用于在地图上绘制大范围的文字标识
  {
    id: 'reg_north',
    name: '北境 · The North',
    faction: '阿尔摩恩家族 (House Almoen)',
    description: '征服王国的北方边境，由北境大公爵暨全境守护者阿尔摩恩家族统治。这里地形险峻，多高山与高原，气候寒冷。',
    x: 50,
    y: 15,
    path: 'all',
    region: 'North',
    isRegionLabel: true,
    matchNames: ['北境']
  },
  {
    id: 'reg_west',
    name: '西境 · The West',
    faction: '哈蒙德家族 (House Hammond)',
    description: '毗邻琥珀海 (Amber Sea)，拥有富庶的海港与繁荣的贸易。西境大公爵暨全境守护哈蒙德家族以此为据点。',
    x: 20,
    y: 50,
    path: 'all',
    region: 'West',
    isRegionLabel: true,
    matchNames: ['西境']
  },
  {
    id: 'reg_central',
    name: '中央河间地 · Riverlands',
    faction: '赫西王室 (House Hersey)',
    description: '王国的核心地带，坐落着宏伟的王城凯斯。这里河流纵横，是政治与宗教的中心。',
    x: 50,
    y: 45,
    path: 'all',
    region: 'Central',
    isRegionLabel: true,
    matchNames: ['中央河间地', '河间地']
  },
  {
    id: 'reg_south',
    name: '南境',
    faction: '斯特莱家族 (House Stray)',
    description: '征服王国的粮仓，多平原、河流、耕地与森林。南境大公爵暨全境守护斯特莱家族统治着这片丰饶的土地。',
    x: 50,
    y: 80,
    path: 'all',
    region: 'South',
    isRegionLabel: true,
    matchNames: ['南境']
  },
  {
    id: 'reg_east',
    name: '东境 · The East',
    faction: '萨拉赫家族 (House Salah)',
    description: '地形复杂的东方疆域，由东境大公爵暨全境守护萨拉赫家族治理。越过银脊山脉后便是广阔的黎明海 (Dawn Sea)。',
    x: 80,
    y: 50,
    path: 'all',
    region: 'East',
    isRegionLabel: true,
    matchNames: ['东境']
  },

  // --- 具体地点 (SPECIFIC LOCATIONS) ---
  // 每个地点包含坐标 (x, y)、所属势力、统治者及剧情匹配关键词
  
  // 中央河间地 (Central)
  {
    id: 'kase_city',
    name: '王城',
    faction: '赫西王室',
    description: '征服王国的首都，坐落于中央河间地。它是权力的巅峰，也是所有阴谋与荣耀的终点。',
    ruler: '征服王 劳顿·赫西',
    x: 50,
    y: 40,
    path: 'all',
    region: 'Central',
    matchNames: ['王城', '凯斯']
  },
  {
    id: 'holy_spring',
    name: '凯斯大圣堂',
    faction: '七神教会',
    description: '位于王城凯斯之内的宏伟建筑，是征服王国宗教信仰的中心。南境总主教瓦兰提尔·诺恩的许多密令皆源于此。',
    ruler: '大主教 昆提斯·德罗斯特',
    x: 52,
    y: 42,
    path: 'all',
    region: 'Central',
    matchNames: ['凯斯大教堂', '大圣堂']
  },
  // ... 其他地点数据以此类推
  {
    id: 'oakport_cathedral',
    name: '橡港大教堂',
    faction: '七神教会',
    description: '位于南境重要港口城市橡港的大教堂，是南境总主教瓦兰提尔·诺恩的驻地。',
    ruler: '瓦兰提尔·诺恩',
    x: 60,
    y: 85,
    path: 'fox',
    region: 'South',
    matchNames: ['橡港']
  },
  {
    id: 'sages_keep',
    name: '贤者堡',
    faction: '学士会议',
    description: '位于王城内的学术中心，德雷大学士在此工作，存放着大量的古籍与文书。',
    ruler: '德雷大学士 (Archmaester Dre)',
    x: 48,
    y: 42,
    path: 'deer',
    region: 'Central',
    matchNames: ['贤者堡']
  },

  // West
  {
    id: 'velis_capital',
    name: '维利斯 (Velis)',
    faction: '哈蒙德家族',
    description: '西境的首都，银岸诸城中最璀璨的明珠。作为富庶的海港，它掌控着琥珀海的贸易命脉。',
    ruler: '哈蒙德大公 (Duke Hammond)',
    x: 15,
    y: 45,
    path: 'all',
    region: 'West',
    matchNames: ['维利斯']
  },
  {
    id: 'silver_shore',
    name: '银岸诸城',
    faction: '自由城市集群',
    description: '西境沿海的一系列自由城市，以精湛的工艺 and 繁荣的商业著称。',
    x: 10,
    y: 55,
    path: 'all',
    region: 'West',
    matchNames: ['银岸诸城', '银岸']
  },
  {
    id: 'amber_sea',
    name: '琥珀海 (Amber Sea)',
    faction: '中立',
    description: '位于王国西侧的广阔海域，是连接外界的重要贸易航道。',
    x: 5,
    y: 30,
    path: 'all',
    region: 'West',
    matchNames: ['琥珀海']
  },

  // South
  {
    id: 'verdant_vale',
    name: '翠谷 · Verdant Vale',
    faction: '赫西王室',
    description: '南境北部的一片丰饶子区域，气候宜人，绿意盎然。溪木堡、瓦列堡等重要地标皆坐落于此谷地之中。这里曾是赫西王室的私有猎场，也是公主成长的地方。',
    x: 46,
    y: 64,
    path: 'all',
    region: 'South',
    isRegionLabel: true,
    isSubRegion: true,
    matchNames: ['翠绿谷地', '翠谷']
  },
  {
    id: 'creekwood_castle',
    name: '溪木堡',
    faction: '赫西王室 (夏宫)',
    description: '位于翠谷腹地，是凯瑟琳公主长大的地方。这里绿野环绕，远离王城的喧嚣。城堡本身就是王室的夏宫。',
    ruler: '凯瑟琳公主',
    x: 45,
    y: 65,
    path: 'fox',
    region: 'South',
    parentId: 'verdant_vale',
    matchNames: ['溪木堡']
  },
  {
    id: 'grove_village',
    name: '林谷村',
    faction: '南境平民领',
    description: '紧邻溪木堡的小村庄，中间只隔着一座茂密的森林。芬因·里德与他的母亲爱琳居住于此。',
    x: 47,
    y: 67,
    path: 'fox',
    region: 'South',
    parentId: 'verdant_vale',
    matchNames: ['林谷村']
  },
  {
    id: 'lancani_falls',
    name: '兰卡尼瀑布',
    faction: '自然景观',
    description: '位于翠谷深处的宏伟瀑布，瀑流水声如同一首歌，陪伴着凯瑟琳的成长。',
    x: 44,
    y: 63,
    path: 'fox',
    region: 'South',
    parentId: 'verdant_vale',
    matchNames: ['兰卡尼瀑布', '瀑布']
  },
  {
    id: 'mount_bendi',
    name: '本迪山',
    faction: '自然景观',
    description: '翠谷远处的雄伟山脉，其走势形如睡狮与卧剑，是南境北方的重要地理坐标。',
    x: 48,
    y: 60,
    path: 'fox',
    region: 'South',
    parentId: 'verdant_vale',
    matchNames: ['本迪山']
  },
  {
    id: 'valles_keep',
    name: '瓦列堡',
    faction: '瓦列家族',
    description: '瓦列堡家族的根据地，位于翠谷西侧，也是南境主道与林路的交汇处。这里的学士消息灵通。',
    ruler: '瓦列男爵 (Baron Valles)',
    x: 42,
    y: 67,
    path: 'fox',
    region: 'South',
    parentId: 'verdant_vale',
    matchNames: ['瓦列堡']
  },
  {
    id: 'lesdos_territory',
    name: '雷斯多领地',
    faction: '雷斯多家族',
    description: '红鹿之路的起点，雷斯多伯爵的封地。这里有连绵的葡萄园和静静流淌的黑河。',
    ruler: '雷斯多伯爵 (Earl Lesdos)',
    x: 55,
    y: 75,
    path: 'deer',
    region: 'South',
    matchNames: ['雷斯多领地']
  },
  {
    id: 'black_river',
    name: '黑河',
    faction: '雷斯多家族',
    description: '流经雷斯多领地的河流。达里安在此听着河水声成长，写诗思虑。',
    x: 56,
    y: 77,
    path: 'deer',
    region: 'South',
    matchNames: ['黑河']
  },

  // North
  {
    id: 'iron_peaks',
    name: '铁脊峰',
    faction: '阿尔摩恩家族',
    description: '北境最险峻的山脉之一，终年积雪，出产高品质的铁矿。',
    ruler: '北境大公 阿尔摩恩 (Duke Almoen)',
    x: 40,
    y: 10,
    path: 'all',
    region: 'North',
    matchNames: ['铁脊峰']
  },
  {
    id: 'north_plateau',
    name: '极北高原',
    faction: '阿尔摩恩家族',
    description: '荒凉而广阔的高原，是北境游牧部落与坚韧子民的家园。',
    ruler: '北境大公 阿尔摩恩',
    x: 60,
    y: 5,
    path: 'all',
    region: 'North',
    matchNames: ['极北高原']
  },

  // East
  {
    id: 'silver_ridge',
    name: '银脊山脉',
    faction: '萨拉赫家族',
    description: '横跨东境的雄伟山脉，是通往黎明海的天然屏障。',
    ruler: '东境大公 萨拉赫 (Duke Salah)',
    x: 75,
    y: 45,
    path: 'all',
    region: 'East',
    matchNames: ['银脊山脉']
  },
  {
    id: 'dawn_sea',
    name: '黎明海 (Dawn Sea)',
    faction: '中立',
    description: '王国东方的无尽大海，传说中太阳升起的地方 Boris。',
    ruler: '无 (公海)',
    x: 90,
    y: 30,
    path: 'all',
    region: 'East',
    matchNames: ['黎明海']
  }
];
