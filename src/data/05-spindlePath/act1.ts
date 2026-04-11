import { Scene } from '../../types';

export const spindleAct1Scenes: Record<string, Scene> = {
  'Destiny': {
    id: 'Destiny',
    title: '拜启七神之七，哑言诗人与无性无声之琴',
    description: '角色命运dlc',
    paragraphs: [
      { text: '现在，你想弹拨哪一根琴弦？' }
    ],
    choices: [
      { text: '安妮·朗珀蕾（Anne Langperley）', nextSceneId: 'start' },
      { text: '迪恩·哈蒙德（Dean Hammond）', nextSceneId: 'start' },
      { text: '尤金妮亚·赫西（Yugenia Hessie）', nextSceneId: "start" },
      { text: '菲利克斯·德·雷斯多（Felix de Lesdo）', nextSceneId: 'start' }
    ]
  },
};
//安妮：WeavingWomenAndWhiteQueen

//迪恩 ：Thedespisedeldestson

//尤金妮亚 ：Lesdo'sdaughter

//菲利克斯：Therunawayprodigalson