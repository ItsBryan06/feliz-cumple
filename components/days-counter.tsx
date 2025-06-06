"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Heart } from "lucide-react"

interface DaysCounterProps {
  startDate: string // formato YYYY-MM-DD
}

export default function DaysCounter({ startDate }: DaysCounterProps) {
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    // Crear fecha de inicio en UTC
    const start = new Date(startDate + "T00:00:00.000Z")

    const updateCounter = () => {
      // Obtener tiempo actual en UTC
      const now = new Date()
      const difference = now.getTime() - start.getTime()

      const d = Math.floor(difference / (1000 * 60 * 60 * 24))
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const s = Math.floor((difference % (1000 * 60)) / 1000)

      setDays(d)
      setHours(h)
      setMinutes(m)
      setSeconds(s)
    }

    // Actualizar inmediatamente
    updateCounter()

    // Actualizar cada segundo
    const interval = setInterval(updateCounter, 1000)
    return () => clearInterval(interval)
  }, [startDate])

  return (
    <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-0 shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Clock className="w-6 h-6 text-purple-500" />
            <h3 className="text-xl font-semibold text-gray-800">Nuestro Tiempo Juntos</h3>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="bg-white rounded-lg p-2 shadow-inner">
              <div className="text-3xl font-bold text-purple-600 transition-all duration-300">{days}</div>
              <div className="text-xs text-gray-500">días</div>
            </div>
            <div className="bg-white rounded-lg p-2 shadow-inner">
              <div className="text-3xl font-bold text-pink-500 transition-all duration-300">{hours}</div>
              <div className="text-xs text-gray-500">horas</div>
            </div>
            <div className="bg-white rounded-lg p-2 shadow-inner">
              <div className="text-3xl font-bold text-purple-500 transition-all duration-300">{minutes}</div>
              <div className="text-xs text-gray-500">min</div>
            </div>
            <div className="bg-white rounded-lg p-2 shadow-inner">
              <div className="text-3xl font-bold text-pink-400 transition-all duration-300">{seconds}</div>
              <div className="text-xs text-gray-500">seg</div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2">
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            <p className="text-gray-600 text-sm">
              Desde el{" "}
              {new Date(startDate + "T00:00:00.000Z").toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              })}
            </p>
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
          </div>

          <div className="text-xs text-gray-400">⏰ Tiempo en UTC (Greenwich)</div>
        </div>
      </CardContent>
    </Card>
  )
}
