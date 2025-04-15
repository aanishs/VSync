"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

// Mock venue data
const mockVenues = [
  {
    id: "venue-1",
    name: "Downtown Loft",
    location: "Downtown Los Angeles",
  },
  {
    id: "venue-2",
    name: "Beachside Studio",
    location: "Santa Monica",
  },
]

// Mock bookings data
const mockBookings = [
  {
    id: "book-1",
    venueId: "venue-1",
    title: "Corporate Party",
    date: new Date(2025, 3, 20), // April 20, 2025
    startTime: "19:00",
    endTime: "23:00",
    status: "confirmed",
  },
  {
    id: "book-2",
    venueId: "venue-2",
    title: "Photo Shoot",
    date: new Date(2025, 3, 25), // April 25, 2025
    startTime: "10:00",
    endTime: "16:00",
    status: "pending",
  },
]

// Mock unavailable dates
const mockUnavailableDates = [
  {
    id: "block-1",
    venueId: "venue-1",
    date: new Date(2025, 3, 15), // April 15, 2025
    reason: "Maintenance",
  },
  {
    id: "block-2",
    venueId: "venue-2",
    date: new Date(2025, 3, 10), // April 10, 2025
    reason: "Personal Use",
  },
]

export default function CalendarPage() {
  const [selectedVenue, setSelectedVenue] = useState(mockVenues[0])
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [blockReason, setBlockReason] = useState("")
  const [showBlockDateDialog, setShowBlockDateDialog] = useState(false)

  // Filter bookings and unavailable dates for the selected venue
  const venueBookings = mockBookings.filter((booking) => booking.venueId === selectedVenue.id)
  const venueUnavailableDates = mockUnavailableDates.filter((block) => block.venueId === selectedVenue.id)

  // Function to handle blocking a date
  const handleBlockDate = () => {
    if (!selectedDate || !blockReason) return

    // In a real app, we would send this to the backend
    // For now, just show a toast
    toast({
      title: "Date Blocked",
      description: `${selectedDate.toLocaleDateString()} has been blocked for ${blockReason}.`,
    })

    setSelectedDate(undefined)
    setBlockReason("")
    setShowBlockDateDialog(false)
  }

  // Function to get events for a specific date
  const getEventsForDate = (date: Date) => {
    const dateString = date.toDateString()

    const bookingsOnDate = venueBookings.filter((booking) => booking.date.toDateString() === dateString)

    const blockedDate = venueUnavailableDates.find((block) => block.date.toDateString() === dateString)

    return { bookingsOnDate, blockedDate }
  }

  // Function to render the day cell content
  const renderDayContent = (day: Date) => {
    const { bookingsOnDate, blockedDate } = getEventsForDate(day)

    return (
      <div className="h-full w-full">
        <div className="text-right p-1">{day.getDate()}</div>

        {blockedDate && (
          <div className="bg-red-500/20 text-red-400 text-xs p-1 rounded mt-1 truncate">
            Blocked: {blockedDate.reason}
          </div>
        )}

        {bookingsOnDate.map((booking) => (
          <div
            key={booking.id}
            className={`text-xs p-1 rounded mt-1 truncate ${
              booking.status === "confirmed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
            }`}
          >
            {booking.title} ({booking.startTime}-{booking.endTime})
          </div>
        ))}
      </div>
    )
  }

  return (
    <main className="bg-gray-900 text-white min-h-screen pb-16">
      <div className="container mx-auto px-4 py-6">
        <Link href="/host" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-8 gradient-text">Calendar & Availability</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Your Venues</h2>

              <Select
                value={selectedVenue.id}
                onValueChange={(value) => {
                  const venue = mockVenues.find((v) => v.id === value)
                  if (venue) setSelectedVenue(venue)
                }}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select venue" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {mockVenues.map((venue) => (
                    <SelectItem key={venue.id} value={venue.id}>
                      {venue.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="mt-6">
                <h3 className="font-medium text-sm mb-2">Legend</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500/20"></div>
                    <span className="text-sm">Confirmed Booking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-500/20"></div>
                    <span className="text-sm">Pending Booking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500/20"></div>
                    <span className="text-sm">Blocked Date</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Dialog open={showBlockDateDialog} onOpenChange={setShowBlockDateDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Block Dates
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xl">Block Date</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                      <div>
                        <Label className="mb-2 block">Select Date</Label>
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          className="bg-gray-800 text-white rounded-md border border-gray-700"
                        />
                      </div>

                      <div>
                        <Label htmlFor="block-reason" className="mb-2 block">
                          Reason
                        </Label>
                        <Select value={blockReason} onValueChange={setBlockReason}>
                          <SelectTrigger id="block-reason" className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                            <SelectItem value="Personal Use">Personal Use</SelectItem>
                            <SelectItem value="Renovation">Renovation</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex justify-end gap-2 mt-2">
                        <Button
                          variant="outline"
                          className="bg-gray-700 hover:bg-gray-600 border-gray-600"
                          onClick={() => setShowBlockDateDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="bg-orange-500 hover:bg-orange-600"
                          onClick={handleBlockDate}
                          disabled={!selectedDate || !blockReason}
                        >
                          Block Date
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">{selectedVenue.name} Calendar</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-gray-700 hover:bg-gray-600 border-gray-600"
                    onClick={() => {
                      const prevMonth = new Date(currentMonth)
                      prevMonth.setMonth(prevMonth.getMonth() - 1)
                      setCurrentMonth(prevMonth)
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">
                    {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-gray-700 hover:bg-gray-600 border-gray-600"
                    onClick={() => {
                      const nextMonth = new Date(currentMonth)
                      nextMonth.setMonth(nextMonth.getMonth() + 1)
                      setCurrentMonth(nextMonth)
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-400 p-2">
                    {day}
                  </div>
                ))}

                {(() => {
                  const days = []
                  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
                  const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

                  // Add empty cells for days before the first day of the month
                  for (let i = 0; i < firstDay.getDay(); i++) {
                    days.push(<div key={`empty-${i}`} className="min-h-24 bg-gray-750 rounded-md opacity-50"></div>)
                  }

                  // Add cells for each day of the month
                  for (let day = 1; day <= lastDay.getDate(); day++) {
                    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                    days.push(
                      <div key={`day-${day}`} className="min-h-24 bg-gray-750 rounded-md p-1 overflow-hidden">
                        {renderDayContent(date)}
                      </div>,
                    )
                  }

                  return days
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
