"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VenuePhotoGalleryProps {
  images: string[]
  venueName: string
  isOpen: boolean
  onClose: () => void
}

export default function VenuePhotoGallery({ images, venueName, isOpen, onClose }: VenuePhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
      if (e.key === "ArrowRight") setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, images.length, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="p-4 flex justify-between items-center">
        <Button onClick={onClose} variant="ghost" className="text-white hover:bg-gray-800 absolute top-2 left-2 z-10">
          <X className="h-6 w-6" />
        </Button>
        <h2 className="text-white font-medium mx-auto">{venueName} Photos</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {images.map((image, index) => (
          <div key={index} className="mb-4 px-4">
            <div className="relative h-[60vh] w-full">
              <Image
                src={image || "/placeholder.svg"}
                alt={`${venueName} photo ${index + 1}`}
                fill
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 flex justify-center">
        <p className="text-white">
          {currentIndex + 1} / {images.length}
        </p>
      </div>
    </div>
  )
}
