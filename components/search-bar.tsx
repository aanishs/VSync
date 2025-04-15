"use client"

import { useState, useEffect } from "react"
import { Search, Calendar, Users, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { useRouter, useSearchParams } from "next/navigation"
import { TimePickerDemo } from "@/components/time-picker"
import { addMonths } from "date-fns"

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize state from URL parameters
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [location, setLocation] = useState("")
  const [attendees, setAttendees] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")

  // Initialize state from URL parameters on mount
  useEffect(() => {
    const locationParam = searchParams.get("location")
    if (locationParam) {
      setLocation(locationParam)
    }

    const dateParam = searchParams.get("date")
    if (dateParam) {
      setDate(new Date(dateParam))
    }

    const endDateParam = searchParams.get("endDate")
    if (endDateParam) {
      setEndDate(new Date(endDateParam))
    }

    const startTimeParam = searchParams.get("startTime")
    if (startTimeParam) {
      setStartTime(startTimeParam)
    }

    const endTimeParam = searchParams.get("endTime")
    if (endTimeParam) {
      setEndTime(endTimeParam)
    }

    const attendeesParam = searchParams.get("attendees")
    if (attendeesParam) {
      setAttendees(attendeesParam)
    }
  }, [searchParams])

  const handleSearch = () => {
    // Build query string with search parameters
    const params = new URLSearchParams(searchParams.toString())

    if (location) {
      params.set("location", location)
    } else {
      params.delete("location")
    }

    if (date) {
      params.set("date", date.toISOString().split("T")[0])
    } else {
      params.delete("date")
    }

    if (endDate) {
      params.set("endDate", endDate.toISOString().split("T")[0])
    } else {
      params.delete("endDate")
    }

    if (startTime) {
      params.set("startTime", startTime)
    } else {
      params.delete("startTime")
    }

    if (endTime) {
      params.set("endTime", endTime)
    } else {
      params.delete("endTime")
    }

    if (attendees) {
      params.set("attendees", attendees)
    } else {
      params.delete("attendees")
    }

    // Navigate with the search parameters
    router.push(`/?${params.toString()}`)
  }

  const clearInput = (field: "location" | "attendees") => {
    if (field === "location") {
      setLocation("")
      // Update URL to remove location parameter
      const params = new URLSearchParams(searchParams.toString())
      params.delete("location")
      router.push(`/?${params.toString()}`)
    } else if (field === "attendees") {
      setAttendees("")
      // Update URL to remove attendees parameter
      const params = new URLSearchParams(searchParams.toString())
      params.delete("attendees")
      router.push(`/?${params.toString()}`)
    }
  }

  return (
    <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Where?"
            className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white h-12"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          {location && (
            <button
              className="absolute right-3 top-3 text-gray-400 hover:text-white"
              onClick={() => clearInput("location")}
              type="button"
              aria-label="Clear location"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start text-left font-normal h-12 bg-gray-700 border-gray-600 text-white"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {date
                ? endDate
                  ? `${date.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
                  : date.toLocaleDateString()
                : "Date and Time"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
            <div className="p-3">
              <div className="flex gap-8">
                <CalendarComponent
                  mode="range"
                  selected={{
                    from: date,
                    to: endDate,
                  }}
                  onSelect={(range) => {
                    if (range?.from) setDate(range.from)
                    if (range?.to) setEndDate(range.to)
                  }}
                  numberOfMonths={2}
                  defaultMonth={new Date()}
                  initialFocus
                  className="bg-gray-800 text-white"
                />
              </div>
            </div>
            <div className="p-3 border-t border-gray-700">
              <div className="flex justify-between mb-2">
                <h4 className="font-medium">Start Time</h4>
                <h4 className="font-medium">End Time</h4>
              </div>
              <div className="flex gap-4">
                <TimePickerDemo value={startTime} onChange={setStartTime} />
                <TimePickerDemo value={endTime} onChange={setEndTime} />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="relative flex-1">
          <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Number of Attendees"
            className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white h-12"
            type="number"
            min="1"
            value={attendees}
            onChange={(e) => setAttendees(e.target.value)}
          />
          {attendees && (
            <button
              className="absolute right-3 top-3 text-gray-400 hover:text-white"
              onClick={() => clearInput("attendees")}
              type="button"
              aria-label="Clear attendees"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <Button className="bg-orange-500 hover:bg-orange-600 h-12 px-6" onClick={handleSearch}>
          Search
        </Button>
      </div>
    </div>
  )
}
