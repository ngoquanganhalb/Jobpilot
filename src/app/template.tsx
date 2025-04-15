"use client";
// https://motion.dev/docs/react-layout-animations
// npm framer-motion ??
//page routing animation
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      {/* scale fadefade */}
      <motion.div
        key={pathname}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
      {/* down up fade */}
      {/* <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
        className="min-h-screen"
      >
        {children}
      </motion.div> */}
    </AnimatePresence>
  );
}
