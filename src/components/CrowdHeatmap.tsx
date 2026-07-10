'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface HeatmapProps {
  occupancy?: number
}

export function CrowdHeatmap({ occupancy = 65 }: HeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw heatmap grid
    const cellWidth = canvas.width / 8
    const cellHeight = canvas.height / 8

    // Generate heatmap data based on occupancy
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const x = col * cellWidth
        const y = row * cellHeight

        // Vary intensity based on position (simulate crowd distribution)
        const centerDist = Math.hypot(col - 3.5, row - 3.5)
        const baseIntensity = Math.max(0, occupancy / 100 * (1 - centerDist / 6))
        const jitter = Math.sin(row * col * 0.5) * 0.15
        const intensity = Math.max(0, Math.min(1, baseIntensity + jitter))

        // Color based on intensity: green -> yellow -> red
        let color: string
        if (intensity < 0.33) {
          color = `rgba(34, 197, 94, ${intensity * 0.6})`
        } else if (intensity < 0.66) {
          const t = (intensity - 0.33) / 0.33
          const r = Math.round(255 * t)
          const g = 255
          color = `rgba(${r}, ${g}, 0, ${Math.min(intensity * 0.8)})`
        } else {
          const t = (intensity - 0.66) / 0.34
          const r = 255
          const g = Math.round(255 * (1 - t * 0.5))
          color = `rgba(${r}, ${g}, 0, ${Math.min(intensity * 0.9)})`
        }

        ctx.fillStyle = color
        ctx.fillRect(x, y, cellWidth - 2, cellHeight - 2)

        // Add glow effect for high intensity
        if (intensity > 0.6) {
          ctx.strokeStyle = `rgba(255, ${Math.round(100 * (1 - intensity))}, 0, ${intensity * 0.4})`
          ctx.lineWidth = 2
          ctx.strokeRect(x, y, cellWidth - 2, cellHeight - 2)
        }
      }
    }

    // Draw crosshair
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(centerX - 30, centerY)
    ctx.lineTo(centerX + 30, centerY)
    ctx.moveTo(centerX, centerY - 30)
    ctx.lineTo(centerX, centerY + 30)
    ctx.stroke()
  }, [mounted, occupancy])

  if (!mounted) return null

  return (
    <motion.div
      className="relative w-full h-full bg-black/50 rounded-2xl overflow-hidden border border-blue-500/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />

      {/* Overlay legend */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <span className="text-slate-300">Low Crowd</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded" />
            <span className="text-slate-300">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded" />
            <span className="text-slate-300">High Density</span>
          </div>
          <div className="ml-auto text-cyan-300 font-bold">
            {occupancy}% Occupancy
          </div>
        </div>
      </div>
    </motion.div>
  )
}
