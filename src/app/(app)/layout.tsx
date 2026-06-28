import { AnimatedBlobs } from '@/components/ui/AnimatedBlobs'
import { GlassTabBar } from '@/components/ui/GlassTabBar'
import { SpringTransition } from '@/components/ui/SpringTransition'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen">
      <AnimatedBlobs />
      
      {/* Top safe area / Glass header area if needed */}
      <header className="sticky top-0 z-30 w-full h-16 pt-safe backdrop-blur-md bg-base-dark/20 border-b border-white/5 flex items-center justify-center">
        <h1 className="font-display font-bold text-lg tracking-wide text-white/90">
          GlassFit
        </h1>
      </header>

      <main className="px-4 pt-6 pb-24 w-full max-w-lg mx-auto min-h-[calc(100vh-4rem)]">
        <SpringTransition>
          {children}
        </SpringTransition>
      </main>

      <GlassTabBar />
    </div>
  )
}
