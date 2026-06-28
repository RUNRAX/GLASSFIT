'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Dumbbell, Calendar, MessageSquare, User } from 'lucide-react'

const TABS = [
  { name: 'Home', path: '/dashboard', icon: Home },
  { name: 'Train', path: '/train', icon: Dumbbell },
  { name: 'Progress', path: '/progress', icon: Calendar },
  { name: 'Coach', path: '/coach', icon: MessageSquare },
  { name: 'Profile', path: '/profile', icon: User },
]

export function GlassTabBar() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-md z-40">
      <div className="glass-surface rounded-[28px] px-6 py-4 flex justify-between items-center relative overflow-hidden">
        {TABS.map((tab) => {
          const isActive = pathname.startsWith(tab.path)
          const Icon = tab.icon

          return (
            <Link
              key={tab.path}
              href={tab.path}
              className="relative flex flex-col items-center gap-1 w-12"
            >
              <Icon 
                size={24} 
                className={`transition-colors duration-300 ${isActive ? 'text-accent-primary' : 'text-text-secondary hover:text-white'}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {isActive && (
                <div className="absolute -bottom-2 w-1 h-1 rounded-full bg-accent-primary" />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
