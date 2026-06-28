'use client'
import { forwardRef, InputHTMLAttributes } from 'react'

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    
    const inputId = id || props.name || Math.random().toString(36).substring(7)
    
    return (
      <div className="w-full flex flex-col gap-1.5 mb-4">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-secondary ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            className={`w-full glass-surface text-text-primary placeholder:text-text-secondary/50 rounded-2xl px-4 py-3 outline-none transition-all duration-200 focus:ring-1 focus:ring-accent-primary focus:border-accent-primary/50 ${error ? 'border-accent-energy focus:ring-accent-energy focus:border-accent-energy' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-accent-energy ml-1">{error}</p>
        )}
      </div>
    )
  }
)
GlassInput.displayName = 'GlassInput'
