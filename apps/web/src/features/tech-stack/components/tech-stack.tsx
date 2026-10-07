import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { type MotionValue, motion, useScroll } from "motion/react";
import React, { Suspense, useRef } from "react";
import Text from "../../../Components/typography/text";
import { getMediaUrl } from "../../../lib/media-url";
import { techStackDatas } from "../data/tech-stack-data";
import { useTechStackAnimations } from "../hooks/use-tech-stack-animations";
import { useTechStackCardMotion } from "../hooks/use-tech-stack-card-motion";
import type { TechStackItem } from "../types/tech-stack";
import Exel from "./exel";

interface TechStackProps {
  className?: string;
  id: string;
}

const TechStack: React.FC<TechStackProps> = ({ id, className }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isXL, setIsXL] = React.useState(false);
  const [isMdUp, setIsMdUp] = React.useState(false);

  React.useEffect(() => {
    const updateBreakpoints = () => {
      const width = window.innerWidth;
      setIsXL(width >= 1000);
      setIsMdUp(width >= 768);
    };

    updateBreakpoints();
    window.addEventListener("resize", updateBreakpoints);
    return () => window.removeEventListener("resize", updateBreakpoints);
  }, []);

  const { scrollYProgress } = useScroll({
    offset: ["start center", "end center"],
    target: sectionRef,
  });
  const { sectionSlideLeft, sectionSlideUp, rotationX, rotationY, scale } =
    useTechStackAnimations(scrollYProgress);

  const sectionMotionStyle = isMdUp
    ? { x: sectionSlideLeft }
    : { y: sectionSlideUp };

  return (
    <motion.section
      className={`z-50 h-[400vh] ${className}`}
      id={id}
      ref={sectionRef}
    >
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-evenly lg:flex-row">
        <motion.div
          className="z-20 my-20 mb-10 flex flex-col items-center justify-start gap-10 px-20 md:px-0 lg:w-1/3 lg:items-start lg:justify-center"
          style={sectionMotionStyle}
        >
          <h1 className="text-center font-bold text-4xl text-accent lg:text-left">
            The stack powering my work.
          </h1>
          <Text className="text-center text-xl lg:pr-20 lg:text-left xl:pr-40">
            The tools and technologies behind how I build, ship, and scale
            products.
          </Text>
        </motion.div>
        <motion.div
          className="flex aspect-square h-auto w-screen flex-col items-center justify-center md:mb-20 lg:w-1/2"
          style={sectionMotionStyle}
        >
          {techStackDatas.map((tech, index) => (
            <TechStackIcon
              index={index}
              key={tech.label}
              radius={isXL ? 250 : 150}
              scrollYProgress={scrollYProgress}
              tech={tech}
              total={techStackDatas.length}
            />
          ))}
          <Canvas>
            {/* biome-ignore lint/suspicious/noUnknownAttribute: React Three Fiber uses Three.js props here. */}
            <ambientLight intensity={0.8} />
            {/* biome-ignore lint/suspicious/noUnknownAttribute: React Three Fiber uses Three.js props here. */}
            <directionalLight intensity={1} position={[5, 5, 5]} />
            <OrbitControls enabled={false} />
            <Suspense fallback={null}>
              <Exel rotationX={rotationX} rotationY={rotationY} scale={scale} />
            </Suspense>
            <Environment preset="sunset" />
          </Canvas>
        </motion.div>
      </div>
    </motion.section>
  );
};

function TechStackIcon({
  tech,
  index,
  total,
  radius,
  scrollYProgress,
}: {
  tech: TechStackItem;
  index: number;
  total: number;
  radius: number;
  scrollYProgress: MotionValue<number>;
}) {
  const cardMotion = useTechStackCardMotion(
    scrollYProgress,
    index,
    total,
    radius
  );

  return (
    <motion.div
      className="group absolute z-9999 rounded-lg bg-primary p-3 transition-normal duration-200 hover:scale-110"
      style={cardMotion}
    >
      {typeof tech.icon === "string" ? (
        <img
          alt={tech.label}
          className="h-5 w-5 transition-transform duration-200 lg:h-12 lg:w-12"
          src={getMediaUrl(tech.icon)}
        />
      ) : (
        <tech.icon className="h-5 w-5 transition-transform duration-200 lg:h-12 lg:w-12" />
      )}
    </motion.div>
  );
}

export default TechStack;
