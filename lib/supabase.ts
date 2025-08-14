import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

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

    // Convertir formato de localStorage a formato de Supabase
    const messagesToInsert = localMessages.map((msg: any) => ({
      id: msg.id,
      title: msg.title,
      content: msg.content,
      author: msg.author,
      created_at: new Date(`${msg.date} ${msg.time}`).toISOString(),
    }))

    const { error } = await supabase.from("messages").upsert(messagesToInsert, { onConflict: "id" })

    if (error) {
      console.error("Error migrating messages:", error)
    } else {
      console.log("Messages migrated successfully!")
      // Opcional: limpiar localStorage después de la migración
      // localStorage.removeItem('messages')
    }
  } catch (error) {
    console.error("Error during migration:", error)
  }
}
