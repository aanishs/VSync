"use client"

import { DialogHeader } from "@/components/ui/dialog"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MessageCircle, Star, Wifi, Music, Car, Coffee, X, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { TimePickerDemo } from "@/components/time-picker"
import AuthModal from "@/components/auth-modal"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import VenuePhotoGallery from "@/components/venue-photo-gallery"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Mock venue data with more realistic information
const venueData = {
  "venue-1": {
    id: "venue-1",
    name: "Skyline Lounge",
    location: "Downtown Los Angeles",
    type: "Club",
    capacity: 250,
    squareFeet: 3500,
    minHours: 4,
    pricePerHour: 350,
    rating: 4.8,
    reviews: 42,
    description:
      "A modern rooftop venue with panoramic views of downtown LA, perfect for parties and corporate events. Features state-of-the-art sound system and lighting.",
    hostRules: [
      "No smoking indoors",
      "Music must end by 2AM",
      "No decorations on walls",
      "Cleaning fee applies",
      "Security deposit required",
    ],
    amenities: [
      { name: "WiFi", icon: Wifi },
      { name: "Sound System", icon: Music },
      { name: "Parking", icon: Car },
      { name: "Bar Service", icon: Coffee },
    ],
    images: [
      `/skyline1.png?height=500&width=800`,
      `/skyline2.png?height=500&width=800`,
      `/skyline3.png?height=500&width=800`,
    ],
    hostId: "host-1",
    hostName: "Michael Johnson",
  },
  "venue-2": {
    id: "venue-2",
    name: "Warehouse 213",
    location: "Arts District, Los Angeles",
    type: "Warehouse",
    capacity: 500,
    squareFeet: 6000,
    minHours: 6,
    pricePerHour: 450,
    rating: 4.6,
    reviews: 38,
    description:
      "An industrial warehouse space with exposed brick walls and high ceilings. Perfect for large events, art exhibitions, and photo shoots.",
    hostRules: [
      "No open flames",
      "Load-in/out times must be scheduled",
      "No drilling into walls",
      "Cleaning fee applies",
    ],
    amenities: [
      { name: "WiFi", icon: Wifi },
      { name: "Sound System", icon: Music },
      { name: "Parking", icon: Car },
    ],
    images: [
      `/warehouse1.png?height=500&width=800`,
      `/warehouse2.png?height=500&width=800`,
      `/warehouse3.png?height=500&width=800`,
    ],
    hostId: "host-2",
    hostName: "Sarah Williams",
  },
  "venue-3": {
    id: "venue-3",
    name: "Grand Ballroom",
    location: "Beverly Hills",
    type: "Banquet Hall",
    capacity: 300,
    squareFeet: 4500,
    minHours: 5,
    pricePerHour: 550,
    rating: 4.9,
    reviews: 56,
    description:
      "An elegant ballroom with crystal chandeliers and marble floors. Ideal for weddings, galas, and upscale corporate events.",
    hostRules: [
      "No confetti",
      "No tape on walls",
      "Outside catering allowed with approval",
      "Security deposit required",
    ],
    amenities: [
      { name: "WiFi", icon: Wifi },
      { name: "Sound System", icon: Music },
      { name: "Parking", icon: Car },
      { name: "Kitchen", icon: Coffee },
    ],
    images: [
      `/ballroom1.png?height=500&width=800`,
      `/ballroom2.png?height=500&width=800`,
      `/ballroom3.png?height=500&width=800`,
    ],
    hostId: "host-3",
    hostName: "David Chen",
  },
}

export default function VenuePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [date, setDate] = useState<Date>()
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [showAllPhotos, setShowAllPhotos] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [showMessageDialog, setShowMessageDialog] = useState(false)
  const [messageText, setMessageText] = useState("")
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false)
  const [bookingReference, setBookingReference] = useState("")
  const [showFullScreenGallery, setShowFullScreenGallery] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)

  // Payment form state
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [billingZip, setBillingZip] = useState("")

  // Check if user is logged in on component mount
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (loggedIn) {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = () => {
    setIsLoggedIn(true)
    setIsAuthModalOpen(false)
    localStorage.setItem("isLoggedIn", "true")
  }

  // Get venue data based on ID
  const venue = venueData[params.id as keyof typeof venueData] || venueData["venue-1"]

  const calculateTotal = () => {
    if (!date || !startTime || !endTime) return null

    // Calculate hours between start and end time
    const [startHour, startMinute] = startTime.split(":").map(Number)
    const [endHour, endMinute] = endTime.split(":").map(Number)

    let hours = endHour - startHour
    if (endMinute > startMinute) hours += 0.5
    if (endMinute < startMinute) hours -= 0.5

    // Ensure minimum hours
    hours = Math.max(hours, venue.minHours)

    const subtotal = venue.pricePerHour * hours
    const tax = subtotal * 0.08
    const total = subtotal + tax

    return { subtotal, tax, total, hours }
  }

  const totals = calculateTotal()

  const handleSendMessage = () => {
    if (!messageText.trim()) return

    // In a real app, we would send this message to the backend
    // For now, let's save to localStorage to simulate persistence
    const existingMessages = JSON.parse(localStorage.getItem("messages") || "[]")
    const newMessage = {
      id: `msg-${Date.now()}`,
      conversationId: `conv-${venue.hostId}`,
      with: venue.name,
      withId: venue.hostId,
      withName: venue.hostName,
      sender: "user",
      text: messageText,
      timestamp: new Date().toISOString(),
    }

    localStorage.setItem("messages", JSON.stringify([...existingMessages, newMessage]))

    toast({
      title: "Message Sent",
      description: "Your message has been sent to the host.",
    })

    setMessageText("")
    setShowMessageDialog(false)
  }

  const handleRequestToBook = () => {
    if (!date || !startTime || !endTime) return

    if (!isLoggedIn) {
      setIsAuthModalOpen(true)
      return
    }

    // Show payment dialog
    setShowPaymentDialog(true)
  }

  const handlePaymentSubmit = () => {
    // Validate payment form
    if (!cardNumber || !cardName || !expiryDate || !cvv || !billingZip) {
      toast({
        title: "Payment Information Required",
        description: "Please fill in all payment fields to complete your booking.",
        variant: "destructive",
      })
      return
    }

    // Generate a random booking reference
    const reference = `VSYNC-${Math.floor(100000 + Math.random() * 900000)}`
    setBookingReference(reference)

    // In a real app, we would send this booking request to the backend
    // For now, let's save to localStorage to simulate persistence
    const existingBookings = JSON.parse(localStorage.getItem("bookings") || "[]")
    const newBooking = {
      id: `book-${Date.now()}`,
      reference,
      venueId: venue.id,
      venueName: venue.name,
      hostId: venue.hostId,
      hostName: venue.hostName,
      date: date ? date.toISOString() : new Date().toISOString(),
      startTime,
      endTime,
      hours: totals?.hours,
      subtotal: totals?.subtotal,
      tax: totals?.tax,
      total: totals?.total,
      status: "Pending",
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem("bookings", JSON.stringify([...existingBookings, newBooking]))

    // Close payment dialog and show confirmation
    setShowPaymentDialog(false)
    setShowBookingConfirmation(true)
  }

  return (
    <main className="bg-gray-900 text-white min-h-screen pb-16">
      <div className="container mx-auto px-4 py-6">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to search
        </Link>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <Image
                src={venue.images[0] || "/placeholder.svg"}
                alt={venue.name}
                fill
                className="object-cover cursor-pointer"
                onClick={() => setShowFullScreenGallery(true)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {venue.images.slice(1, 5).map((image, i) => (
                <div key={i} className="aspect-square relative rounded-lg overflow-hidden">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${venue.name} ${i + 2}`}
                    fill
                    className="object-cover cursor-pointer"
                    onClick={() => {
                      setCurrentPhotoIndex(i + 1)
                      setShowFullScreenGallery(true)
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="absolute bottom-4 right-4 bg-black/70 hover:bg-black/90"
                onClick={() => setShowFullScreenGallery(true)}
              >
                Show all photos
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogClose asChild>
                <Button className="absolute top-2 left-2 bg-black/70 hover:bg-black/90 h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
              <div className="grid gap-4 pt-6">
                {venue.images.map((image, i) => (
                  <div key={i} className="relative h-[60vh]">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${venue.name} ${i + 1}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold">{venue.name}</h1>
                <p className="text-gray-400">{venue.location}</p>
              </div>
              <div className="flex items-center gap-1 bg-orange-500 px-3 py-1 rounded-full text-sm font-medium">
                <Star className="h-4 w-4" />
                {venue.rating} ({venue.reviews} reviews)
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-300">
              <div className="bg-gray-800 px-3 py-1 rounded-full">Capacity: {venue.capacity} people</div>
              <div className="bg-gray-800 px-3 py-1 rounded-full">{venue.squareFeet} sq ft</div>
              <div className="bg-gray-800 px-3 py-1 rounded-full">Min. {venue.minHours} hours</div>
              <div className="bg-gray-800 px-3 py-1 rounded-full">{venue.type}</div>
            </div>

            <div className="mt-6">
              <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border-gray-700"
                    onClick={() => !isLoggedIn && setIsAuthModalOpen(true)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Message Host
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-md">
                  {isLoggedIn ? (
                    <div className="grid gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                          {venue.hostName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-medium">{venue.hostName}</h3>
                          <p className="text-sm text-gray-400">Host of {venue.name}</p>
                        </div>
                      </div>

                      <textarea
                        className="w-full h-32 p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
                        placeholder="Type your message here..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                      ></textarea>

                      <div className="flex justify-end gap-2">
                        <DialogClose asChild>
                          <Button variant="outline" className="bg-gray-700 hover:bg-gray-600 border-gray-600">
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button
                          className="bg-orange-500 hover:bg-orange-600"
                          onClick={handleSendMessage}
                          disabled={!messageText.trim()}
                        >
                          Send Message
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="mb-4">Please log in to message the host</p>
                      <Button
                        className="bg-orange-500 hover:bg-orange-600"
                        onClick={() => {
                          setShowMessageDialog(false)
                          setIsAuthModalOpen(true)
                        }}
                      >
                        Log In
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            <div className="mt-8">
              <Tabs defaultValue="about">
                <TabsList className="bg-gray-800 border-b border-gray-700 w-full justify-start">
                  <TabsTrigger
                    value="about"
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none"
                  >
                    About
                  </TabsTrigger>
                  <TabsTrigger
                    value="rules"
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none"
                  >
                    Host Rules
                  </TabsTrigger>
                  <TabsTrigger
                    value="amenities"
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none"
                  >
                    Amenities
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="pt-4">
                  <p className="text-gray-300">{venue.description}</p>
                </TabsContent>

                <TabsContent value="rules" className="pt-4">
                  <ul className="space-y-2 text-gray-300">
                    {venue.hostRules.map((rule, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-orange-500">•</span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="amenities" className="pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {venue.amenities.map((amenity, i) => {
                      const Icon = amenity.icon
                      return (
                        <div key={i} className="flex items-center gap-2 text-gray-300">
                          <Icon className="h-5 w-5 text-orange-500" />
                          {amenity.name}
                        </div>
                      )
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 h-fit sticky top-6">
            <h2 className="text-2xl font-bold mb-2">${venue.pricePerHour}/hour</h2>
            <p className="text-gray-400 text-sm mb-4">Minimum {venue.minHours} hours</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <Tabs defaultValue="calendar" className="w-full">
                  <TabsList className="w-full bg-gray-700">
                    <TabsTrigger value="calendar" className="flex-1 data-[state=active]:bg-orange-500">
                      Calendar
                    </TabsTrigger>
                    <TabsTrigger value="flexible" className="flex-1 data-[state=active]:bg-orange-500">
                      Flexible
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="calendar" className="pt-2">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="bg-gray-800 text-white rounded-md border border-gray-700"
                    />
                  </TabsContent>
                  <TabsContent value="flexible" className="pt-2">
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white">
                      <option value="">Select date range</option>
                      <option value="weekend">This Weekend</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Time</label>
                  <TimePickerDemo value={startTime} onChange={setStartTime} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Time</label>
                  <TimePickerDemo value={endTime} onChange={setEndTime} />
                </div>
              </div>

              {totals && (
                <div className="border-t border-gray-700 pt-4 mt-4">
                  <div className="flex justify-between mb-2">
                    <span>
                      ${venue.pricePerHour} × {totals.hours} hours
                    </span>
                    <span>${totals.subtotal}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Taxes</span>
                    <span>${totals.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-700 mt-2">
                    <span>Total</span>
                    <span>${totals.total.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <Button
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={!date || !startTime || !endTime}
                onClick={handleRequestToBook}
              >
                Reserve Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-md">
          <DialogHeader>
            <h2 className="text-xl font-bold">Payment Information</h2>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="card-number">Card Number</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  className="pl-10 bg-gray-700 border-gray-600"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="card-name">Name on Card</Label>
              <Input
                id="card-name"
                placeholder="John Smith"
                className="bg-gray-700 border-gray-600"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  className="bg-gray-700 border-gray-600"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  className="bg-gray-700 border-gray-600"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="billing-zip">Billing Zip Code</Label>
              <Input
                id="billing-zip"
                placeholder="90210"
                className="bg-gray-700 border-gray-600"
                value={billingZip}
                onChange={(e) => setBillingZip(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                className="bg-gray-700 hover:bg-gray-600 border-gray-600"
                onClick={() => setShowPaymentDialog(false)}
              >
                Cancel
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600" onClick={handlePaymentSubmit}>
                Complete Booking
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking Confirmation Dialog */}
      <Dialog open={showBookingConfirmation} onOpenChange={setShowBookingConfirmation}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-md">
          <div className="grid gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Booking Confirmed!</h2>
              <p className="text-gray-400 mb-4">Your booking request has been sent to the host.</p>
              <div className="bg-gray-700 p-4 rounded-md mb-4 text-left">
                <p className="text-sm text-gray-300 mb-1">Booking Reference:</p>
                <p className="font-medium">{bookingReference}</p>
              </div>
              <p className="text-sm text-gray-300 mb-6">
                The host will review your request and confirm within 24 hours. You can check the status in your
                messages.
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  className="bg-gray-700 hover:bg-gray-600 border-gray-600"
                  onClick={() => {
                    setShowBookingConfirmation(false)
                    router.push("/messages")
                  }}
                >
                  Go to Messages
                </Button>
                <Button
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={() => {
                    setShowBookingConfirmation(false)
                    router.push("/")
                  }}
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode="login"
        onLogin={handleLogin}
      />
      <VenuePhotoGallery
        images={venue.images}
        venueName={venue.name}
        isOpen={showFullScreenGallery}
        onClose={() => setShowFullScreenGallery(false)}
      />
    </main>
  )
}
