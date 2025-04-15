"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Heart } from "lucide-react"
import VenueCard from "@/components/venue-card"

// Mock favorite venues data
const mockFavorites = [
  {
    id: "venue-1",
    name: "Skyline Lounge",
    location: "Downtown Los Angeles",
    type: "Club",
    capacity: 250,
    pricePerHour: 350,
    rating: 4.8,
    images: [
      `/placeholder.svg?height=300&width=400`,
      `/placeholder.svg?height=300&width=400`,
      `/placeholder.svg?height=300&width=400`,
    ],
  },
  {
    id: "venue-3",
    name: "Grand Ballroom",
    location: "Beverly Hills",
    type: "Banquet Hall",
    capacity: 300,
    pricePerHour: 550,
    rating: 4.9,
    images: [
      `/placeholder.svg?height=300&width=400`,
      `/placeholder.svg?height=300&width=400`,
      `/placeholder.svg?height=300&width=400`,
    ],
  },
]

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(mockFavorites)

  // In a real app, we would load favorites from localStorage or a database
  useEffect(() => {
    // Check if we have any saved favorites in localStorage
    const savedFavorites = localStorage.getItem("favorites")
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites)
        if (Array.isArray(parsedFavorites) && parsedFavorites.length > 0) {
          setFavorites(parsedFavorites)
        }
      } catch (error) {
        console.error("Error parsing favorites:", error)
      }
    }
  }, [])

  const handleRemoveFavorite = (id: string) => {
    const updatedFavorites = favorites.filter((venue) => venue.id !== id)
    setFavorites(updatedFavorites)
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
  }

  return (
    <main className="bg-gray-900 text-white min-h-screen pb-16">
      <div className="container mx-auto px-4 py-6">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-6 w-6 text-red-500 fill-red-500" />
          <h1 className="text-3xl font-bold gradient-text">My Favorites</h1>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">No Favorites Yet</h3>
            <p className="text-gray-400 mb-6">
              You haven't added any venues to your favorites yet. Click the heart icon on any venue to add it to your
              favorites.
            </p>
            <Link href="/">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-full">
                Browse Venues
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((venue) => (
              <div key={venue.id} className="relative">
                <button
                  onClick={() => handleRemoveFavorite(venue.id)}
                  className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
                >
                  <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                </button>
                <VenueCard
                  id={venue.id}
                  name={venue.name}
                  location={venue.location}
                  type={venue.type}
                  capacity={venue.capacity}
                  pricePerHour={venue.pricePerHour}
                  rating={venue.rating}
                  images={venue.images}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
