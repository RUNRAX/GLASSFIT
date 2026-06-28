'use client'

import { motion, useDragControls } from 'framer-motion'
import { ReactNode, useEffect, useState } from 'react'

interface GlassSheetProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export function GlassSheet({ isOpen, onClose, children }: GlassSheetProps) {
  const [mounted, setMounted] = useState(false)
  const dragControls = useDragControls()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        />
      )}

      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: isOpen ? '0%' : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        drag="y"
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0 }}
        dragElastic={0.2}
        onDragEnd={(e, info) => {
          if (info.offset.y > 100 || info.velocity.y > 500) {
            onClose()
          }
        }}
        className="fixed bottom-0 left-0 right-0 glass-surface z-50 rounded-t-[32px] pt-4 pb-12 px-6 flex flex-col shadow-2xl"
        style={{ maxHeight: '90vh' }}
      >
        <div 
          className="w-16 h-1.5 bg-white/30 rounded-full mx-auto mb-6 cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => dragControls.start(e)}
        />
        <div className="overflow-y-auto hide-scrollbar flex-1">
          {children}
        </div>
      </motion.div>
    </>
  )
}
