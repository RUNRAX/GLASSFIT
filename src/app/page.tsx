import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { AnimatedBlobs } from "@/components/ui/AnimatedBlobs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = auth();

  // If user is already logged in, send them straight to the app
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-base-dark flex flex-col items-center justify-center p-6">
      <AnimatedBlobs />
      
      <div className="z-10 w-full max-w-lg flex flex-col items-center text-center mt-[-10vh]">
        
        {/* Hero Section */}
        <div className="mb-12 relative">
          <div className="absolute -inset-8 bg-accent-primary/20 blur-[100px] rounded-full pointer-events-none" />
          <h1 className="text-6xl sm:text-7xl font-display font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            GLASS<span className="text-accent-primary drop-shadow-[0_0_20px_rgba(198,244,50,0.5)]">FIT</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-text-secondary max-w-md mx-auto font-medium">
            AI-powered fitness & nutrition logic wrapped in liquid glass.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-2 gap-4 w-full mb-12">
          <GlassCard className="p-5 flex flex-col items-center justify-center text-center aspect-square">
            <div className="w-12 h-12 rounded-full bg-accent-primary/20 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-white mb-1">Smart AI</h3>
            <p className="text-xs text-text-secondary">Personalized routines generated instantly</p>
          </GlassCard>
          
          <GlassCard className="p-5 flex flex-col items-center justify-center text-center aspect-square">
            <div className="w-12 h-12 rounded-full bg-accent-energy/20 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-accent-energy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-bold text-white mb-1">Data Driven</h3>
            <p className="text-xs text-text-secondary">Track progressive overload effortlessly</p>
          </GlassCard>
        </div>

        {/* Call to Action */}
        <Link href="/login" className="w-full sm:w-auto">
          <GlassButton variant="primary" className="w-full sm:w-64 py-4 text-lg font-bold shadow-[0_0_30px_rgba(198,244,50,0.3)] hover:shadow-[0_0_40px_rgba(198,244,50,0.5)] transition-shadow">
            Enter the Glass
          </GlassButton>
        </Link>
      </div>
    </div>
  );
}
