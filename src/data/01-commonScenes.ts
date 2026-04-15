import { Scene } from '../types';

export const commonScenes: Record<string, Scene> = {
  start: {
    id: 'start',
    title: '绛红女王',
    description: '赫西王室的起源与凯瑟琳公主的诞生。',
    bgm: "https://cdn.pixabay.com/audio/2023/03/27/audio_5f7c3d5b65.mp3",
    paragraphs: [
      { text: '自古以来，狐狸奔跑在大地，黑鹰飞翔在天空，红鹿踱步于林间。\n直到劳顿·赫西与伊莎贝拉·赫西的女儿——征服王国的凯瑟琳·赫西公主诞生。' }
    ],
    choices: [
      { 
        text: '狐狸之路 ', 
        nextSceneId: 'F1-fox', 
        animalType: 'fox', 
        sfx: 'https://cdn.pixabay.com/audio/2022/03/15/audio_c8c8a73467.mp3',
        explanation: '你将带来，你将带去。\n你将统治，你将君临。\n哪一个才是你的未来？' 
      },
      { 
        text: '红鹿之路', 
        nextSceneId: 'd1-deer', 
        animalType: 'deer', 
        sfx: 'https://cdn.pixabay.com/audio/2022/03/15/audio_c8c8a73467.mp3',
        explanation: '雀鸟与铁剑，弟弟与儿子。你是女王的夜莺，还是持琴的骑士？' 
      },
      { 
        text: '黑鹰之路', 
        nextSceneId: 'eagle', 
        animalType: 'eagle', 
        sfx: 'https://cdn.pixabay.com/audio/2022/03/15/audio_c8c8a73467.mp3',
        explanation: '篡夺者与被遗忘者。你是权力的棋子，还是破局的利刃？'
      },
      { 
        text: '纺锤之路', 
        nextSceneId: 'Destiny', 
        animalType: 'destiny', 
        sfx: 'https://cdn.pixabay.com/audio/2022/03/15/audio_c8c8a73467.mp3',
        explanation: '在你被尊为白王之前，这里有一千零一根羊毛。作为纺织女，你需要将它们全部纺织成线。'
      }
    ]
  },
  
  
};
