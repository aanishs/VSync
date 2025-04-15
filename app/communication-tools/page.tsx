"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, MessageSquare, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

// Mock templates data
const mockTemplates = [
  {
    id: "template-1",
    name: "Booking Confirmation",
    content:
      "Thank you for booking [Venue Name]! We're excited to host your event on [Date] from [Start Time] to [End Time]. Please let me know if you have any questions or special requirements before your event.",
  },
  {
    id: "template-2",
    name: "Venue Information",
    content:
      "Here's some information about [Venue Name]:\n\n- Capacity: [Capacity] people\n- Amenities: [Amenities]\n- Parking: [Parking Details]\n\nPlease let me know if you'd like to schedule a viewing or have any questions!",
  },
  {
    id: "template-3",
    name: "Check-in Instructions",
    content:
      "Looking forward to your event at [Venue Name] tomorrow! Here are your check-in instructions:\n\n1. Arrival time: [Check-in Time]\n2. Meet our staff at: [Meeting Point]\n3. Access code: [Access Code]\n\nIf you need anything, please call [Contact Number].",
  },
]

export default function CommunicationToolsPage() {
  const [templates, setTemplates] = useState(mockTemplates)
  const [selectedTemplate, setSelectedTemplate] = useState(mockTemplates[0])
  const [editedTemplate, setEditedTemplate] = useState(selectedTemplate.content)
  const [newTemplateName, setNewTemplateName] = useState("")
  const [newTemplateContent, setNewTemplateContent] = useState("")
  const [autoResponderEnabled, setAutoResponderEnabled] = useState(false)
  const [autoResponderMessage, setAutoResponderMessage] = useState(
    "Thank you for your message! I'll get back to you as soon as possible, usually within 24 hours.",
  )

  const handleSaveTemplate = () => {
    const updatedTemplates = templates.map((template) => {
      if (template.id === selectedTemplate.id) {
        return { ...template, content: editedTemplate }
      }
      return template
    })

    setTemplates(updatedTemplates)
    setSelectedTemplate({ ...selectedTemplate, content: editedTemplate })

    toast({
      title: "Template Saved",
      description: "Your message template has been saved successfully.",
    })
  }

  const handleCreateTemplate = () => {
    if (!newTemplateName || !newTemplateContent) return

    const newTemplate = {
      id: `template-${templates.length + 1}`,
      name: newTemplateName,
      content: newTemplateContent,
    }

    setTemplates([...templates, newTemplate])
    setNewTemplateName("")
    setNewTemplateContent("")

    toast({
      title: "Template Created",
      description: "Your new message template has been created successfully.",
    })
  }

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(selectedTemplate.content)

    toast({
      title: "Template Copied",
      description: "Template has been copied to clipboard.",
    })
  }

  const handleSaveAutoResponder = () => {
    toast({
      title: "Auto-Responder Updated",
      description: `Auto-responder has been ${autoResponderEnabled ? "enabled" : "disabled"}.`,
    })
  }

  return (
    <main className="bg-gray-900 text-white min-h-screen pb-16">
      <div className="container mx-auto px-4 py-6">
        <Link href="/host" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-8 gradient-text">Guest Communication Tools</h1>

        <Tabs defaultValue="templates">
          <TabsList className="bg-gray-800 border-b border-gray-700 w-full justify-start mb-6">
            <TabsTrigger
              value="templates"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none"
            >
              Message Templates
            </TabsTrigger>
            <TabsTrigger
              value="auto-responder"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none"
            >
              Auto-Responder
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none"
            >
              Notification Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="bg-gray-800 rounded-xl p-6">
                  <h2 className="text-lg font-semibold mb-4">Your Templates</h2>

                  <div className="space-y-2">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className={`p-3 rounded-lg cursor-pointer ${
                          selectedTemplate.id === template.id ? "bg-gray-700" : "hover:bg-gray-750"
                        }`}
                        onClick={() => {
                          setSelectedTemplate(template)
                          setEditedTemplate(template.content)
                        }}
                      >
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-gray-400 truncate mt-1">{template.content.substring(0, 50)}...</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <h3 className="font-medium mb-3">Create New Template</h3>

                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="template-name" className="text-sm">
                          Template Name
                        </Label>
                        <Input
                          id="template-name"
                          placeholder="e.g., Welcome Message"
                          className="bg-gray-700 border-gray-600"
                          value={newTemplateName}
                          onChange={(e) => setNewTemplateName(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="template-content" className="text-sm">
                          Template Content
                        </Label>
                        <Textarea
                          id="template-content"
                          placeholder="Write your template message here..."
                          className="bg-gray-700 border-gray-600 min-h-[100px]"
                          value={newTemplateContent}
                          onChange={(e) => setNewTemplateContent(e.target.value)}
                        />
                      </div>

                      <Button
                        className="w-full bg-orange-500 hover:bg-orange-600"
                        onClick={handleCreateTemplate}
                        disabled={!newTemplateName || !newTemplateContent}
                      >
                        Create Template
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="bg-gray-800 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Edit Template: {selectedTemplate.name}</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gray-700 hover:bg-gray-600 border-gray-600"
                      onClick={handleCopyTemplate}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <Textarea
                      className="bg-gray-700 border-gray-600 min-h-[200px]"
                      value={editedTemplate}
                      onChange={(e) => setEditedTemplate(e.target.value)}
                    />

                    <div className="bg-gray-750 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Template Variables</h3>
                      <p className="text-sm text-gray-300 mb-3">
                        Use these variables in your templates. They will be automatically replaced with the actual
                        information when you use the template.
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-gray-700 px-2 py-1 rounded">[Venue Name]</div>
                        <div className="bg-gray-700 px-2 py-1 rounded">[Date]</div>
                        <div className="bg-gray-700 px-2 py-1 rounded">[Start Time]</div>
                        <div className="bg-gray-700 px-2 py-1 rounded">[End Time]</div>
                        <div className="bg-gray-700 px-2 py-1 rounded">[Capacity]</div>
                        <div className="bg-gray-700 px-2 py-1 rounded">[Amenities]</div>
                        <div className="bg-gray-700 px-2 py-1 rounded">[Guest Name]</div>
                        <div className="bg-gray-700 px-2 py-1 rounded">[Total Price]</div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleSaveTemplate}>
                        Save Template
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="auto-responder">
            <div className="max-w-3xl mx-auto">
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Auto-Responder</h2>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="auto-responder-toggle" className="text-sm">
                      {autoResponderEnabled ? "Enabled" : "Disabled"}
                    </Label>
                    <Switch
                      id="auto-responder-toggle"
                      checked={autoResponderEnabled}
                      onCheckedChange={setAutoResponderEnabled}
                      className="data-[state=checked]:bg-orange-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="auto-responder-message" className="text-sm mb-2 block">
                      Auto-Response Message
                    </Label>
                    <Textarea
                      id="auto-responder-message"
                      className="bg-gray-700 border-gray-600 min-h-[150px]"
                      value={autoResponderMessage}
                      onChange={(e) => setAutoResponderMessage(e.target.value)}
                      disabled={!autoResponderEnabled}
                    />
                  </div>

                  <div className="bg-gray-750 p-4 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      How It Works
                    </h3>
                    <p className="text-sm text-gray-300">
                      The auto-responder automatically sends a message to guests when they first contact you. This helps
                      set expectations for response times and lets them know you've received their message.
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleSaveAutoResponder}>
                      Save Settings
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="max-w-3xl mx-auto">
              <div className="bg-gray-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-6">Notification Settings</h2>

                <div className="space-y-6">
                  <div className="bg-gray-750 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-400 mt-1">
                          Receive email notifications for new messages and bookings
                        </p>
                      </div>
                      <Switch defaultChecked className="data-[state=checked]:bg-orange-500" />
                    </div>
                  </div>

                  <div className="bg-gray-750 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">SMS Notifications</h3>
                        <p className="text-sm text-gray-400 mt-1">
                          Receive text messages for new bookings and urgent communications
                        </p>
                      </div>
                      <Switch className="data-[state=checked]:bg-orange-500" />
                    </div>
                  </div>

                  <div className="bg-gray-750 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Push Notifications</h3>
                        <p className="text-sm text-gray-400 mt-1">Receive push notifications on your mobile device</p>
                      </div>
                      <Switch defaultChecked className="data-[state=checked]:bg-orange-500" />
                    </div>
                  </div>

                  <div className="bg-gray-750 p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Notification Preferences</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notify-new-messages" className="text-sm">
                          New Messages
                        </Label>
                        <Switch
                          id="notify-new-messages"
                          defaultChecked
                          className="data-[state=checked]:bg-orange-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notify-new-bookings" className="text-sm">
                          New Booking Requests
                        </Label>
                        <Switch
                          id="notify-new-bookings"
                          defaultChecked
                          className="data-[state=checked]:bg-orange-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notify-booking-changes" className="text-sm">
                          Booking Changes/Cancellations
                        </Label>
                        <Switch
                          id="notify-booking-changes"
                          defaultChecked
                          className="data-[state=checked]:bg-orange-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notify-reviews" className="text-sm">
                          New Reviews
                        </Label>
                        <Switch id="notify-reviews" defaultChecked className="data-[state=checked]:bg-orange-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notify-promotions" className="text-sm">
                          VSync Promotions & Updates
                        </Label>
                        <Switch id="notify-promotions" className="data-[state=checked]:bg-orange-500" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-orange-500 hover:bg-orange-600">Save Notification Settings</Button>
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
