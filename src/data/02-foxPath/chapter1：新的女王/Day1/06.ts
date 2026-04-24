import { Scene } from '../../../../types';

export const Day1ScholarScenes: Record<string, Scene> = {
  'F88-Scholar': {
    id: 'F88-Scholar',
    title: '学士来了',
    paragraphs: [
      { text: '你不记得自己什么时候睡着了。醒来时，你感到疲惫。这一觉你什么也没梦见，又也许，是你忘记了。' },
      { text: '......好渴。', isThought: true },
      { text: '你呼唤侍女，发现自己的声音就像渡鸦一样嘶哑。一个少女应声走进来。她拿来一只水壶，灌满你的杯子。' },
      { text: '水很清凉，带一点甜味。你感到自己好多了。' },
      { text: '“陛下。”' },
      { text: '侍女这时说，“塞普迪莫斯学士求见。”' },
      { text: '学士？' },
      { text: '“马上让他进来。”你握着杯子的手收紧了，“我要见他。”' },
      { text: '侍女对你行礼。她转过身，正准备出门。' },
      { text: '“等等！”你叫住她，“我要换件衣服。”你看向衣柜，“不要身上这件，我要穿从我的行李里拿出来的绿裙子。”' },
      { text: '蓝裙子被放进衣柜，你不想再看见它哪怕一眼。被摆布的凯瑟琳·赫西，被吓坏的女王......那条裙子沾满了你的眼泪。' },
      { text: '“把刚刚那件拿走。”你说，“我再也不要看见它。”' },
      { text: '那件刚挂进去的裙子又被拿了出来。侍女将它叠好，放在一边的凳子上。接着，她走到门外，对侍卫说了一句什么。' },
      { text: '“他已经在书房等候。”侍女转向你，“请跟我来，陛下。”' }
    ],
    choices: [
      { text: '继续', nextSceneId: 'F88-ScholarMeeting' }
    ],
    onEnter: (state) => {
      // 初始化本次会话的对话计数
      state.sessionFlags.talkCount = 0;
    }
  },

  'F88-ScholarMeeting': {
    id: 'F88-ScholarMeeting',
    title: '塞普迪莫斯学士',
    paragraphs: [
      { text: '你几乎迫不及待地跟着侍女走向书房。午后的走廊静悄悄的，金红罩袍的卫士们看起来犹如王宫的装饰品，他们个个都像一尊不会说话的雕塑。' },
      { text: '“学士！”' },
      { text: '你急忙推开门，那个你认识了十四年的灰袍老人正对你露出他那标志性的微笑。一看到这个，你的鼻子就发酸了。' },
      { text: '“你好啊，我的小殿下。”' },
      { text: '门在你身后重重关上，塞普迪莫斯学士接住扑到他怀里的你，拍了拍你的背。' },
      { text: '“您去哪了？”你有好多好多问题想问他，“修女不见了！我不知道她在哪，芬因去了红袍塔，还有哈蒙德！学士，我......”' },
      { text: '“慢慢来，小凯瑟琳。”他拨了拨胸前的铁环，你从他身上起来，乖乖坐在椅子上。' },
      { text: '“玛格丽特修女从进城之后就不见了，我一个人吃了午饭。”你有些委屈，“芬因......芬和大骑士去了红袍塔，现在他们都没有回来。我上午去了御前会议，我见到哈蒙德、奥尔德斯、还有莫尔......”' },
      { text: '你恨不得将一上午的所有事都告诉他，话到嘴边，却急的不知道先说哪件事才好。学士铜色的眼睛沉静而睿智地看着你，你慢慢闭上嘴，只是撇了撇嘴巴。' },
      { text: '“您怎么在这？”你问，“您......您为什么会到红堡里来？”' },
      { text: '“尽管您已经有了王室学士，但我仍然认为，您在接下来的几天里需要我的知识。”他有些促狭地眨眨眼，“是不是啊，小凯瑟琳？”' },
      { text: '当然！当然！他说得对极了！', isThought: true },
      { text: '一看到接下来几天都能和学士见面，你终于笑了起来。这恐怕是你从进城以来的第一个微笑。' },
      { text: '“我想每天下午都见到您。”你央求道，“学士，您能每天下午这个时间在书房吗？”' },
      { text: '“当然了，小殿下。”他说，“您只需要让韦斯特女官长向威斯汀卫队长说一声就行了。”' },
      { text: '“威斯汀？”' },
      { text: '“托马斯·威斯汀，他是王宫卫队的队长。”塞普迪莫斯学士指了指门外，“也就是您 看到的那些穿金红罩袍的卫士，他们都是王宫侍卫。”' },
      { text: '你点点头。' },
      { text: '“但我恐怕不能在这里待太久，公主殿下。”塞普迪莫斯学士翻开桌上的书，他的目光垂在书页上，“您这几天最重要的事是典礼彩排，我们只能待一小会儿。”' },
      { text: '一小会儿也好。你接受了。' },
      { text: '“学士，我想问......”' }
    ],
    choices: [
      {
        text: '“乔治·哈蒙德到底是怎样的男人？”',
        nextSceneId: 'F89-HammondDetail',
        onSelect: (state) => {
          state.flags.askedHammondInScholarTalk = true;
        }
      },
      {
        text: '“米瑞斯的马雷竟然是我的红袍卫士。”',
        nextSceneId: 'F91-MaresDetail',
        condition: (state) => !!state.flags.askedMaresBefore,
        onSelect: (state) => {
          state.flags.askedMaresInScholarTalk = true;
        }
      },
      {
        text: '“我的姑姑伊瑟尔迪丝公主是因为黄金骑士才去修道院的吗？”',
        nextSceneId: 'F92-GoldenKnightDetail',
        condition: (state) => !!state.flags.askedGoldenKnightReason,
        onSelect: (state) => {
          state.flags.askedGoldenKnightInScholarTalk = true;
        }
      },
      {
        text: '“关于御前会议，来的人我都不认识......”',
        nextSceneId: 'F93-CouncilDetail',
        onSelect: (state) => {
          state.flags.askedCouncilInScholarTalk = true;
        }
      }
    ]
  },

  'F89-HammondDetail': {
    id: 'F89-HammondDetail',
    title: '哈蒙德',
    paragraphs: [
      { text: '“他是个不好对付的男人。”塞普迪莫斯学士看着你，“征服王国西境大公爵，财政大臣兼御前首相，他在您的父亲，先王劳顿陛下四十三岁的时候就成了财政大臣。三年后，他成为御前首相。”' },
      { text: '“他从我的父亲开始，就是王国的财政大臣吗？”' },
      { text: '“是啊，他手里握着整个西境，年税金是整个的国库的一半。”塞普迪莫斯学士说，“西境沿海的众多城市自古以来被称为银岸诸城，其中最核心的有四座。您还记得是哪四座吗？”' },
      { text: '你努力回忆着，“维利斯、米瑞斯、洛安......”' },
      { text: '“科林。”学士替你补充，“维利斯、米瑞斯、洛安、科林。哈蒙德与这些城市的统治家族之间有着紧密的商贸联盟。他非常精明，比起贵族，更像一个商人。西境的银岸贵族们对他很忠诚。”' },
      { text: '你沉默了。' },
      { text: '一个握有半个国库财富、又受西境贵族拥戴的男人，坐在御前首相的位置上，手里还捏着财政大权。你想起他鹰一样的眼睛，和他对北境大公那句“他应该早点动身”的轻蔑。他不是国王，但他比国王更像国王。' },
      { text: '“真可怕。”你低声说。' }
    ],
    choices: [
      {
        text: '继续',
        nextSceneId: 'F94-ConditionCheck',
        onSelect: (state) => {
          state.sessionFlags.talkCount = (state.sessionFlags.talkCount || 0) + 1;
        }
      },
      {
        text: '“我还听说他脾气很坏，对男人也很挑剔......”',
        condition: (state) => !!state.flags.askedHammondTraitBefore,
        nextSceneId: 'F90-HammondDeep'
      }
    ]
  },

  'F90-HammondDeep': {
    id: 'F90-HammondDeep',
    title: '哈蒙德的秘闻',
    paragraphs: [
      { text: '“您从瓦列家的小姐们那听来的？”' },
      { text: '“您怎么知道？”' },
      { text: '“您在马车上只和她们在一起。”塞普迪莫斯学士说，“而在红堡里，没有人敢这样谈论哈蒙德。”' },
      { text: '“所以，这是真的吗？”' },
      { text: '“当然，所有真正和哈蒙德打过交道的都这么说。”塞普迪莫斯学士悠悠道，“尽管没人敢这样谈论哈蒙德，但在码头、酒馆、旅店之类的地方，有着从四面八方来的人。”' },
      { text: '“我还听说他很早就失去了妻子，一直没有再娶。”你试探着说，“我之前觉得这是因为他爱那位女士，但现在......”' },
      { text: '你没有继续往下说，学士看着你，露出一个不置可否的微笑。' },
      { text: '“也许他在等待一笔好买卖。”学士说，“但谁也不知道这是什么。”' }
    ],
    choices: [
      {
        text: '继续',
        nextSceneId: 'F94-ConditionCheck',
        onSelect: (state) => {
          state.sessionFlags.talkCount = (state.sessionFlags.talkCount || 0) + 1;
        }
      }
    ]
  },

  'F91-MaresDetail': {
    id: 'F91-MaresDetail',
    title: '米瑞斯的马雷',
    paragraphs: [
      { text: '“我都不敢相信。”你说，“米瑞斯的马雷竟然会是我的红袍卫士。”' },
      { text: '“您觉得贾斯珀·马雷如何？”' },
      { text: '“冷冰冰的。”你回想着他的脸，“让我有点害怕。而且，他真的很高......”' },
      { text: '塞普迪莫斯学士等待你说下去。' },
      { text: '“他比大骑士还要高，就是脸上有伤疤。如果没有那道疤，我觉得他会很不错。”' },
      { text: '学士笑了一声。“公主殿下，我向您担保，他的武艺和他本该拥有的长相一样好。”' },
      { text: '“本该？”你有点好奇，“他那道疤到底是怎么回事？”' },
      { text: '“谁也不知道。”塞普迪莫斯学士摇了摇头，“我和您一起离开红堡时，贾斯珀·马雷还是维尔福·马雷侯爵的长子与继承人，也许是在这十四年里发生了什么。”' },
      { text: '“那，米瑞斯呢？”你想到这个被梅莉桑德和梅莉奥拉挂在嘴上的城市，“我听说那是一座银与石之城，米瑞斯是怎样的城市？”' },
      { text: '“米瑞斯的银锭铸成了征服王国半数的银币，而石料则铺成了凯斯城里每一条像样的路。”学士将桌上的地图指给你看，“马雷家族世代统治着那里。但近年来，听说那里的几座老矿产量开始下降。米瑞斯和马雷都需要新的矿脉，而勘探和开采需要钱——很多钱。他们需要与哈蒙德商议。”' }
    ],
    choices: [
      {
        text: '继续',
        nextSceneId: 'F94-ConditionCheck',
        onSelect: (state) => {
          state.sessionFlags.talkCount = (state.sessionFlags.talkCount || 0) + 1;
        }
      }
    ]
  },

  'F92-GoldenKnightDetail': {
    id: 'F92-GoldenKnightDetail',
    title: '渡海的黄金骑士',
    paragraphs: [
      { text: '“很多人都这么说。”塞普迪莫斯学士说，“到今天也有人这么说，但这件事对你来说太遥远了，殿下。黄金骑士珀西瓦尔·莱昂离开已经快二十年了。”' },
      { text: '“离开？”你好奇起来，“他为什么离开？去了哪？”' },
      { text: '“他放弃了家族的继承权，也放弃了领地。”学士看向窗外，阳光耀然如金，“然后，带了一些人从金狮港离开。他的船队消失在大海尽头，据说他是去寻找失落的漂流大陆的。”' },
      { text: '“失落的漂流大陆？”这是一个崭新的词，你看了看地图，上面哪里也没看到。“那是在哪？”' },
      { text: '“也许是在海外，也许是在天外，谁知道呢。”学士摇了摇头。' },
      { text: '“那......他是因为要离开，才拒绝了我的姑姑吗？”' },
      { text: '“啊，很好的想法。”学士微笑着，“但比起一位王国的公主，他的家族当时所拥有的显赫和他唾手得的光荣未来相比，后者也很有吸引力。他拒绝了前者，放弃了后者，没人知道珀西瓦尔·莱昂想要什么。他是他父亲唯一的儿子，而他父亲的妹妹，他的姑姑，则终身没有婚嫁。”' }
    ],
    choices: [
      {
        text: '继续',
        nextSceneId: 'F94-ConditionCheck',
        onSelect: (state) => {
          state.sessionFlags.talkCount = (state.sessionFlags.talkCount || 0) + 1;
        }
      }
    ]
  },

  'F93-CouncilDetail': {
    id: 'F93-CouncilDetail',
    title: '御前会议的大臣们',
    paragraphs: [
      { text: '你低下头，手指绕着裙边。想起御前会议，你的胃又开始不舒服。' },
      { text: '你只是个坐在王座上的少女，他们都没把你当回事。乔治·哈蒙德几乎替代了你，他们说的话你听不明白，而他们也只回答你最简单的问题。' },
      { text: '“奥尔德斯学士是贤者堡在世的大贤者之一，他十年前就开始担任王室学士了。”塞普迪莫斯学士说，“您看见他的七环了吗？”' },
      { text: '“是的，学士。”' },
      { text: '五环以上的学士被称为贤者，七环以上被称为大贤者。要想取得大贤者的成就，还需要通过贤者堡议会的认可。' },
      { text: '“他的知识远比我渊博，您有任何求知方面的问题都可以咨询他。”' },
      { text: '“可我觉得您最厉害。”你揪了揪学士的灰袍角，小声说。' },
      { text: '“哈哈，可别在我的老师面前这么说，小殿下。”他被你逗笑，“奥尔德斯学士是我的老师，他的考核一向严格。”' },
      { text: '“那，其他两位呢？”你问，“莫尔大人和隆德大人也是奥尔德斯学士的徒弟吗？”' },
      { text: '“格雷戈尔·隆德爵士效忠于您的家族，殿下。”学士将包括王城凯斯在内的王室直属领划给你看，“他负责王室直属领内的卫兵训练和调遣，王城防卫军也需要服从他的安排。同时，如果您想出兵，他会为您前往各个领主的领地，调遣他们的军队。”' },
      { text: '“我也有自己的军队吗？”你想起那些骑士——白袍的、深蓝罩袍的、金红罩袍的。' },
      { text: '“每个家族都会有自己的军队。”塞普迪莫斯学士说，“但赫西的王室军队人数少，且只分布在王室直属领。”' },
      { text: '“哦......”你点点头，“那莫尔大人呢？”' },
      { text: '没想到，塞普迪莫斯学士冷哼了一声。' },
      { text: '“奥古斯丁·莫尔出身凯斯大圣堂附属法学院。”他说，“法律教育本该属于贤者堡，可惜......您之后将会有许多需要上朝的时候，有时您需要调解和判断御前的状告。”' },
      { text: '“为什么会有御前状告？那些纠纷不都是领地内的贵族来解决的吗？”' },
      { text: '“是啊，但王城凯斯是征服王国的中心。”学士悠悠地说，“在您的直属领包括凯斯城内，会有不少需要您来判断的案子。他们会绕过自己的领主，直接向您汇报。”' }
    ],
    choices: [
      {
        text: '继续',
        nextSceneId: 'F94-ConditionCheck',
        onSelect: (state) => {
          state.sessionFlags.talkCount = (state.sessionFlags.talkCount || 0) + 1;
        }
      }
    ]
  },

  'F94-ConditionCheck': {
    id: 'F94-ConditionCheck',
    title: '逻辑检定',
    description: '检定是否可以继续对话',
    paragraphs: [],
    onEnter: (state) => {
      const talkCount = state.sessionFlags.talkCount || 0;
      
      const HammondAvailable = !state.flags.askedHammondInScholarTalk;
      const MaresAvailable = !state.flags.askedMaresInScholarTalk && !!state.flags.askedMaresBefore;
      const GoldenKnightAvailable = !state.flags.askedGoldenKnightInScholarTalk && !!state.flags.askedGoldenKnightReason;
      const CouncilAvailable = !state.flags.askedCouncilInScholarTalk;

      const hasMoreOptions = HammondAvailable || MaresAvailable || GoldenKnightAvailable || CouncilAvailable;

      if (talkCount < 2 && hasMoreOptions) {
        state.nextSceneId = 'F95-ContinueTalk';
      } else {
        state.nextSceneId = 'F96-Transition3';
      }
    },
    choices: [] 
  },

  'F95-ContinueTalk': {
    id: 'F95-ContinueTalk',
    title: '你还想问',
    paragraphs: [
      { text: '你点点头，另一个话题涌到嘴边：' }
    ],
    choices: [
      {
        text: '我还想知道哈蒙德的事',
        nextSceneId: 'F89-HammondDetail',
        condition: (state) => !state.flags.askedHammondInScholarTalk
      },
      {
        text: '马雷的长子竟然是我的红袍卫士',
        nextSceneId: 'F91-MaresDetail',
        condition: (state) => !state.flags.askedMaresInScholarTalk && !!state.flags.askedMaresBefore
      },
      {
        text: '我听说了我姑姑和黄金骑士的事',
        nextSceneId: 'F92-GoldenKnightDetail',
        condition: (state) => !state.flags.askedGoldenKnightInScholarTalk && !!state.flags.askedGoldenKnightReason
      },
      {
        text: '今天早上，我还去了御前会议',
        nextSceneId: 'F93-CouncilDetail',
        condition: (state) => !state.flags.askedCouncilInScholarTalk
      }
    ]
  },

  'F96-Transition3': {
    id: 'F96-Transition3',
    title: '告别学士',
    paragraphs: [
      { text: '不知不觉，你已经知道了很多东西。' },
      { text: '门被轻轻叩响，塞普迪莫斯学士和你一起站起来。' },
      { text: '“看来您还有别的事情。”学士说，“明天下午，我会在书房等您。如果您愿意来，我们可以再聊些别的事情。”' },
      { text: '你点点头。' }
    ],
    choices: [
      { text: '继续', nextSceneId: 'Act2ChapterSplash' }
    ]
  }
};
