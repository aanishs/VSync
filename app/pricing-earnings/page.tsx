"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, DollarSign, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock venue data
const mockVenues = [
  {
    id: "venue-1",
    name: "Downtown Loft",
    location: "Downtown Los Angeles",
    pricePerHour: 200,
    minHours: 4,
    instantBook: true,
    weekendPricing: 250,
    cleaningFee: 100,
    securityDeposit: 500,
  },
  {
    id: "venue-2",
    name: "Beachside Studio",
    location: "Santa Monica",
    pricePerHour: 150,
    minHours: 3,
    instantBook: false,
    weekendPricing: 200,
    cleaningFee: 75,
    securityDeposit: 300,
  },
]

// Mock earnings data
const mockEarnings = [
  { month: "January", amount: 2500 },
  { month: "February", amount: 3200 },
  { month: "March", amount: 4100 },
  { month: "April", amount: 3800 },
  { month: "May", amount: 0 },
  { month: "June", amount: 0 },
]

export default function PricingEarningsPage() {
  const [venues, setVenues] = useState(mockVenues)
  const [selectedVenue, setSelectedVenue] = useState(mockVenues[0])
  const [pricePerHour, setPricePerHour] = useState(selectedVenue.pricePerHour.toString())
  const [minHours, setMinHours] = useState(selectedVenue.minHours.toString())
  const [instantBook, setInstantBook] = useState(selectedVenue.instantBook)
  const [weekendPricing, setWeekendPricing] = useState(selectedVenue.weekendPricing.toString())
  const [cleaningFee, setCleaningFee] = useState(selectedVenue.cleaningFee.toString())
  const [securityDeposit, setSecurityDeposit] = useState(selectedVenue.securityDeposit.toString())
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false)

  const handleSaveChanges = () => {
    // Update the selected venue with new values
    const updatedVenues = venues.map((venue) => {
      if (venue.id === selectedVenue.id) {
        return {
          ...venue,
          pricePerHour: Number.parseInt(pricePerHour),
          minHours: Number.parseInt(minHours),
          instantBook,
          weekendPricing: Number.parseInt(weekendPricing),
          cleaningFee: Number.parseInt(cleaningFee),
          securityDeposit: Number.parseInt(securityDeposit),
        }
      }
      return venue
    })

    setVenues(updatedVenues)
    setSelectedVenue(updatedVenues.find((v) => v.id === selectedVenue.id)!)
    setShowSaveConfirmation(true)

    // Hide the confirmation after 3 seconds
    setTimeout(() => {
      setShowSaveConfirmation(false)
    }, 3000)

    toast({
      title: "Changes Saved",
      description: "Your pricing changes have been saved successfully.",
    })
  }

  // Calculate total earnings
  const totalEarnings = mockEarnings.reduce((sum, month) => sum + month.amount, 0)

  // Update the handleSaveMethod function to actually save the payment method
  const handleSaveMethod = () => {
    // In a real app, we would send this to the backend
    toast({
      title: "Payout Method Updated",
      description: "Your payout method has been updated successfully.",
    })

    // Close the dialog after saving
    const dialogElement = document.querySelector('[role="dialog"]') as HTMLElement
    if (dialogElement) {
      const closeButton = dialogElement.querySelector('[data-state="open"]') as HTMLElement
      if (closeButton) {
        closeButton.click()
      }
    }
  }

  return (
    <main className="bg-gray-900 text-white min-h-screen pb-16">
      <div className="container mx-auto px-4 py-6">
        <Link href="/host" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-8 gradient-text">Pricing & Earnings</h1>

        <Tabs defaultValue="pricing">
          <TabsList className="bg-gray-800 border-b border-gray-700 w-full justify-start mb-6">
            <TabsTrigger
              value="pricing"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none"
            >
              Pricing Settings
            </TabsTrigger>
            <TabsTrigger
              value="earnings"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none"
            >
              Earnings
            </TabsTrigger>
            <TabsTrigger
              value="payouts"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none"
            >
              Payouts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pricing">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="bg-gray-800 rounded-xl p-6">
                  <h2 className="text-lg font-semibold mb-4">Your Venues</h2>
                  <div className="space-y-2">
                    {venues.map((venue) => (
                      <div
                        key={venue.id}
                        className={`p-3 rounded-lg cursor-pointer ${
                          selectedVenue.id === venue.id ? "bg-gray-700" : "hover:bg-gray-750"
                        }`}
                        onClick={() => {
                          setSelectedVenue(venue)
                          setPricePerHour(venue.pricePerHour.toString())
                          setMinHours(venue.minHours.toString())
                          setInstantBook(venue.instantBook)
                          setWeekendPricing(venue.weekendPricing.toString())
                          setCleaningFee(venue.cleaningFee.toString())
                          setSecurityDeposit(venue.securityDeposit.toString())
                        }}
                      >
                        <h3 className="font-medium">{venue.name}</h3>
                        <p className="text-sm text-gray-400">{venue.location}</p>
                        <p className="text-sm text-orange-400 mt-1">${venue.pricePerHour}/hour</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="bg-gray-800 rounded-xl p-6 relative">
                  <h2 className="text-lg font-semibold mb-4">Pricing Settings for {selectedVenue.name}</h2>

                  {showSaveConfirmation && (
                    <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 px-4 py-2 rounded-md">
                      Changes saved successfully!
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="price-per-hour">Base Price (per hour)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="price-per-hour"
                          type="number"
                          className="pl-9 bg-gray-700 border-gray-600"
                          value={pricePerHour}
                          onChange={(e) => setPricePerHour(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="min-hours">Minimum Hours</Label>
                      <Input
                        id="min-hours"
                        type="number"
                        className="bg-gray-700 border-gray-600"
                        value={minHours}
                        onChange={(e) => setMinHours(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weekend-pricing">Weekend Pricing (per hour)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="weekend-pricing"
                          type="number"
                          className="pl-9 bg-gray-700 border-gray-600"
                          value={weekendPricing}
                          onChange={(e) => setWeekendPricing(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cleaning-fee">Cleaning Fee</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="cleaning-fee"
                          type="number"
                          className="pl-9 bg-gray-700 border-gray-600"
                          value={cleaningFee}
                          onChange={(e) => setCleaningFee(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="security-deposit">Security Deposit</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="security-deposit"
                          type="number"
                          className="pl-9 bg-gray-700 border-gray-600"
                          value={securityDeposit}
                          onChange={(e) => setSecurityDeposit(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="instant-book"
                        checked={instantBook}
                        onCheckedChange={() => setInstantBook(!instantBook)}
                        className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                      />
                      <Label htmlFor="instant-book">Enable Instant Book</Label>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleSaveChanges}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="earnings">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="bg-gray-800 rounded-xl p-6">
                  <h2 className="text-lg font-semibold mb-4">Earnings Summary</h2>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400">Total Earnings (YTD)</p>
                      <p className="text-3xl font-bold text-orange-400">${totalEarnings.toLocaleString()}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400">Bookings Completed</p>
                      <p className="text-xl font-semibold">12</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400">Average Per Booking</p>
                      <p className="text-xl font-semibold">${Math.round(totalEarnings / 12).toLocaleString()}</p>
                    </div>

                    <div className="pt-4 border-t border-gray-700">
                      <p className="text-sm text-gray-400">Next Payout</p>
                      <p className="text-xl font-semibold">$850</p>
                      <p className="text-xs text-gray-400">Scheduled for May 15, 2025</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="bg-gray-800 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Monthly Earnings</h2>
                    <select className="bg-gray-700 border border-gray-600 rounded-md p-1 text-sm">
                      <option>2025</option>
                      <option>2024</option>
                    </select>
                  </div>

                  <div className="h-64 flex items-end gap-2">
                    {mockEarnings.map((month) => (
                      <div
                        key={month.month}
                        className="flex-1 flex flex-col items-center"
                        onClick={() => setSelectedMonth(month.month)}
                      >
                        <div
                          className={`w-full ${selectedMonth === month.month ? "bg-orange-500" : "bg-orange-500/70 hover:bg-orange-500"} rounded-t-sm transition-all cursor-pointer`}
                          style={{
                            height: `${(month.amount / Math.max(...mockEarnings.map((m) => m.amount))) * 180}px`,
                            minHeight: month.amount > 0 ? "20px" : "0",
                          }}
                        ></div>
                        <p className="text-xs mt-2">{month.month.substring(0, 3)}</p>
                        <p className="text-xs text-gray-400">${month.amount.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <h3 className="font-medium mb-4">
                      {selectedMonth ? `${selectedMonth} Earnings by Venue` : "Recent Earnings"}
                    </h3>
                    <div className="space-y-2">
                      {selectedMonth === "April" && (
                        <>
                          <div className="flex justify-between p-3 bg-gray-750 rounded-lg">
                            <div>
                              <p className="font-medium">Downtown Loft</p>
                              <p className="text-sm text-gray-400">Corporate Event - April 10</p>
                            </div>
                            <p className="font-medium text-orange-400">$1,200</p>
                          </div>
                          <div className="flex justify-between p-3 bg-gray-750 rounded-lg">
                            <div>
                              <p className="font-medium">Beachside Studio</p>
                              <p className="text-sm text-gray-400">Photo Shoot - April 15</p>
                            </div>
                            <p className="font-medium text-orange-400">$900</p>
                          </div>
                          <div className="flex justify-between p-3 bg-gray-750 rounded-lg">
                            <div>
                              <p className="font-medium">Downtown Loft</p>
                              <p className="text-sm text-gray-400">Birthday Party - April 22</p>
                            </div>
                            <p className="font-medium text-orange-400">$1,600</p>
                          </div>
                        </>
                      )}
                      {selectedMonth === "March" && (
                        <>
                          <div className="flex justify-between p-3 bg-gray-750 rounded-lg">
                            <div>
                              <p className="font-medium">Downtown Loft</p>
                              <p className="text-sm text-gray-400">Wedding Reception - March 5</p>
                            </div>
                            <p className="font-medium text-orange-400">$2,400</p>
                          </div>
                          <div className="flex justify-between p-3 bg-gray-750 rounded-lg">
                            <div>
                              <p className="font-medium">Beachside Studio</p>
                              <p className="text-sm text-gray-400">Corporate Retreat - March 18</p>
                            </div>
                            <p className="font-medium text-orange-400">$1,700</p>
                          </div>
                        </>
                      )}
                      {!selectedMonth && (
                        <>
                          <div className="flex justify-between p-3 bg-gray-750 rounded-lg">
                            <div>
                              <p className="font-medium">Downtown Loft</p>
                              <p className="text-sm text-gray-400">Corporate Event - April 10</p>
                            </div>
                            <p className="font-medium text-orange-400">$1,200</p>
                          </div>
                          <div className="flex justify-between p-3 bg-gray-750 rounded-lg">
                            <div>
                              <p className="font-medium">Beachside Studio</p>
                              <p className="text-sm text-gray-400">Photo Shoot - April 15</p>
                            </div>
                            <p className="font-medium text-orange-400">$900</p>
                          </div>
                          <div className="flex justify-between p-3 bg-gray-750 rounded-lg">
                            <div>
                              <p className="font-medium">Downtown Loft</p>
                              <p className="text-sm text-gray-400">Birthday Party - April 22</p>
                            </div>
                            <p className="font-medium text-orange-400">$1,600</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payouts">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="bg-gray-800 rounded-xl p-6">
                  <h2 className="text-lg font-semibold mb-4">Payout Methods</h2>

                  <div className="space-y-4">
                    <div className="p-3 bg-gray-750 rounded-lg border border-gray-700">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center">
                            <DollarSign className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">Bank Account</p>
                            <p className="text-xs text-gray-400">****6789</p>
                          </div>
                        </div>
                        <div className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Default</div>
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full bg-gray-700 hover:bg-gray-600 border-gray-600">
                          <Settings className="h-4 w-4 mr-2" />
                          Manage Payout Methods
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-xl">Manage Payout Methods</DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                          <div className="p-3 bg-gray-750 rounded-lg border border-gray-700">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center">
                                  <DollarSign className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className="font-medium">Bank Account</p>
                                  <p className="text-xs text-gray-400">****6789</p>
                                </div>
                              </div>
                              <div className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                                Default
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor="account-type">Account Type</Label>
                            <Select defaultValue="bank">
                              <SelectTrigger id="account-type" className="bg-gray-700 border-gray-600">
                                <SelectValue placeholder="Select account type" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-700">
                                <SelectItem value="bank">Bank Account</SelectItem>
                                <SelectItem value="paypal">PayPal</SelectItem>
                                <SelectItem value="venmo">Venmo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor="account-number">Account Number</Label>
                            <Input
                              id="account-number"
                              placeholder="Enter account number"
                              className="bg-gray-700 border-gray-600"
                            />
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor="routing-number">Routing Number</Label>
                            <Input
                              id="routing-number"
                              placeholder="Enter routing number"
                              className="bg-gray-700 border-gray-600"
                            />
                          </div>

                          <div className="flex justify-end gap-2 mt-2">
                            <DialogClose asChild>
                              <Button variant="outline" className="bg-gray-700 hover:bg-gray-600 border-gray-600">
                                Cancel
                              </Button>
                            </DialogClose>
                            <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleSaveMethod}>
                              Save Method
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="bg-gray-800 rounded-xl p-6">
                  <h2 className="text-lg font-semibold mb-6">Recent Payout History</h2>

                  <div className="space-y-4">
                    <div className="flex justify-between p-4 bg-gray-750 rounded-lg">
                      <div>
                        <p className="font-medium">April 2025 Payout</p>
                        <p className="text-sm text-gray-400">Processed on April 15, 2025</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-orange-400">$2,300</p>
                        <p className="text-xs text-green-400">Completed</p>
                      </div>
                    </div>

                    <div className="flex justify-between p-4 bg-gray-750 rounded-lg">
                      <div>
                        <p className="font-medium">March 2025 Payout</p>
                        <p className="text-sm text-gray-400">Processed on March 15, 2025</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-orange-400">$1,800</p>
                        <p className="text-xs text-green-400">Completed</p>
                      </div>
                    </div>

                    <div className="flex justify-between p-4 bg-gray-750 rounded-lg">
                      <div>
                        <p className="font-medium">February 2025 Payout</p>
                        <p className="text-sm text-gray-400">Processed on February 15, 2025</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-orange-400">$2,100</p>
                        <p className="text-xs text-green-400">Completed</p>
                      </div>
                    </div>

                    <div className="flex justify-between p-4 bg-gray-750 rounded-lg">
                      <div>
                        <p className="font-medium">January 2025 Payout</p>
                        <p className="text-sm text-gray-400">Processed on January 15, 2025</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-orange-400">$1,500</p>
                        <p className="text-xs text-green-400">Completed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
