"use client"

import { useMemo } from "react"
import VenueCard from "@/components/venue-card"
import SearchBar from "@/components/search-bar"
import CategoryFilter from "@/components/category-filter"
import { useSearchParams } from "next/navigation"

// Mock venue data with realistic names and locations
const allVenues = [
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
    id: "venue-2",
    name: "Warehouse 213",
    location: "Arts District, Los Angeles",
    type: "Warehouse",
    capacity: 500,
    pricePerHour: 450,
    rating: 4.6,
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
  {
    id: "venue-4",
    name: "Coastal Cafe",
    location: "Santa Monica",
    type: "Cafe",
    capacity: 80,
    pricePerHour: 150,
    rating: 4.5,
    images: [
      `/placeholder.svg?height=300&width=400`,
      `/placeholder.svg?height=300&width=400`,
      `/placeholder.svg?height=300&width=400`,
    ],
  },
  {
    id: "venue-5",
    name: "Sunset Restaurant",
    location: "Malibu",
    type: "Restaurant",
    capacity: 120,
    pricePerHour: 250,
    rating: 4.7,
    images: [
      `/placeholder.svg?height=300&width=400`,
      `/placeholder.svg?height=300&width=400`,
      `/placeholder.svg?height=300&width=400`,
    ],
  },
  {
    id: "venue-6",
    name: "Whiskey Bar",
    location: "Hollywood",
    type: "Bar",
    capacity: 150,
    pricePerHour: 200,
    rating: 4.4,
    images: [
      `/placeholder.svg?height=300&width=400`,
      `/placeholder.svg?height=300&width=400`,
      `/placeholder.svg?height=300&width=400`,
    ],
  },
  {
    id: "venue-7",
    name: "Echo Nightclub",
    location: "Culver City",
    type: "Club",
    capacity: 300,
    pricePerHour: 400,
    rating: 4.3,
    images: [
      `/placeholder.svg?height=300&width=400`,
      `/placeholder.svg?height=300&width=400`,
      `/placeholder.svg?height=300&width=400`,
    ],
  },
  {
    id: "venue-8",
    name: "Industrial Space",
    location: "Long Beach",
    type: "Warehouse",
    capacity: 400,
    pricePerHour: 350,
    rating: 4.2,
    images: [
      `/placeholder.svg?height=300&width=400`,
      `/placeholder.svg?height=300&width=400`,
      `/placeholder.svg?height=300&width=400`,
    ],
  },
  {
    id: "venue-9",
    name: "Pasadena Hall",
    location: "Pasadena",
    type: "Banquet Hall",
    capacity: 250,
    pricePerHour: 500,
    rating: 4.7,
    images: [
      `/placeholder.svg?height=300&width=400`,
      `/placeholder.svg?height=300&width=400`,
      `/placeholder.svg?height=300&width=400`,
    ],
  },
  {
    id: "venue-10",
    name: "Morning Brew",
    location: "Glendale",
    type: "Cafe",
    capacity: 60,
    pricePerHour: 120,
    rating: 4.4,
    images: [
      `/placeholder.svg?height=300&width=400`,
      `/placeholder.svg?height=300&width=400`,
      `/placeholder.svg?height=300&width=400`,
    ],
  },
  {
    id: "venue-11",
    name: "Gourmet Kitchen",
    location: "West Hollywood",
    type: "Restaurant",
    capacity: 100,
    pricePerHour: 300,
    rating: 4.8,
    images: [
      `/placeholder.svg?height=300&width=400`,
      `/placeholder.svg?height=300&width=400`,
      `/placeholder.svg?height=300&width=400`,
    ],
  },
  {
    id: "venue-12",
    name: "Speakeasy",
    location: "Downtown Los Angeles",
    type: "Bar",
    capacity: 80,
    pricePerHour: 180,
    rating: 4.6,
    images: [
      `/placeholder.svg?height=300&width=400`,
      `/placeholder.svg?height=300&width=400`,
      `/placeholder.svg?height=300&width=400`,
    ],
  },
]

export default function Home() {
  const searchParams = useSearchParams()

  // Use useMemo to filter venues based on search parameters
  const filteredVenues = useMemo(() => {
    // Filter venues based on search parameters
    let filtered = [...allVenues]

    // Filter by category
    const category = searchParams.get("category")
    if (category && category !== "trending") {
      filtered = filtered.filter((venue) => venue.type.toLowerCase() === category.toLowerCase())
    }

    // Filter by location
    const location = searchParams.get("location")
    if (location) {
      filtered = filtered.filter((venue) => venue.location.toLowerCase().includes(location.toLowerCase()))
    }

    // Filter by price range
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    if (minPrice) {
      filtered = filtered.filter((venue) => venue.pricePerHour >= Number.parseInt(minPrice))
    }
    if (maxPrice) {
      filtered = filtered.filter((venue) => venue.pricePerHour <= Number.parseInt(maxPrice))
    }

    // Filter by attendees
    const attendees = searchParams.get("attendees")
    if (attendees) {
      filtered = filtered.filter((venue) => venue.capacity >= Number.parseInt(attendees))
    }

    // Filter by venue types from advanced filter
    const venueTypes = searchParams.get("venueTypes")
    if (venueTypes) {
      const types = venueTypes.split(",")
      filtered = filtered.filter((venue) => types.includes(venue.type))
    }

    // Sort venues - trending shows highest rated first
    if (category === "trending" || !category) {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating)
    }

    return filtered
  }, [searchParams])

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        <SearchBar />

        <CategoryFilter />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {filteredVenues.map((venue) => (
            <VenueCard
              key={venue.id}
              id={venue.id}
              name={venue.name}
              location={venue.location}
              type={venue.type}
              capacity={venue.capacity}
              pricePerHour={venue.pricePerHour}
              rating={venue.rating}
              images={venue.images}
            />
          ))}
        </div>

        {filteredVenues.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No venues match your criteria</h3>
            <p className="text-gray-400">Try adjusting your filters to see more results.</p>
          </div>
        )}

        {filteredVenues.length > 0 && (
          <div className="flex justify-center mt-12 mb-8">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full transition-colors">
              Show More
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
