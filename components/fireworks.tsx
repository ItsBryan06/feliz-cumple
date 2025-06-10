"use client"

import { useEffect, useState } from "react"

interface FireworkParticle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  life: number
  maxLife: number
}

interface FireworksProps {
  isActive: boolean
  duration?: number
}

export default function Fireworks({ isActive, duration = 3000 }: FireworksProps) {
  const [particles, setParticles] = useState<FireworkParticle[]>([])

  const colors = [
    "#ff6b6b",
    "#4ecdc4",
    "#45b7d1",
    "#96ceb4",
    "#feca57",
    "#ff9ff3",
    "#54a0ff",
    "#5f27cd",
    "#00d2d3",
    "#ff9f43",
  ]

  const createFirework = (x: number, y: number) => {
    const newParticles: FireworkParticle[] = []
    const particleCount = 15 + Math.random() * 10

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5
      const velocity = 2 + Math.random() * 4
      const life = 60 + Math.random() * 40

      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        color: colors[Math.floor(Math.random() * colors.length)],
        life,
        maxLife: life,
      })
    }

    setParticles((prev) => [...prev, ...newParticles])
  }

  const createRandomFirework = () => {
    const x = Math.random() * window.innerWidth
    const y = Math.random() * (window.innerHeight * 0.6) + window.innerHeight * 0.1
    createFirework(x, y)
  }

  useEffect(() => {
    if (!isActive) {
      setParticles([])
      return
    }

    // Crear fuegos artificiales iniciales
    const initialFireworks = () => {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => createRandomFirework(), i * 200)
      }
    }

    initialFireworks()

    // Continuar creando fuegos artificiales durante la duración especificada
    const interval = setInterval(createRandomFirework, 400)

    // Limpiar después de la duración
    const timeout = setTimeout(() => {
      clearInterval(interval)
    }, duration)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [isActive, duration])

  useEffect(() => {
    if (particles.length === 0) return

    const animationFrame = requestAnimationFrame(() => {
      setParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.1, // gravedad
            vx: particle.vx * 0.99, // fricción
            life: particle.life - 1,
          }))
          .filter((particle) => particle.life > 0),
      )
    })

    return () => cancelAnimationFrame(animationFrame)
  }, [particles])

  if (!isActive && particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            opacity: particle.life / particle.maxLife,
            transform: `scale(${particle.life / particle.maxLife})`,
            boxShadow: `0 0 6px ${particle.color}`,
          }}
        />
      ))}
    </div>
  )
}
