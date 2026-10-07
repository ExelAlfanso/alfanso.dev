import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { navigationItems } from "../data/navbar-data";
import { useScrollSpy } from "../hooks/use-scroll-spy";
import BurgerMenu from "./icons/burger-menu";

const Navbar = () => {
  const activeSection = useScrollSpy(
    navigationItems.map((item) => item.href),
    300
  );

  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  const [isOpen, setIsOpen] = useState(false);
  const sideBarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        sideBarRef.current &&
        !sideBarRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  function handleClick() {
    setIsOpen((wasOpen) => !wasOpen);
  }
  function handleNavClick(href: string) {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (href.startsWith("#Projects") && element) {
        element.scrollIntoView({ behavior: "smooth", block: "end" });
      } else {
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
    setIsOpen(false);
  }
  return (
    <nav className="mt-10 flex w-full flex-col items-center justify-center">
      <motion.div
        className="fixed z-10 mt-30 hidden items-center justify-center gap-10 rounded-full bg-primary py-5 font-heading xs:text-[10px] transition-all md:flex md:w-3/4 xl:text-[32px]"
        style={{ opacity: navOpacity }}
      >
        {navigationItems.map((navItem) => (
          <button
            className={`top-0 cursor-pointer text-accent transition-all duration-500 hover:scale-110 hover:text-accent-two ${
              activeSection === navItem.href ? "text-accent-two" : "text-accent"
            } `}
            key={navItem.href}
            onClick={() => handleNavClick(navItem.href)}
            type="button"
          >
            {navItem.label}
          </button>
        ))}
      </motion.div>
      <div
        className="absolute z-10 flex w-full justify-end p-5 md:hidden"
        ref={sideBarRef}
      >
        {navigationItems.map((navItem) => (
          <button
            className={`fixed top-0 right-0 h-full w-80 cursor-pointer text-accent transition-all duration-500 hover:scale-110 hover:text-accent-two ${
              navItem.bg
            } ${isOpen ? navItem.translate : "translate-x-full"}`}
            key={navItem.href}
            onClick={() => handleNavClick(navItem.href)}
            type="button"
          >
            <h1 className="absolute top-180 z-10 origin-top-left -rotate-90 font-accent text-[2rem] lg:text-[3rem]">
              {`<<<<<<${navItem.label.toUpperCase()}>>>>>>`}
            </h1>
          </button>
        ))}
        <button onClick={handleClick} type="button">
          <BurgerMenu className="cursor-pointer transition-all hover:scale-130" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
