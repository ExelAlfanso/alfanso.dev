import { type MotionValue, useSpring, useTransform } from "motion/react";

export const useTimelineItemMotion = (
  scrollYProgress: MotionValue<number>,
  index: number,
  total: number
) => {
  const startProgress = (index / total) * 0.8;
  const endProgress = ((index + 1) / total) * 0.8;

  return useSpring(
    useTransform(
      scrollYProgress,
      [startProgress, endProgress, 0.8],
      [500, 0, 0]
    ),
    {
      damping: 20,
      stiffness: 150,
    }
  );
};
