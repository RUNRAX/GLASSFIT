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
            showText={false}
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
            showText={false}
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
            showText={false}
          />
        </div>
        
        {/* Centralized Text Display to prevent overlap */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-1">
          <div className="text-center">
            <span className="font-mono font-bold text-lg text-mint">{Math.round(volume)}</span>
            <span className="text-[9px] text-text-secondary uppercase ml-1 block leading-none">Vol</span>
          </div>
          <div className="text-center">
            <span className="font-mono font-bold text-lg text-coral">{Math.round(calories)}</span>
            <span className="text-[9px] text-text-secondary uppercase ml-1 block leading-none">kCal</span>
          </div>
          <div className="text-center">
            <span className="font-mono font-bold text-lg text-amber">{streak}</span>
            <span className="text-[9px] text-text-secondary uppercase ml-1 block leading-none">Days</span>
          </div>
        </div>
      </div>
    </div>
  )
}
