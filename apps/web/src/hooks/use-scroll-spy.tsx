import { useEffect, useState } from "react";

export function useScrollSpy(selectors: string[], offset = 100) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      let current = "";

      for (const selector of selectors) {
        const element = document.querySelector(selector);

        if (element) {
          const rect = element.getBoundingClientRect();

          if (rect.top <= offset && rect.bottom >= offset) {
            current = selector;
          }
        }
      }

      setActiveId(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [selectors, offset]);

  return activeId;
}
