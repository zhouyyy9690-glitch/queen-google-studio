import { Scene } from '../../../types';

export const eveningScenes: Record<string, Scene> = {
  'F13-EveningTransition': {
    id: 'F13-EveningTransition',
    title: '暮色',
    description: '你整理东西，没有心情，在城堡里逛了逛。晚饭之后，夜幕降临了。',
    paragraphs: [
      { text: '你回到了卧房，闷闷不乐地开始收拾你的行李。\n看来离开是必然的事实，至少现在还没人告诉你其他答案。' },
      { text: '玛格丽特修女来过一次，她帮你收拾了一些衣服。\n尽管她的面容隐藏在黑纱下，你却仍能从她沙哑的声音里听出她的情绪。' },
      { text: '她也显得有些心不在焉。\n“殿下，您想去外面走走吗？晚餐做好之前回来就好。”', isDialogue: true },
      { text: '正合你意。' },
      { text: '你走出房门。\n芬因早就离开，他的鲜花被修女插在花瓶里，就放在你的门边。' },
      { text: '你漫无目的地逛了一会儿，不经意间，似乎要将看了十四年的翠谷风光和居住的溪木堡永远记在心里。\n你不知道自己会不会再回来。' },
      { text: '天色转暗时，你听见玛格丽特修女的呼唤。' },
      { text: '你最后一次望向林谷村的方向，转身走进城堡。\n晚饭后，夜晚真正降临了。' }
    ],
    choices: [
      { text: '继续', nextSceneId: 'F14-NightActions' }
    ]
  }
};
