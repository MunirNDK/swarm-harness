'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  staggerIndex?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
}

const directionOffset: Record<string, { x?: number; y?: number }> = {
  up: { y: 20 },
  down: { y: -20 },
  left: { x: 20 },
  right: { x: -20 },
};

export function Reveal({
  children,
  className,
  staggerIndex = 0,
  direction = 'up',
  delay,
}: RevealProps) {
  const offset = directionOffset[direction] ?? directionOffset.up;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.7,
        ease: 'easeOut',
        delay: delay ?? staggerIndex * 0.05,
      }}
    >
      {children}
    </motion.div>
  );
}