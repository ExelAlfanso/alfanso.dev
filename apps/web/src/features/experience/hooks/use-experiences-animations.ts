import { type MotionValue, useSpring, useTransform } from "motion/react";

export const useExperiencesAnimations = (
  scrollYProgress: MotionValue<number>
) => {
  const headerY = useTransform(scrollYProgress, [0, 0.15], [24, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  const headerMotion = {
    opacity: useSpring(headerOpacity, {
      damping: 20,
      stiffness: 120,
    }),
    y: useSpring(headerY, {
      damping: 20,
      stiffness: 120,
    }),
  };

  const imgMotion = useSpring(
    useTransform(scrollYProgress, [0, 0.1], [500, 0]),
    {
      damping: 20,
      stiffness: 150,
    }
  );

  return { headerMotion, imgMotion };
};
