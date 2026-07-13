'use client'

import { useEffect, useRef } from 'react'

export function Universe3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      opacity: number
      color: string
    }

    // Create particles (stars/cosmic dust)
    const particles: Particle[] = []
    const particleCount = 150

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 1.5,
        opacity: Math.random() * 0.7 + 0.3,
        color: ['#FF3131', '#FFB800', '#081226', '#00D4FF', '#FFD700'][Math.floor(Math.random() * 5)],
      })
    }

    // Animation loop
    const animate = () => {
      // Dark space background with gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, '#0a0e27')
      gradient.addColorStop(0.5, '#1a1f3a')
      gradient.addColorStop(1, '#0f1729')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw and update particles
      particles.forEach((p) => {
        // Update position
        p.x += p.vx
        p.y += p.vy

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Draw particle
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()

        // Draw glow effect
        ctx.strokeStyle = p.color
        ctx.lineWidth = 0.5
        ctx.globalAlpha = p.opacity * 0.3
        ctx.stroke()
      })

      ctx.globalAlpha = 1

      // Draw connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.strokeStyle = '#00D4FF'
            ctx.globalAlpha = (1 - distance / 100) * 0.2
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ background: '#0a0e27' }}
    />
  )
}
