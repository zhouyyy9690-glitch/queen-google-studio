import { Scene } from '../../../types';

export const nightScenes: Record<string, Scene> = {
  'F14-NightActions': {
    id: 'F14-NightActions',
    title: '深夜抉择',
    description: '深夜决定',
    paragraphs: [
      { text: '今夜是你在翠谷的溪木堡度过的最后一夜，明天，在瓦兰提尔·诺恩与瓦列子爵与斯特莱家族的护送下，你将正式向王城启程。' },
      { text: '你躺在床上，望着摇曳的蜡烛，思绪万千。' },
      { text: '现在，你想做什么？' }
    ],
    choices: [
      { text: '找玛格丽特修女聊聊', nextSceneId: 'F15-TalkWithNun', explanation: '修女正在等待你的来访' },
      { text: '找大骑士诉说', nextSceneId: 'F21-TalkWithKnight', explanation: '大骑士正在擦拭他的佩剑' },
      { text: '找塞普迪莫斯学士', nextSceneId: 'F24-TalkWithScholar', explanation: '塞普迪莫斯学士正在喂食渡鸦' },
      { text: '睡觉', nextSceneId: 'F40-LeaveWithoutFain', explanation: '有时面对命运，无需苛责所有的顺从' }
    ]
  },

  //修女线入口
  'F15-TalkWithNun': {
    id: 'F15-TalkWithNun',
    title: '修女的担忧',
    description: '你和修女的交流',
    paragraphs: [
      { text: '玛格丽特修女正跪在床沿，对蜡烛祈祷。' },
      { text: '“美貌的神圣少女，请你庇护凯瑟琳·赫西公主殿下的未来......”', isDialogue: true },
      { text: '你没有打搅她，只是关上门，静静地等待她的祷告结束。' },
      { text: '征服王国信奉七神，祷告可以指向其中一位或者多位。\n但需要在祷告开始之前，说明本次祷告的指明对象，' },
      { text: '修女告诉过你，指向越多，就越要注意祂们原本的次序。\n神是古怪的存在，祂们之所以古怪是因为存在，之所以存在是因为古怪。' },
      { text: '从修女的祷文中，你辨认出她向神圣少女、哑言诗人和剑师祈祷。\n这对即将开启旅行的人来说，是常选的祷告对象。' },
      { text: '“什么事，我的孩子？”', isDialogue: true },
      { text: '祷告结束，玛格丽特修女转过来。她已经褪下黑纱，露出那双非常温柔的棕色眼睛。\n修女们夜晚独处或与未成年、未婚女子相处时，才能够褪下黑纱。' },
      { text: '你喜欢她不戴黑纱的样子。\n玛格丽特修女今年四十岁，你在过去无数个做噩梦的夜晚都寻求她的庇护。' },
      { text: '也是在私下，她会温柔地称呼你为“我的孩子”。\n尽管这是宗教的语言，但你总觉得玛格丽特修女就像你素未谋面的母亲。' },
      { text: '“我睡不着，修女。我害怕......”', isDialogue: true },
      { text: '你钻进玛格丽特修女的怀抱，她抚摸着你的脊背，轻柔地拍着。\n你听见她叹了口气。' },
      { text: '“王城是个危险的地方，我的孩子。”修女亲吻了你的额头，“尽管我认为留在翠谷对您更好，但我不能替您做决定。”', isDialogue: true }
    ],
    choices: [
      { text: '“危险？为什么？”', nextSceneId: 'F16-NunDeepTalk', setFlags: { talkedToNun: true, nunDeepTalk: true } },
      { text: '“我知道了，谢谢您。”', nextSceneId: 'F17-NunShallowReturn', setFlags: { talkedToNun: true, nunDeepTalk: false } }
    ]
  },

  //修女-深谈-返回房间检定
  'F16-NunDeepTalk': {
    id: 'F16-NunDeepTalk',
    title: '修女对你低语',
    description: '修女为你指出一条道路',
    paragraphs: [
      { text: '玛格丽特修女却没有回答你的疑问。\n她轻轻摇头，仿佛这是一桩禁忌。' },
      { text: '你的心中更加不安，那个一直盘旋心头的想法终于变得清晰——' },
      { text: '“我不想回去，修女。”', isDialogue: true },
      { text: '你搂住了玛格丽特修女的脖子，就像小时候那样。\n她的身上散发着一如既往令你安心的气息。' },
      { text: '“我很害怕，王城如此危险，我想一直留在翠谷，留在溪木堡......”', isDialogue: true },
      { text: '“这会是一条危险的道路，公主殿下。”玛格丽特修女说。\n与此同时，她从床单下摸出一个手形护身符，将它递给你。', isDialogue: true },
      { text: '“如果您打算这么做，请收下这个。必要时，它会为您指明一条隐秘之路。”', isDialogue: true },
      { text: '“神圣少女将守护您的内心。”修女亲吻了你的额头，“现在，您该回去了。晚安，我的孩子。神圣少女将看顾您人生的每个夜晚。”', isDialogue: true }
    ],
    choices: [
      { text: '“晚安，玛格丽特修女。”', nextSceneId: 'F18-BackToRoom' }
    ]
  },

  //修女-浅谈-看月亮-返回房间检定
  'F17-NunShallowReturn': {
    id: 'F17-NunShallowReturn',
    title: '玛格丽特修女拥抱了你',
    description: '修女的提示',
    paragraphs: [
      { text: '你依偎在玛格丽特修女怀中，感受那只手在背上的轻抚。\n恒定的节奏渐渐舒缓了你的神经。' },
      { text: '过了一会儿，你站起身，准备离开。\n这时，玛格丽特修女对你说：' },
      { text: '“无论发生什么，我都会和您在一起。”', isDialogue: true }
    ],
    choices: [
      { text: '继续', nextSceneId: 'F20-NunMoonTip' }
    ]
  },

  //修女月亮-返回房间
  'F20-NunMoonTip': {
    id: 'F20-NunMoonTip',
    title: '修女对你说.....？',
    description: '修女的月亮提示',
    paragraphs: [
      { text: '“但是，如果您改变了想法，夜晚的月亮会为您指路。”', isDialogue: true },
      { text: '“神圣少女将守护您的内心。”修女亲吻了你的额头，“现在，您该回去了。晚安，我的孩子。神圣少女将看顾您人生的每个夜晚。”', isDialogue: true }
    ],
    choices: [
      { text: '“晚安，玛格丽特修女。”', nextSceneId: 'F18-BackToRoom' }
    ]
  },

  //骑士路线入口
  'F21-TalkWithKnight': {
    id: 'F21-TalkWithKnight',
    title: '骑士的准备',
    description: '和骑士的交谈',
    paragraphs: [
      { text: '你来的时候，大骑士正借着蜡烛擦拭他的剑。\n空气里弥漫着铁锈与剑油的气息，闻起来是金属腥味和厚重油脂的混合。' },
      { text: '但是，当你在他身边坐下，大骑士的气息仍然不变。\n蜡烛烟和旧皮革，他是一位温暖而陈旧的老人。' },
      { text: '其实，说是老人也不太准确。\n大骑士今年五十多岁，时间在他身上的沉淀，让他的严肃更加年长。' },
      { text: '“大骑士。”你轻声呼唤他。\n大骑士放下手里那柄磨光的长剑，看向你：', isDialogue: true },
      { text: '“是的，公主殿下？”', isDialogue: true },
      { text: '大骑士这个称呼，是你从小就开始叫的。\n很早以前， 他对你说过自己的名字，但你还没能学会那个单词。' },
      { text: '之后，玛格丽特修女和塞普莫迪斯学士也都称他为爵士。\n你觉得比起爵士，“大骑士”是个更符合他的称呼。' }
    ],
    choices: [
      { text: '“关于回王城，我想......”', nextSceneId: 'F22-KnightDeepTalk', setFlags: { talkedToKnight: true, knightDeepTalk: true } },
      { text: '“（轻轻摇头）”', nextSceneId: 'F23-KnightShallowReturn', setFlags: { talkedToKnight: true, knightDeepTalk: false } }
    ]
  },

  //骑士深谈-返回房间（f18）
  'F22-KnightDeepTalk': {
    id: 'F22-KnightDeepTalk',
    title: '大骑士倾听了你的担忧',
    description: '骑士的深入谈话，谈到誓言',
    paragraphs: [
      { text: '“我很担心。”你对他说，“你们......不，所有人都说王城很危险，很可怕。那里有什么？”', isDialogue: true },
      { text: '“命运。”大骑士眼睛旁边的皱纹更深了，“殿下，那里有一种命运。”', isDialogue: true },
      { text: '“命运？”', isDialogue: true },
      { text: '你想了想：' },
      { text: '“我不喜欢命运。”', isDialogue: true },
      { text: '“人都会有自己的命运，小公主。”', isDialogue: true },
      { text: '这是他让你感到亲切的时候。小公主，小小的公主，赫西小公主。\n私下时，他偶尔会这么叫你，你在他眼中永远是个需要保护的小女孩。' },
      { text: '“大骑士，您的命运又是什么呢？”', isDialogue: true },
      { text: '“誓言。”', isDialogue: true },
      { text: '他将剑插回剑鞘，对你露出一个微笑：“我曾向你的父亲和母亲许下了誓言，公主殿下，我所有的荣耀与生命皆系于此。我会尽可能保护你不陷入危险之中。”', isDialogue: true },
      { text: '“可是，王城对我很危险。”你站起来，走到他面前。\n“大骑士，如果我不想回去，而是留在翠谷，或是......无论我的选择是什么，您都会保护我的命运吗？”', isDialogue: true },
      { text: '他沉默了片刻，对你单膝跪下。' },
      { text: '“会。”大骑士说，“公主殿下，我将如您所愿。这是我的誓言。”', isDialogue: true }
    ],
    choices: [
      { text: '“我接受您的效忠，爵士。”', nextSceneId: 'F18-BackToRoom' }
    ]
  },

  //骑士浅谈-返回房间（f18）
  'F23-KnightShallowReturn': {
    id: 'F23-KnightShallowReturn',
    title: '大骑士的沉默',
    description: '骑士的沉默',
    paragraphs: [
      { text: '你们谁也没有说话，也许，谁都认为言语此时缺场是最好的。' },
      { text: '静静地和大骑士待在一起，你的心中便积攒了更多的勇气。' },
      { text: '“谢谢您，大骑士。”', isDialogue: true },
      { text: '你离开之前，大骑士对你行了一礼。' },
      { text: '“晚安，小公主。”', isDialogue: true },
      { text: '这是他让你感到亲切的时候。小公主，小小的公主，赫西小公主。\n私下时，他偶尔会这么叫你，你在他眼中永远是个需要保护的小女孩。' }
    ],
    choices: [
      { text: '“晚安，大骑士。”', nextSceneId: 'F18-BackToRoom' }
    ]
  },

  //学士路线入口
  'F24-TalkWithScholar': {
    id: 'F24-TalkWithScholar',
    title: '渡鸦的羽毛',
    description: '与学士对话',
    paragraphs: [
      { text: '“殿下，您应该休息。”他头也不抬。\n渡鸦正停在他身旁的架子上，用嘴壳撩着羽毛。', isDialogue: true },
      { text: '“学士，我睡不着。”', isDialogue: true },
      { text: '塞普迪莫斯学士博学多识，你向来用诚实的态度面对他。' },
      { text: '他是个六环链士，这是在你出生以前就取得的荣誉。\n银、金、铜、铁、铅、木，他早已掌握除了数学以外的六大学科。' },
      { text: '“我在想，我回王城是不是会遇到危险？留在翠谷......是不是会更好呢？”', isDialogue: true },
      { text: '他放下羽毛笔，推了推眼镜：“没错，殿下。但留在翠谷，您会失去一切。王位是您的责任。”', isDialogue: true },
      { text: '“而且，依照我的判断，您恐怕很难留在翠谷。”', isDialogue: true },
      { text: '“为什么？”', isDialogue: true },
      { text: '塞普迪莫斯学士铜色的眼睛跃动着烛火，他的目光替代了他的语言。\n你意识到：' }
    ],
    choices: [
      { text: '“是哈蒙德吗？”', nextSceneId: 'F25-ScholarDeepTalk', setFlags: { talkedToScholar: true, scholarDeepTalk: true } },
      { text: '“......我明白了。”', nextSceneId: 'F26-ScholarShallowReturn', setFlags: { talkedToScholar: true, scholarDeepTalk: false } }
    ]
  },

  //学士深谈-返回f18
  'F25-ScholarDeepTalk': {
    id: 'F25-ScholarDeepTalk',
    title: '塞普迪莫斯学士向你解密',
    description: '王城的一点事情',
    paragraphs: [
      { text: '“今天的对话，您听见了多少？”', isDialogue: true },
      { text: '“一点点。”你伸出一根手指，比划了一下。', isDialogue: true },
      { text: '塞普迪莫斯学士笑了。“你是只狡猾的小狐狸，殿下。”', isDialogue: true },
      { text: '你有些不好意思。我怎么可能瞒得过学士？', isThought: true },
      { text: '“哈蒙德家族是西境大公爵暨全境守护，但征服王国还有东、南、北三境大公爵暨全境守护。”学士慢悠悠地说，“瓦兰提尔·诺恩是南境总主教，但他的命令是从凯斯大教堂——也就是王城那边来的。”', isDialogue: true },
      { text: '“所以，我的小殿下，不一定是哈蒙德。[C:昆提斯·德罗斯特]也在关注您的行动。”', isDialogue: true },
      { text: '“......征服王国大主教？为什么？”', isDialogue: true },
      { text: '“因为这是大人游戏胜利的重要条件。”', isDialogue: true },
      { text: '渡鸦叫了一声。你这才意识到，学士的窗户没有关上。\n春夜的风撩动了你的头发，月光如水，淌满整个窗台。' },
      { text: '“但是，如果您不留在翠谷，将是游戏胜利的另一个重要条件。”\n塞普迪莫斯学士走到渡鸦身边，从旁边的盘子里捡肉喂给它。', isDialogue: true },
      { text: '“如果您做出这样的选择，我会为您准备一份伪造的文书和地图。”学士看着渡鸦，压低声音，“但您必须明白，这将永远改变您的人生。”', isDialogue: true },
      { text: '你意识到，除了留在翠谷和明天离开之外，这里存在第三条路。' }
    ],
    choices: [
      { text: '“我会在明天之前决定，学士。”', nextSceneId: 'F18-BackToRoom' }
    ]
  },

  //学士浅谈-月亮-f18
  'F26-ScholarShallowReturn': {
    id: 'F26-ScholarShallowReturn',
    title: '学士对你说......？',
    description: '学士的月亮提示',
    paragraphs: [
      { text: '你意识到他把话停在了这里，而你已经有了新的答案。\n但愿如此。' },
      { text: '正在你打算离开时，渡鸦叫了一声。你这才意识到，学士的窗户没有关上。\n春夜的风撩动了你的头发，月光如水，淌满整个窗台。' },
      { text: '“今夜对您而言，会是个艰难的决策之夜。”', isDialogue: true },
      { text: '“在得到答案前，我的小殿下，您不妨听听所有人的意见，然后，独自仰望星空。”学士推了推眼镜，意味深长地说。', isDialogue: true },
      { text: '“哑言诗人将眷顾您的道路。晚安，凯瑟琳·赫西公主殿下。”', isDialogue: true }
    ],
    choices: [
      { text: '“我会好好想想。晚安，塞普迪莫斯学士。”', nextSceneId: 'F18-BackToRoom' }
    ]
  },

  //返回房间（修女/骑士/学士）
  'F18-BackToRoom': {
    id: 'F18-BackToRoom',
    title: '无眠之夜',
    description: '进入检定',
    paragraphs: [
      { text: '你回到房间，对着镜子看了看自己的脸，狐狸正在你的灵魂中舞蹈。' }
    ],
    choices: [
      { text: '继续', nextSceneId: 'F19-CheckWhoElse' }
    ]
  },

  //三人对话选项检定
  'F19-CheckWhoElse': {
    id: 'F19-CheckWhoElse',
    title: '你的思绪仍在流动',
    description: '找其他的人',
    paragraphs: [
      { text: '在明天到来之前，你还想去找谁？' },

    ],
    choices: [
      // 如果还没找修女
      {
        text: '玛格丽特修女',
        nextSceneId: 'F15-TalkWithNun',
        condition: 'talkedToNun === false'
      },
      // 如果还没找骑士
      {
        text: '大骑士',
        nextSceneId: 'F21-TalkWithKnight',
        condition: 'talkedToKnight === false'
      },
      // 如果还没找学士
      {
        text: '塞普迪莫斯学士',
        nextSceneId: 'F24-TalkWithScholar',
        condition: 'talkedToScholar === false'
      },
      // 如果三人全谈且未告诉芬因 → 显示“睡觉”和“看月亮”
      {
        text: '睡觉',
        nextSceneId: 'F40-LeaveWithoutFain',
        condition: 'talkedToNun === true && talkedToKnight === true && talkedToScholar === true && toldFain === false'
      },
      {
        text: '看月亮',
        nextSceneId: 'F34-MoonWatch1',
        condition: 'talkedToNun === true && talkedToKnight === true && talkedToScholar === true && toldFain === false'
      }
      // 注意：如果三人全谈且 toldFain === true，不会显示任何选项，需要在组件中自动跳转到 F29-AutoKnight。
    ]
  },

  //月亮路线：
  'F34-MoonWatch1': {
    id: 'F34-MoonWatch1',
    title: '望月',
    description: '第一次看月亮',
    paragraphs: [
      { text: '月亮在今夜似乎对你有特殊的吸引力。' },
      { text: '神圣少女掌握春季的月亮，她的母亲婚妇则是夏秋的美月。' },
      { text: '你望着月亮，似乎从中看到那位貌美绝伦的青春之神。\n她的瞳孔正高悬夜空，苍白如银。' },
      { text: '你看了一会儿，现在你打算：' }
    ],
    choices: [
      { text: '继续看', nextSceneId: 'F35-MoonWatch2' },
      { text: '睡觉', nextSceneId: 'F40-LeaveWithoutFain' }
    ]
  },

  'F35-MoonWatch2': {
    id: 'F35-MoonWatch2',
    title: '再次望月',
    description: '第二次看月亮',
    paragraphs: [
      { text: '你目不转睛，心中响起了神圣少女的祷文。' },
      { text: '敬献七神之一，神圣少女的青春，您是新春之月，青春之神。' },
      { text: '您的灵光垂露如珠，盈满我的心间。' },
      { text: '我的道路，我的道路......\n夜色已然宁静。你打算：' }
    ],
    choices: [
      { text: '继续看', nextSceneId: 'F36-MoonWatch3' },
      { text: '睡觉', nextSceneId: 'F40-LeaveWithoutFain' }
    ]
  },

  'F36-MoonWatch3': {
    id: 'F36-MoonWatch3',
    title: '神圣少女的密谋',
    description: '月下密谋',
    paragraphs: [
      { text: '在你的祝祷中，你的房门被轻轻叩响。' },
      { text: '你没有回头。' },
      { text: '“殿下。”' },
      { text: '玛格丽特修女轻声呼唤：“您还没有睡吗？”' },
      { text: '“是的。”' },
      { text: '你走到门前，打开大门，玛格丽特修女、大骑士和塞普迪莫斯学士都在这。\n神圣少女之光照耀他们的脸庞，你忽然觉得他们所有人都变得年轻了。' },
      { text: '“走吧。”' },
      { text: '大骑士低沉地说：“我已经知道了您的决定。”' },
      { text: '“有时，神圣少女会通过特殊的感召，将人们汇聚在向她许愿的孩子身边。”' },
      { text: '塞普迪莫斯学士对你微笑，渡鸦停在他的左肩，“她是位任性而灵敏的女神。我们和您的想法相同。”' }
    ],
    choices: [
      { text: '赞美神圣少女！', nextSceneId: 'MoonlightEscape-kill' }
    ]
  },

  //册封路线：
  'F29-AutoKnight': {
    id: 'F29-AutoKnight',
    title: '命运的指引',
    description: '自动跳转到册封仪式',
    bgm: 'FAIN_THEME',
    paragraphs: [
      { text: '在完全的黑夜里，你反而更加清晰地想起了那个金发男孩。\n芬因正在午夜的花园等候我。\n你回忆起白天的情况，看向在今天下午找出来的一件旧物。' },
      { text: '溪木堡的守夜人路线固定，你知道怎么绕开他们。' }
    ],
    choices: [
      { text: '前往花园', nextSceneId: 'F30-KnightCeremony' }
    ]
  },
  'F30-KnightCeremony': {
    id: 'F30-KnightCeremony',
    title: '午夜之约',
    description: '午夜与芬因',
    bgm: 'FAIN_THEME',
    paragraphs: [
      { text: '你来到花园。月色洁白如银，芬因·里德站在盛放的鸢尾花丛旁。银色的月光洒在他金色的头发上，仿佛为他镀上不朽神光。\n夜风拂过，你知道他看见了你，正如你看见了他。' },
      { text: '空气里弥漫着清甜的香气。\n踏着露水、青草与芬芳，你来到他的面前。' },
      { text: '“凯茜......”', isDialogue: true },
      { text: '“跪下。”', isDialogue: true },
      { text: '你抽出腰间的长剑，剑尖指向少年。\n这一刻，你身披月光，犹如司掌春季的神圣少女亲身在场。' },
      { text: '芬因·里德没有错愕。他双膝跪地，双手交合。\n这是一个祈祷与受封的姿势。' },
      { text: '剑尖在少年的双肩轻点，你的声音宛如天国福音：' },
      { text: '“以诸神与我，赫西之女的名义，愿你手持此剑守卫正义，捍卫无辜。”', isDialogue: true },
      { text: '“今日，我封你为我的骑士，愿你忠贞英勇，荣耀我与我国，直至生命终结。”', isDialogue: true },
      { text: '“起身吧，我的骑士！”', isDialogue: true },
      { text: '他伸出双手，接过这柄十四岁孩子能够挥动的剑。\n从四岁那年开始，他就是大骑士不成文的弟子。\n也许，在你曾经向大骑士要这柄由他打造的旧剑时，他就已经料到芬因·里德会有这一天。' },
      { text: '以剑为界，他跪下前仍是男孩，起身时已是男人。\n以此剑为证，他发誓保护弱者、妇女和儿童，发誓忠诚、正直、善良而谦逊。' },
      { text: '以此剑为信，他发誓为他的主人，凯瑟琳·赫西，挥动手中的剑，杀死她所有的敌人。' },
      { text: '他发誓永远对他的女士忠诚，视你的荣耀为他的荣耀，用生命来守卫你，直到你呼吸断绝的那天。' },
      { text: '芬因·里德已经彻底属于你。\n这是你收到成为女王的消息以来，为自己选择的第一件礼物。' },
      { text: '“吾主（My lady）。”芬因沉声说，“我的生命与荣耀都将永远属于您。七神见证我的誓言，您见证我的忠诚。”', isDialogue: true },
      { text: '你终于笑起来。\n少女的快乐，情人的甜蜜，再一次回到你的身上。\n你抱住芬因，当他的手臂也环上你的腰时，你突然很想流泪。' },
      { text: '是太高兴了吗？还是你终于做出了一次完全、彻底、如你所愿的选择？\n你不知道，你的眼泪打湿了他的皮肤，而你的骑士紧紧地拥抱着你。', isThought: true },
      { text: '夜莺在枝头歌唱。\n再没有比今天更美好、更哀伤、更甜蜜的春夜了。' },
      { text: '渐渐地，你不再流泪。\n新的道路也因此变得明晰：' }
    ],
    choices: [
      { text: '“我们离开这，芬因，我不想回去。”', nextSceneId: 'F31-EscapePlan' },
      { text: '“晚安，芬因，明天见。”', nextSceneId: 'F39-FainGoodnight' }
    ]
  },

  //芬因-逃离分支
  'F31-EscapePlan': {
    id: 'F31-EscapePlan',
    title: '延宕的绿野',
    description: '逃离的分支',
    paragraphs: [
      { text: '芬因·里德并没有惊讶。他亲吻了一下你的头发：' },
      { text: '“凯茜，这是个好主意。”' }
    ],
    choices: [
      { text: '就我们两人。', nextSceneId: 'F32-CoupleEscape' },
      { text: '修女他们会为我们提供帮助。', nextSceneId: 'F33-FourEscape', condition: 'talkedToNun && talkedToKnight && talkedToScholar && nunDeepTalk && knightDeepTalk || talkedToNun && talkedToKnight && talkedToScholar && nunDeepTalk && scholarDeepTalk || talkedToNun && talkedToKnight && talkedToScholar && knightDeepTalk && scholarDeepTalk' }
    ]
  },

  //芬因-逃离-两人
  'F32-CoupleEscape': {
    id: 'F32-CoupleEscape',
    title: '只有我们',
    description: '二人逃离',
    paragraphs: [
      { text: '塞普迪莫斯学士、玛格丽特修女和大骑士陪伴你来到这时，你还是个孩子。' },
      { text: '当你渐渐长大，他们便渐渐衰老。' },
      { text: '他们不懂得少女的心，你向往绿野之外的人世而非宁静的自然，这一愿望在你十四岁那年抵达顶峰。' },
      { text: '此时，命运为你备好了一个骑手。金发的芬因·里德因其英俊、热情和真诚早已赢得了你的心，你视他为那些传说中的英雄。' }
    ],
    choices: [
      { text: '离开吧，公主殿下！', nextSceneId: 'ForgottenPrincess-kill' }
    ]
  },

  //芬因-逃离-四人
  'F33-FourEscape': {
    id: 'F33-FourEscape',
    title: '新的道路',
    description: '四人逃离',
    paragraphs: [
      { text: '你已经向玛格丽特修女、大骑士和塞普迪莫斯学士确认过。\n你相信如果你要离开，他们一定会帮助你。' },
      { text: '月下，大骑士对芬因的出现有些意外。\n看到你们紧握在一起的手，这位严肃的男人并没有多说什么。' },
      { text: '玛格丽特修女给你的手形护身符里有一条秘道，可以通往东方的修道院。\n据说翻过东方的银脊山脉（Silver Ridge Mountains），就可以看到另一片大海。' },
      { text: '她教养你十四年，早已将你视为自己的孩子。\n大骑士对你的父母和你宣誓，他将护卫这趟旅程，即使逃亡将很可能永无抬头之境。' },
      { text: '塞普迪莫斯学士并不打算和你们一起离开。\n他为你提供了伪造的文件与一张地图，按他的话来说，他会从另一条道路返回王城的贤者堡。\n也许，他在有生之年能拿到锡环，成为位列学会的贤者之一。' }
    ],
    choices: [
      { text: '告别吧，公主殿下！', nextSceneId: 'LegendoftheGreenValley-kill' }
    ]
  },

  //芬因-晚安分支
  'F39-FainGoodnight': {
    id: 'F39-FainGoodnight',
    title: '晚安',
    description: '和芬因晚安，转第二天',
    bgm: 'FAIN_THEME',
    paragraphs: [
      { text: '翠谷之风吹过你们身旁。\n大地和天空都如此安静，你从芬因的怀抱中探出脑袋，看向四周。' },
      { text: '多么寂静啊，就像过去的十四年一样。\n你在这样的寂静中生活了整整十四年，而当太阳升起，你就要迎接未知的挑战。' },
      { text: '如果有芬因在，你想你会更安心。' },
      { text: '王城的危险......哈蒙德......种种一切，你似乎可以不再那么恐惧。' },
      { text: '抱着这样的想法，你和芬因道别。' },
      { text: '黎明就要升起了，新的一天，你将在太阳下离开。' }
    ],
    choices: [
      { text: '新的一天', nextSceneId: 'F41-LeaveWithFain' }
    ]
  }
};
