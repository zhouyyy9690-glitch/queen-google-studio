import { Scene } from '../../../../types';

export const day1ScenesPart2: Record<string, Scene> = {
  'F61-OuterCityLife': {
    id: 'F61-OuterCityLife',
    ambience: 'https://cdn.pixabay.com/audio/2025/10/27/audio_dc93b69db8.mp3',
    title: '外城区',
    description: '外城风土',
    paragraphs: [
      { text: '外城的空气中弥漫着生活的气息，与内城的肃穆截然不同。' }
    ],
    choices: [
      { text: '继续', nextSceneId: 'Act2ChapterSplash' } // Placeholder transition
    ]
  }
};
