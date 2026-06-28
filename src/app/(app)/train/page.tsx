import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { userPrograms, programs, programDays, programExercises } from '@/db/schema'
import { eq, and, count } from 'drizzle-orm'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassButton } from '@/components/ui/GlassButton'
import Link from 'next/link'

export default async function TrainPage() {
  const { userId } = auth()

  if (!userId) redirect('/login')

  const activeProgJoin = await db
    .select({
      programId: userPrograms.programId,
      programName: programs.name,
      programDesc: programs.description
    })
    .from(userPrograms)
    .innerJoin(programs, eq(userPrograms.programId, programs.id))
    .where(and(eq(userPrograms.userId, userId), eq(userPrograms.active, true)))
    .limit(1)

  const activeProg = activeProgJoin[0]

  if (!activeProg) {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-3xl font-bold font-display">Training</h2>
        <GlassCard className="p-6">
          <p className="mb-4 text-text-secondary">You don&apos;t have an active program yet. Go back to Onboarding or let your AI Coach pick one.</p>
        </GlassCard>
      </div>
    )
  }

  const daysQuery = await db
    .select({
      id: programDays.id,
      dayNumber: programDays.dayNumber,
      focus: programDays.focus,
      exerciseCount: count(programExercises.id)
    })
    .from(programDays)
    .leftJoin(programExercises, eq(programDays.id, programExercises.programDayId))
    .where(eq(programDays.programId, activeProg.programId))
    .groupBy(programDays.id, programDays.dayNumber, programDays.focus)
    .orderBy(programDays.dayNumber)

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="text-3xl font-bold font-display mb-2">Your Program</h2>
        <h3 className="text-xl text-accent-primary font-semibold">{activeProg.programName}</h3>
        <p className="text-sm text-text-secondary mt-1">{activeProg.programDesc}</p>
      </header>

      <div className="flex flex-col gap-4">
        <h4 className="font-semibold text-lg">Schedule</h4>
        {daysQuery?.map((day) => (
          <GlassCard key={day.id} className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-text-secondary font-mono tracking-wider mb-1">DAY {day.dayNumber}</div>
              <div className="font-bold text-lg">{day.focus}</div>
              <div className="text-sm text-text-secondary mt-1">
                {day.exerciseCount || 0} exercises
              </div>
            </div>
            
            {day.focus.toLowerCase() !== 'rest' ? (
              <Link href={`/train/workout/${day.id}`}>
                <GlassButton variant="primary" className="py-2 px-4 rounded-xl text-sm">
                  Start
                </GlassButton>
              </Link>
            ) : (
              <div className="px-4 py-2 bg-white/5 rounded-xl text-sm text-text-secondary font-semibold">
                Rest
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
