import Button from "../../../Components/button";
import Header from "../../../Components/typography/header";
import PassportCard from "./passport-card";
import TextType from "./text-type";

interface HeroProps {
  className?: string;
  id: string;
}
const Hero: React.FC<HeroProps> = ({ id, className }) => (
  <section
    className={`z-10 flex w-full flex-col items-center justify-center pt-50 lg:mb-100 lg:flex-row lg:gap-20 ${className} overflow-hidden`}
    id={id}
  >
    <div className="items-left flex flex-col justify-center">
      <Header
        className="h-30 w-85 lg:mb-5 lg:h-50 lg:w-100 lg:text-left xl:h-80 xl:w-135"
        size="title"
      >
        <TextType
          className="text-accent lg:text-6xl xl:py-20 xl:text-7xl"
          cursorCharacter="|"
          loop={true}
          showCursor={true}
          text={"Hi! My name is Exel Boy Alfanso."}
          typingSpeed={60}
        />
      </Header>
      <div className="mb-10 hidden lg:block">
        <Button href="#Footer">CONTACT ME</Button>
      </div>
    </div>
    <div className="mb-10 lg:hidden xl:hidden">
      <Button href="#Footer">CONTACT ME</Button>
    </div>
    <PassportCard />
  </section>
);

export default Hero;
