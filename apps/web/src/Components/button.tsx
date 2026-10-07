import type React from "react";

interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  href: string;
  isExternal?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  href = "#Hero",
  isExternal = false,
}) => {
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (href.startsWith("#") && !isExternal) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else if (isExternal) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = href;
    }
  }

  return (
    <button
      className={`z-10 lg:text-3xl xl:border-2 xl:text-5xl ${className} cursor-pointer rounded-full border-1 border-accent bg-transparent px-5 py-1 font-bold text-accent transition-colors hover:border-white hover:text-white lg:px-7 lg:py-3`}
      onClick={handleClick}
      type="button"
    >
      <h1>{children}</h1>
    </button>
  );
};

export default Button;
