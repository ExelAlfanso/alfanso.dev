import { type MotionValue, useSpring, useTransform } from "motion/react";

export const useAboutAnimations = (scrollYProgress: MotionValue<number>) => {
  const slideFromLeft = useSpring(
    useTransform(scrollYProgress, [0, 0.6], ["-40vw", "0vw"]),
    { damping: 20, stiffness: 120 }
  );

  const slideFromRight = useSpring(
    useTransform(scrollYProgress, [0, 0.6], ["40vw", "0vw"]),
    { damping: 25, stiffness: 120 }
  );
  const imageLeftFastMobile = useSpring(
    useTransform(scrollYProgress, [0, 0.6], ["-40vw", "15vw"]),
    { damping: 20, stiffness: 120 }
  );
  const imageLeftSlowMobile = useSpring(
    useTransform(scrollYProgress, [0, 0.6], ["40vw", "-10vw"]),
    { damping: 20, stiffness: 120 }
  );
  const imageLeftFast = slideFromLeft;
  const imageLeftSlow = useSpring(
    useTransform(scrollYProgress, [0, 0.35], ["-40vw", "0vw"]),
    { damping: 25, stiffness: 120 }
  );
  const imageRight = slideFromRight;
  const textMotion = useSpring(
    useTransform(scrollYProgress, [0, 0.7], [1000, 0]),
    {
      damping: 20,
      stiffness: 150,
    }
  );
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

  return {
    headerMotion,
    imageLeftFast,
    imageLeftFastMobile,
    imageLeftSlow,
    imageLeftSlowMobile,
    imageRight,
    textMotion,
  };
};
