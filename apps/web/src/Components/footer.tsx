import { Copyright } from "lucide-react";
import type React from "react";
import { Link } from "react-router-dom";
import { footerDatas } from "../data/footer-data";
import Text from "./typography/text";

interface FooterProps {
  className?: string;
  id: string;
}

const Footer: React.FC<FooterProps> = ({ id, className }) => (
  <div
    className={`flex h-80 w-full flex-row items-center justify-between gap-10 overflow-hidden bg-secondary px-10 lg:px-50 ${className} `}
    id={id}
  >
    <div className="items-left flex flex-col">
      <div className="items-left mb-5 flex flex-row gap-5 font-accent">
        <div className="flex flex-row items-center gap-2">
          <Copyright className="my-2 w-4 text-accent" />
          <Text className="text-xs sm:text-base">2025 alfanso.xyz</Text>
        </div>
      </div>
      <Text className="font-accent text-xs sm:text-base">
        Exel Boy Alfanso - Software Engineer & Game Developer
      </Text>
      <Text className="font-p text-xs sm:text-base">
        exel.alfanso@gmail.com
      </Text>
    </div>
    <div className="grid grid-cols-2 gap-5">
      {footerDatas.map((data) => (
        <Link
          className="flex flex-row gap-2 font-heading text-accent text-xs transition-colors hover:text-white sm:text-base"
          key={data.id}
          target="_blank"
          to={data.href}
        >
          <p>0{data.id}</p>
          <p>{data.label}</p>
        </Link>
      ))}
    </div>
  </div>
);

export default Footer;
