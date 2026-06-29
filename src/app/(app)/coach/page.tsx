'use client'

import { GlassCard } from '@/components/ui/GlassCard'
import { GlassInput } from '@/components/ui/GlassInput'
import { GlassButton } from '@/components/ui/GlassButton'
import { Send, Bot, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export default function CoachPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<any>(null)
  
  const bottomRef = useRef<HTMLDivElement>(null)

  const handleManualSubmit = async (e: any) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    
    const userMsg = { id: Date.now().toString(), role: 'user', content: input }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      })

      if (!res.ok) {
        throw new Error(await res.text())
      }

      // Stream the response
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      
      const botMsgId = (Date.now() + 1).toString()
      let botContent = ''

      setMessages(prev => [...prev, { id: botMsgId, role: 'assistant', content: botContent }])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          const chunk = decoder.decode(value)
          // The AI SDK `streamText` format often prefixes with '0:'
          // For simplicity, we just clean up the '0:' prefix from Vercel's protocol
          const textChunk = chunk.replace(/^0:/gm, '').replace(/^"/gm, '').replace(/"$/gm, '').replace(/\\n/g, '\n').replace(/\\"/g, '"')
          
          botContent += textChunk
          
          setMessages(prev => 
            prev.map(m => m.id === botMsgId ? { ...m, content: botContent } : m)
          )
        }
      }
    } catch (err: any) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-4">
      <header>
        <h2 className="text-3xl font-bold font-display">AI Coach</h2>
        <p className="text-text-secondary mt-1">Llama 3.3 powered fitness guidance.</p>
      </header>

      <GlassCard className="flex-1 flex flex-col p-4 overflow-hidden relative">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-4 pb-4">
          {messages.length === 0 && (
            <div className="text-center text-text-secondary mt-10">
              <Bot size={48} className="mx-auto mb-4 opacity-50" />
              <p>Ask me anything about your training, form, or nutrition.</p>
              
              <div className="flex flex-wrap justify-center gap-2 mt-8">
                {[
                  "Can you build me a 4-day split?",
                  "Is my protein target enough?",
                  "How to fix lower back pain on squats?",
                  "What's a good pre-workout meal?"
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-all backdrop-blur-md"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div 
              key={m.id} 
              className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-accent-primary text-base-dark' : 'bg-white/10 text-accent-primary'}`}>
                {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-accent-primary/20 text-white' : 'bg-white/5 border border-white/10 text-white/90'}`}>
                {m.content.split('\n').map((line: string, i: number) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </div>
            </div>
          ))}

          {error && (
            <div className="text-accent-energy text-center text-sm p-3 bg-accent-energy/10 rounded-xl">
              {error.message?.includes('429') ? 'Daily AI limit reached (15/15). Check back tomorrow!' : 'Something went wrong. Try again.'}
            </div>
          )}
          
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleManualSubmit} className="relative mt-2 flex gap-2">
          <input
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent-primary transition-colors"
            value={input}
            placeholder="Ask your coach..."
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading || error?.message?.includes('429')}
          />
          <GlassButton type="submit" disabled={isLoading || !input.trim() || error?.message?.includes('429')} className="px-4">
            <Send size={18} />
          </GlassButton>
        </form>
      </GlassCard>
    </div>
  )
}
