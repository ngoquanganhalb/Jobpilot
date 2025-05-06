//animation wrapper in module
"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

type Props = {
  children: React.ReactNode;
  delay?: number;
};

export function SectionWrapper({ children, delay = 0 }: Props) {
  const { ref, inView } = useInView({
    threshold: 0.2,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={
        inView
          ? {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 0.8,
                delay,
                ease: [0.25, 0.8, 0.25, 1],
              },
            }
          : {}
      }
    >
      {children}
    </motion.div>
  );
}
