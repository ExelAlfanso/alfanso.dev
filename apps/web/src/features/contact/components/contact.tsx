import { motion } from "framer-motion";
import type React from "react";
import Button from "../../../Components/button";
import Text from "../../../Components/typography/text";
import { fadeInAnimation } from "../../../constants/animation-variants";

interface ContactProps {
  className?: string;
  id: string;
}

const Contact: React.FC<ContactProps> = ({ id, className }) => (
  <motion.section
    className={`mb-75 ${className} my-100 flex flex-col items-center justify-center`}
    id={id}
    initial="initial"
    variants={fadeInAnimation}
    whileInView="animate"
  >
    <h1 className="mb-10 px-20 text-center font-bold text-4xl text-accent lg:text-5xl">
      Have a Big Idea? Let’s Build It Together.
    </h1>
    <Text className="mb-10 w-1/2 text-center text-[16px] lg:text-[24px]">
      I love turning complex problems into elegant solutions. From the first
      sketch to the final launch, I’m here to help you navigate the journey.
    </Text>
    <Button href="#Footer">Contact Me</Button>
  </motion.section>
);

export default Contact;
