"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Home, BookOpen, Gift, LogOut, Heart, User } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState("")
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const currentUser = localStorage.getItem("user")
    if (currentUser) {
      setUser(currentUser)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("isAuthenticated")
    router.push("/")
  }

  const menuItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Nuestro Diario",
      url: "/dashboard/diario",
      icon: BookOpen,
    },
    {
      title: "Cumpleaños 2025",
      url: "/dashboard/cumpleanos",
      icon: Gift,
    },
  ]

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <Sidebar className="border-r-0 bg-white/95 backdrop-blur-md shadow-lg">
          <SidebarHeader className="border-b border-pink-200/50 bg-white/90">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-800">Nuestro Espacio</h2>
                <p className="text-sm text-gray-600">Especial</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="bg-white/90">
            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-700 font-medium">Navegación</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.url}
                        className="hover:bg-pink-100/80 text-gray-700 data-[active=true]:bg-gradient-to-r data-[active=true]:from-pink-100 data-[active=true]:to-purple-100 data-[active=true]:text-purple-700 data-[active=true]:font-medium"
                      >
                        <a href={item.url}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-pink-200/50 bg-white/90">
            <div className="px-3 py-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{user}</p>
                  <p className="text-xs text-gray-600">Conectado</p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="w-full text-red-600 border-red-200 hover:bg-red-50 bg-white/80"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar sesión
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-pink-200/50 p-4 shadow-sm">
            <SidebarTrigger className="text-gray-700" />
          </header>

          <main className="flex-1 p-6">
            <Card className="h-full bg-white/40 backdrop-blur-sm border-0 shadow-lg">
              <div className="p-6 h-full">{children}</div>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
