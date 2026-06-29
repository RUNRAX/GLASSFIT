import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { profiles, nutritionTargets, programs, programDays, programExercises, userPrograms } from '@/db/schema'
import { calculateBMR } from '@/lib/nutrition/bmr'
import { calculateTDEE, ActivityLevel } from '@/lib/nutrition/tdee'
import { calculateCalorieTarget, calculateMacros, Goal } from '@/lib/nutrition/macros'
import { matchProgram } from '@/lib/programs/matcher'
import { eq } from 'drizzle-orm'

export async function POST(request: Request) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      sex, 
      date_of_birth, 
      height_cm, 
      weight_kg, 
      body_fat_pct, 
      activity_level, 
      primary_goal, 
      experience_level, 
      dietary_preference,
      equipment 
    } = body

    // Calculate Nutrition Targets
    const age = new Date().getFullYear() - new Date(date_of_birth).getFullYear()
    const bmr = calculateBMR(sex, weight_kg, height_cm, age, body_fat_pct)
    const tdee = calculateTDEE(bmr, activity_level)
    const calorie_target = calculateCalorieTarget(tdee, primary_goal, sex)
    const macros = calculateMacros(calorie_target, weight_kg)

    // Match Program
    const matchedTemplate = matchProgram(primary_goal, experience_level, equipment)

      // 1. Save Profile
      await db.insert(profiles).values({
        id: userId,
        sex,
        dateOfBirth: date_of_birth,
        heightCm: height_cm.toString(),
        weightKg: weight_kg.toString(),
        bodyFatPct: body_fat_pct ? body_fat_pct.toString() : null,
        activityLevel: activity_level,
        primaryGoal: primary_goal,
        experienceLevel: experience_level,
        dietaryPreference: dietary_preference
      }).onConflictDoUpdate({
        target: profiles.id,
        set: {
          sex,
          dateOfBirth: date_of_birth,
          heightCm: height_cm.toString(),
          weightKg: weight_kg.toString(),
          bodyFatPct: body_fat_pct ? body_fat_pct.toString() : null,
          activityLevel: activity_level,
          primaryGoal: primary_goal,
          experienceLevel: experience_level,
          dietaryPreference: dietary_preference
        }
      })

      // 2. Save Nutrition Targets
      await db.insert(nutritionTargets).values({
        userId,
        bmr: bmr.toString(),
        tdee: tdee.toString(),
        calorieTarget: calorie_target.toString(),
        proteinG: macros.protein_g.toString(),
        fatG: macros.fat_g.toString(),
        carbsG: macros.carbs_g.toString()
      })

      // 3. Create Program
      const [prog] = await db.insert(programs).values({
        ownerId: userId,
        name: matchedTemplate.name,
        description: matchedTemplate.description,
        goal: matchedTemplate.goal,
        experienceLevel: matchedTemplate.experience_level,
        isPublic: false
      }).returning()

      // Create Days & Exercises
      for (const day of matchedTemplate.days) {
        const [d] = await db.insert(programDays).values({
          programId: prog.id,
          dayNumber: day.day_number,
          focus: day.focus
        }).returning()

        if (day.exercises.length > 0) {
          const exToInsert = day.exercises.map((ex: any, idx: number) => ({
            programDayId: d.id,
            exerciseId: ex.exercise_id,
            sets: ex.sets,
            reps: ex.reps,
            restSeconds: ex.rest_seconds,
            sortOrder: idx
          }))
          await db.insert(programExercises).values(exToInsert)
        }
      }

      // Link User Program
      await db.insert(userPrograms).values({
        userId,
        programId: prog.id,
        active: true
      })

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Onboarding Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
