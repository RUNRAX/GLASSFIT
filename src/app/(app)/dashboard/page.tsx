import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { profiles, userPrograms, programs, programDays, nutritionTargets } from '@/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { GlassRings } from '@/components/dashboard/GlassRings'
import { TodayWorkout } from '@/components/dashboard/TodayWorkout'
import { QuickLinks } from '@/components/dashboard/QuickLinks'
import { GlassCard } from '@/components/ui/GlassCard'
import { StatNumber } from '@/components/ui/StatNumber'

export default async function DashboardPage() {
  const { userId } = auth()

  if (!userId) {
    redirect('/login')
  }

  // 1. Fetch Profile for Greeting
  const [profile] = await db.select().from(profiles).where(eq(profiles.id, userId))

  if (!profile) {
    redirect('/onboarding')
  }

  // 2. Fetch Active Program and Today's target
  const activeProgJoin = await db
    .select({
      programId: userPrograms.programId,
      programName: programs.name
    })
    .from(userPrograms)
    .innerJoin(programs, eq(userPrograms.programId, programs.id))
    .where(and(eq(userPrograms.userId, userId), eq(userPrograms.active, true)))
    .limit(1)

  const activeProg = activeProgJoin[0]

  // Find what day they are on based on logs (simplification for MVP: just day 1 if no logs)
  let nextDay: any = null
  if (activeProg) {
    const days = await db
      .select()
      .from(programDays)
      .where(eq(programDays.programId, activeProg.programId))
      .orderBy(programDays.dayNumber)
      
    // Ideally we check workout_logs to find the next incomplete day. 
    // We'll just assume Day 1 for now if not implemented.
    nextDay = days?.[0]
  }

  // 3. Fetch Nutrition Target
  const [nutrition] = await db
    .select({
      calorieTarget: nutritionTargets.calorieTarget,
      proteinG: nutritionTargets.proteinG,
      carbsG: nutritionTargets.carbsG,
      fatG: nutritionTargets.fatG
    })
    .from(nutritionTargets)
    .where(eq(nutritionTargets.userId, userId))
    .orderBy(desc(nutritionTargets.calculatedAt))
    .limit(1)

  // Dummy stats for the UI to look alive
  const volume = 4520;
  const streak = 3;

  return (
    <div className="flex flex-col gap-8 pb-12">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-display font-bold">
          Ready to work?
        </h2>
        <p className="text-text-secondary mt-1">Let&apos;s crush today&apos;s goals.</p>
      </div>

      {/* Glass Rings */}
      <GlassRings 
        volume={volume}
        calories={nutrition?.calorieTarget ? Number(nutrition.calorieTarget) : 0}
        streak={streak}
      />

      {/* Today's Workout */}
      <TodayWorkout 
        programName={activeProg?.programName}
        dayFocus={nextDay?.focus}
        dayId={nextDay?.id}
        isRestDay={nextDay?.focus?.toLowerCase() === 'rest'}
        completed={false}
      />

      {/* Quick Links */}
      <QuickLinks />

      {/* Macros Preview */}
      {nutrition && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-bold mb-4">Daily Targets</h3>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="flex flex-col">
              <span className="text-2xl font-mono text-coral"><StatNumber value={Math.round(Number(nutrition.calorieTarget))} /></span>
              <span className="text-[10px] text-text-secondary uppercase">Calories</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-mono text-mint"><StatNumber value={Math.round(Number(nutrition.proteinG))} /></span>
              <span className="text-[10px] text-text-secondary uppercase">Protein</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-mono text-amber"><StatNumber value={Math.round(Number(nutrition.carbsG))} /></span>
              <span className="text-[10px] text-text-secondary uppercase">Carbs</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-mono text-sky"><StatNumber value={Math.round(Number(nutrition.fatG))} /></span>
              <span className="text-[10px] text-text-secondary uppercase">Fats</span>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Personalized AI Plan Overview */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <span className="bg-accent-primary text-base-dark p-1 rounded">✨</span> Your Blueprint
        </h3>
        
        <div className="space-y-4 text-sm text-white/80">
          <p>
            Based on your goal to <strong className="text-white">{(profile?.primaryGoal || 'improve fitness').replace('_', ' ')}</strong> as a <strong className="text-white">{profile?.experienceLevel || 'beginner'}</strong>, 
            I&apos;ve assigned you the <strong className="text-accent-primary">{activeProg?.programName || 'Starter Program'}</strong>. 
          </p>
          
          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
            <h4 className="font-bold text-white mb-2">🍽️ Diet Strategy ({profile?.dietaryPreference || 'Any'})</h4>
            <ul className="list-disc pl-4 space-y-1">
              {profile?.primaryGoal === 'lose_fat' && (
                <li>Eat in a caloric deficit. Focus on high-volume, low-calorie foods to stay full.</li>
              )}
              {profile?.primaryGoal === 'build_muscle' && (
                <li>You need a caloric surplus. Don&apos;t skip meals, and eat carbs before training.</li>
              )}
              {profile?.primaryGoal === 'recomposition' && (
                <li>Eat at maintenance. Keep protein extremely high to build muscle while losing fat.</li>
              )}
              <li>Hit your {Math.round(Number(nutrition?.proteinG || 0))}g of protein to maximize recovery.</li>
              <li>Divide your meals into 3-4 servings spread evenly throughout the day.</li>
            </ul>
          </div>

          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
            <h4 className="font-bold text-white mb-2">⚡ Daily Routine</h4>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Morning:</strong> Hydrate immediately (500ml water). Light stretching.</li>
              <li><strong>Training:</strong> Do your <em>{nextDay?.focus || 'Workout'}</em> session when you have the most energy.</li>
              <li><strong>Recovery:</strong> Aim for 7-8 hours of sleep. Your activity level is {(profile?.activityLevel || 'sedentary').replace('_', ' ')}, so adjust rest accordingly.</li>
            </ul>
          </div>
        </div>
      </GlassCard>

    </div>
  )
}
