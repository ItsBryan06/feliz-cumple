import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://esyshgsmiuamfwchqagp.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzeXNoZ3NtaXVhbWZ3Y2hxYWdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMzUwNDgsImV4cCI6MjA3MDcxMTA0OH0.CL6cbYKqUjav-p_p5b8X1E3SeVoeAi4rObvNA8LtRZM"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Message {
  id: string
  title: string
  content: string
  author: string
  created_at: string
}

// Función para obtener todos los mensajes
export async function getMessages(): Promise<Message[]> {
  const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching messages:", error)
    return []
  }

  return data || []
}

// Función para crear un nuevo mensaje
export async function createMessage(title: string, content: string, author: string): Promise<Message | null> {
  const { data, error } = await supabase
    .from("messages")
    .insert([
      {
        title,
        content,
        author,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error creating message:", error)
    return null
  }

  return data
}

// Función para actualizar un mensaje
export async function updateMessage(id: string, title: string, content: string): Promise<Message | null> {
  const { data, error } = await supabase.from("messages").update({ title, content }).eq("id", id).select().single()

  if (error) {
    console.error("Error updating message:", error)
    return null
  }

  return data
}

// Función para eliminar un mensaje
export async function deleteMessage(id: string): Promise<boolean> {
  const { error } = await supabase.from("messages").delete().eq("id", id)

  if (error) {
    console.error("Error deleting message:", error)
    return false
  }

  return true
}

// Función para migrar datos de localStorage a Supabase
export async function migrateLocalStorageToSupabase(): Promise<void> {
  try {
    const localMessages = JSON.parse(localStorage.getItem("messages") || "[]")

    if (localMessages.length === 0) return

    // Verificar si ya existen mensajes en Supabase para evitar duplicados
    const existingMessages = await getMessages()
    if (existingMessages.length > 0) {
      console.log("Messages already exist in Supabase, skipping migration")
      return
    }

    // Convertir formato de localStorage a formato de Supabase
    const messagesToInsert = localMessages.map((msg: any) => ({
      title: msg.title,
      content: msg.content,
      author: msg.author,
      created_at: new Date(`${msg.date} ${msg.time}`).toISOString(),
    }))

    const { error } = await supabase.from("messages").insert(messagesToInsert)

    if (error) {
      console.error("Error migrating messages:", error)
    } else {
      console.log("Messages migrated successfully!")
      // Marcar migración como completada
      localStorage.setItem("migrated_to_supabase", "true")
    }
  } catch (error) {
    console.error("Error during migration:", error)
  }
}

// Función para verificar la conexión con Supabase
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from("messages").select("count", { count: "exact" }).limit(1)

    if (error) {
      console.error("Supabase connection test failed:", error)
      return false
    }

    console.log("Supabase connection successful!")
    return true
  } catch (error) {
    console.error("Supabase connection test error:", error)
    return false
  }
}
