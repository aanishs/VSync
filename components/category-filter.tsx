"use client"

import { useState, useEffect } from "react"
import { Filter, TrendingUp, Music, Warehouse, Building2, Coffee, Utensils, Wine } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"

export default function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Initialize state from URL parameters
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [minPrice, setMinPrice] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<string>("")
  const [amenities, setAmenities] = useState<string[]>([])
  const [instantBook, setInstantBook] = useState<boolean>(false)
  const [venueTypes, setVenueTypes] = useState<string[]>([])

  // Initialize state from URL parameters on mount
  useEffect(() => {
    setActiveCategory(searchParams.get("category") || "trending")
    setMinPrice(searchParams.get("minPrice") || "50")
    setMaxPrice(searchParams.get("maxPrice") || "500")

    const amenitiesParam = searchParams.get("amenities")
    if (amenitiesParam) {
      setAmenities(amenitiesParam.split(","))
    }

    setInstantBook(searchParams.get("instantBook") === "true")

    const venueTypesParam = searchParams.get("venueTypes")
    if (venueTypesParam) {
      setVenueTypes(venueTypesParam.split(","))
    }
  }, [searchParams])

  const handleCategoryClick = (category: string) => {
    if (category === activeCategory) return

    setActiveCategory(category)

    // Update URL with the selected category
    const params = new URLSearchParams(searchParams.toString())
    params.set("category", category)
    router.push(`/?${params.toString()}`)
  }

  const handleAmenityChange = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter((a) => a !== amenity))
    } else {
      setAmenities([...amenities, amenity])
    }
  }

  const handleVenueTypeChange = (type: string) => {
    if (venueTypes.includes(type)) {
      setVenueTypes(venueTypes.filter((t) => t !== type))
    } else {
      setVenueTypes([...venueTypes, type])
    }
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = e.target.value
    if (type === 'min') {
      setMinPrice(value)
    } else {
      setMaxPrice(value)
    }
  }

  const handleInstantBookChange = () => {
    setInstantBook(!instantBook)
  }

  const clearFilters = () => {
    setMinPrice("50")
    setMaxPrice("500")
    setAmenities([])
    setInstantBook(false)
    setVenueTypes([])
  }

  const applyFilters = () => {
    // Build query string with all filters
    const params = new URLSearchParams(searchParams.toString())

    if (activeCategory) params.set("category", activeCategory)
    if (minPrice !== "50" || maxPrice !== "500") {
      params.set("minPrice", minPrice)
      params.set("maxPrice", maxPrice)
    } else {
      params.delete("minPrice")
      params.delete("maxPrice")
    }

    if (amenities.length > 0) {
      params.set("amenities", amenities.join(","))
    } else {
      params.delete("amenities")
    }

    if (instantBook) {
      params.set("instantBook", "true")
    } else {
      params.delete("instantBook")
    }

    if (venueTypes.length > 0) {
      params.set("venueTypes", venueTypes.join(","))
    } else {
      params.delete("venueTypes")
    }

    // Navigate with the filters applied
    router.push(`/?${params.toString()}`)
    setIsDialogOpen(false) // Close the dialog after applying filters
  }

  const categories = [
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "club", label: "Club", icon: Music },
    { id: "warehouse", label: "Warehouse", icon: Warehouse },
    { id: "banquet hall", label: "Banquet Hall", icon: Building2 },
    { id: "cafe", label: "Cafe", icon: Coffee },
    { id: "restaurant", label: "Restaurant", icon: Utensils },
    { id: "bar", label: "Bar", icon: Wine },
  ]

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between overflow-x-auto pb-2">
        <div className="flex gap-2">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                className={`flex items-center gap-2 ${
                  activeCategory === category.id
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-gray-800 hover:bg-gray-700 border-gray-700"
                }`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <Icon className="h-4 w-4" />
                {category.label}
              </Button>
            )
          })}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border-gray-700">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </DialogTrigger>
          <DialogContent 
            className="bg-gray-800 text-white border-gray-700 max-w-md" 
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <DialogHeader>
              <DialogTitle className="text-xl">Filter</DialogTitle>
              <DialogDescription className="text-gray-400">
                Adjust filters to find venues that match your needs.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4" onClick={(e) => e.stopPropagation()}>
              <div>
                <h3 className="font-medium mb-2">Price Per Hour</h3>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <Label htmlFor="min-price" className="text-xs text-gray-400 mb-1 block">
                      Min $
                    </Label>
                    <Input
                      id="min-price"
                      type="number"
                      className="bg-gray-700 border-gray-600"
                      value={minPrice}
                      onChange={(e) => handlePriceChange(e, 'min')}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="max-price" className="text-xs text-gray-400 mb-1 block">
                      Max $
                    </Label>
                    <Input
                      id="max-price"
                      type="number"
                      className="bg-gray-700 border-gray-600"
                      value={maxPrice}
                      onChange={(e) => handlePriceChange(e, 'max')}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {["WiFi", "Parking", "Sound System", "Lighting", "Bar", "Kitchen", "Restrooms", "Stage"].map(
                    (amenity) => (
                      <div key={amenity} className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          id={`amenity-${amenity}`}
                          checked={amenities.includes(amenity)}
                          onCheckedChange={() => handleAmenityChange(amenity)}
                          className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                        />
                        <Label htmlFor={`amenity-${amenity}`}>{amenity}</Label>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    id="instant-book"
                    checked={instantBook}
                    onCheckedChange={handleInstantBookChange}
                    className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                  />
                  <Label htmlFor="instant-book">Instant Book</Label>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Venue Types</h3>
                <div className="grid grid-cols-2 gap-2">
                  {["Club", "Warehouse", "Banquet Hall", "Cafe", "Restaurant", "Bar"].map((type) => (
                    <div key={type} className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        id={`venue-${type}`}
                        checked={venueTypes.includes(type)}
                        onCheckedChange={() => handleVenueTypeChange(type)}
                        className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                      />
                      <Label htmlFor={`venue-${type}`}>{type}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={clearFilters} className="bg-transparent hover:bg-gray-700">
                  Clear All
                </Button>
                <Button onClick={applyFilters} className="bg-orange-500 hover:bg-orange-600">
                  Show {venueTypes.length > 0 ? venueTypes.length : "All"} Venues
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
