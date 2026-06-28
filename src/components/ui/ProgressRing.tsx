'use client'

import { motion, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'

interface ProgressRingProps {
  value: number
  max: number
  size?: number
  color?: 'mint' | 'coral' | 'amber'
  strokeWidth?: number
  label?: string
}

const COLORS = {
  mint: '#2EE6C5',
  coral: '#FF6B5B',
  amber: '#FFC857',
}

export function ProgressRing({ 
  value, 
  max, 
  size = 120, 
  color = 'mint',
  strokeWidth = 12,
  label
}: ProgressRingProps) {
  
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const safeValue = Math.min(Math.max(value, 0), max)
  
  // Spring physics for the ring fill
  const springValue = useSpring(0, { stiffness: 60, damping: 20 })
  
  // Transform spring value to stroke offset
  const strokeDashoffset = useTransform(
    springValue,
    [0, max],
    [circumference, circumference - (safeValue / max) * circumference]
  )

  useEffect(() => {
    springValue.set(safeValue)
  }, [safeValue, springValue])

  const hexColor = COLORS[color]

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* SVG Filter for the inner glow / glass tube effect */}
        <defs>
          <filter id={`glow-${color}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />
        
        {/* Fill */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={hexColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
          filter={`url(#glow-${color})`}
          className="drop-shadow-lg"
        />
      </svg>
      
      {/* Center Label */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="font-mono font-bold text-2xl" style={{ color: hexColor }}>
          {value}
        </span>
        {label && <span className="text-[10px] text-text-secondary uppercase tracking-wider">{label}</span>}
      </div>
    </div>
  )
}
