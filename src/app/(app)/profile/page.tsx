import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { profiles } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassButton } from '@/components/ui/GlassButton'

export default async function ProfilePage() {
  const { userId } = auth()

  if (!userId) redirect('/login')

  const [profile] = await db.select().from(profiles).where(eq(profiles.id, userId))
  
  const userObj = await clerkClient.users.getUser(userId)
  const email = userObj.emailAddresses[0]?.emailAddress

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="text-3xl font-bold font-display">Profile</h2>
        <p className="text-text-secondary mt-1">{email}</p>
      </header>

      <GlassCard className="p-6 flex flex-col gap-4">
        <h3 className="font-bold text-lg mb-2">My Information</h3>
        <div className="flex justify-between py-2 border-b border-white/10">
          <span className="text-text-secondary">Primary Goal</span>
          <span className="capitalize">{profile?.primaryGoal?.replace('_', ' ')}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-white/10">
          <span className="text-text-secondary">Experience Level</span>
          <span className="capitalize">{profile?.experienceLevel}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-text-secondary">Current Weight</span>
          <span>{profile?.weightKg} kg</span>
        </div>
      </GlassCard>

      <form action="/api/auth/signout" method="post">
        <GlassButton variant="secondary" type="submit" className="text-accent-energy border-accent-energy/30">
          Sign Out
        </GlassButton>
      </form>
    </div>
  )
}
