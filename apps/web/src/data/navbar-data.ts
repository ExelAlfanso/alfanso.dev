export interface NavItem {
  bg: string;
  href: string;
  id: number;
  isExternal?: boolean;
  label: string;
  translate: string;
}

export const navigationItems: NavItem[] = [
  {
    bg: "bg-primary",
    href: "#Hero",
    id: 1,
    label: "Home",
    translate: "translate-x-20 lg:-translate-x-20",
  },
  {
    bg: "bg-secondary",
    href: "#About",
    id: 2,
    label: "About",
    translate: "translate-x-30 lg:-translate-x-0",
  },
  {
    bg: "bg-[#470F12]",
    href: "#Experiences",
    id: 3,
    label: "Experiences",
    translate: "translate-x-40 lg:translate-x-20",
  },
  {
    bg: "bg-[#59181B]",
    href: "#TechStack",
    id: 4,
    label: "TechStack",
    translate: "translate-x-50 lg:translate-x-40",
  },
  {
    bg: "bg-[#712528]",
    href: "#Projects",
    id: 5,
    label: "Projects",
    translate: "translate-x-60 lg:translate-x-60",
  },
];
