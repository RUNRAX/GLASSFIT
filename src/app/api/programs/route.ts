import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { userPrograms, programs, programDays, programExercises, exerciseLibrary } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(request: Request) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const activeProgramJoin = await db
      .select({
        programId: userPrograms.programId,
        program: {
          id: programs.id,
          name: programs.name,
          description: programs.description,
          goal: programs.goal,
          experienceLevel: programs.experienceLevel
        }
      })
      .from(userPrograms)
      .innerJoin(programs, eq(userPrograms.programId, programs.id))
      .where(and(eq(userPrograms.userId, userId), eq(userPrograms.active, true)))
      .limit(1)
      
    const activeProgram = activeProgramJoin[0]

    if (!activeProgram) {
      return NextResponse.json({ program: null })
    }

    const days = await db.select().from(programDays).where(eq(programDays.programId, activeProgram.programId)).orderBy(programDays.dayNumber)
    
    // We would fetch exercises for each day
    // For simplicity, we are returning days as they are. The TrainPage component mostly drives this logic anyway.
    const fullProgram = {
      ...activeProgram.program,
      days: days.map(d => ({
        ...d,
        program_exercises: []
      }))
    }

    return NextResponse.json({ program: fullProgram })
  } catch (err: any) {
    console.error('Fetch program error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
