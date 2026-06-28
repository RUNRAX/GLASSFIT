'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GlassInput } from '@/components/ui/GlassInput'
import { GlassButton } from '@/components/ui/GlassButton'

const GOALS = [
  { id: 'lose_fat', label: 'Lose Fat' },
  { id: 'build_muscle', label: 'Build Muscle' },
  { id: 'recomposition', label: 'Recomposition' },
  { id: 'maintain', label: 'Maintain' },
  { id: 'general_fitness', label: 'General Fitness' }
]

const EXPERIENCE = [
  { id: 'beginner', label: 'Beginner (< 1 year)' },
  { id: 'intermediate', label: 'Intermediate (1-3 years)' },
  { id: 'advanced', label: 'Advanced (3+ years)' }
]

const EQUIPMENT = [
  { id: 'body_only', label: 'Bodyweight Only' },
  { id: 'dumbbell', label: 'Dumbbells / Kettlebells' },
  { id: 'full_gym', label: 'Full Gym Access' }
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    sex: 'male',
    date_of_birth: '1990-01-01',
    height_cm: 175,
    weight_kg: 70,
    body_fat_pct: '',
    activity_level: 'moderate',
    primary_goal: 'general_fitness',
    experience_level: 'beginner',
    dietary_preference: 'none',
    equipment: ['body_only']
  })

  const updateForm = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleEquipmentToggle = (id: string) => {
    setFormData(prev => {
      const current = prev.equipment
      if (current.includes(id)) {
        // don't allow empty
        if (current.length === 1) return prev
        return { ...prev, equipment: current.filter(e => e !== id) }
      }
      return { ...prev, equipment: [...current, id] }
    })
  }

  const submitOnboarding = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          body_fat_pct: formData.body_fat_pct ? parseFloat(formData.body_fat_pct) : null
        })
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      
      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg glass-surface p-8 rounded-[24px]">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2 text-center">Set Up Your Profile</h2>
          <div className="flex gap-2 justify-center mt-4">
            {[1, 2, 3].map(s => (
              <div 
                key={s} 
                className={`h-2 w-12 rounded-full transition-colors ${s <= step ? 'bg-accent-primary' : 'bg-white/20'}`}
              />
            ))}
          </div>
        </div>

        {error && (
           <div className="mb-4 p-3 bg-accent-energy/10 border border-accent-energy/20 rounded-xl text-accent-energy text-sm">
             {error}
           </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex gap-4">
               <div className="flex-1">
                 <label className="text-sm text-text-secondary ml-1 mb-1 block">Sex</label>
                 <select 
                   className="w-full glass-surface p-3 rounded-2xl outline-none"
                   value={formData.sex}
                   onChange={e => updateForm('sex', e.target.value)}
                 >
                   <option value="male" className="bg-base-dark">Male</option>
                   <option value="female" className="bg-base-dark">Female</option>
                 </select>
               </div>
               <div className="flex-1">
                 <GlassInput 
                   label="Date of Birth" 
                   type="date" 
                   value={formData.date_of_birth}
                   onChange={e => updateForm('date_of_birth', e.target.value)}
                 />
               </div>
            </div>
            
            <div className="flex gap-4">
               <div className="flex-1">
                 <GlassInput 
                   label="Height (cm)" 
                   type="number" 
                   value={formData.height_cm}
                   onChange={e => updateForm('height_cm', parseFloat(e.target.value))}
                 />
               </div>
               <div className="flex-1">
                 <GlassInput 
                   label="Weight (kg)" 
                   type="number" 
                   value={formData.weight_kg}
                   onChange={e => updateForm('weight_kg', parseFloat(e.target.value))}
                 />
               </div>
            </div>

            <GlassInput 
              label="Body Fat % (Optional)" 
              type="number" 
              placeholder="e.g. 15"
              value={formData.body_fat_pct}
              onChange={e => updateForm('body_fat_pct', e.target.value)}
            />

            <GlassButton onClick={() => setStep(2)}>Next Step</GlassButton>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <label className="text-sm text-text-secondary ml-1 mb-2 block">Primary Goal</label>
              <div className="flex flex-col gap-2">
                {GOALS.map(g => (
                  <button
                    key={g.id}
                    onClick={() => updateForm('primary_goal', g.id)}
                    className={`p-4 rounded-xl text-left transition-colors border ${formData.primary_goal === g.id ? 'bg-accent-primary/20 border-accent-primary text-accent-primary' : 'glass-surface border-transparent text-text-primary'}`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-text-secondary ml-1 mb-2 block">Experience Level</label>
              <div className="flex flex-col gap-2">
                {EXPERIENCE.map(e => (
                  <button
                    key={e.id}
                    onClick={() => updateForm('experience_level', e.id)}
                    className={`p-4 rounded-xl text-left transition-colors border ${formData.experience_level === e.id ? 'bg-accent-primary/20 border-accent-primary text-accent-primary' : 'glass-surface border-transparent text-text-primary'}`}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex gap-4">
              <GlassButton variant="secondary" onClick={() => setStep(1)}>Back</GlassButton>
              <GlassButton onClick={() => setStep(3)}>Next Step</GlassButton>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <label className="text-sm text-text-secondary ml-1 mb-2 block">Available Equipment</label>
              <div className="flex flex-col gap-2">
                {EQUIPMENT.map(eq => (
                  <button
                    key={eq.id}
                    onClick={() => handleEquipmentToggle(eq.id)}
                    className={`p-4 rounded-xl text-left transition-colors border ${formData.equipment.includes(eq.id) ? 'bg-accent-primary/20 border-accent-primary text-accent-primary' : 'glass-surface border-transparent text-text-primary'}`}
                  >
                    {eq.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-text-secondary ml-1 mb-2 block">Activity Level (for nutrition)</label>
              <select 
                 className="w-full glass-surface p-4 rounded-xl outline-none"
                 value={formData.activity_level}
                 onChange={e => updateForm('activity_level', e.target.value)}
               >
                 <option value="sedentary" className="bg-base-dark">Sedentary (Office job)</option>
                 <option value="light" className="bg-base-dark">Lightly Active (1-3 days/wk)</option>
                 <option value="moderate" className="bg-base-dark">Moderately Active (3-5 days/wk)</option>
                 <option value="active" className="bg-base-dark">Very Active (6-7 days/wk)</option>
                 <option value="very_active" className="bg-base-dark">Extra Active (Physical job)</option>
               </select>
            </div>

            <div className="flex gap-4">
              <GlassButton variant="secondary" onClick={() => setStep(2)}>Back</GlassButton>
              <GlassButton onClick={submitOnboarding} loading={loading}>Complete Setup</GlassButton>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
