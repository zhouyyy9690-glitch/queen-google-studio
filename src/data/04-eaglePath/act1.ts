import { Scene } from '../../types';

export const eagleAct1Scenes: Record<string, Scene> = {
  eagle: {
    id: 'eagle',
    title: '黑鹰之路',
    description: '黑鹰之路的开始',
    paragraphs: [
      { text: '你选择了黑鹰之路。' }
    ],
    choices: [
      { text: '返回', nextSceneId: 'start' }
    ]
  }
};
