"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface PhotoGalleryModalProps {
  isOpen: boolean
  onClose: () => void
  photos: string[]
}

export default function PhotoGalleryModal({ isOpen, onClose, photos }: PhotoGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!isOpen) return null

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Mi linda princesa✨</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="relative aspect-[4/3] w-full bg-gray-100">
          <Image
            src={photos[currentIndex] || "/placeholder.svg"}
            alt={`Foto ${currentIndex + 1}`}
            fill
            className="object-contain"
          />

          <button
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all duration-200"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all duration-200"
            aria-label="Siguiente foto"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>
        </div>

        <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50">
          <div className="flex justify-center gap-2 overflow-x-auto py-2">
            {photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                  currentIndex === index ? "border-pink-500 scale-105" : "border-transparent opacity-70"
                }`}
              >
                <Image src={photo || "/placeholder.svg"} alt={`Miniatura ${index + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
          <div className="text-center mt-2 text-sm text-gray-600">
            {currentIndex + 1} de {photos.length}
          </div>
        </div>
      </div>
    </div>
  )
}
