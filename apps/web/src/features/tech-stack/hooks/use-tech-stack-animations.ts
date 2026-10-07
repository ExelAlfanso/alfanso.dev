import { type MotionValue, useSpring, useTransform } from "motion/react";

export const useTechStackAnimations = (
  scrollYProgress: MotionValue<number>
) => {
  const sectionSlideLeft = useSpring(
    useTransform(scrollYProgress, [0, 0.5], ["-1000vw", "0"]),
    {
      damping: 20,
      mass: 0.8,
      stiffness: 80,
    }
  );

  const sectionSlideUp = useSpring(
    useTransform(scrollYProgress, [0, 0.5], ["100vh", "0vh"]),
    {
      damping: 20,
      mass: 0.8,
      stiffness: 80,
    }
  );

  const rotationY = useSpring(
    useTransform(scrollYProgress, [0, 0.2, 0.5], [0, 1, Math.PI * 1.5]),
    {
      damping: 20,
      mass: 0.8,
      stiffness: 80,
    }
  );

  const rotationX = useSpring(
    useTransform(scrollYProgress, [0, 0.2, 0.5], [0, 1, 0]),
    {
      damping: 20,
      mass: 0.8,
      stiffness: 80,
    }
  );

  const scale = useSpring(useTransform(scrollYProgress, [0, 0.7], [1, 3]), {
    damping: 20,
    mass: 0.8,
    stiffness: 80,
  });

  return {
    rotationX,
    rotationY,
    scale,
    sectionSlideLeft,
    sectionSlideUp,
  };
};
