export interface ProjectItem {
  categories: string[];
  category: "GAME DEVELOPMENT" | "WEB DEVELOPMENT" | "APP DEVELOPMENT";
  description: string;
  href: string;
  img: string;
  name: string;
  workType: "COLLABORATIVE" | "PERSONAL";
}
