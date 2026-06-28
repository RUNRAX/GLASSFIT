'use client'

import { GlassCard } from '@/components/ui/GlassCard'
import { Dumbbell, Scale, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export function QuickLinks() {
  const links = [
    { name: 'Train', icon: Dumbbell, path: '/train', color: 'text-accent-primary', bg: 'bg-accent-primary/10' },
    { name: 'Log Weight', icon: Scale, path: '/progress', color: 'text-accent-streak', bg: 'bg-accent-streak/10' },
    { name: 'Ask Coach', icon: MessageSquare, path: '/coach', color: 'text-accent-recovery', bg: 'bg-accent-recovery/10' },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {links.map((link) => {
        const Icon = link.icon
        return (
          <Link key={link.name} href={link.path}>
            <GlassCard hover className="p-4 flex flex-col items-center justify-center gap-3 text-center h-full">
              <div className={`w-10 h-10 rounded-full ${link.bg} ${link.color} flex items-center justify-center`}>
                <Icon size={20} />
              </div>
              <span className="text-xs font-medium text-text-secondary">{link.name}</span>
            </GlassCard>
          </Link>
        )
      })}
    </div>
  )
}
