import { streamText } from 'ai'
import { groq, SYSTEM_PROMPT } from '@/lib/ai/groq'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { profiles, nutritionTargets, aiUsageCounters } from '@/db/schema'
import { eq, and, desc } from 'drizzle-orm'

// Free tier rate limits: max 15 requests per day
export async function POST(req: Request) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const todayDate = new Date().toISOString().split('T')[0]

    // 1. Check Rate Limit
    const [usage] = await db
      .select({ count: aiUsageCounters.callCount })
      .from(aiUsageCounters)
      .where(and(eq(aiUsageCounters.userId, userId), eq(aiUsageCounters.usageDate, todayDate)))

    const currentRequests = usage?.count || 0

    if (currentRequests >= 15) {
      return new Response('Daily AI limit reached (15/15). Check back tomorrow!', { status: 429 })
    }

    // 2. Parse request
    const { messages } = await req.json()

    // 3. Fetch User Context for the AI
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId))

    const [nutrition] = await db
      .select()
      .from(nutritionTargets)
      .where(eq(nutritionTargets.userId, userId))
      .orderBy(desc(nutritionTargets.calculatedAt))
      .limit(1)

    const enhancedSystemPrompt = `
      ${SYSTEM_PROMPT}
      
      USER CONTEXT:
      - Goal: ${profile?.primaryGoal}
      - Experience: ${profile?.experienceLevel}
      - Weight: ${profile?.weightKg}kg
      - Daily Calories: ${nutrition?.calorieTarget}kcal (P: ${nutrition?.proteinG}g, C: ${nutrition?.carbsG}g, F: ${nutrition?.fatG}g)
    `

    // 4. Update usage counter (fire and forget)
    db.insert(aiUsageCounters).values({
      userId: userId,
      usageDate: todayDate,
      callCount: currentRequests + 1
    }).onConflictDoUpdate({
      target: [aiUsageCounters.userId, aiUsageCounters.usageDate],
      set: { callCount: currentRequests + 1 }
    }).catch(console.error)

    // 5. Stream response
    const result = await streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: enhancedSystemPrompt,
      messages,
      temperature: 0.7,
    })

    return result.toTextStreamResponse()

  } catch (error: any) {
    console.error('AI Error:', error)
    return new Response(error.message, { status: 500 })
  }
}
