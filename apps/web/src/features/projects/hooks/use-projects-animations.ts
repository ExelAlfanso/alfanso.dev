import { type MotionValue, useSpring, useTransform } from "motion/react";

export const useProjectsAnimations = (scrollYProgress: MotionValue<number>) => {
  const headerY = useSpring(useTransform(scrollYProgress, [0, 0.2], [24, 0]), {
    damping: 20,
    stiffness: 120,
  });

  const itemsOpacity = useSpring(
    useTransform(scrollYProgress, [0.1, 0.4], [0, 1]),
    {
      damping: 20,
      stiffness: 100,
    }
  );

  const cardAnimation = {
    exit: { opacity: 0, y: 30 },
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return { cardAnimation, headerY, itemsOpacity };
};
