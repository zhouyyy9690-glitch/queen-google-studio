import { morningScenes } from './act1-p1-morning';
import { dayScenes } from './act1-p2-day';
import { eveningScenes } from './act1-p3-evening';
import { nightScenes } from './act1-p4-night';
import { afterDayScenes } from './act1-p5-Afterday';
import { endingScenes } from './act1-p6-Ending';

export const act1Scenes = {
  ...morningScenes,
  ...dayScenes,
  ...eveningScenes,
  ...nightScenes,
  ...afterDayScenes,
  ...endingScenes,
};
