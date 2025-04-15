"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface VenueCardProps {
  id: string
  name: string
  location: string
  type: string
  capacity: number
  pricePerHour: number
  rating: number
  images: string[]
}

export default function VenueCard({
  id,
  name,
  location,
  type,
  capacity,
  pricePerHour,
  rating,
  images,
}: VenueCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  // Check if venue is in favorites on mount
  useEffect(() => {
    try {
      const existingFavorites = JSON.parse(localStorage.getItem("favorites") || "[]")
      const isInFavorites = existingFavorites.some((venue: any) => venue.id === id)
      setIsFavorite(isInFavorites)
    } catch (error) {
      console.error("Error checking favorites:", error)
    }
  }, [id])

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // Update the toggleFavorite function to save to localStorage
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const newFavoriteState = !isFavorite
      setIsFavorite(newFavoriteState)

      // Save to localStorage
      const existingFavorites = JSON.parse(localStorage.getItem("favorites") || "[]")

      if (newFavoriteState) {
        // Add to favorites
        const venueData = {
          id,
          name,
          location,
          type,
          capacity,
          pricePerHour,
          rating,
          images,
        }
        localStorage.setItem("favorites", JSON.stringify([...existingFavorites, venueData]))
      } else {
        // Remove from favorites
        const updatedFavorites = existingFavorites.filter((venue: any) => venue.id !== id)
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
      }
    } catch (error) {
      console.error("Error updating favorites:", error)
    }
  }

  return (
    <Link href={`/venues/${id}`} className="card group">
      <div className="relative">
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={images[currentImageIndex] || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ‹
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ›
            </button>
          </>
        )}

        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
        >
          <Heart className={cn("h-5 w-5 transition-colors", isFavorite ? "fill-red-500 text-red-500" : "text-white")} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-gray-400 text-sm">{location}</p>
          </div>
          <div className="flex items-center gap-1 bg-orange-500 px-2 py-1 rounded text-xs font-medium">★ {rating}</div>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          <span className="text-xs bg-gray-700 px-2 py-1 rounded">{type}</span>
          <span className="text-xs bg-gray-700 px-2 py-1 rounded">Up to {capacity} people</span>
        </div>

        <div className="mt-3 font-semibold text-orange-400">${pricePerHour}/hour</div>
      </div>
    </Link>
  )
}
