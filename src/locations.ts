import { Location } from './types';

export const locations: Location[] = [
  {
    id: 'capital',
    name: '王城',
    faction: '赫西王室',
    description: '征服王国的权力中心，宏伟而古老的城市。赫西家族在此统治了数百年。',
    x: 50,
    y: 45,
    path: 'all'
  },
  {
    id: 'emerald_valley',
    name: '翠谷',
    faction: '地方教区 / 瓦列家族',
    description: '位于南境北部的宁静河谷，气候宜人，绿草如茵。凯瑟琳公主在此度过了十四年的流亡时光。',
    x: 45,
    y: 65,
    path: 'fox'
  },
  {
    id: 'brookwood_castle',
    name: '溪木堡',
    faction: '赫西王室',
    description: '坐落于翠谷之中的堡垒，曾是王室的夏宫。凯瑟琳长大的地方，充满了童年的回忆。',
    x: 44,
    y: 67,
    path: 'fox'
  },
  {
    id: 'west_march',
    name: '西境',
    faction: '哈蒙德家族',
    description: '王国的西部疆域，富庶而强大。乔治·哈蒙德公爵的领地，拥有王国三分之二的财富。',
    x: 25,
    y: 45,
    path: 'all'
  },
  {
    id: 'south_march',
    name: '南境',
    faction: '斯特莱家族',
    description: '温暖的南方，盛产美酒与果实。斯特莱伯爵统治着这片土地，是王室坚定的盟友。',
    x: 50,
    y: 80,
    path: 'all'
  },
  {
    id: 'north_march',
    name: '北境',
    faction: '阿尔摩恩家族',
    description: '寒冷的北方疆域，民风彪悍。杜林·阿尔摩恩公爵守护着王国的北大门。',
    x: 50,
    y: 15,
    path: 'all'
  },
  {
    id: 'vallet_territory',
    name: '瓦列子爵领地',
    faction: '瓦列家族',
    description: '毗邻翠谷的领地，瓦列家族世代在此为王室看守猎场，修缮夏宫。',
    x: 40,
    y: 60,
    path: 'fox'
  },
  {
    id: 'mount_bendi',
    name: '本迪山',
    faction: '自然',
    description: '势如睡狮与卧剑的雄伟山脉，守护着翠谷的安宁。',
    x: 38,
    y: 70,
    path: 'fox'
  },
  {
    id: 'lancani_falls',
    name: '兰卡尼瀑布',
    faction: '自然',
    description: '湍急的瀑布，水声如歌，是翠谷著名的自然景观。',
    x: 46,
    y: 68,
    path: 'fox'
  },
  {
    id: 'lesdos_territory',
    name: '雷斯多领地',
    faction: '雷斯多家族',
    description: '红鹿之路的起点，雷斯多伯爵的封地。这里有连绵的葡萄园和静静流淌的黑河。',
    x: 55,
    y: 75,
    path: 'deer'
  },
  {
    id: 'black_river',
    name: '黑河',
    faction: '雷斯多家族',
    description: '流经雷斯多领地的河流。达里安在此听着河水声成长，写诗思虑。',
    x: 56,
    y: 77,
    path: 'deer'
  },
  {
    id: 'sages_keep',
    name: '贤者堡',
    faction: '学士会议',
    description: '位于王城内的学术中心，德雷大学士在此工作，存放着大量的古籍与文书。',
    x: 51,
    y: 44,
    path: 'deer'
  },
  {
    id: 'valles_keep',
    name: '瓦列堡',
    faction: '瓦列家族',
    description: '瓦列家族的根据地，位于南境主道与林路的交汇处。这里的学士消息灵通，甚至比渡鸦更早知晓王城的动向。',
    x: 42,
    y: 58,
    path: 'fox'
  },
  {
    id: 'valles_keep',
    name: '瓦列堡',
    faction: '瓦列家族',
    description: '瓦列家族的根据地，位于南境主道与林路的交汇处。这里的学士消息灵通，甚至比渡鸦更早知晓王城的动向。',
    x: 42,
    y: 58,
    path: 'fox'
  }
];
