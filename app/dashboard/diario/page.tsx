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
import { Plus, Edit, Trash2, Heart, Calendar, RefreshCw, Wifi, WifiOff } from "lucide-react"
import {
  getMessages,
  createMessage,
  updateMessage,
  deleteMessage,
  migrateLocalStorageToSupabase,
  testSupabaseConnection,
  type Message,
} from "@/lib/supabase"

export default function DiarioPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [user, setUser] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMessage, setEditingMessage] = useState<Message | null>(null)
  const [formData, setFormData] = useState({ title: "", content: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isConnected, setIsConnected] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    const currentUser = localStorage.getItem("user")

    if (!isAuthenticated || !currentUser) {
      router.push("/")
      return
    }

    setUser(currentUser)
    initializeData()
  }, [router])

  const initializeData = async () => {
    // Verificar conexión con Supabase
    const connected = await testSupabaseConnection()
    setIsConnected(connected)

    if (connected) {
      // Migrar datos de localStorage si es necesario
      const migrated = localStorage.getItem("migrated_to_supabase")
      if (!migrated) {
        await migrateLocalStorageToSupabase()
      }

      // Cargar mensajes desde Supabase
      await loadMessages()
    } else {
      console.warn("No se pudo conectar con Supabase, usando datos locales")
      // Fallback a localStorage si no hay conexión
      loadLocalMessages()
    }
  }

  const loadMessages = async () => {
    setIsLoading(true)
    try {
      const fetchedMessages = await getMessages()
      setMessages(fetchedMessages)
    } catch (error) {
      console.error("Error loading messages:", error)
      setIsConnected(false)
      loadLocalMessages()
    } finally {
      setIsLoading(false)
    }
  }

  const loadLocalMessages = () => {
    try {
      const localMessages = JSON.parse(localStorage.getItem("messages") || "[]")
      const formattedMessages = localMessages.map((msg: any) => ({
        ...msg,
        created_at: new Date(`${msg.date} ${msg.time}`).toISOString(),
      }))
      setMessages(formattedMessages.reverse())
    } catch (error) {
      console.error("Error loading local messages:", error)
      setMessages([])
    }
  }

  const saveMessage = async () => {
    if (!formData.title.trim() || !formData.content.trim()) return

    setIsSaving(true)
    try {
      let result
      if (editingMessage) {
        result = await updateMessage(editingMessage.id, formData.title, formData.content)
      } else {
        result = await createMessage(formData.title, formData.content, user)
      }

      if (result) {
        await loadMessages() // Recargar la lista
        setFormData({ title: "", content: "" })
        setEditingMessage(null)
        setIsDialogOpen(false)
      }
    } catch (error) {
      console.error("Error saving message:", error)
      setIsConnected(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteMessage = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este mensaje?")) {
      try {
        const success = await deleteMessage(id)
        if (success) {
          await loadMessages() // Recargar la lista
        }
      } catch (error) {
        console.error("Error deleting message:", error)
        setIsConnected(false)
      }
    }
  }

  const startEdit = (message: Message) => {
    setEditingMessage(message)
    setFormData({ title: message.title, content: message.content })
    setIsDialogOpen(true)
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

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {}
    messages.forEach((message) => {
      const date = formatDate(message.created_at)
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
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
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Nuestro Diario 💕
              </h1>
              {isConnected ? (
                <Wifi className="w-5 h-5 text-green-500" title="Conectado a Supabase" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500" title="Sin conexión - usando datos locales" />
              )}
            </div>
            <p className="text-gray-600 mt-1">
              Nuestros pensamientos y recuerdos especiales
              {!isConnected && " (modo offline)"}
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={loadMessages} variant="outline" size="sm" disabled={isLoading} className="bg-white/80">
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Cargando..." : "Actualizar"}
            </Button>

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
                    disabled={isSaving || !formData.title.trim() || !formData.content.trim()}
                    className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
                  >
                    {isSaving ? "Guardando..." : editingMessage ? "Actualizar" : "Agregar al diario"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Estado de conexión */}
        {!isConnected && (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <WifiOff className="w-5 h-5" />
                <p className="text-sm">
                  <strong>Modo offline:</strong> No se pudo conectar con la base de datos. Los cambios se guardarán
                  localmente.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de mensajes agrupados por fecha */}
        {isLoading ? (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <RefreshCw className="w-8 h-8 mx-auto mb-4 text-purple-400 animate-spin" />
              <p className="text-gray-600">Cargando mensajes...</p>
            </CardContent>
          </Card>
        ) : Object.keys(groupedMessages).length > 0 ? (
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
                              <span>{formatTime(message.created_at)}</span>
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
                              onClick={() => handleDeleteMessage(message.id)}
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
