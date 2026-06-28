'use client'

import { useState, useEffect } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassButton } from '@/components/ui/GlassButton'
import { StatNumber } from '@/components/ui/StatNumber'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Clock, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function WorkoutSession({ day, exercises }: { day: any, exercises: any[] }) {
  const router = useRouter()
  const [activeExerciseIdx, setActiveExerciseIdx] = useState(0)
  const [setsCompleted, setSetsCompleted] = useState<any[]>([])
  
  // Timer State
  const [restTimer, setRestTimer] = useState<number | null>(null)

  useEffect(() => {
    let interval: any
    if (restTimer !== null && restTimer > 0) {
      interval = setInterval(() => setRestTimer(prev => (prev! - 1)), 1000)
    } else if (restTimer === 0) {
      setRestTimer(null)
    }
    return () => clearInterval(interval)
  }, [restTimer])

  if (!day) return null

  const activeEx = exercises[activeExerciseIdx]
  const isFinished = activeExerciseIdx >= exercises.length

  const handleLogSet = (reps: number, weight: number) => {
    setSetsCompleted([...setsCompleted, {
      exercise_id: activeEx.exercise_id,
      actual_reps: reps,
      weight_kg: weight
    }])
    
    const currentSets = setsCompleted.filter(s => s.exercise_id === activeEx.exercise_id).length + 1
    
    if (currentSets >= activeEx.sets) {
      // Move to next exercise
      if (activeExerciseIdx < exercises.length) {
         setActiveExerciseIdx(prev => prev + 1)
      }
    } else {
      // Start rest timer
      setRestTimer(activeEx.rest_seconds)
    }
  }

  const completeWorkout = async () => {
    await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        program_day_id: day.id,
        log_date: new Date().toISOString().split('T')[0],
        completed: true,
        perceived_effort: 7, // Default for now
        exercise_logs: setsCompleted
      })
    })
    router.push('/dashboard')
    router.refresh()
  }

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
        <div className="w-24 h-24 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary text-4xl">
          🏆
        </div>
        <div>
          <h2 className="text-3xl font-display font-bold mb-2">Workout Complete!</h2>
          <p className="text-text-secondary">You crushed it today.</p>
        </div>
        <GlassButton onClick={completeWorkout}>Finish & Save</GlassButton>
      </div>
    )
  }

  const currentSetNum = setsCompleted.filter(s => s.exercise_id === activeEx.exercise_id).length + 1

  return (
    <div className="flex flex-col gap-6 relative">
      
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <p className="text-xs text-text-secondary tracking-wider">DAY {day.day_number}</p>
          <h2 className="text-2xl font-bold font-display">{day.focus}</h2>
        </div>
        <div className="text-sm font-mono text-accent-primary bg-accent-primary/10 px-3 py-1 rounded-full">
          {activeExerciseIdx + 1} / {exercises.length}
        </div>
      </header>

      {/* Rest Timer Overlay */}
      <AnimatePresence>
        {restTimer !== null && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-4 right-4 z-50 glass-surface border-accent-recovery p-6 rounded-[24px] shadow-2xl flex flex-col items-center gap-4 text-center"
          >
            <Clock size={32} className="text-accent-recovery mb-2" />
            <h3 className="text-2xl font-bold">Rest</h3>
            <div className="text-6xl font-mono text-accent-recovery tracking-tighter">
              {Math.floor(restTimer / 60)}:{(restTimer % 60).toString().padStart(2, '0')}
            </div>
            <GlassButton variant="secondary" onClick={() => setRestTimer(null)} className="mt-2 text-sm">
              Skip Rest
            </GlassButton>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Exercise */}
      <GlassCard className="p-6">
        <h3 className="text-2xl font-bold mb-1">{activeEx.exercise_library?.name || "Exercise"}</h3>
        <p className="text-text-secondary text-sm mb-6 capitalize">
          {activeEx.exercise_library?.primary_muscles?.join(', ')}
        </p>

        <div className="flex justify-between bg-black/20 p-4 rounded-2xl mb-8">
          <div className="text-center">
            <div className="text-[10px] text-text-secondary uppercase tracking-widest mb-1">Target Sets</div>
            <div className="font-mono text-xl">{activeEx.sets}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-text-secondary uppercase tracking-widest mb-1">Target Reps</div>
            <div className="font-mono text-xl text-accent-streak">{activeEx.reps}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-text-secondary uppercase tracking-widest mb-1">Rest</div>
            <div className="font-mono text-xl text-accent-recovery">{activeEx.rest_seconds}s</div>
          </div>
        </div>

        {/* Current Set Logger */}
        <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
          <h4 className="font-bold mb-4 flex items-center justify-between">
            <span>Set {currentSetNum} of {activeEx.sets}</span>
          </h4>
          
          <form 
            onSubmit={(e: any) => {
              e.preventDefault();
              handleLogSet(parseInt(e.target.reps.value), parseFloat(e.target.weight.value || 0))
            }}
            className="flex gap-4 items-end"
          >
             <div className="flex-1">
               <label className="text-xs text-text-secondary ml-1 mb-1 block">Weight (kg)</label>
               <input 
                 name="weight"
                 type="number"
                 step="0.5"
                 className="w-full bg-black/40 border border-white/10 p-3 rounded-xl font-mono text-lg text-center outline-none focus:border-accent-primary transition-colors"
                 placeholder="0.0"
               />
             </div>
             <div className="flex-1">
               <label className="text-xs text-text-secondary ml-1 mb-1 block">Reps</label>
               <input 
                 name="reps"
                 type="number"
                 required
                 defaultValue={parseInt(activeEx.reps.split('-')[0]) || 10}
                 className="w-full bg-black/40 border border-white/10 p-3 rounded-xl font-mono text-lg text-center outline-none focus:border-accent-primary transition-colors"
               />
             </div>
             <button 
               type="submit"
               className="h-[52px] px-6 bg-accent-primary text-base-dark font-bold rounded-xl active:scale-95 transition-transform flex items-center justify-center"
             >
               <Check size={24} />
             </button>
          </form>
        </div>
      </GlassCard>
      
      {/* Set History Preview */}
      {setsCompleted.filter(s => s.exercise_id === activeEx.exercise_id).length > 0 && (
        <div className="px-2">
          <h4 className="text-xs text-text-secondary uppercase tracking-wider mb-3">Completed Sets</h4>
          <div className="flex flex-col gap-2">
            {setsCompleted.filter(s => s.exercise_id === activeEx.exercise_id).map((s, i) => (
              <div key={i} className="flex justify-between items-center py-2 px-4 glass-surface rounded-lg opacity-60 text-sm font-mono">
                <span>Set {i + 1}</span>
                <span>{s.weight_kg > 0 ? `${s.weight_kg}kg × ` : ''}{s.actual_reps} reps</span>
                <Check size={14} className="text-accent-primary" />
              </div>
            ))}
          </div>
        </div>
      )}
      
    </div>
  )
}
