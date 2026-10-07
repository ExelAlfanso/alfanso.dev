import type React from "react";

interface HeadingProps {
  alignment?: "left" | "center" | "right";
  children: React.ReactNode;
  className?: string;
  size?: "title" | "subtitle" | "description";
}

const Heading: React.FC<HeadingProps> = ({
  children,
  className,
  alignment = "center",
  size = "title",
}) => {
  const sizeClass = {
    description: "text-2xl",
    subtitle: "text-3xl lg:text-6xl xl:text-7xl",
    title: "text-4xl",
  };

  const alignmentClass = {
    center: "text-center",
    left: "text-left",
    right: "text-right",
  };
  return (
    <div
      className={`font-heading ${sizeClass[size]} ${className} ${alignmentClass[alignment]} text-accent`}
    >
      {children}
    </div>
  );
};

export default Heading;
