import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { workoutLogs, exerciseLogs } from '@/db/schema'
import { eq, and, gte, lte, desc } from 'drizzle-orm'

export async function GET(request: Request) {
  try {
    const { userId } = auth()
    
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    const conditions = [eq(workoutLogs.userId, userId)]
    if (startDate) conditions.push(gte(workoutLogs.logDate, startDate))
    if (endDate) conditions.push(lte(workoutLogs.logDate, endDate))
      
    const logs = await db.select().from(workoutLogs).where(and(...conditions)).orderBy(desc(workoutLogs.logDate))
    
    return NextResponse.json({ logs })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth()
    
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      
    const body = await request.json()
    const { program_day_id, log_date, completed, perceived_effort, notes, exercise_logs } = body
    
    const [workoutLog] = await db.insert(workoutLogs).values({
      userId,
      programDayId: program_day_id,
      logDate: log_date,
      completed,
      perceivedEffort: perceived_effort,
      notes
    }).onConflictDoUpdate({
      target: [workoutLogs.userId, workoutLogs.logDate],
      set: {
        completed,
        perceivedEffort: perceived_effort,
        notes
      }
    }).returning()
    
    // Insert exercise logs
    if (exercise_logs && exercise_logs.length > 0) {
      const logsToInsert = exercise_logs.map((log: any) => ({
        workoutLogId: workoutLog.id,
        exerciseId: log.exercise_id,
        actualSets: log.actual_sets,
        actualReps: log.actual_reps,
        weightKg: log.weight_kg ? log.weight_kg.toString() : null
      }))
      
      await db.insert(exerciseLogs).values(logsToInsert)
    }
    
    return NextResponse.json({ success: true, workout_log: workoutLog })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
