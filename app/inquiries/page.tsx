"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Edit, Trash2, Calendar, MapPin, Users, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

interface Inquiry {
  id: string
  eventType: string
  location: string
  date?: string
  time?: string
  budget: string
  attendees: string
  venueTypes: string[]
  description: string
  createdAt: string
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)

  useEffect(() => {
    // Load inquiries from localStorage
    const savedInquiries = JSON.parse(localStorage.getItem("inquiries") || "[]")
    setInquiries(savedInquiries)
  }, [])

  const handleDeleteInquiry = (id: string) => {
    const updatedInquiries = inquiries.filter((inquiry) => inquiry.id !== id)
    setInquiries(updatedInquiries)
    localStorage.setItem("inquiries", JSON.stringify(updatedInquiries))
    toast({
      title: "Inquiry Deleted",
      description: "Your inquiry has been deleted successfully.",
    })
  }

  return (
    <main className="bg-gray-900 text-white min-h-screen pb-16">
      <div className="container mx-auto px-4 py-6">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold gradient-text">My Inquiries</h1>
            <Link href="/sync-event">
              <Button className="bg-orange-500 hover:bg-orange-600">New Inquiry</Button>
            </Link>
          </div>

          {inquiries.length === 0 ? (
            <div className="bg-gray-800 rounded-xl p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">No Inquiries Yet</h3>
              <p className="text-gray-400 mb-6">You haven't submitted any event inquiries yet.</p>
              <Link href="/sync-event">
                <Button className="bg-orange-500 hover:bg-orange-600">Create Your First Inquiry</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {inquiries.map((inquiry) => (
                <div key={inquiry.id} className="bg-gray-800 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg">{inquiry.eventType}</h3>
                    <div className="flex gap-2">
                      <Link href={`/sync-event?edit=${inquiry.id}`}>
                        <Button variant="outline" size="sm" className="bg-gray-700 hover:bg-gray-600 border-gray-600">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gray-700 hover:bg-gray-600 border-gray-600"
                        onClick={() => handleDeleteInquiry(inquiry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 text-sm text-gray-300 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {inquiry.location}
                    </div>
                    {inquiry.date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {inquiry.date}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      {inquiry.attendees} attendees
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      {inquiry.budget}
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{inquiry.description}</p>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="bg-gray-700 hover:bg-gray-600 border-gray-600"
                        onClick={() => setSelectedInquiry(inquiry)}
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-lg">
                      {selectedInquiry && (
                        <>
                          <DialogHeader>
                            <DialogTitle className="text-xl">{selectedInquiry.eventType}</DialogTitle>
                          </DialogHeader>

                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-y-2">
                              <div>
                                <span className="text-gray-400">Location:</span> {selectedInquiry.location}
                              </div>
                              {selectedInquiry.date && (
                                <div>
                                  <span className="text-gray-400">Date:</span> {selectedInquiry.date}
                                </div>
                              )}
                              {selectedInquiry.time && (
                                <div>
                                  <span className="text-gray-400">Time:</span> {selectedInquiry.time}
                                </div>
                              )}
                              <div>
                                <span className="text-gray-400">Attendees:</span> {selectedInquiry.attendees}
                              </div>
                              <div>
                                <span className="text-gray-400">Budget:</span> {selectedInquiry.budget}
                              </div>
                              <div className="col-span-2">
                                <span className="text-gray-400">Venue Types:</span>{" "}
                                {selectedInquiry.venueTypes.join(", ")}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-1">Description</h4>
                              <p className="text-gray-300">{selectedInquiry.description}</p>
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                              <DialogClose asChild>
                                <Button variant="outline" className="bg-gray-700 hover:bg-gray-600 border-gray-600">
                                  Close
                                </Button>
                              </DialogClose>
                              <Link href={`/sync-event?edit=${selectedInquiry.id}`}>
                                <Button className="bg-orange-500 hover:bg-orange-600">Edit Inquiry</Button>
                              </Link>
                            </div>
                          </div>
                        </>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
