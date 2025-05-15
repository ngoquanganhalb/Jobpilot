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
    triggerOnce: false,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{
        opacity: inView ? 1 : 0,
        y: inView ? 0 : 30,
        scale: inView ? 1 : 0.95,
        transition: {
          duration: 0.8,
          delay,
          ease: [0.22, 1, 0.36, 1], // ease-out expo
        },
      }}
    >
      {children}
    </motion.div>
  );
}
