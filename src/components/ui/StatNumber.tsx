'use client'

import { motion, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'

interface StatNumberProps {
  value: number
  animate?: boolean
  className?: string
  prefix?: string
  suffix?: string
}

export function StatNumber({ value, animate = true, className = '', prefix = '', suffix = '' }: StatNumberProps) {
  const springValue = useSpring(0, { stiffness: 50, damping: 20 })
  const displayValue = useTransform(springValue, (current) => Math.round(current))

  useEffect(() => {
    if (animate) {
      springValue.set(value)
    } else {
      springValue.jump(value)
    }
  }, [value, animate, springValue])

  return (
    <span className={`font-mono tabular-nums ${className}`}>
      {prefix}
      <motion.span>{animate ? displayValue : value}</motion.span>
      {suffix}
    </span>
  )
}
