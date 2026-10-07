import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import Dither from "../Components/background/dither";
import Footer from "../Components/footer";
import Navbar from "../Components/navbar";
import SplashScreen from "../Components/splash-screen";
import About from "../features/about/components/about";
import Contact from "../features/contact/components/contact";
import Experiences from "../features/experience/components/experience";
import Hero from "../features/hero/components/hero";
import ProjectsSection from "../features/projects/components/projects-section";
import TechStack from "../features/tech-stack/components/tech-stack";

const Home = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      <AnimatePresence>{showSplash ? <SplashScreen /> : null}</AnimatePresence>
      <div className="pointer-events-none fixed inset-0 -z-20 h-screen w-screen overflow-hidden">
        <Dither
          colorNum={4}
          disableAnimation={false}
          mouseRadius={0.3}
          waveAmplitude={0.2}
          waveColor={[0.9, 0.3, 0.3]}
          waveFrequency={2}
          waveSpeed={0.05}
        />
      </div>
      <Navbar />
      <main>
        <Hero className="z-10" id="Hero" />
        <About id="About" />
        <TechStack id="TechStack" />
        <Experiences id="Experiences" />
        <ProjectsSection id="Projects" />
        <Contact id="Contact" />
      </main>
      <Footer id="Footer" />
    </div>
  );
};

export default Home;
