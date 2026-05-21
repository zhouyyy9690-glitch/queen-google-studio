import { Scene } from "../../../../types";

export const day2Scenes06: Record<string, Scene> = {
  "F129-ScholarLesson": {
    id: "F129-ScholarLesson",
    title: "学士课程",
    paragraphs: [
      { text: "午觉醒来，你坐在床上发了会儿懵。窗前桌上的花瓶里今日插着几枝白色百合，间杂着淡紫色的薰衣草，侍女不知何时关上了窗户，熏香和花香流淌在你的房间。" },
      { text: "起床更衣时，你问起时间。" },
      { text: "“现在是午后第二时。”" },
      { text: "下午......书房......昨天，学士似乎说这几天每天都在书房等我。", isThought: true },
      { text: "“塞普迪莫斯学士已经到了书房吗？”" },
      { text: "“是的，陛下。”\n“我现在就过去。”" },
      { text: "走入书房，塞普迪莫斯学士从一本厚重的古籍里抬起头，从书名来看，是《计算与术数原理》。" },
      { text: "“下午好，小公主。”他温和地对你说，“我就知道你今天也会来。”" },
      { text: "“下午好，塞普学士。”你在他身旁坐下，双手放在膝盖上。" },
      { text: "现在，你想问他的是：" }
    ],
    choices: [
      { 
        text: "“昨天，哈蒙德大人邀请我去参加晚宴。”", 
        nextSceneId: "F130-talkaboutHammonddinner",
        setFlags: { topicCount: 1, discussedHammond: true }
      },
      { 
        text: "“玛格丽特修女被换走了，我的伴护修女变成了萨米娅......”", 
        nextSceneId: "F131-talkaboutSisterSamia",
        setFlags: { topicCount: 1, discussedSamia: true }
      },
      { 
        text: "“我今早见到了我的贴身女官，其中有一位叫做尤利娅·维里克。”", 
        nextSceneId: "F131-1-talkaboutYulia",
        condition: { choseYuliaForBreakfast: true },
        setFlags: { topicCount: 1, discussedYulia: true }
      }
    ]
  },
  "F130-talkaboutHammonddinner": {
    id: "F130-talkaboutHammonddinner",
    title: "提到了哈蒙德晚宴",
    paragraphs: [
      { text: "“昨天，哈蒙德大人邀请我去参加晚宴。”" },
      { text: "“哈蒙德大人？”塞普迪莫斯学士有些诧异，“他在王宫为您设宴吗？”" },
      { text: "“不。”尽管你不想回忆，但你还是告诉了他，“是在内城的哈蒙德宅邸，斯特莱大人和东境的特使也在。”" },
      { text: "还有他们的孩子，你想。那三位年轻男女的脸孔从你的心中浮起，又迅速沉下。" },
      { text: "“作为御前首相，为您接风洗尘是理所当然。”学士说，“那顿饭如何，小殿下？”" },
      { text: "你咬住嘴唇。“糟透了，塞普学士。”" },
      { text: "他露出微笑，“那里的菜肴令您不满吗？”" },
      { text: "“还有其他人......”你说，“斯特莱大人的儿子和女儿，哈蒙德大人的儿子都在那。他们都比我年长，也彼此认识，我根本说不了什么。斯特莱大人和哈蒙德大人还一直问我，我没有任何胃口吃饭。”" },
      { text: "“但是......”" },
      { text: "昨夜去哈蒙德宅邸的记忆在你的头脑中展开，如果忽略哈蒙德和斯特莱，你现在反而更在意卡维·法哈迪。\n“东境大公派遣了一位叫做卡维·法哈迪的特使，他本人为什么没有来凯斯呢？”" },
      { text: "“因为法鲁克·萨拉赫大人的身体情况不足以支撑长途旅行。”学士说，“他很早以前就瞎掉了一只眼，一条腿也瘸了。那个老人重病缠身，他还能活在世上，已是诸神仁慈。”" },
      { text: "“但他没有儿子，公主殿下。在他死后，也许‘白庭’将迎来继承问题，这恐怕是您日后必须要操心的一件事。”" },
      { text: "“‘白庭’？”\n这是你第一次听到与王宫红堡类似的地名。" },
      { text: "“那是萨拉赫家族的城堡，他们的领地是沙赫尔领，那是古时弯月王国的第三王都。”学士看向你，“沙赫尔领的核心堡垒就是‘白庭’，用他们当地的称呼，是‘塔克希斯’。卡维·法哈迪从银脊山脉来，但法哈迪家族是萨拉赫家族最重要的封臣之一。”" }
    ],
    choices: [
      { text: "听起来真遥远......", nextSceneId: "F131-2-Logicaljudement" }
    ]
  },
  "F131-talkaboutSisterSamia": {
    id: "F131-talkaboutSisterSamia",
    title: "你很怀疑萨米娅修女",
    paragraphs: [
      { text: "“玛格丽特修女被换走了，我的伴护修女变成了萨米娅......”" },
      { text: "说到萨米娅修女，你感到她仿佛就在这。\n只是短暂的相处，她却让你记忆深刻。无论是脸、声音、气质还是说话方式，又或者是......" },
      { text: "“而且，”你皱起眉头，不觉流露出一丝厌恶，“她似乎和哈蒙德大人有联系。我想她绝不是个遵守七神教会戒律的好修女。”" },
      { text: "塞普迪莫斯学士意味深长地看着你，“萨米娅修女？她是个怎样的人，小殿下？”" },
      { text: "“她很漂亮，但——”" },
      { text: "但？\n你在脑中搜寻了一番，发现自己竟然一时间找不到任何对应的形容。" },
      { text: "即使是在昨天的晚宴上，她带给你的也只有震惊。\n虽然你很想说她举止放荡，但这个词你始终说不出口。" },
      { text: "那萨米娅修女，又是个怎样的女人呢？“" },
      { text: "“......我不太清楚，学士。”你最终摇摇头，“老实说，她给我的感觉和凯安完全不同。虽然，照这么看，他们应该都是东境人。学士，东境人的长相都这么有特点吗？”" },
      { text: "“你说对了，公主殿下。”塞普迪莫斯学士说，“一般情况下，您很容易辨认出一些东境人，他们浅橄榄色的皮肤是最好的代表之一，但还有许多其他的东境人。东方与其他地方都不一样，比之西境林立的银岸诸城，那边也有不少城市，但由于地形地貌复杂，切割出大量不同的部族、城镇、城堡等。”" },
      { text: "你瞪大眼睛，“我以为四境人各有各的长相特点。”" },
      { text: "“东境人是一种概念。”学士笑了，“别忘了王国最东边的黎明海，小殿下。只要能横渡那片海洋，越过银脊山脉，你就是一个东境人。”" },
      { text: "你点点头。\n“但我还是想念玛格丽特修女。”你的声音低下去，“我根本不知道她去哪了，为什么还没有来找我......”" },
      { text: "“她来到您身边时才二十岁。”塞普迪莫斯学士有些感怀，“如今，她也已经三十四岁了。萨米娅修女应该也是位年轻女子，如果她是七神教会派来的伴护修女，您需要向她学习不少新知识。”" }
    ],
    choices: [
      { text: "嗯......", nextSceneId: "F131-2-Logicaljudement" }
    ]
  },
  "F131-1-talkaboutYulia": {
    id: "F131-1-talkaboutYulia",
    title: "谈到了尤利娅",
    paragraphs: [
      { text: "“我今早见到了我的贴身女官，其中有一位叫做尤利娅·维里克。”" },
      { text: "想起尤利娅，你自然而然想到今早的情形。\n“今天早上，我和她一起吃了早餐。学士，我发现她的家族纹徽是黑狐！征服王国贵族的家徽里，不是不能有与赫西王室重合的象征吗？”" },
      { text: "但塞普迪莫斯学士的关注点在另一个细节上。\n“维里克？”他眯起眼睛，“您和她一起吃早餐时，她向您说了什么？”" },
      { text: "“没什么特别的。”你回忆着，“她说维里克家族的城堡在晨星领的科梅塔城，还说维里克从‘立法者’起，就是黑狐的家族了。”" },
      { text: "“殿下。”塞普迪莫斯学士悠悠开口，“您还记得埃塞尔雷德陛下为什么被称为‘立法者’吗？”" },
      { text: "“因为他将王城从西境的维利斯迁走了，在河间地筑起现在的凯斯城，确立了许多征服王国的新法例。”" },
      { text: "历史！你最不擅长的知识来了。\n过去，塞普迪莫斯学士也曾考过你一些内容，但你答不上来也不在意。反正，学士也从来没有骂过你 ......" },
      { text: "“埃塞尔雷德陛下还做了两件事。”学士说，“您还有印象吗？”" },
      { text: "完全没有。", isThought: true },
      { text: "你果断地摇头。" },
      { text: "“他毁灭了维拉尼家族，并褫夺他的叔祖父雷纳金德·赫西的姓氏，将他与他的家族流放到东方。”他铜色的眼睛平静地看着你，“这一支赫西后来叫做维里克，以白底黑狐作为家徽，遵从王室的谕令，协助东境大公家族萨拉赫统治整个东境。”" },
      { text: "“维里克？等等，也就是说......”" },
      { text: "“尤利娅出身征服王国唯一一个黑狐家族。”塞普迪莫斯学士将桌上的书翻过一页，“她会被送到凯斯来做您的女官，背后必定有家族的支持。即使在我的印象里，维里克家族并不热衷与哈蒙德往来，您也需要注意尤利娅可能携带的意见。”" }
    ],
    choices: [
      { text: "......我知道了。", nextSceneId: "F131-2-Logicaljudement", affect: { yulia: 1 } }
    ]
  },
  "F131-2-Logicaljudement": {
    id: "F131-2-Logicaljudement",
    title: "逻辑判断",
    paragraphs: [],
    onEnter: (state) => {
      const topicCount = state.flags.topicCount || 0;
      
      const HammondAvailable = !state.flags.discussedHammond;
      const SamiaAvailable = !state.flags.discussedSamia;
      const YuliaAvailable = !state.flags.discussedYulia && !!state.flags.choseYuliaForBreakfast;
      
      const hasMoreOptions = HammondAvailable || SamiaAvailable || YuliaAvailable;

      if (topicCount < 2 && hasMoreOptions) {
        state.nextSceneId = "F131-3-Dialoguetransition";
      } else {
        state.nextSceneId = "F131-4-day2talktranstion";
      }
    },
    choices: []
  },
  "F131-3-Dialoguetransition": {
    id: "F131-3-Dialoguetransition",
    title: "你们的谈话",
    paragraphs: [
      { text: "“关于刚才提到的，我还有些想法。”你对学士说。" }
    ],
    choices: [
      { 
        text: "“我昨天还去了哈蒙德的晚宴。”", 
        nextSceneId: "F130-talkaboutHammonddinner",
        condition: { discussedHammond: false },
        setFlags: { topicCount: 2, discussedHammond: true }
      },
      { 
        text: "“我的伴护修女被换成了萨米娅修女。”", 
        nextSceneId: "F131-talkaboutSisterSamia",
        condition: { discussedSamia: false },
        setFlags: { topicCount: 2, discussedSamia: true }
      },
      { 
        text: "“今天早上，我见到了我的贴身女官们。”", 
        nextSceneId: "F131-1-talkaboutYulia",
        condition: { discussedYulia: false, choseYuliaForBreakfast: true },
        setFlags: { topicCount: 2, discussedYulia: true }
      }
    ]
  },
  "F131-4-day2talktranstion": {
    id: "F131-4-day2talktranstion",
    title: "告别学士",
    paragraphs: [
      { text: "今天的谈话让你的心情有些沉重，未来所代表的一切，再一次更清楚地摆在你眼前。\n你想起杜林上午说“您不会永远无力”，现在听来，竟有一丝安慰。" },
      { text: "安慰归安慰，你其实也不知道该怎么办。\n如果要说目前最好的方法，看样子就是度过五天，参加继位典礼。" },
      { text: "叩叩。\n侍女的声音在门外响起：“陛下。”" },
      { text: "“进来！”你头也不回地喊。" },
      { text: "侍女对你和学士低下头。“您稍后要参加第一次典礼彩排，请随我来。”" },
      { text: "“真忙碌啊，小殿下。”塞普迪莫斯学士站起来，“那么，我也先告辞了。”" },
      { text: "彩排......现在？", isThought: true },
      { text: "眼睁睁地看着学士离开，你的心中顿时泛起一阵不情愿。\n但不愿归不愿，在侍女的等候下，你仍然调转脚尖，主动往外走了一步。" }
    ],
    choices: [
      { text: "继续", nextSceneId: "F132-Rehearsal" }
    ]
  }
};
