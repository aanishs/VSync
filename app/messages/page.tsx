"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Mock conversation data
const mockConversations = [
  {
    id: "conv-1",
    with: "Skyline Lounge",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Yes, we can accommodate your request for additional lighting.",
    timestamp: "2 hours ago",
    unread: true,
    messages: [
      {
        id: "msg-1",
        sender: "host",
        text: "Hello! Thank you for your interest in Skyline Lounge. How can I help you?",
        timestamp: "Yesterday, 2:30 PM",
      },
      {
        id: "msg-2",
        sender: "user",
        text: "Hi! I'm interested in booking your venue for a corporate event next month. Do you have availability on the 15th?",
        timestamp: "Yesterday, 2:45 PM",
      },
      {
        id: "msg-3",
        sender: "host",
        text: "We do have availability on the 15th! What time were you thinking and how many guests will attend?",
        timestamp: "Yesterday, 3:00 PM",
      },
      {
        id: "msg-4",
        sender: "user",
        text: "Great! We're looking at 6-10 PM with about 100 guests. Also, do you provide additional lighting for presentations?",
        timestamp: "Yesterday, 3:15 PM",
      },
      {
        id: "msg-5",
        sender: "host",
        text: "Yes, we can accommodate your request for additional lighting. We have a full A/V setup available for presentations.",
        timestamp: "2 hours ago",
      },
    ],
  },
  {
    id: "conv-2",
    with: "Warehouse 213",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "The venue is available on that date. Would you like to schedule a tour?",
    timestamp: "Yesterday",
    unread: false,
    messages: [
      {
        id: "msg-1",
        sender: "host",
        text: "Hello! Thanks for your interest in Warehouse 213.",
        timestamp: "2 days ago, 10:30 AM",
      },
      {
        id: "msg-2",
        sender: "user",
        text: "Hi! I'm looking for a space for a photo shoot next week. Is your venue available?",
        timestamp: "2 days ago, 11:45 AM",
      },
      {
        id: "msg-3",
        sender: "host",
        text: "The venue is available on that date. Would you like to schedule a tour?",
        timestamp: "Yesterday, 9:00 AM",
      },
    ],
  },
  {
    id: "conv-3",
    with: "Grand Ballroom",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "We've received your booking request and will confirm within 24 hours.",
    timestamp: "3 days ago",
    unread: false,
    messages: [
      {
        id: "msg-1",
        sender: "user",
        text: "Hello, I'm interested in booking your venue for a wedding reception.",
        timestamp: "4 days ago, 3:30 PM",
      },
      {
        id: "msg-2",
        sender: "host",
        text: "Congratulations! We'd be happy to host your wedding reception. When is the big day?",
        timestamp: "4 days ago, 4:15 PM",
      },
      {
        id: "msg-3",
        sender: "user",
        text: "Thank you! We're looking at July 15th next year. Do you have availability?",
        timestamp: "3 days ago, 10:30 AM",
      },
      {
        id: "msg-4",
        sender: "host",
        text: "We've received your booking request and will confirm within 24 hours.",
        timestamp: "3 days ago, 11:00 AM",
      },
    ],
  },
]

// Mock inquiries data (replace with your actual data source)
const mockInquiries = [
  {
    id: "inq-1",
    eventType: "Wedding",
    date: "July 15th next year",
    attendees: 150,
    budget: "$50,000",
    description: "Looking for a grand ballroom with catering services.",
  },
  {
    id: "inq-2",
    eventType: "Corporate Event",
    date: "December 10th this year",
    attendees: 100,
    budget: "$20,000",
    description: "Need a venue with A/V setup for presentations.",
  },
]

export default function MessagesPage() {
  const [conversations, setConversations] = useState(mockConversations)
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")

  const selectedConversation = conversations.find((conv) => conv.id === activeConversation)

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return

    const updatedConversations = conversations.map((conv) => {
      if (conv.id === activeConversation) {
        return {
          ...conv,
          messages: [
            ...conv.messages,
            {
              id: `msg-${Date.now()}`,
              sender: "user",
              text: newMessage,
              timestamp: "Just now",
            },
          ],
          lastMessage: newMessage,
          timestamp: "Just now",
        }
      }
      return conv
    })

    setConversations(updatedConversations)
    setNewMessage("")
  }

  useEffect(() => {
    // Check if we're starting a new chat from an inquiry
    const urlParams = new URLSearchParams(window.location.search)
    const newChatId = urlParams.get("newChat")

    if (newChatId) {
      // Find the inquiry in our mock data or localStorage
      const inquiryData = mockInquiries.find((inq) => inq.id === newChatId)

      if (inquiryData) {
        // Create a new conversation for this inquiry
        const newConversation = {
          id: `conv-${Date.now()}`,
          with: `${inquiryData.eventType} Inquiry`,
          avatar: "/placeholder.svg?height=40&width=40",
          lastMessage: "Hello! I'm interested in your venue for my event.",
          timestamp: "Just now",
          unread: false,
          messages: [
            {
              id: `msg-${Date.now()}`,
              sender: "user",
              text: `Hello! I'm interested in your venue for my ${inquiryData.eventType.toLowerCase()} on ${inquiryData.date} with ${inquiryData.attendees} attendees. My budget is ${inquiryData.budget}. ${inquiryData.description}`,
              timestamp: "Just now",
            },
          ],
        }

        setConversations([newConversation, ...conversations])
        setActiveConversation(newConversation.id)

        // Clear the URL parameter
        window.history.replaceState({}, document.title, "/messages")
      }
    }
  }, [])

  return (
    <main className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>

        <h1 className="text-3xl font-bold mb-8 gradient-text">Messages</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[500px]">
          {/* Conversation List */}
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h2 className="font-semibold">Conversations</h2>
            </div>
            <div className="overflow-y-auto h-[calc(100%-56px)]">
              {conversations.length === 0 ? (
                <div className="p-6 text-center text-gray-400">No conversations yet</div>
              ) : (
                <div>
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={`p-4 border-b border-gray-700 hover:bg-gray-750 cursor-pointer ${activeConversation === conv.id ? "bg-gray-750" : ""}`}
                      onClick={() => setActiveConversation(conv.id)}
                    >
                      <div className="flex gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <Image
                              src={conv.avatar || "/placeholder.svg"}
                              alt={conv.with}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          </div>
                          {conv.unread && (
                            <div className="absolute top-0 right-0 w-3 h-3 bg-orange-500 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium truncate">{conv.with}</h3>
                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{conv.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-400 truncate">{conv.lastMessage}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message Area */}
          <div className="bg-gray-800 rounded-xl overflow-hidden md:col-span-2 flex flex-col">
            {!activeConversation ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Select a conversation to view messages
              </div>
            ) : (
              <>
                <div className="p-4 border-b border-gray-700 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={selectedConversation?.avatar || "/placeholder.svg"}
                      alt={selectedConversation?.with || ""}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                  <h2 className="font-semibold">{selectedConversation?.with}</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation?.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === "user" ? "bg-orange-500 text-white" : "bg-gray-700 text-white"
                        }`}
                      >
                        <p>{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-700">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      className="bg-gray-700 border-gray-600"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
