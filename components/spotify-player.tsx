"use client"

import { useState, useEffect, useRef } from "react"
import { Music, Pause, Play, X } from "lucide-react"

interface SpotifyPlayerProps {
  trackId: string // ID de la canción de Spotify
}

export default function SpotifyPlayer({ trackId }: SpotifyPlayerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Función para controlar la reproducción
  const togglePlayback = () => {
    if (iframeRef.current) {
      const message = isPlaying ? "pause" : "play"
      iframeRef.current.contentWindow?.postMessage({ command: message }, "https://open.spotify.com")
      setIsPlaying(!isPlaying)
    }
  }

  // Expandir/colapsar el reproductor
  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
    // Si se está expandiendo y no está reproduciendo, iniciar reproducción
    if (!isExpanded && !isPlaying) {
      setTimeout(() => {
        setIsPlaying(true)
      }, 500)
    }
  }

  // Efecto para iniciar la reproducción cuando se expande
  useEffect(() => {
    if (isExpanded && !isPlaying && iframeRef.current) {
      // Pequeño retraso para asegurar que el iframe esté cargado
      const timer = setTimeout(() => {
        iframeRef.current?.contentWindow?.postMessage({ command: "play" }, "https://open.spotify.com")
        setIsPlaying(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isExpanded, isPlaying])

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {/* Botón circular flotante */}
      <div
        className={`rounded-full shadow-xl transition-all duration-500 ${
          isExpanded
            ? "bg-white/90 backdrop-blur-md w-72 h-72 md:w-80 md:h-80"
            : "bg-gradient-to-r from-green-400 to-green-500 w-16 h-16 cursor-pointer hover:scale-110"
        }`}
      >
        {/* Contenido cuando está colapsado */}
        {!isExpanded && (
          <div className="w-full h-full flex items-center justify-center" onClick={toggleExpand}>
            <Music className="w-8 h-8 text-white animate-pulse" />
          </div>
        )}

        {/* Contenido cuando está expandido */}
        {isExpanded && (
          <div className="relative w-full h-full p-4 flex flex-col items-center">
            {/* Botón para cerrar */}
            <button
              onClick={toggleExpand}
              className="absolute top-3 right-3 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Cerrar reproductor"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>

            {/* Título */}
            <div className="text-center mb-2 mt-2">
              <h4 className="font-semibold text-gray-800">Una canción que te gusta</h4>
              <p className="text-xs text-gray-500">Te amio mucho princesa</p>
            </div>

            {/* Reproductor de Spotify (iframe) */}
            <div className="relative w-full flex-1 rounded-lg overflow-hidden">
              <iframe
                ref={iframeRef}
                src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
                width="90%"
                height="90%"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="absolute inset-0 rounded-lg"
              ></iframe>
            </div>

            {/* Controles personalizados */}
            <div className="mt-3 flex justify-center">
              <button
                onClick={togglePlayback}
                className="p-3 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                aria-label={isPlaying ? "Pausar" : "Reproducir"}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Indicador de música flotante cuando está colapsado */}
      {!isExpanded && isPlaying && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
        </div>
      )}
    </div>
  )
}
