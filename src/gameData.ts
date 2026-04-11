import { GameData } from './types';
import { commonScenes } from './data/01-commonScenes';
import { foxScenes } from './data/02-foxPath/index';
import { deerScenes } from './data/03-deerPath/index';
import { eagleScenes } from './data/04-eaglePath/index';
import { spindleScenes } from './data/05-spindlePath/index';

export const gameData: GameData = {
  initialScene: 'start',
  scenes: {
    ...commonScenes,
    ...foxScenes,
    ...deerScenes,
    ...eagleScenes,
    ...spindleScenes
  }
};
