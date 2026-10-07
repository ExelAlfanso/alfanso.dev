import type React from "react";

interface BurgerMenuProps {
  className?: string;
}
const BurgerMenu: React.FC<BurgerMenuProps> = ({ className }) => (
  <div className={`grid justify-items-center gap-1.5 ${className}`}>
    <span className="h-0.5 w-8 rounded-l-3xl bg-accent" />
    <span className="h-0.5 w-8 rounded-full bg-accent" />
    <span className="h-0.5 w-8 rounded-full bg-accent" />
  </div>
);

export default BurgerMenu;
