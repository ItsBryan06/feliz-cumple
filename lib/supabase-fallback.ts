// Versión alternativa sin Supabase para desarrollo local
export interface Message {
  id: string
  title: string
  content: string
  author: string
  created_at: string
}

// Simulación de funciones de Supabase usando localStorage
export async function getMessages(): Promise<Message[]> {
  try {
    const localMessages = JSON.parse(localStorage.getItem("messages") || "[]")
    const formattedMessages = localMessages.map((msg: any) => ({
      id: msg.id || Date.now().toString(),
      title: msg.title,
      content: msg.content,
      author: msg.author,
      created_at: msg.created_at || new Date(`${msg.date} ${msg.time}`).toISOString(),
    }))
    return formattedMessages.reverse()
  } catch (error) {
    console.error("Error loading local messages:", error)
    return []
  }
}

export async function createMessage(title: string, content: string, author: string): Promise<Message | null> {
  try {
    const newMessage: Message = {
      id: Date.now().toString(),
      title,
      content,
      author,
      created_at: new Date().toISOString(),
    }

    const messages = await getMessages()
    const updatedMessages = [newMessage, ...messages]

    // Convertir de vuelta al formato localStorage para compatibilidad
    const localFormat = updatedMessages.map((msg) => ({
      id: msg.id,
      title: msg.title,
      content: msg.content,
      author: msg.author,
      date: new Date(msg.created_at).toLocaleDateString("es-ES"),
      time: new Date(msg.created_at).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
    }))

    localStorage.setItem("messages", JSON.stringify(localFormat.reverse()))
    return newMessage
  } catch (error) {
    console.error("Error creating message:", error)
    return null
  }
}

export async function updateMessage(id: string, title: string, content: string): Promise<Message | null> {
  try {
    const messages = await getMessages()
    const updatedMessages = messages.map((msg) => (msg.id === id ? { ...msg, title, content } : msg))

    // Convertir de vuelta al formato localStorage
    const localFormat = updatedMessages.map((msg) => ({
      id: msg.id,
      title: msg.title,
      content: msg.content,
      author: msg.author,
      date: new Date(msg.created_at).toLocaleDateString("es-ES"),
      time: new Date(msg.created_at).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
    }))

    localStorage.setItem("messages", JSON.stringify(localFormat.reverse()))

    const updatedMessage = updatedMessages.find((msg) => msg.id === id)
    return updatedMessage || null
  } catch (error) {
    console.error("Error updating message:", error)
    return null
  }
}

export async function deleteMessage(id: string): Promise<boolean> {
  try {
    const messages = await getMessages()
    const filteredMessages = messages.filter((msg) => msg.id !== id)

    // Convertir de vuelta al formato localStorage
    const localFormat = filteredMessages.map((msg) => ({
      id: msg.id,
      title: msg.title,
      content: msg.content,
      author: msg.author,
      date: new Date(msg.created_at).toLocaleDateString("es-ES"),
      time: new Date(msg.created_at).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
    }))

    localStorage.setItem("messages", JSON.stringify(localFormat.reverse()))
    return true
  } catch (error) {
    console.error("Error deleting message:", error)
    return false
  }
}

export async function migrateLocalStorageToSupabase(): Promise<void> {
  // No hace nada en la versión fallback
  console.log("Using localStorage fallback - no migration needed")
}

export async function testSupabaseConnection(): Promise<boolean> {
  // Siempre retorna false en la versión fallback
  return false
}
