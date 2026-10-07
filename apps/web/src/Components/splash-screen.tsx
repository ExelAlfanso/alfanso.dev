import { motion } from "motion/react";

export default function SplashScreen() {
  return (
    <motion.div
      animate={{ opacity: 0 }}
      className={
        "pointer-events-none fixed inset-0 z-[1000] flex items-center justify-center bg-primary text-accent transition-opacity"
      }
      initial={{ opacity: 1 }}
      transition={{ delay: 2.5, duration: 1 }}
    >
      <div className="relative flex items-center justify-center">
        <motion.svg
          className="h-auto w-64 text-accent"
          fill="none"
          height="791"
          viewBox="0 0 587 791"
          width="587"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            animate={{ strokeDashoffset: 0 }}
            d="M582 5H5V786H582V5Z"
            initial={{ strokeDasharray: 1, strokeDashoffset: 1 }}
            pathLength={1}
            stroke="currentColor"
            strokeWidth="10"
            transition={{ duration: 2, ease: "easeIn" }}
          />
        </motion.svg>
        <motion.div
          animate={{ opacity: 1 }}
          className="absolute inset-0 grid place-items-center"
          initial={{ opacity: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <span className="font-heading text-xl tracking-wide">
            alfanso.xyz
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
