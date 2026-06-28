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
              <span className="text-2xl font-mono text-coral"><StatNumber value={Number(nutrition.calorieTarget)} /></span>
              <span className="text-[10px] text-text-secondary uppercase">Calories</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-mono text-mint"><StatNumber value={Number(nutrition.proteinG)} /></span>
              <span className="text-[10px] text-text-secondary uppercase">Protein</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-mono text-amber"><StatNumber value={Number(nutrition.carbsG)} /></span>
              <span className="text-[10px] text-text-secondary uppercase">Carbs</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-mono text-sky"><StatNumber value={Number(nutrition.fatG)} /></span>
              <span className="text-[10px] text-text-secondary uppercase">Fats</span>
            </div>
          </div>
        </GlassCard>
      )}

    </div>
  )
}
