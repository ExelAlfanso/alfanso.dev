import { Dot } from "lucide-react";

interface ChipProps {
  children: React.ReactNode;
  className?: string;
}

const Chip: React.FC<ChipProps> = ({ children, className }) => (
  <div
    className={`justiy-center flex h-10 w-30 items-center rounded-3xl bg-accent ${className}`}
  >
    <Dot />
    {children}
  </div>
);

export default Chip;
