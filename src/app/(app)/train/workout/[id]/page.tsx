import { redirect } from 'next/navigation'
import { db } from '@/db'
import { programDays, programExercises, exerciseLibrary } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { WorkoutSession } from '@/components/train/WorkoutSession'

export default async function WorkoutPage({ params }: { params: { id: string } }) {
  
  const [day] = await db.select().from(programDays).where(eq(programDays.id, params.id))

  if (!day) redirect('/train')

  const exercisesJoin = await db
    .select({
      id: programExercises.id,
      sets: programExercises.sets,
      reps: programExercises.reps,
      restSeconds: programExercises.restSeconds,
      exercise: {
        id: exerciseLibrary.id,
        name: exerciseLibrary.name,
        instructions: exerciseLibrary.instructions,
        imageUrls: exerciseLibrary.imageUrls,
        primaryMuscles: exerciseLibrary.primaryMuscles
      }
    })
    .from(programExercises)
    .innerJoin(exerciseLibrary, eq(programExercises.exerciseId, exerciseLibrary.id))
    .where(eq(programExercises.programDayId, day.id))
    .orderBy(programExercises.sortOrder)

  if (!exercisesJoin.length) redirect('/train')

  // Map to the structure WorkoutSession expects
  const mappedExercises = exercisesJoin.map(ex => ({
    ...ex,
    exercise_library: ex.exercise
  }))

  return (
    <WorkoutSession day={day} exercises={mappedExercises} />
  )
}
