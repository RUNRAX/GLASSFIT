'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { forwardRef } from 'react'

interface GlassCardProps extends HTMLMotionProps<"div"> {
  hover?: boolean
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, hover = false, className = '', ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileTap={hover ? { scale: 0.96 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={`glass-surface rounded-[24px] overflow-hidden ${hover ? 'cursor-pointer hover:bg-white/5 transition-colors' : ''} ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
GlassCard.displayName = 'GlassCard'
