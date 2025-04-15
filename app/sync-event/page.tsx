"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { TimePickerDemo } from "@/components/time-picker"
import { toast } from "@/components/ui/use-toast"

export default function SyncEventPage() {
  const router = useRouter()
  const [date, setDate] = useState<Date>()
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [eventType, setEventType] = useState("")
  const [location, setLocation] = useState("")
  const [minBudget, setMinBudget] = useState("")
  const [maxBudget, setMaxBudget] = useState("")
  const [minAttendees, setMinAttendees] = useState("")
  const [maxAttendees, setMaxAttendees] = useState("")
  const [venueTypes, setVenueTypes] = useState<string[]>([])
  const [description, setDescription] = useState("")

  const handleVenueTypeChange = (type: string) => {
    if (venueTypes.includes(type)) {
      setVenueTypes(venueTypes.filter((t) => t !== type))
    } else {
      setVenueTypes([...venueTypes, type])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Create inquiry object
    const inquiry = {
      id: `inq-${Date.now()}`,
      eventType,
      location,
      date: date?.toLocaleDateString(),
      time: startTime && endTime ? `${startTime} - ${endTime}` : "",
      budget: `$${minBudget}-${maxBudget}/hr`,
      attendees: `${minAttendees}-${maxAttendees}`,
      venueTypes,
      description,
      createdAt: new Date().toISOString(),
    }

    // In a real app, we would save this to a database
    // For now, let's save to localStorage to simulate persistence
    const existingInquiries = JSON.parse(localStorage.getItem("inquiries") || "[]")
    localStorage.setItem("inquiries", JSON.stringify([...existingInquiries, inquiry]))

    toast({
      title: "Inquiry Submitted",
      description: "Your event inquiry has been submitted successfully!",
    })

    // Redirect to inquiries page
    router.push("/inquiries")
  }

  return (
    <main className="bg-gray-900 text-white min-h-screen pb-16">
      <div className="container mx-auto px-4 py-6">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 gradient-text">VSync Your Event</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="event-type">Event</Label>
                <Input
                  id="event-type"
                  placeholder="Type of event"
                  className="bg-gray-800 border-gray-700"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="City, neighborhood"
                  className="bg-gray-800 border-gray-700"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  list="locations"
                  required
                />
                <datalist id="locations">
                  <option value="Los Angeles" />
                  <option value="Long Beach" />
                  <option value="Glendale" />
                  <option value="Santa Clarita" />
                  <option value="Lancaster" />
                  <option value="Palmdale" />
                  <option value="Pomona" />
                  <option value="Torrance" />
                  <option value="Pasadena" />
                  <option value="El Monte" />
                  <option value="Inglewood" />
                  <option value="West Covina" />
                  <option value="Norwalk" />
                  <option value="Downey" />
                  <option value="Santa Monica" />
                  <option value="Beverly Hills" />
                  <option value="Culver City" />
                  <option value="Manhattan Beach" />
                  <option value="Malibu" />
                </datalist>
              </div>

              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-gray-800 border-gray-700"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {date ? date.toLocaleDateString() : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="bg-gray-800 text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Time</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-400 mb-1">Start</Label>
                    <TimePickerDemo value={startTime} onChange={setStartTime} />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-400 mb-1">End</Label>
                    <TimePickerDemo value={endTime} onChange={setEndTime} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Budget (per hour)</Label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Min $"
                      className="bg-gray-800 border-gray-700"
                      type="number"
                      value={minBudget}
                      onChange={(e) => setMinBudget(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Max $"
                      className="bg-gray-800 border-gray-700"
                      type="number"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Number of Expected Attendees</Label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Min"
                      className="bg-gray-800 border-gray-700"
                      type="number"
                      value={minAttendees}
                      onChange={(e) => setMinAttendees(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Max"
                      className="bg-gray-800 border-gray-700"
                      type="number"
                      value={maxAttendees}
                      onChange={(e) => setMaxAttendees(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Venue Type (select all that apply)</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {["Club", "Warehouse", "Banquet Hall", "Cafe", "Restaurant", "Bar"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
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

            <div className="space-y-2">
              <Label htmlFor="description">Event Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your event and venue requirements..."
                className="bg-gray-800 border-gray-700 min-h-[150px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
              Submit Inquiry
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
