import { motion, useScroll } from "motion/react";
import type React from "react";
import { useRef } from "react";
import Header from "../../../Components/typography/header";
import { useIsMobile } from "../../../hooks/use-is-mobile";
import { getMediaUrl } from "../../../lib/media-url";
import { useAboutAnimations } from "../hooks/use-about-animations";

interface AboutProps {
  className?: string;
  id: string;
}

const About: React.FC<AboutProps> = ({ id, className }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"],
    target: sectionRef,
  });
  const isMobile = useIsMobile();
  const {
    headerMotion,
    imageLeftFast,
    imageLeftFastMobile,
    imageLeftSlow,
    imageLeftSlowMobile,
    imageRight,
    textMotion,
  } = useAboutAnimations(scrollYProgress);
  return (
    <motion.section
      className={`mt-10 h-[700vh] text-center font-accent ${className} `}
      id={id}
      ref={sectionRef}
    >
      <div className="sticky top-0 h-[200vh] overflow-hidden">
        <motion.div style={headerMotion}>
          <Header
            className="mb-10 font-bold text-4xl lg:mb-0 lg:text-6xl xl:text-8xl"
            size="subtitle"
          >
            About
          </Header>
        </motion.div>
        <div className="relative flex w-full flex-col items-center justify-center px-10 md:flex-row md:justify-evenly md:gap-15">
          <div className="relative aspect-square w-100 md:w-150">
            <motion.img
              alt="Portrait of Exel Boy Alfanso"
              animate={{ visibility: "visible" }}
              className="max-w-1/3 object-cover md:max-w-2/3 lg:max-w-3/4"
              decoding="async"
              initial={{ visibility: "hidden" }}
              loading="lazy"
              src={getMediaUrl("profile/about-01.png")}
              style={{ x: isMobile ? imageLeftFastMobile : imageLeftFast }}
            />
            <motion.img
              alt="Exel Boy Alfanso working on projects"
              className="absolute right-0 bottom-20 max-w-1/3 object-cover md:right-10 md:-bottom-10 md:max-w-2/3 lg:max-w-3/4"
              decoding="async"
              loading="lazy"
              src={getMediaUrl("profile/about-03.png")}
              style={{ x: isMobile ? imageLeftSlowMobile : imageLeftSlow }}
            />
            <motion.div
              className="z-9999 ml-15 flex flex-col items-start text-left lg:w-1/2"
              style={{ y: textMotion }}
            >
              <h3 className="font-bold text-[16px] text-accent xl:text-[30px]">
                Exel Boy Alfanso,
              </h3>
              <p className="w-1/3 font-light text-[12px] lg:w-2/3 xl:w-2/3 xl:text-[16px]">
                He is a third-year Computer Science student at University of
                Brawijaya
              </p>
            </motion.div>
          </div>
          <div className="relative flex items-center justify-center">
            <motion.img
              alt="Exel Boy Alfanso - Game Developer and Software Engineer"
              className="max-w-1/2 object-cover md:max-w-2/3 lg:max-w-3/4"
              decoding="async"
              loading="lazy"
              src={getMediaUrl("profile/about-02.png")}
              style={{ x: imageRight }}
            />

            <motion.div
              className="absolute -bottom-10 left-10 flex flex-col md:bottom-0 xl:-left-40"
              style={{ y: textMotion }}
            >
              <p className="m-0 text-left font-bold text-[24px] leading-tight xl:text-[36px]">
                SOFTWARE ENGINEER
              </p>
              <p className="m-0 text-left font-bold text-[24px] leading-tight xl:text-[36px]">
                GAME DEVELOPER
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default About;
