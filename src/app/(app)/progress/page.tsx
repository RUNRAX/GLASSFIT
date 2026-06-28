'use client'

import { GlassCard } from '@/components/ui/GlassCard'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const DUMMY_DATA = [
  { date: 'Mon', weight: 70.5 },
  { date: 'Tue', weight: 70.2 },
  { date: 'Wed', weight: 70.1 },
  { date: 'Thu', weight: 70.4 },
  { date: 'Fri', weight: 69.8 },
  { date: 'Sat', weight: 69.5 },
  { date: 'Sun', weight: 69.6 },
]

export default function ProgressPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="text-3xl font-bold font-display">Progress</h2>
        <p className="text-text-secondary mt-1">Track your body metrics over time.</p>
      </header>

      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold">Weight Trend</h3>
          <span className="text-accent-primary font-mono bg-accent-primary/10 px-3 py-1 rounded-full text-sm">
            -0.9 kg
          </span>
        </div>
        
        <div className="h-64 w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={DUMMY_DATA}>
              <XAxis 
                dataKey="date" 
                stroke="rgba(255,255,255,0.3)" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                domain={['dataMin - 1', 'auto']} 
                stroke="rgba(255,255,255,0.3)" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                width={40}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(20,20,25,0.8)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#2EE6C5" 
                strokeWidth={3} 
                dot={{ fill: '#2EE6C5', strokeWidth: 2 }} 
                activeDot={{ r: 6, fill: '#fff' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 gap-4">
        <GlassCard className="p-5 text-center">
          <div className="text-xs text-text-secondary uppercase tracking-wider mb-2">Total Volume</div>
          <div className="text-2xl font-mono text-coral font-bold">12,450 kg</div>
        </GlassCard>
        <GlassCard className="p-5 text-center">
          <div className="text-xs text-text-secondary uppercase tracking-wider mb-2">Workouts</div>
          <div className="text-2xl font-mono text-sky font-bold">14</div>
        </GlassCard>
      </div>
    </div>
  )
}
