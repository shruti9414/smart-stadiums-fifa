'use client'

import { useRef, useEffect } from 'react'

interface Stadium3DProps {
  occupancy: number
  className?: string
}

export function Stadium3D({ occupancy, className = '' }: Stadium3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Draw background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#0f172a')
    gradient.addColorStop(1, '#0a0e27')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Stadium colors
    const getOccupancyColor = () => {
      if (occupancy > 80) return { light: '#ff6b6b', dark: '#cc0000' }
      if (occupancy > 50) return { light: '#fbbf24', dark: '#d4a500' }
      return { light: '#10b981', dark: '#059669' }
    }

    const colors = getOccupancyColor()

    // Draw field
    ctx.fillStyle = '#1a4d1a'
    ctx.beginPath()
    ctx.ellipse(centerX, centerY, 80, 120, 0, 0, Math.PI * 2)
    ctx.fill()

    // Field lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - 120)
    ctx.lineTo(centerX, centerY + 120)
    ctx.stroke()

    // Center circle
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2)
    ctx.stroke()

    // Center spot
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.beginPath()
    ctx.arc(centerX, centerY, 2, 0, Math.PI * 2)
    ctx.fill()

    // Draw stadium seats (2 sides - front and back)
    const drawSeats = (startAngle, endAngle, offsetY) => {
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 6; j++) {
          const angle = startAngle + ((endAngle - startAngle) * i) / 7
          const radius = 95 + j * 12
          const x = centerX + Math.cos(angle) * radius
          const y = centerY + offsetY + Math.sin(angle) * 15

          ctx.fillStyle = colors.light
          ctx.globalAlpha = 0.8 - j * 0.1
          ctx.fillRect(x - 3, y - 2, 6, 4)
        }
      }
      ctx.globalAlpha = 1
    }

    drawSeats(Math.PI * 0.3, Math.PI * 0.7, -5)
    drawSeats(Math.PI * 1.3, Math.PI * 1.7, 5)

    // Draw side stands
    ctx.fillStyle = 'rgba(251, 191, 36, 0.7)'
    ctx.fillRect(centerX - 100, centerY - 40, 20, 80)
    ctx.fillRect(centerX + 80, centerY - 40, 20, 80)

    // Draw roof/structure top
    ctx.strokeStyle = '#fbbf24'
    ctx.lineWidth = 3
    ctx.globalAlpha = 0.6

    // Top arcs
    ctx.beginPath()
    ctx.ellipse(centerX, centerY - 120, 120, 30, 0, 0, Math.PI)
    ctx.stroke()

    ctx.beginPath()
    ctx.ellipse(centerX, centerY + 120, 120, 30, 0, Math.PI, Math.PI * 2)
    ctx.stroke()

    ctx.globalAlpha = 1

    // Draw floodlights
    const lights = [
      { x: centerX - 130, y: centerY - 80 },
      { x: centerX + 130, y: centerY - 80 },
      { x: centerX - 130, y: centerY + 80 },
      { x: centerX + 130, y: centerY + 80 }
    ]

    lights.forEach(light => {
      // Light tower
      ctx.fillStyle = '#666666'
      ctx.fillRect(light.x - 4, light.y - 50, 8, 50)

      // Light glow
      const lightGradient = ctx.createRadialGradient(light.x, light.y - 50, 0, light.x, light.y - 50, 60)
      lightGradient.addColorStop(0, 'rgba(255, 215, 0, 0.4)')
      lightGradient.addColorStop(1, 'rgba(255, 215, 0, 0)')
      ctx.fillStyle = lightGradient
      ctx.beginPath()
      ctx.arc(light.x, light.y - 50, 60, 0, Math.PI * 2)
      ctx.fill()
    })

    // Occupancy indicator (top right)
    ctx.fillStyle = 'rgba(30, 41, 59, 0.8)'
    ctx.fillRect(canvas.width - 140, 20, 120, 80)

    ctx.strokeStyle = colors.light
    ctx.lineWidth = 2
    ctx.strokeRect(canvas.width - 140, 20, 120, 80)

    ctx.fillStyle = colors.light
    ctx.font = 'bold 40px Arial'
    ctx.textAlign = 'right'
    ctx.fillText(`${Math.round(occupancy)}%`, canvas.width - 30, 70)

    ctx.font = '12px Arial'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.fillText('Occupancy', canvas.width - 30, 90)

    // Stadium name
    ctx.font = 'bold 20px Arial'
    ctx.fillStyle = colors.light
    ctx.textAlign = 'center'
    ctx.fillText('FIFA WORLD CUP STADIUM 2026', centerX, 30)

    // Animation - subtle pulsing on occupancy light
    const pulse = Math.sin(Date.now() / 300) * 0.1 + 0.9
    const pulseGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 200)
    pulseGradient.addColorStop(0, `rgba(251, 191, 36, ${0.1 * pulse})`)
    pulseGradient.addColorStop(1, 'rgba(251, 191, 36, 0)')
    ctx.fillStyle = pulseGradient
    ctx.beginPath()
    ctx.arc(centerX, centerY, 200, 0, Math.PI * 2)
    ctx.fill()
  }, [occupancy])

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ display: 'block' }}
    />
  )
}
