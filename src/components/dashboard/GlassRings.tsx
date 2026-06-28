'use client'

import { ProgressRing } from '@/components/ui/ProgressRing'
import { GlassCard } from '@/components/ui/GlassCard'
import { motion } from 'framer-motion'

interface GlassRingsProps {
  volume: number
  calories: number
  streak: number
}

export function GlassRings({ volume, calories, streak }: GlassRingsProps) {
  return (
    <div className="relative w-full flex justify-center items-center py-8">
      {/* Container for the 3 concentric rings */}
      <div className="relative" style={{ width: 280, height: 280 }}>
        
        {/* Outer Ring: Volume */}
        <div className="absolute inset-0 flex items-center justify-center">
          <ProgressRing 
            value={volume} 
            max={10000} 
            size={280} 
            strokeWidth={16} 
            color="mint"
            label="Volume (kg)"
          />
        </div>

        {/* Middle Ring: Calories */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <ProgressRing 
            value={calories} 
            max={2500} 
            size={200} 
            strokeWidth={16} 
            color="coral" 
            label="kcal"
          />
        </div>

        {/* Inner Ring: Streak */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <ProgressRing 
            value={streak} 
            max={30} 
            size={120} 
            strokeWidth={16} 
            color="amber"
            label="Day Streak"
          />
        </div>
      </div>
    </div>
  )
}
