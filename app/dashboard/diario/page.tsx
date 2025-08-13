"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Heart, Calendar } from "lucide-react"

interface Message {
  id: string
  title: string
  content: string
  author: string
  date: string
  time: string
}

export default function DiarioPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [user, setUser] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMessage, setEditingMessage] = useState<Message | null>(null)
  const [formData, setFormData] = useState({ title: "", content: "" })
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    const currentUser = localStorage.getItem("user")

    if (!isAuthenticated || !currentUser) {
      router.push("/")
      return
    }

    setUser(currentUser)
    loadMessages()
  }, [router])

  const loadMessages = () => {
    const savedMessages = JSON.parse(localStorage.getItem("messages") || "[]")
    setMessages(savedMessages.reverse()) // Mostrar más recientes primero
  }

  const saveMessage = () => {
    if (!formData.title.trim() || !formData.content.trim()) return

    const now = new Date()
    const newMessage: Message = {
      id: editingMessage?.id || Date.now().toString(),
      title: formData.title,
      content: formData.content,
      author: user,
      date: now.toLocaleDateString("es-ES"),
      time: now.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
    }

    let updatedMessages
    if (editingMessage) {
      updatedMessages = messages.map((msg) => (msg.id === editingMessage.id ? newMessage : msg))
    } else {
      updatedMessages = [newMessage, ...messages]
    }

    setMessages(updatedMessages)
    localStorage.setItem("messages", JSON.stringify(updatedMessages.reverse()))

    setFormData({ title: "", content: "" })
    setEditingMessage(null)
    setIsDialogOpen(false)
  }

  const deleteMessage = (id: string) => {
    const updatedMessages = messages.filter((msg) => msg.id !== id)
    setMessages(updatedMessages)
    localStorage.setItem("messages", JSON.stringify(updatedMessages.reverse()))
  }

  const startEdit = (message: Message) => {
    setEditingMessage(message)
    setFormData({ title: message.title, content: message.content })
    setIsDialogOpen(true)
  }

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {}
    messages.forEach((message) => {
      if (!groups[message.date]) {
        groups[message.date] = []
      }
      groups[message.date].push(message)
    })
    return groups
  }

  const groupedMessages = groupMessagesByDate(messages)

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Nuestro Diario 💕
            </h1>
            <p className="text-gray-600 mt-1">Nuestros pensamientos y recuerdos especiales</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
                onClick={() => {
                  setEditingMessage(null)
                  setFormData({ title: "", content: "" })
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar mensajito
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingMessage ? "Editar mensaje" : "Nuevo mensaje"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Título del mensaje..."
                  />
                </div>
                <div>
                  <Label htmlFor="content">Mensaje</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Escribe tu mensaje aquí..."
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={saveMessage}
                  className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
                >
                  {editingMessage ? "Actualizar" : "Agregar al diario"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de mensajes agrupados por fecha */}
        {Object.keys(groupedMessages).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date}>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  <h2 className="text-lg font-semibold text-gray-700">{date}</h2>
                </div>
                <div className="space-y-4">
                  {dateMessages.map((message) => (
                    <Card key={message.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg text-gray-800">{message.title}</CardTitle>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                              <span>Por {message.author}</span>
                              <span>{message.time}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEdit(message)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteMessage(message.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-gray-600 leading-relaxed">{message.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <Heart className="w-16 h-16 mx-auto mb-4 text-pink-300" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Nuestro diario está vacío</h3>
              <p className="text-gray-500 mb-4">¡Comienza escribiendo vuestro primer mensaje de amor!</p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Escribir primer mensaje
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
