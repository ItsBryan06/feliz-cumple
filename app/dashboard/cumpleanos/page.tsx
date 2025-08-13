"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Heart, Calendar, MapPin, Music, Camera, Gift, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import DaysCounter from "@/components/days-counter"
import PhotoGalleryModal from "@/components/photo-gallery-modal"
import SpotifyPlayer from "@/components/spotify-player"
import Fireworks from "@/components/fireworks"
import TypewriterText from "@/components/typewriter-text"

export default function CumpleanosPage() {
  const [showMessage, setShowMessage] = useState(false)
  const [currentPhoto, setCurrentPhoto] = useState(0)
  const [floatingHearts, setFloatingHearts] = useState<number[]>([])
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [showFireworks, setShowFireworks] = useState(false)
  const [showTitle, setShowTitle] = useState(false)
  const [showText, setShowText] = useState(false)
  const router = useRouter()

  // ID de la canción de Spotify
  const spotifyTrackId = "4cOdK2wGLETKBW3PvgPWqT"

  const photos = ["/portada.jpg", "/foto-1.jpg", "/foto-2.jpg", "/foto-3.jpg", "/foto-4.jpg", "/foto-5.png"]

  const memories = [
    { date: "Febrero 2025", title: "Nuestra primera charla", description: "Hola, vendo pan" },
    { date: "Marzo 2025", title: "Oficialmente novios", description: "Un cálido 10 de marzo." },
    {
      date: "Abril 2025",
      title: "Primer mes juntos",
      description: "Apenas estamos empezando en este camino, pero cada día me siento tan feliz contigo a mi lado <3",
    },
  ]

  const news = [
    {
      date: "2026",
      title: "Año de nuestro encuentro",
      description:
        "El año en el que viajaré para visitarte y saldremos a comer, dormiremos juntos, pasearemos de un sitio a otro <3",
    },
    {
      date: "----",
      title: "Nuestro lindo apartamento",
      description: "Muy pronto ya estaremos viviendo juntos con nuestro lindo apartamento uwu.",
    },
    {
      date: "Indefinido",
      title: "Página web de nuestras salidas?",
      description: "Y aquí pondremos todas las futuras cosas que haremos uwu",
    },
  ]

  const messageTitle = "Un regalito de mi parte mi princesa"
  const messageText =
    "Te amo muchísimo amor. Quiero recordarte lo increíble que eres y lo afortunado que me siento de tenerte en mi vida. Eres una grandísima mujer y una grandísima novia. Me siento orgulloso de ti y de todo el esfuerzo que pones para mejorar cada día. Te amo mucho mi amor. Feliz cumpleaños"

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/")
      return
    }

    const interval = setInterval(() => {
      setCurrentPhoto((prev) => (prev + 1) % photos.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [photos.length, router])

  const createFloatingHearts = () => {
    const numberOfHearts = Math.floor(Math.random() * 6) + 10

    for (let i = 0; i < numberOfHearts; i++) {
      const newHeart = Date.now() + i
      setFloatingHearts((prev) => [...prev, newHeart])

      setTimeout(() => {
        setFloatingHearts((prev) => prev.filter((heart) => heart !== newHeart))
      }, 1000)
    }
  }

  const handleOpenGift = () => {
    setShowMessage(true)
    setShowFireworks(true)
    createFloatingHearts()

    setTimeout(() => {
      setShowTitle(true)
    }, 500)
  }

  const handleTitleComplete = () => {
    setTimeout(() => {
      setShowText(true)
    }, 300)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
      {/* Botón para volver al dashboard */}
      <div className="fixed top-4 left-4 z-50">
        <Button onClick={() => router.push("/dashboard")} variant="outline" className="bg-white/80 backdrop-blur-sm">
          ← Volver al Dashboard
        </Button>
      </div>

      {/* Fireworks */}
      <Fireworks isActive={showFireworks} duration={4000} />

      {/* Floating Hearts Animation */}
      {floatingHearts.map((heart) => (
        <div
          key={heart}
          className="absolute animate-float-up"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 30 + 60}%`,
            opacity: Math.random() * 0.5 + 0.5,
            transform: `scale(${Math.random() * 0.5 + 0.8})`,
          }}
        >
          <Heart
            className="w-6 h-6 text-pink-400 fill-pink-400"
            style={{ transform: `rotate(${Math.random() * 40 - 20}deg)` }}
          />
        </div>
      ))}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
              ¡Feliz Cumpleaños!
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-gray-700 font-light">Mi Amor ✨</h2>
          </div>

          <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full animate-spin-slow opacity-20"></div>
            <div className="relative w-full h-full rounded-full border-8 border-white shadow-2xl overflow-hidden transition-all duration-1000 hover:scale-105">
              <Image
                src={photos[currentPhoto] || "/placeholder.svg"}
                alt="Foto especial"
                fill
                className="object-cover transition-all duration-1000"
                sizes="(max-width: 768px) 256px, 320px"
                priority
              />
            </div>
          </div>

          <Button
            onClick={handleOpenGift}
            className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Gift className="w-5 h-5 mr-2" />
            Abrir mi regalo
          </Button>
        </div>
      </section>

      {/* Days Counter Section */}
      <section className="py-12 px-4">
        <div className="max-w-md mx-auto">
          <DaysCounter startDate="2025-03-10" />
        </div>
      </section>

      {/* Love Message with Typewriter Effect */}
      {showMessage && (
        <section className="py-16 px-4 animate-fade-in">
          <Card className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="p-8 text-center space-y-6">
              <Sparkles className="w-12 h-12 text-yellow-400 mx-auto animate-bounce" />

              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 min-h-[2.5rem]">
                {showTitle && <TypewriterText text={messageTitle} speed={80} onComplete={handleTitleComplete} />}
              </h3>

              <div className="text-gray-600 leading-relaxed text-lg min-h-[6rem]">
                {showText && <TypewriterText text={messageText} speed={30} />}
              </div>

              {showText && (
                <div className="flex justify-center space-x-4 animate-fade-in">
                  <Heart className="w-6 h-6 text-red-400 fill-red-400 animate-pulse" />
                  <Heart
                    className="w-6 h-6 text-pink-400 fill-pink-400 animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  />
                  <Heart
                    className="w-6 h-6 text-purple-400 fill-purple-400 animate-pulse"
                    style={{ animationDelay: "1s" }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* Memories Timeline */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Nuestros Recuerdos
          </h3>
          <div className="space-y-8">
            {memories.map((memory, index) => (
              <Card
                key={index}
                className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <h4 className="text-xl font-semibold text-gray-800">{memory.title}</h4>
                          <p className="text-gray-600 mt-1">{memory.description}</p>
                        </div>
                        <span className="text-sm text-purple-500 font-medium mt-2 md:mt-0">{memory.date}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Future Projects Timeline */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            Nuestros Futuros Proyectos
          </h3>
          <div className="space-y-8">
            {news.map((project, index) => (
              <Card
                key={index}
                className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <h4 className="text-xl font-semibold text-gray-800">{project.title}</h4>
                          <p className="text-gray-600 mt-1">{project.description}</p>
                        </div>
                        <span className="text-sm text-blue-500 font-medium mt-2 md:mt-0">{project.date}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Features */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Momentos Especiales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              className="bg-gradient-to-br from-pink-100 to-pink-200 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => setIsGalleryOpen(true)}
            >
              <CardContent className="p-6 text-center space-y-4">
                <Camera className="w-12 h-12 text-pink-500 mx-auto" />
                <h4 className="text-xl font-semibold text-gray-800">Galería</h4>
                <p className="text-gray-600">Nuestras fotos favoritas</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <CardContent className="p-6 text-center space-y-4">
                <Music className="w-12 h-12 text-purple-500 mx-auto" />
                <h4 className="text-xl font-semibold text-gray-800">Playlist</h4>
                <p className="text-gray-600">Nuestras canciones</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-100 to-blue-200 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <CardContent className="p-6 text-center space-y-4">
                <MapPin className="w-12 h-12 text-blue-500 mx-auto" />
                <h4 className="text-xl font-semibold text-gray-800">Lugares</h4>
                <p className="text-gray-600">Sitios importantes</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final Message */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-0 shadow-2xl">
            <CardContent className="p-8 space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800">Te amo más cada día</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Que este nuevo año de vida esté lleno de sueños cumplidos, aventuras increíbles y todo el amor que
                mereces. ¡Feliz cumpleaños, mi amor!
              </p>
              <Button
                onClick={createFloatingHearts}
                className="bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Heart className="w-5 h-5 mr-2 fill-current" />
                Enviar amor
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Photo Gallery Modal */}
      <PhotoGalleryModal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} photos={photos} />

      {/* Spotify Player */}
      <SpotifyPlayer trackId={spotifyTrackId} />
    </div>
  )
}
