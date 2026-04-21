import { Character } from './types';

export const characters: Character[] = [
  {
    id: 'catherine',
    name: '凯瑟琳·赫西',
    nameEn: 'Catherine Hersey',
    title: '绿野王女',
    description: '劳顿·赫西与伊莎贝拉·赫西之女，征服王国的合法继承人。在绿野中长大，十四岁时被卷入权力的漩涡。',
    updates: [
      {
        atScene: 'HerMaiesty',
        title: '绛红女王',
        description: '你回到了王城，正式继位成为征服王国的女王。虽然身处权力的中心，但你感到前所未有的孤独与压力。'
      },
      {
        atScene: 'newlymarriedgirl',
        description: '作为女王，你不得不面对权臣的逼婚。在乔治·哈蒙德的阴影下，你正试图寻找自己的生存之道。'
      }
    ],
    unlockedAt: 'F2-Bishop',
    iconType: 'fox',
    path: 'fox',
    matchNames: ['凯瑟琳'],
    positionHint: { x: 50, y: 55 },
    relations: [
      { to: 'laughton', type: 'kin', label: '父王' },
      { to: 'isabella', type: 'kin', label: '母后' },
      { to: 'finn', type: 'friend', label: '挚友' },
      { to: 'george', type: 'enemy', label: '权臣 / 争夺者' },
      { to: 'valantir', type: 'vassal', label: '宗教导师' }
    ]
  },
  // Fox Path Characters
  {
    id: 'finn',
    name: '芬因·里德',
    nameEn: 'Finn Reed',
    title: '绿野少年',
    description: '凯瑟琳在绿野中结识的唯一朋友，一头金发的乡下男孩。他不懂得王国的法理，只懂得守护你的笑容。',
    updates: [
      {
        atScene: 'HerMaiesty',
        title: '红袍卫士',
        description: '随你一同回到王城，成为了隶属女王的红袍卫士。他是你在冰冷的宫廷中唯一的温暖。'
      }
    ],
    unlockedAt: 'DelayedePrincess',
    iconType: 'sword',
    path: 'fox',
    positionHint: { x: 25, y: 50 },
    relations: [
      { to: 'catherine', type: 'friend', label: '守护者' }
    ]
  },
  {
    id: 'george',
    name: '乔治·哈蒙德',
    nameEn: 'George Hammond',
    title: '御前首相 / 西境大公',
    description: '手握征服王国三分之二财富的男人，黑发黑眼，深不可测。他既是王国的支柱，也是最危险的篡夺者。',
    updates: [
      {
        atScene: 'newlymarriedgirl',
        description: '他在深夜走进你的房间，以金币为赌注，迫使你进行一场关于婚姻与权力的交易。'
      },
      {
        atScene: 'BlackHawksRemarriage',
        title: '西境公爵',
        description: '在雷斯多伯爵的口中，他是西境公爵，财政大臣，御前首相。有秘闻称他与赫西夫妇的死有关。他即将迎娶女王。'
      }
    ],
    unlockedAt: ['HerMaiesty', 'd1-deer', 'BlackHawksRemarriage', 'BlackHawksNewMarriage'],
    iconType: 'eagle',
    path: 'all',
    positionHint: { x: 75, y: 50 },
    relations: [
      { to: 'catherine', type: 'enemy', label: '摄政敌人' },
      { to: 'laughton', type: 'vassal', label: '前御前首相' },
      { to: 'dean', type: 'kin', label: '长子' }
    ]
  },
  {
    id: 'valantir',
    name: '瓦兰提尔·诺恩',
    nameEn: 'Valantir Nohn',
    title: '南境总主教',
    description: '南境总主教，瓦兰提尔·诺恩。他傲慢而冷静，将王国的未来带到了凯瑟琳面前。',
    updates: [
      {
        atScene: 'ValantirNohnboesdowntoyou',
        description: '他向你俯身，承诺准备回城车队。他的微笑中带着一丝怜悯。'
      }
    ],
    unlockedAt: ['fox', 'Yourdecision'],
    iconType: 'ring',
    path: 'fox',
    positionHint: { x: 50, y: 85 }
  },
  {
    id: 'margaret',
    name: '玛格丽特修女',
    nameEn: 'Sister Margaret',
    title: '伴护修女',
    description: '凯瑟琳的伴护修女，一直悉心照顾着公主。在权力的风暴面前，她显得忧心忡忡。',
    updates: [
      {
        atScene: 'HelpFromNun',
        title: '秘密的守护者',
        description: '她私下为你提供帮助，指引你前往修道院避难。'
      }
    ],
    unlockedAt: ['fox', 'Yourdecision'],
    iconType: 'user',
    path: 'fox'
  },
  {
    id: 'septimus',
    name: '塞普迪莫斯学士',
    nameEn: 'Maester Septimus',
    title: '溪木堡学士',
    description: '在溪木堡陪伴凯瑟琳长大的学士，胸前挂着象征学识的六环。他冷静而睿智。',
    unlockedAt: ['fox', 'Yourdecision'],
    iconType: 'sword',
    path: 'fox'
  },
  {
    id: 'aldric',
    name: '奥德里克·格林',
    nameEn: 'Aldric Green',
    title: '翠谷地区主教',
    description: '翠谷地区的主教，与瓦兰提尔·诺恩一同到来。',
    unlockedAt: ['fox', 'Yourdecision'],
    iconType: 'user',
    path: 'fox',
    matchNames: ['奥德里克']
  },
  {
    id: 'knight',
    name: '大骑士',
    nameEn: 'The Great Knight',
    title: '守护骑士',
    description: '从凯瑟琳有记忆起就守护在她身边的老骑士。他沉默寡言，但他的剑始终为保护公主而存在。',
    unlockedAt: ['fox', 'Yourdecision'],
    iconType: 'sword',
    path: 'fox'
  },
  {
    id: 'raymond',
    name: '雷蒙德·瓦列',
    nameEn: 'Raymond Valais',
    title: '瓦列子爵',
    description: '翠谷地区的领主，瓦列家族的首领。他在瓦兰提尔·诺恩的安排下负责护送凯瑟琳回城。',
    unlockedAt: 'F4-ValantirNohnboesdowntoyou',
    iconType: 'sword',
    path: 'fox'
  },
  {
    id: 'edgar',
    name: '埃德加·斯特莱',
    nameEn: 'Edgar Stray',
    title: '南境守护之子',
    description: '斯特莱家族的成员，南境领主的次子。他与雷蒙德·瓦列一同护送女王。',
    unlockedAt: 'F4-ValantirNohnboesdowntoyou',
    iconType: 'sword',
    path: 'fox'
  },
  {
    id: 'stray',
    name: '伯恩·斯特莱',
    nameEn: 'Byron Stray',
    title: '南境公爵',
    description: '来自南方的领主，热爱美酒与夏日的果实。在红廷的盛宴中献上南方的佳酿。他是乔治·哈蒙德的盟友。',
    unlockedAt: 'HerMaiesty',
    iconType: 'tiger',
    path: 'fox'
  },
  {
    id: 'durin',
    name: '杜林·阿尔摩恩',
    nameEn: 'Durin Almohn',
    title: '北境公爵',
    description: '来自寒冷北境的领主，为女王带来了王统的剑盔。他沉默寡言，忠于王室传统，手握王国的北方边境。',
    unlockedAt: 'HerMaiesty',
    iconType: 'bear',
    path: 'fox'
  },
  {
    id: 'dean',
    name: '迪恩·哈蒙德',
    nameEn: 'Dean Hammond',
    title: '西境继承人',
    description: '乔治·哈蒙德的长子。在某些命运的分支中，他成为了女王的丈夫。',
    unlockedAt: ['Caesar', 'Thedespisedeldestson', 'd2-1-DeanHammond'],
    iconType: 'ring',
    path: 'all'
  },
  // Deer Path Characters
  {
    id: 'dami',
    name: '达里安·德·雷斯多',
    nameEn: 'Darian de Lesdos',
    title: '雷斯多家的幼子',
    description: '维克托·德·雷斯多伯爵最小的孩子。体弱多病，却拥有至纯的诗艺与灵性。',
    updates: [
      {
        atScene: 'd4-EnterCity-1',
        title: '他是对的',
        description: '你承认了自己无法成为骑士的现实。七神收走了你的健康体魄，却赐予你至纯的诗艺与灵性。你感到灵魂中有一道裂缝，渴望被新的世界填满。'
      }
    ],
    unlockedAt: 'd2-CarriageTalk',
    iconType: 'user',
    path: 'deer'
  },
  {
    id: 'victor',
    name: '维克托·德·雷斯多',
    nameEn: 'Victor de Lesdos',
    title: '雷斯多伯爵',
    description: '达里安的父亲，一位严谨而关爱孩子的领主。他效忠于南境领主斯特莱家族。',
    updates: [
      {
        atScene: 'd3-Dissatisfied',
        description: '在前往王城的马车上， he expressed concern about the situation and strictly warned you that you must stay by his side and not run around.'
      }
    ],
    unlockedAt: 'd1-deer',
    iconType: 'sword',
    path: 'deer'
  },
  {
    id: 'franklin',
    name: '富兰克林·德·雷斯多',
    nameEn: 'Franklin de Lesdos',
    title: '雷斯多家的二哥',
    description: '达里安的二哥，棕发绿眼。比起严肃的家事，他似乎更热衷于追求有风情的女人。',
    unlockedAt: 'd1-deer',
    iconType: 'user',
    path: 'deer'
  },
  {
    id: 'felix',
    name: '菲利克斯·德·雷斯多',
    nameEn: 'Felix de Lesdos',
    title: '雷斯多家的三哥',
    description: '达里安的三哥，黑发蓝眼。看似不着调，实则是家族中最聪明的人。他被称为“风流的菲力”。',
    updates: [
      {
        atScene: 'd3-Dissatisfied',
        description: 'Although he is usually joking, when his father mentioned the dangers of the Royal City, he exchanged a deep look with his father, showing his sharp insight.'
      }
    ],
    unlockedAt: ['d1-deer', 'Therunawayprodigalson'],
    iconType: 'user',
    path: 'all'
  },
  {
    id: 'etienne',
    name: '埃蒂安·德·雷斯多',
    nameEn: 'Etienne de Lesdos',
    title: '雷斯多家的长子',
    description: '达里安的大哥，家族未来的继承人。他沉稳温和，承担着家族的重任。',
    unlockedAt: 'd1-deer',
    iconType: 'sword',
    path: 'deer'
  },
  {
    id: 'giovanna',
    name: '吉尔瓦娜·德·雷斯多',
    nameEn: 'Giovanna de Lesdos',
    title: '雷斯多伯爵夫人',
    description: '达里安的母亲，温柔而坚韧。她是家族的情感纽带，始终默默支持着丈夫和孩子们。',
    unlockedAt: 'd1-deer',
    iconType: 'user',
    path: 'deer'
  },
  {
    id: 'dray',
    name: '德雷大学士',
    nameEn: 'Scholar Dray',
    title: '雷斯多家族顾问学士',
    description: '头发花白、总是笑眯眯的老人。教导达里安历史、天文和草药学。目前在王城的贤者堡。',
    unlockedAt: 'd3-1-ScholarNeed',
    iconType: 'user',
    path: 'deer'
  },
  {
    id: 'anne',
    name: '安妮·朗珀蕾',
    nameEn: 'Anne Lampere',
    title: '纺织女',
    description: '坐在织机前的神秘女子，声称能看见命运的经纬。',
    unlockedAt: 'TheWeavingWomanandtheWhiteQueen',
    iconType: 'ring',
    path: 'all'
  },
  {
    id: 'yugenia',
    name: '尤金妮亚·赫西',
    nameEn: 'Eugenia Hersey',
    title: '赫西家的女儿',
    description: '眼神坚定的少女，认为赫西的名字不应只代表过去。',
    unlockedAt: 'Lesdosdaughter',
    iconType: 'fox',
    path: 'all'
  },
  {
    id: 'droste',
    name: '昆提斯·德罗斯特',
    nameEn: 'Quintus Droste',
    title: '征服王国大主教',
    description: '征服王国七神教会的最高领袖，驻扎在王城的凯斯大圣堂。他是一位权倾朝野的宗教领袖，对王国的政治局势有着深远的影响。',
    iconType: 'scroll',
    path: 'common',
    unlockedAt: 'F25-ScholarDeepTalk'
  },
  {
    id: 'jeffrey',
    name: '杰弗里学士',
    nameEn: 'Maester Jeffrey',
    title: '瓦列堡学士',
    description: '服务于瓦列家族的学士，博学多才。他在瓦兰提尔·诺恩抵达翠谷之前就通过某种手段获知了消息。',
    iconType: 'scroll',
    path: 'fox',
    unlockedAt: 'F9-1-wallshaveears'
  },
  {
    id: 'eileen',
    name: '爱琳·里德',
    nameEn: 'Eileen Reed',
    title: '林谷村寡妇',
    description: '芬因·里德的母亲，一位勤劳善良的农家妇女。在丈夫去世后，她独自抚养芬因长大。',
    iconType: 'heart',
    path: 'fox',
    unlockedAt: 'F41-LeaveWithFain'
  },
  {
    id: 'laughton',
    name: '劳顿·赫西',
    nameEn: 'Laughton Hersey',
    title: '征服者之王',
    description: '凯瑟琳的父亲，征服王国的国王。一个威严而神秘的人物，他的命运与王国的存亡紧紧相连。',
    iconType: 'ring',
    path: 'common',
    unlockedAt: 'F5-LaughtonAndIsabella',
    positionHint: { x: 40, y: 20 },
    relations: [
      { to: 'isabella', type: 'spouse', label: '王后' },
      { to: 'catherine', type: 'kin', label: '女儿' }
    ]
  },
  {
    id: 'isabella',
    name: '伊莎贝拉·赫西',
    nameEn: 'Isabella Hersey',
    title: '征服王国之王后',
    description: '凯瑟琳的母亲，劳顿·赫西的王后。据说她拥有惊人的美貌与非凡的智慧。',
    iconType: 'heart',
    path: 'common',
    unlockedAt: 'F5-LaughtonAndIsabella',
    positionHint: { x: 60, y: 20 },
    relations: [
      { to: 'laughton', type: 'spouse', label: '国王' },
      { to: 'catherine', type: 'kin', label: '女儿' }
    ]
  }
];
