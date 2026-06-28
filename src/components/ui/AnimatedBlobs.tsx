'use client'

import { motion } from 'framer-motion'

export function AnimatedBlobs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[10%] left-[20%] w-96 h-96 bg-accent-primary/30 rounded-full mix-blend-screen blur-[80px]"
      />
      <motion.div
        animate={{
          x: [0, -100, 50, 0],
          y: [0, 100, -50, 0],
          scale: [1, 0.8, 1.2, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[40%] right-[20%] w-[30rem] h-[30rem] bg-accent-energy/20 rounded-full mix-blend-screen blur-[100px]"
      />
      <motion.div
        animate={{
          x: [0, 50, -100, 0],
          y: [0, 50, 100, 0],
          scale: [0.8, 1.2, 1, 0.8],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[10%] left-[30%] w-80 h-80 bg-accent-recovery/20 rounded-full mix-blend-screen blur-[70px]"
      />
    </div>
  )
}
