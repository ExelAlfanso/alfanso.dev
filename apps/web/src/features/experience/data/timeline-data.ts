import type { TimelineItem } from "../types/timeline";
import { achievementDatas } from "./achievements-data";
import { experiencesDatas } from "./experiences-data";

export const timelineDatas: TimelineItem[] = [
  ...experiencesDatas,
  ...achievementDatas,
];
