'use client'

import { GlassCard } from '@/components/ui/GlassCard'
import { GlassButton } from '@/components/ui/GlassButton'
import { useRouter } from 'next/navigation'
import { Play } from 'lucide-react'

interface TodayWorkoutProps {
  programName?: string
  dayFocus?: string
  dayId?: string
  isRestDay?: boolean
  completed?: boolean
}

export function TodayWorkout({ programName, dayFocus, dayId, isRestDay, completed }: TodayWorkoutProps) {
  const router = useRouter()

  if (!programName) {
    return (
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold mb-2">No Active Program</h3>
        <p className="text-text-secondary text-sm mb-4">You haven&apos;t started a training program yet.</p>
        <GlassButton onClick={() => router.push('/train')}>
          Find a Program
        </GlassButton>
      </GlassCard>
    )
  }

  if (isRestDay) {
    return (
      <GlassCard className="p-6 border-accent-recovery/30 bg-accent-recovery/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-accent-recovery/20 flex items-center justify-center text-accent-recovery">
            💤
          </div>
          <div>
            <h3 className="text-xl font-bold text-accent-recovery">Rest Day</h3>
            <p className="text-sm text-text-secondary">Take it easy and recover today.</p>
          </div>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-xs text-accent-primary uppercase tracking-wider font-semibold mb-1">Today&apos;s Session</p>
          <h3 className="text-2xl font-bold">{dayFocus}</h3>
          <p className="text-sm text-text-secondary mt-1">{programName}</p>
        </div>
      </div>
      
      {completed ? (
        <div className="w-full py-3 bg-accent-primary/20 text-accent-primary text-center rounded-xl font-semibold">
          Workout Completed! 🏆
        </div>
      ) : (
        <GlassButton 
          onClick={() => router.push(`/train/workout/${dayId}`)}
          className="gap-2"
        >
          <Play size={18} fill="currentColor" />
          Start Workout
        </GlassButton>
      )}
    </GlassCard>
  )
}
