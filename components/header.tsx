"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AuthModal from "@/components/auth-modal"
import { useRouter } from "next/navigation"

export default function Header() {
  const router = useRouter()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [userType, setUserType] = useState<"guest" | "host">("guest")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleOpenAuthModal = (mode: "login" | "signup") => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
    setIsDropdownOpen(false) // Close dropdown when opening auth modal
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
    setIsAuthModalOpen(false)
    // Save login state to localStorage
    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("userType", userType)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    // Clear login state from localStorage
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userType")
    router.push("/")
  }

  const handleUserTypeChange = (type: "guest" | "host") => {
    setUserType(type)
    localStorage.setItem("userType", type)

    // Redirect to appropriate page based on user type
    if (type === "host") {
      router.push("/host")
    } else {
      router.push("/")
    }
  }

  // Check if user is logged in on component mount
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    const savedUserType = localStorage.getItem("userType") as "guest" | "host" | null

    if (loggedIn) {
      setIsLoggedIn(true)
      if (savedUserType) {
        setUserType(savedUserType)
      }
    }
  }, [])

  return (
    <header className="border-b border-gray-800 bg-gray-900">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
              V
            </div>
            <span className="text-2xl font-bold gradient-text">VSync</span>
          </Link>

          {isLoggedIn && (
            <Tabs defaultValue={userType} className="mx-auto">
              <TabsList>
                <TabsTrigger
                  value="guest"
                  onClick={() => handleUserTypeChange("guest")}
                  className="data-[state=active]:bg-orange-500"
                >
                  Guest
                </TabsTrigger>
                <TabsTrigger
                  value="host"
                  onClick={() => handleUserTypeChange("host")}
                  className="data-[state=active]:bg-orange-500"
                >
                  Host
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gray-900 text-white">
                <nav className="flex flex-col gap-4 mt-8">
                  {isLoggedIn ? (
                    <>
                      <Link href="/sync-event" className="text-lg font-medium">
                        VSync Your Event
                      </Link>
                      <Link href="/favorites" className="text-lg font-medium">
                        My Favorites
                      </Link>
                      <Link href="/inquiries" className="text-lg font-medium">
                        My Inquiries
                      </Link>
                      <Link href="/messages" className="text-lg font-medium">
                        Messages
                      </Link>
                      {userType === "host" && (
                        <>
                          <Link href="/pricing-earnings" className="text-lg font-medium">
                            Pricing & Earnings
                          </Link>
                          <Link href="/calendar" className="text-lg font-medium">
                            Calendar & Availability
                          </Link>
                        </>
                      )}
                      <button onClick={handleLogout} className="text-lg font-medium text-red-400">
                        Log Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleOpenAuthModal("login")} className="text-lg font-medium">
                        Log In
                      </button>
                      <button onClick={() => handleOpenAuthModal("signup")} className="text-lg font-medium">
                        Sign Up
                      </button>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>

            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800 text-white border-gray-700">
                {isLoggedIn ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/sync-event" className="cursor-pointer">
                        VSync Your Event
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem asChild>
                      <Link href="/favorites" className="cursor-pointer">
                        My Favorites
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/inquiries" className="cursor-pointer">
                        My Inquiries
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/messages" className="cursor-pointer">
                        Messages
                      </Link>
                    </DropdownMenuItem>
                    {userType === "host" && (
                      <>
                        <DropdownMenuSeparator className="bg-gray-700" />
                        <DropdownMenuItem asChild>
                          <Link href="/pricing-earnings" className="cursor-pointer">
                            Pricing & Earnings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/calendar" className="cursor-pointer">
                            Calendar & Availability
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-400 cursor-pointer">
                      Log Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onSelect={() => handleOpenAuthModal("login")} className="cursor-pointer">
                      Log In
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleOpenAuthModal("signup")} className="cursor-pointer">
                      Sign Up
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onLogin={handleLogin}
      />
    </header>
  )
}
