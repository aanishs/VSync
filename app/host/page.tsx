"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Filter, Calendar, MessageCircle, DollarSign, Star, Users, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogDescription } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

// Mock inquiries data
const mockInquiries = [
  {
    id: "inq-1",
    eventType: "Birthday Party",
    location: "Downtown Los Angeles",
    date: "May 15, 2025",
    attendees: "30-50",
    budget: "$100-200/hr",
    description: "Looking for a venue with a bar and dance floor for a 30th birthday celebration.",
  },
  {
    id: "inq-2",
    eventType: "Corporate Meeting",
    location: "Pasadena",
    date: "June 5, 2025",
    attendees: "15-20",
    budget: "$150-300/hr",
    description: "Need a professional space with AV equipment for a quarterly team meeting.",
  },
  {
    id: "inq-3",
    eventType: "Wedding Reception",
    location: "Santa Monica",
    date: "July 22, 2025",
    attendees: "80-100",
    budget: "$300-500/hr",
    description: "Searching for a beautiful venue with outdoor space for a summer wedding reception.",
  },
  {
    id: "inq-4",
    eventType: "Product Launch",
    location: "Culver City",
    date: "May 30, 2025",
    attendees: "50-75",
    budget: "$200-400/hr",
    description: "Looking for a modern space to host a tech product launch with demo stations.",
  },
]

// Mock bookings data
const mockBookings = [
  {
    id: "book-1",
    venueName: "Skyline Lounge",
    venueImage: "/placeholder.svg?height=100&width=100",
    eventType: "Corporate Party",
    date: "April 20, 2025",
    time: "7:00 PM - 11:00 PM",
    guests: 75,
    status: "Pending",
    total: "$1,400",
    guestName: "John Smith",
    guestEmail: "john.smith@example.com",
  },
  {
    id: "book-2",
    venueName: "Warehouse 213",
    venueImage: "/placeholder.svg?height=100&width=100",
    eventType: "Photo Shoot",
    date: "April 25, 2025",
    time: "10:00 AM - 4:00 PM",
    guests: 15,
    status: "Pending",
    total: "$2,700",
    guestName: "Emily Johnson",
    guestEmail: "emily.j@example.com",
  },
]

// Mock venues data
const mockVenues = [
  {
    id: "venue-1",
    name: "Downtown Loft",
    location: "Downtown Los Angeles",
    type: "Loft",
    capacity: 100,
    pricePerHour: 200,
    rating: 4.7,
    reviews: 23,
    image: "/placeholder.svg?height=200&width=300",
    status: "Active",
    amenities: ["WiFi", "Parking", "Sound System"],
  },
  {
    id: "venue-2",
    name: "Beachside Studio",
    location: "Santa Monica",
    type: "Studio",
    capacity: 50,
    pricePerHour: 150,
    rating: 4.5,
    reviews: 18,
    image: "/placeholder.svg?height=200&width=300",
    status: "Active",
    amenities: ["WiFi", "Lighting", "Restrooms"],
  },
]

export default function HostDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("inquiries")
  const [eventTypes, setEventTypes] = useState<string[]>([])
  const [inquiries, setInquiries] = useState(mockInquiries)
  const [bookings, setBookings] = useState(mockBookings)
  const [venues, setVenues] = useState(mockVenues)
  const [filteredInquiries, setFilteredInquiries] = useState(mockInquiries)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [showBookingDetails, setShowBookingDetails] = useState(false)
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [minAttendees, setMinAttendees] = useState("")
  const [maxAttendees, setMaxAttendees] = useState("")
  const [showSendVenueDialog, setShowSendVenueDialog] = useState(false)
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null)
  const [selectedVenueToSend, setSelectedVenueToSend] = useState("")
  const [showSendConfirmation, setShowSendConfirmation] = useState(false)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)

  // Add venue editing functionality
  const [editingVenue, setEditingVenue] = useState<any>(null)
  const [showVenueEditDialog, setShowVenueEditDialog] = useState(false)
  const [editedVenueName, setEditedVenueName] = useState("")
  const [editedVenueLocation, setEditedVenueLocation] = useState("")
  const [editedVenueType, setEditedVenueType] = useState("")
  const [editedVenueCapacity, setEditedVenueCapacity] = useState("")
  const [editedVenuePrice, setEditedVenuePrice] = useState("")
  const [editedVenueAmenities, setEditedVenueAmenities] = useState<string[]>([])

  const handleEditVenue = (venue: any) => {
    setEditingVenue(venue)
    setEditedVenueName(venue.name)
    setEditedVenueLocation(venue.location)
    setEditedVenueType(venue.type)
    setEditedVenueCapacity(venue.capacity.toString())
    setEditedVenuePrice(venue.pricePerHour.toString())
    setEditedVenueAmenities(venue.amenities || [])
    setShowVenueEditDialog(true)
  }

  const handleSaveVenueEdit = () => {
    const updatedVenues = venues.map((venue) => {
      if (venue.id === editingVenue.id) {
        return {
          ...venue,
          name: editedVenueName,
          location: editedVenueLocation,
          type: editedVenueType,
          capacity: Number.parseInt(editedVenueCapacity),
          pricePerHour: Number.parseInt(editedVenuePrice),
          amenities: editedVenueAmenities,
        }
      }
      return venue
    })

    setVenues(updatedVenues)
    setShowVenueEditDialog(false)

    toast({
      title: "Venue Updated",
      description: "Your venue has been updated successfully.",
    })
  }

  const handleEventTypeChange = (type: string) => {
    if (eventTypes.includes(type)) {
      setEventTypes(eventTypes.filter((t) => t !== type))
    } else {
      setEventTypes([...eventTypes, type])
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

  const handleAttendeesChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = e.target.value
    if (type === 'min') {
      setMinAttendees(value)
    } else {
      setMaxAttendees(value)
    }
  }

  const applyFilters = () => {
    let filtered = inquiries

    // Filter by event type
    if (eventTypes.length > 0) {
      filtered = filtered.filter((inquiry) =>
        eventTypes.some((type) => inquiry.eventType.toLowerCase().includes(type.toLowerCase())),
      )
    }

    // Filter by price range
    if (minPrice && maxPrice) {
      filtered = filtered.filter((inquiry) => {
        const budgetMatch = inquiry.budget.match(/\$(\d+)-(\d+)\/hr/)
        if (budgetMatch) {
          const [, min, max] = budgetMatch
          return Number.parseInt(min) <= Number.parseInt(maxPrice) && Number.parseInt(max) >= Number.parseInt(minPrice)
        }
        return true
      })
    }

    // Filter by attendees
    if (minAttendees || maxAttendees) {
      filtered = filtered.filter((inquiry) => {
        const attendeesMatch = inquiry.attendees.match(/(\d+)-(\d+)/)
        if (attendeesMatch) {
          const [, min, max] = attendeesMatch
          const minOk = !minAttendees || Number.parseInt(min) >= Number.parseInt(minAttendees)
          const maxOk = !maxAttendees || Number.parseInt(max) <= Number.parseInt(maxAttendees)
          return minOk && maxOk
        }
        return true
      })
    }

    setFilteredInquiries(filtered)
    setIsFilterDialogOpen(false) // Close the dialog after applying filters
  }

  const handleAcceptBooking = (bookingId: string) => {
    const updatedBookings = bookings.map((booking) => {
      if (booking.id === bookingId) {
        return { ...booking, status: "Confirmed" }
      }
      return booking
    })
    setBookings(updatedBookings)
    setShowBookingDetails(false)

    toast({
      title: "Booking Accepted",
      description: "A confirmation message has been sent to the guest. They're excited to use your venue!",
    })
  }

  const handleDeclineBooking = (bookingId: string) => {
    const updatedBookings = bookings.map((booking) => {
      if (booking.id === bookingId) {
        return { ...booking, status: "Declined" }
      }
      return booking
    })
    setBookings(updatedBookings)
    setShowBookingDetails(false)
  }

  const handleSendVenueInfo = (inquiry: any) => {
    setSelectedInquiry(inquiry)
    setShowSendVenueDialog(true)
  }

  const handleConfirmSendVenue = () => {
    if (!selectedVenueToSend) return

    // In a real app, we would send this to the backend
    setShowSendVenueDialog(false)
    setShowSendConfirmation(true)

    // Hide confirmation after 3 seconds
    setTimeout(() => {
      setShowSendConfirmation(false)
    }, 3000)
  }

  // Load any real bookings from localStorage
  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem("bookings") || "[]")
    if (savedBookings.length > 0) {
      // Format the saved bookings to match our expected structure
      const formattedBookings = savedBookings.map((booking: any) => ({
        id: booking.id,
        venueName: booking.venueName,
        venueImage: "/placeholder.svg?height=100&width=100",
        eventType: "Event",
        date: new Date(booking.date).toLocaleDateString(),
        time: `${booking.startTime} - ${booking.endTime}`,
        guests: 50, // Default value
        status: booking.status,
        total: `${booking.total.toFixed(2)}`,
        guestName: "Guest User",
        guestEmail: "guest@example.com",
      }))

      setBookings([...formattedBookings, ...bookings])
    }
  }, [])

  useEffect(() => {
    applyFilters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventTypes, minPrice, maxPrice, minAttendees, maxAttendees, inquiries])

  return (
    <main className="bg-gray-900 text-white min-h-screen pb-16">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">Host Dashboard</h1>

          <div className="flex gap-4">
            <Link href="/messages">
              <Button variant="outline" className="bg-gray-800 border-gray-700 hover:bg-gray-700">
                <MessageCircle className="h-5 w-5 mr-2" />
                Messages
              </Button>
            </Link>
            <Link href="/calendar">
              <Button variant="outline" className="bg-gray-800 border-gray-700 hover:bg-gray-700">
                <Calendar className="h-5 w-5 mr-2" />
                Calendar
              </Button>
            </Link>
            <Link href="/pricing-earnings">
              <Button variant="outline" className="bg-gray-800 border-gray-700 hover:bg-gray-700">
                <DollarSign className="h-5 w-5 mr-2" />
                Earnings
              </Button>
            </Link>
          </div>
        </div>

        {showSendConfirmation && (
          <div className="fixed top-4 right-4 bg-green-500/20 text-green-400 px-4 py-2 rounded-md z-50 flex items-center gap-2">
            <Check className="h-5 w-5" />
            Venue information sent successfully!
          </div>
        )}

        <Tabs defaultValue="inquiries" onValueChange={setActiveTab}>
          <TabsList className="bg-gray-800 border-b border-gray-700 w-full justify-start mb-6">
            <TabsTrigger
              value="inquiries"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none"
            >
              Event Inquiries
            </TabsTrigger>
            <TabsTrigger
              value="bookings"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none"
            >
              Bookings
            </TabsTrigger>
            <TabsTrigger
              value="venues"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none"
            >
              My Venues
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inquiries">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Event Inquiries</h2>

              <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border-gray-700"
                  >
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
                    <DialogTitle className="text-xl">Filter Inquiries</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Adjust filters to narrow down your inquiry results.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div>
                      <h3 className="font-medium mb-2">Event Types</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {["Birthday", "Corporate", "Wedding", "Product Launch"].map((type) => (
                          <div
                            key={type}
                            className="flex items-center space-x-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Checkbox
                              id={`event-${type}`}
                              checked={eventTypes.includes(type)}
                              onCheckedChange={() => handleEventTypeChange(type)}
                              className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                            />
                            <Label
                              htmlFor={`event-${type}`}
                            >
                              {type}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Budget Range (per hour)</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="min-price" className="text-xs text-gray-400">
                            Min $
                          </Label>
                          <Input
                            id="min-price"
                            type="number"
                            placeholder="0"
                            className="bg-gray-700 border-gray-600"
                            value={minPrice}
                            onChange={(e) => handlePriceChange(e, 'min')}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div>
                          <Label htmlFor="max-price" className="text-xs text-gray-400">
                            Max $
                          </Label>
                          <Input
                            id="max-price"
                            type="number"
                            placeholder="1000"
                            className="bg-gray-700 border-gray-600"
                            value={maxPrice}
                            onChange={(e) => handlePriceChange(e, 'max')}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Attendees</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="min-attendees" className="text-xs text-gray-400">
                            Min Attendees
                          </Label>
                          <Input
                            id="min-attendees"
                            type="number"
                            placeholder="0"
                            className="bg-gray-700 border-gray-600"
                            value={minAttendees}
                            onChange={(e) => handleAttendeesChange(e, 'min')}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div>
                          <Label htmlFor="max-attendees" className="text-xs text-gray-400">
                            Max Attendees
                          </Label>
                          <Input
                            id="max-attendees"
                            type="number"
                            placeholder="1000"
                            className="bg-gray-700 border-gray-600"
                            value={maxAttendees}
                            onChange={(e) => handleAttendeesChange(e, 'max')}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between mt-4">
                      <Button
                        variant="outline"
                        className="bg-transparent hover:bg-gray-700"
                        onClick={() => {
                          setEventTypes([]);
                          setMinPrice("");
                          setMaxPrice("");
                          setMinAttendees("");
                          setMaxAttendees("");
                        }}
                      >
                        Clear All
                      </Button>
                      <Button
                        className="bg-orange-500 hover:bg-orange-600"
                        onClick={applyFilters}
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredInquiries.map((inquiry) => (
                <div key={inquiry.id} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg">{inquiry.eventType}</h3>
                    <span className="text-orange-400 font-medium">{inquiry.budget}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-300 mb-4">
                    <div>
                      <span className="text-gray-400">Location:</span> {inquiry.location}
                    </div>
                    <div>
                      <span className="text-gray-400">Date:</span> {inquiry.date}
                    </div>
                    <div>
                      <span className="text-gray-400">Attendees:</span> {inquiry.attendees}
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{inquiry.description}</p>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="bg-gray-700 hover:bg-gray-600 border-gray-600">
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-lg" onPointerDown={(e) => e.stopPropagation()}>
                        <DialogHeader>
                          <DialogTitle className="text-xl">{inquiry.eventType}</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            View and respond to this event inquiry.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-y-2">
                            <div>
                              <span className="text-gray-400">Location:</span> {inquiry.location}
                            </div>
                            <div>
                              <span className="text-gray-400">Date:</span> {inquiry.date}
                            </div>
                            <div>
                              <span className="text-gray-400">Attendees:</span> {inquiry.attendees}
                            </div>
                            <div>
                              <span className="text-gray-400">Budget:</span> {inquiry.budget}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-1">Description</h4>
                            <p className="text-gray-300">{inquiry.description}</p>
                          </div>

                          <div className="flex justify-end gap-2 mt-4">
                            <Link href={`/messages?newChat=${inquiry.id}`}>
                              <Button variant="outline" className="bg-gray-700 hover:bg-gray-600 border-gray-600">
                                Message Guest
                              </Button>
                            </Link>
                            <Button
                              className="bg-orange-500 hover:bg-orange-600"
                              onClick={() => handleSendVenueInfo(inquiry)}
                            >
                              Send Venue Info
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Link href="/messages">
                      <Button className="bg-orange-500 hover:bg-orange-600">Message</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {filteredInquiries.length === 0 && (
              <div className="bg-gray-800 rounded-xl p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">No Matching Inquiries</h3>
                <p className="text-gray-400 mb-6">There are no inquiries matching your current filters.</p>
                <Button
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={() => {
                    setEventTypes([])
                    setMinPrice("")
                    setMaxPrice("")
                    setMinAttendees("")
                    setMaxAttendees("")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="bookings">
            {bookings.length === 0 ? (
              <div className="bg-gray-800 rounded-xl p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">No Active Bookings</h3>
                <p className="text-gray-400 mb-6">You don't have any active bookings at the moment.</p>
                <Button className="bg-orange-500 hover:bg-orange-600">View Past Bookings</Button>
              </div>
            ) : (
              <div className="space-y-6">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-gray-800 rounded-xl p-6">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 relative rounded-md overflow-hidden">
                        <Image
                          src={booking.venueImage || "/placeholder.svg"}
                          alt={booking.venueName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{booking.venueName}</h3>
                            <p className="text-gray-400">{booking.eventType}</p>
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              booking.status === "Confirmed"
                                ? "bg-green-500/20 text-green-400"
                                : booking.status === "Declined"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {booking.status}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-300 mt-2">
                          <div>
                            <span className="text-gray-400">Date:</span> {booking.date}
                          </div>
                          <div>
                            <span className="text-gray-400">Time:</span> {booking.time}
                          </div>
                          <div>
                            <span className="text-gray-400">Guests:</span> {booking.guests}
                          </div>
                          <div>
                            <span className="text-gray-400">Total:</span> {booking.total}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 justify-end">
                      <Link href="/messages">
                        <Button variant="outline" className="bg-gray-700 hover:bg-gray-600 border-gray-600">
                          Message Guest
                        </Button>
                      </Link>
                      <Button
                        className="bg-orange-500 hover:bg-orange-600"
                        onClick={() => {
                          setSelectedBooking(booking)
                          setShowBookingDetails(true)
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Booking Details Dialog */}
            <Dialog open={showBookingDetails} onOpenChange={setShowBookingDetails}>
              <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-lg" onPointerDown={(e) => e.stopPropagation()}>
                {selectedBooking && (
                  <>
                    <DialogHeader>
                      <DialogTitle className="text-xl">Booking Details</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Review the details of this booking request.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                      <div className="flex gap-4 items-start">
                        <div className="w-20 h-20 relative rounded-md overflow-hidden">
                          <Image
                            src={selectedBooking.venueImage || "/placeholder.svg"}
                            alt={selectedBooking.venueName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">{selectedBooking.venueName}</h3>
                          <p className="text-sm text-gray-400">{selectedBooking.eventType}</p>
                          <div
                            className={`mt-1 px-2 py-0.5 rounded-full text-xs font-medium inline-block ${
                              selectedBooking.status === "Confirmed"
                                ? "bg-green-500/20 text-green-400"
                                : selectedBooking.status === "Declined"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {selectedBooking.status}
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-700 p-4 rounded-md">
                        <h4 className="font-medium mb-2">Guest Information</h4>
                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                          <div>
                            <span className="text-gray-400">Name:</span> {selectedBooking.guestName}
                          </div>
                          <div>
                            <span className="text-gray-400">Email:</span> {selectedBooking.guestEmail}
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-700 p-4 rounded-md">
                        <h4 className="font-medium mb-2">Booking Details</h4>
                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span>{selectedBooking.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>{selectedBooking.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-gray-400" />
                            <span>{selectedBooking.guests} guests</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-gray-400" />
                            <span>{selectedBooking.total}</span>
                          </div>
                        </div>
                      </div>

                      {selectedBooking.status === "Pending" && (
                        <div className="flex justify-end gap-2 mt-2">
                          <Button
                            variant="outline"
                            className="bg-gray-700 hover:bg-gray-600 border-gray-600"
                            onClick={() => handleDeclineBooking(selectedBooking.id)}
                          >
                            Decline
                          </Button>
                          <Button
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleAcceptBooking(selectedBooking.id)}
                          >
                            Accept Booking
                          </Button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="venues">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">My Venues</h2>
            </div>

            {venues.length === 0 ? (
              <div className="bg-gray-800 rounded-xl p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">No Venues Listed</h3>
                <p className="text-gray-400 mb-6">
                  You haven't listed any venues yet. Add your first venue to start receiving bookings.
                </p>
                <Link href="/sync-venue">
                  <Button className="bg-orange-500 hover:bg-orange-600">Add Your Venue</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {venues.map((venue) => (
                  <div key={venue.id} className="bg-gray-800 rounded-xl overflow-hidden">
                    <div className="aspect-video relative">
                      <Image src={venue.image || "/placeholder.svg"} alt={venue.name} fill className="object-cover" />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{venue.name}</h3>
                          <p className="text-gray-400">{venue.location}</p>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 text-orange-500" />
                          <span>{venue.rating}</span>
                          <span className="text-gray-400">({venue.reviews})</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded">{venue.type}</span>
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded">Up to {venue.capacity} people</span>
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded">${venue.pricePerHour}/hour</span>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          className="w-full bg-gray-700 hover:bg-gray-600 border-gray-600"
                          onClick={() => handleEditVenue(venue)}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Add the venue edit dialog */}
      <Dialog open={showVenueEditDialog} onOpenChange={setShowVenueEditDialog}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-lg" onPointerDown={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Venue</DialogTitle>
            <DialogDescription className="text-gray-400">
              Make changes to your venue information.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="venue-name">Venue Name</Label>
                <Input
                  id="venue-name"
                  value={editedVenueName}
                  onChange={(e) => setEditedVenueName(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="venue-location">Location</Label>
                <Input
                  id="venue-location"
                  value={editedVenueLocation}
                  onChange={(e) => setEditedVenueLocation(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="venue-type">Venue Type</Label>
                <Select value={editedVenueType} onValueChange={setEditedVenueType}>
                  <SelectTrigger id="venue-type" className="bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="Loft">Loft</SelectItem>
                    <SelectItem value="Studio">Studio</SelectItem>
                    <SelectItem value="Club">Club</SelectItem>
                    <SelectItem value="Warehouse">Warehouse</SelectItem>
                    <SelectItem value="Banquet Hall">Banquet Hall</SelectItem>
                    <SelectItem value="Cafe">Cafe</SelectItem>
                    <SelectItem value="Restaurant">Restaurant</SelectItem>
                    <SelectItem value="Bar">Bar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="venue-capacity">Capacity</Label>
                <Input
                  id="venue-capacity"
                  type="number"
                  value={editedVenueCapacity}
                  onChange={(e) => setEditedVenueCapacity(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="venue-price">Price per Hour ($)</Label>
                <Input
                  id="venue-price"
                  type="number"
                  value={editedVenuePrice}
                  onChange={(e) => setEditedVenuePrice(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 gap-2">
                {["WiFi", "Parking", "Sound System", "Lighting", "Bar", "Kitchen", "Restrooms", "Stage"].map(
                  (amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={`amenity-${amenity}`}
                        checked={editedVenueAmenities.includes(amenity)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setEditedVenueAmenities([...editedVenueAmenities, amenity])
                          } else {
                            setEditedVenueAmenities(editedVenueAmenities.filter((a) => a !== amenity))
                          }
                        }}
                        className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                      />
                      <Label htmlFor={`amenity-${amenity}`}>{amenity}</Label>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <Button
                variant="outline"
                className="bg-gray-700 hover:bg-gray-600 border-gray-600"
                onClick={() => setShowVenueEditDialog(false)}
              >
                Cancel
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleSaveVenueEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Venue Info Dialog */}
      <Dialog open={showSendVenueDialog} onOpenChange={setShowSendVenueDialog}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-md" onPointerDown={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle className="text-xl">Send Venue Information</DialogTitle>
            <DialogDescription className="text-gray-400">
              Select a venue to share with the guest.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <p>Select which venue information to send to the guest:</p>

            <Select value={selectedVenueToSend} onValueChange={setSelectedVenueToSend}>
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue placeholder="Select a venue" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {venues.map((venue) => (
                  <SelectItem key={venue.id} value={venue.id}>
                    {venue.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex justify-end gap-2 mt-2">
              <DialogClose asChild>
                <Button variant="outline" className="bg-gray-700 hover:bg-gray-600 border-gray-600">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                className="bg-orange-500 hover:bg-orange-600"
                onClick={handleConfirmSendVenue}
                disabled={!selectedVenueToSend}
              >
                Send Information
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}
