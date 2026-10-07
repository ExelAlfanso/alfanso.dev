import type React from "react";

interface TextProps {
  children?: React.ReactNode;
  className?: string;
}

const Text: React.FC<TextProps> = ({ children, className }) => (
  <div className={`font-mono text-accent text-base ${className}`}>
    {children}{" "}
  </div>
);

export default Text;
