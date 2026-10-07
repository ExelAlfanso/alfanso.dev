import { type MotionValue, motion, useScroll } from "motion/react";
import type React from "react";
import { useRef } from "react";
import Header from "../../../Components/typography/header";
import Text from "../../../Components/typography/text";
import { timelineDatas } from "../data/timeline-data";
import { useExperiencesAnimations } from "../hooks/use-experiences-animations";
import { useTimelineItemMotion } from "../hooks/use-timeline-item-motion";

interface ExperiencesProps {
  className?: string;
  id: string;
}

const Experiences: React.FC<ExperiencesProps> = ({ id, className }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"],
    target: sectionRef,
  });

  const { headerMotion } = useExperiencesAnimations(scrollYProgress);

  return (
    <div className="relative" ref={sectionRef}>
      <motion.section
        className={`relative z-0 h-[300vh] font-accent md:h-[250vh] ${className}`}
        id={id}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <motion.div style={headerMotion}>
            <Header
              className="mx-auto mb-10 w-full text-center font-bold xl:mb-20"
              size="subtitle"
            >
              Experiences & Achievements
            </Header>
          </motion.div>
          <motion.div className="flex w-full flex-col items-center justify-center px-5 py-5 lg:px-30">
            {timelineDatas.map((item, index) => (
              <TimelineRow
                index={index}
                item={item}
                key={`${item.year}-${item.label}`}
                scrollYProgress={scrollYProgress}
                total={timelineDatas.length}
              />
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

function TimelineRow({
  item,
  index,
  total,
  scrollYProgress,
}: {
  item: (typeof timelineDatas)[number];
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const itemMotion = useTimelineItemMotion(scrollYProgress, index, total);

  return (
    <motion.div
      className="mb-4 w-full text-accent md:mb-5"
      style={{ y: itemMotion }}
    >
      <div className="relative w-full cursor-default transition-transform duration-300 hover:scale-105">
        <div className="flex flex-col items-start justify-between gap-2 md:flex-row-reverse md:items-center md:gap-0">
          <Text className="w-full text-left font-mono text-sm md:w-1/3 md:text-right md:text-lg lg:text-[24px]">
            {item.label}
          </Text>
          <p className="text-left text-2xl md:text-center md:text-4xl lg:text-[48px]">
            {item.year}
          </p>
        </div>
        <div className="w-full border-accent border-b" />
      </div>
    </motion.div>
  );
}

export default Experiences;
