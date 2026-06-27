"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  index?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function Reveal({
  children,
  className,
  delay,
  index = 0,
  direction = "up",
}: RevealProps) {
  const resolvedDelay = delay ?? index * 0.05;
  const prefersReducedMotion = useReducedMotion();

  const directionOffset = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
  };

  const initial = prefersReducedMotion
    ? { opacity: 1, x: 0, y: 0 }
    : { opacity: 0, ...directionOffset[direction] };

  const animate = { opacity: 1, x: 0, y: 0 };

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
        delay: resolvedDelay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
