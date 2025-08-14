"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import DaysCounter from "@/components/days-counter"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Calendar, Heart } from "lucide-react"

// Importar funciones con fallback
let supabaseFunctions: any
try {
  supabaseFunctions = require("@/lib/supabase")
} catch (error) {
  console.warn("Supabase not available, using localStorage fallback")
  supabaseFunctions = require("@/lib/supabase-fallback")
}

const { getMessages } = supabaseFunctions

interface Message {
  id: string
  title: string
  content: string
  author: string
  created_at: string
}

export default function DashboardPage() {
  const [user, setUser] = useState("")
  const [recentMessages, setRecentMessages] = useState<Message[]>([])
  const [totalMessages, setTotalMessages] = useState(0)
  const [daysTogether, setDaysTogether] = useState(0)
  const router = useRouter()

  // Función para calcular días desde el 10 de marzo de 2025
  const calculateDaysTogether = () => {
    const startDate = new Date("2025-03-10T00:00:00.000Z")
    const now = new Date()
    const difference = now.getTime() - startDate.getTime()
    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    return days
  }

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    const currentUser = localStorage.getItem("user")

    if (!isAuthenticated || !currentUser) {
      router.push("/")
      return
    }

    setUser(currentUser)
    setDaysTogether(calculateDaysTogether())

    // Cargar mensajes recientes
    loadRecentMessages()
  }, [router])

  const loadRecentMessages = async () => {
    try {
      const messages = await getMessages()
      const recent = messages.slice(0, 3) // Últimos 3 mensajes
      setRecentMessages(recent)
      setTotalMessages(messages.length)
    } catch (error) {
      console.error("Error loading messages:", error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            ¡Hola, {user}! 💕
          </h1>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {/* Contador de días */}
        <div className="max-w-md">
          <DaysCounter startDate="2025-03-10" />
        </div>

        {/* Mensajes recientes */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-500" />
              Mensajes Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentMessages.length > 0 ? (
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className="border-l-4 border-pink-300 pl-4 py-2">
                    <h4 className="font-semibold text-gray-800">{message.title}</h4>
                    <p className="text-gray-600 text-sm line-clamp-2">{message.content}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Por {message.author}</span>
                      <span>
                        {formatDate(message.created_at)} a las {formatTime(message.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Heart className="w-12 h-12 mx-auto mb-2 text-pink-300" />
                <p>Aún no hay mensajes en nuestro diario</p>
                <p className="text-sm">¡Comienza escribiendo el primero!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-pink-100 to-pink-200 border-0">
            <CardContent className="p-4 text-center">
              <Heart className="w-8 h-8 text-pink-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-pink-700">{totalMessages}</p>
              <p className="text-sm text-pink-600">Mensajes en el diario</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-0">
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-700">{daysTogether}</p>
              <p className="text-sm text-purple-600">Días juntos</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-100 to-blue-200 border-0">
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-700">∞</p>
              <p className="text-sm text-blue-600">Amor infinito</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
