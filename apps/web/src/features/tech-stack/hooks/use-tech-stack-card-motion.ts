import { type MotionValue, useSpring, useTransform } from "motion/react";

export const useTechStackCardMotion = (
  scrollYProgress: MotionValue<number>,
  index: number,
  total: number,
  radius = 150
) => {
  const angle = (index / total) * Math.PI * 2;
  const offsetX = Math.cos(angle) * radius;
  const offsetY = Math.sin(angle) * radius;

  return {
    opacity: useSpring(useTransform(scrollYProgress, [0.1, 0.3], [0, 1]), {
      damping: 20,
      stiffness: 100,
    }),
    scale: useSpring(useTransform(scrollYProgress, [0.1, 0.3], [0.5, 1]), {
      damping: 20,
      stiffness: 100,
    }),
    x: useSpring(useTransform(scrollYProgress, [0.1, 0.5], [0, offsetX]), {
      damping: 20,
      stiffness: 80,
    }),
    y: useSpring(useTransform(scrollYProgress, [0.1, 0.5], [0, offsetY]), {
      damping: 20,
      stiffness: 80,
    }),
  };
};
