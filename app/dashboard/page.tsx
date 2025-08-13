"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import DaysCounter from "@/components/days-counter"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Calendar, Heart } from "lucide-react"

interface Message {
  id: string
  title: string
  content: string
  author: string
  date: string
  time: string
}

export default function DashboardPage() {
  const [user, setUser] = useState("")
  const [recentMessages, setRecentMessages] = useState<Message[]>([])
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    const currentUser = localStorage.getItem("user")

    if (!isAuthenticated || !currentUser) {
      router.push("/")
      return
    }

    setUser(currentUser)

    // Cargar mensajes recientes
    const messages = JSON.parse(localStorage.getItem("messages") || "[]")
    const recent = messages.slice(-3).reverse() // Últimos 3 mensajes
    setRecentMessages(recent)
  }, [router])

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
                        {message.date} a las {message.time}
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
              <p className="text-2xl font-bold text-pink-700">{recentMessages.length}</p>
              <p className="text-sm text-pink-600">Mensajes en el diario</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-0">
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-700">87</p>
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
