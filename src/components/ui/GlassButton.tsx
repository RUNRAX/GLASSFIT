'use client'
import { motion, HTMLMotionProps } from 'framer-motion'
import { forwardRef } from 'react'

interface GlassButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: 'primary' | 'secondary' | 'danger'
  loading?: boolean
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ children, variant = 'primary', loading, className = '', disabled, ...props }, ref) => {
    
    const baseClasses = "relative w-full overflow-hidden rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-dark flex items-center justify-center px-6 py-3"
    
    const variants = {
      primary: "bg-accent-primary text-base-dark font-semibold hover:bg-accent-primary/90 focus:ring-accent-primary",
      secondary: "glass-surface text-text-primary hover:bg-white/10 focus:ring-white/20",
      danger: "bg-accent-energy/20 text-accent-energy border border-accent-energy/30 hover:bg-accent-energy/30 focus:ring-accent-energy",
    }

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || loading ? 1 : 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={`${baseClasses} ${variants[variant]} ${disabled || loading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          children
        )}
      </motion.button>
    )
  }
)
GlassButton.displayName = 'GlassButton'
