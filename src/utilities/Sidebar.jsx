"use client"
import Link from "next/link"
import Image from "next/image"
import { PiBooksDuotone } from "react-icons/pi"
import { BiTask } from "react-icons/bi"
import { FolderGit2 } from "lucide-react"
import { GoDiscussionClosed } from "react-icons/go"
import Loader from "./Spinner/Loader"
import {
  Bell,
  CircleUser,
  Home,
  Menu,
  Search,
  X,
  BookOpenText,
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Logout from "./dialog/Logout"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"

export function Sidebar({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  // Sidebar content component to avoid repetition
  const SidebarContent = () => (
    <>
      <div className="flex h-14 items-center border-b border-pink-900/50 px-4 lg:h-[60px] lg:px-6">
        {!isSidebarCollapsed && (
          <Link href="/" className="flex items-center gap-2 font-semibold text-pink-500">
            <span className="">LearnX-AI</span>
          </Link>
        )}
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-black text-white border-pink-900/50 hover:bg-pink-900/30"
            onClick={toggleSidebar}
          >
            {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-black text-white border-pink-900/50 hover:bg-pink-900/30"
          >
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {[
            { href: "/", icon: Home, label: "Dashboard" },
            { href: "/allcourses", icon: BookOpenText, label: "All Courses" },
            { href: "/course", icon: PiBooksDuotone, label: "My Courses" },
            { href: "/assignment", icon: BiTask, label: "Assignments" },
            { href: "/project", icon: FolderGit2, label: "Projects" },
            { href: "/discussion", icon: GoDiscussionClosed, label: "Discussion Forum" },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 rounded-lg 
                ${pathname === href ? "bg-pink-900/50 text-white" : "text-white/70 hover:bg-pink-900/20"}
                ${isSidebarCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}
                transition-all hover:text-white
              `}
              title={isSidebarCollapsed ? label : ""}
            >
              <Icon className="h-5 w-5" />
              {!isSidebarCollapsed && <span>{label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {!isSidebarCollapsed && (
        <div className="mt-auto p-4">
          <Card className="bg-black border-pink-900/50">
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle className="text-pink-500">Explore Our Courses</CardTitle>
              <CardDescription className="text-white/70">
                Discover a variety of courses tailored to help you achieve your learning goals. Upgrade to Premium for unlimited access to all courses and exclusive content.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <Button
                size="sm"
                className="w-full mb-2 bg-pink-700 hover:bg-pink-600 text-white"
              >
                <Link href="/allcourses">
                  Browse Courses
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )

  return (
    <div className="flex min-h-screen w-full bg-black text-white">
      {/* Sidebar for larger screens - Always visible */}
      <div
        className={`
          sticky top-0 hidden md:block h-screen 
          border-r border-pink-900/50 bg-black 
          transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? "w-[80px]" : "w-[280px] lg:w-[350px]"}
        `}
      >
        <div className="flex h-full flex-col gap-2 relative">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader />
            </div>
          ) : (
            <SidebarContent />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-full z-30">
        <header className="flex h-14 items-center gap-4 border-b border-pink-900/50 bg-black px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden bg-black text-white border-pink-900/50 hover:bg-pink-900/30"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-black border-r border-pink-900/50">
              <div className="flex items-center justify-between h-14 px-4 border-b border-pink-900/50">
                <Link href="/" className="flex items-center gap-2 font-semibold text-pink-500">
                  <span className="">LearnX-AI</span>
                </Link>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="bg-black text-white border-pink-900/50 hover:bg-pink-900/30">
                    <X className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
              </div>
              <nav className="grid gap-1 px-2 py-4 text-sm font-medium">
                {[
                  { href: "/", icon: Home, label: "Dashboard" },
                  { href: "/allcourses", icon: BookOpenText, label: "All Courses" },
                  { href: "/course", icon: PiBooksDuotone, label: "My Courses" },
                  { href: "/assignment", icon: BiTask, label: "Assignments" },
                  { href: "/project", icon: FolderGit2, label: "Projects" },
                  { href: "/discussion", icon: GoDiscussionClosed, label: "Discussion Forum" },
                ].map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`
                      flex items-center gap-3 rounded-lg px-3 py-2 transition-all
                      ${pathname === href ? "bg-pink-900/50 text-white" : "text-white/70 hover:bg-pink-900/20 hover:text-white"}
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto p-4">
                <Card className="bg-black border-pink-900/50">
                  <CardHeader className="p-4">
                    <CardTitle className="text-pink-500">Explore Our Courses</CardTitle>
                    <CardDescription className="text-white/70">
                      Discover courses tailored for your goals.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <Button
                      onClick={() => router.push("/allcourses")}
                      className="w-full bg-pink-700 hover:bg-pink-600 text-white"
                    >
                      Browse Courses
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/70" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full bg-black border-pink-900/50 text-white placeholder:text-white/50 pl-8 shadow-none md:w-2/3 lg:w-1/3 focus:ring-pink-700"
                />
              </div>
            </form>
          </div>
     
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="bg-black text-white border-pink-900/50 hover:bg-pink-900/30">
                <CircleUser className="h-6 w-6" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black border-pink-900/50 text-white">
              <DropdownMenuLabel className="text-pink-500">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-pink-900/50" />
              <Link href="/profile">
                <DropdownMenuItem className="hover:bg-pink-900/20 hover:text-white">Profile</DropdownMenuItem>
              </Link>
              <Link href="https://www.devsomeware.com/contact" target="_blank">
                <DropdownMenuItem className="hover:bg-pink-900/20 hover:text-white">Support</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator className="bg-pink-900/50" />
              <DropdownMenuItem
                onClick={() => setIsOpen(true)}
                className="hover:bg-pink-900/20 hover:text-white"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <Logout isOpen={isOpen} setIsOpen={setIsOpen} type="user" />

        <main className="flex-1 overflow-y-auto p-4 bg-black">
          {children}
        </main>
      </div>
    </div>
  )
}