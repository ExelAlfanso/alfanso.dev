export interface FooterData {
  href: string;
  id: number;
  isExternal?: boolean;
  label: string;
}

export const footerDatas: FooterData[] = [
  {
    href: "https://twitter.com/exelcoeg",
    id: 1,
    label: "twitter",
  },
  {
    href: "https://www.linkedin.com/in/exel-boy-alfanso-a78bb2221/",
    id: 2,
    label: "linkedin",
  },
  {
    href: "https://github.com/ExelAlfanso",
    id: 3,
    label: "github",
  },
  {
    href: "https://www.instagram.com/exel.alfanso",
    id: 4,
    label: "instagram",
  },
  {
    href: "https://exelcoeg.itch.io/",
    id: 5,
    label: "itch.io",
  },
];
