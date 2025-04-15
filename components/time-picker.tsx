"use client"

import * as React from "react"
import { Clock } from "lucide-react"

interface TimePickerDemoProps {
  value: string
  onChange: (time: string) => void
}

export function TimePickerDemo({ value, onChange }: TimePickerDemoProps) {
  // Generate time options in 30-minute intervals
  const timeOptions = React.useMemo(() => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      for (const minute of [0, 30]) {
        const hourFormatted = hour.toString().padStart(2, "0")
        const minuteFormatted = minute.toString().padStart(2, "0")
        const time = `${hourFormatted}:${minuteFormatted}`
        const displayTime = formatTimeDisplay(hour, minute)
        options.push({ value: time, display: displayTime })
      }
    }
    return options
  }, [])

  function formatTimeDisplay(hour: number, minute: number) {
    const period = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    const displayMinute = minute.toString().padStart(2, "0")
    return `${displayHour}:${displayMinute} ${period}`
  }

  return (
    <div className="flex-1">
      <div className="relative">
        <Clock className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <select
          className="w-full pl-8 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select time</option>
          {timeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.display}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
