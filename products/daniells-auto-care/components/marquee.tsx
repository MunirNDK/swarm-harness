"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  className?: string;
  speed?: number; // seconds per full loop
}

export function Marquee({ items, className, speed = 40 }: MarqueeProps) {
  const duplicated = [...items, ...items];

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
      >
        {duplicated.map((item, idx) => (
          <span
            key={`${item}-${idx}`}
            className="text-lg font-medium text-dac-muted/60 hover:text-white transition-colors cursor-default"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
