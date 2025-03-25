"use client"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { Toaster } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"
import SessionDetected from "./Auth/SessionDetected"
import Image from "next/image"
import HomePageSkl from "./skeleton/HomePageSkl"
import useFcmToken from "../../hooks/useFcmToken"

export default function Home() {
  const router = useRouter();
  const { token } = useFcmToken();
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isansession, setisansession] = useState(false);

  const dashboardStats = [
    { title: "Courses", value: data?.length || 0, icon: "📚" },
    { title: "Assignments", value: 3, icon: "📋" },
    { title: "Projects", value: 3, icon: "💼" },
    { title: "Rank", value: "99+", icon: "🏆" }
  ];

  const sampleNotifications = [
    { icon: "🔔", title: "New Course", text: "Cloud Computing course added." },
    { icon: "📅", title: "Deadline", text: "Project proposal due July 26, 2024." },
    { icon: "🏅", title: "Evaluation", text: "Project review on August 20th, 2024." }
  ];

  const sampleProjects = [
    { title: "Capstone Project", progress: 25 },
    { title: "Group Project", progress: 50 },
    { title: "Individual Project", progress: 75 }
  ];

  return (
    <>
      <Toaster position="top-center" expand={false} />
      {loading && <HomePageSkl />}
      {isansession && <SessionDetected />}
      
      {!loading && !isansession && (
        <div className="min-h-screen bg-black text-white p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
              <div className="text-xs md:text-sm text-white/70">
                Welcome, {user?.name || 'Guest'} • {new Date().toLocaleDateString()}
              </div>
            </div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {dashboardStats.map((stat, index) => (
                <div 
                  key={index} 
                  className="bg-gray-950 rounded-xl p-3 border border-pink-600 hover:border-pink-500 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/70 font-medium text-xs">{stat.title}</p>
                      <p className="text-lg font-bold text-white mt-1">{stat.value}</p>
                    </div>
                    <span className="text-lg opacity-70">{stat.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Courses Section */}
              <div className="bg-gray-950 rounded-xl p-4 border border-pink-600 space-y-3 h-full">
                <div className="flex justify-between items-center">
                  <h2 className="text-base font-semibold">Courses</h2>
                  <Link href="/course" className="text-white/70 hover:text-white text-xs">
                    View All
                  </Link>
                </div>
                <div className="space-y-2">
                  {data?.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-900 p-2 rounded-lg">
                      <Image
                        src={item.courseid.img}
                        width={32}
                        height={32}
                        className="rounded-md"
                        alt="Course Thumbnail"
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium text-xs truncate">{item.courseid.title}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Progress value={item.progress} className="w-full h-1 bg-gray-800" />
                          <span className="text-[10px] text-white/70">{item.progress}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assignments Section */}
              <div className="bg-gray-950 rounded-xl p-4 border border-pink-600 space-y-3 h-full">
                <div className="flex justify-between items-center">
                  <h2 className="text-base font-semibold">Assignments</h2>
                  <Link href="/assignment" className="text-white/70 hover:text-white text-xs">
                    View All
                  </Link>
                </div>
                <div className="space-y-2">
                  {sampleProjects.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-900 p-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-white/70 text-base">📋</span>
                        <div>
                          <p className="text-white font-medium text-xs">{item.title}</p>
                          <p className="text-[10px] text-white/50">
                            Due: {new Date().toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-white bg-white/10 px-1.5 py-0.5 rounded-md">Pending</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects Section */}
              <div className="bg-gray-950 rounded-xl p-4 border border-pink-600 space-y-3 h-full">
                <div className="flex justify-between items-center">
                  <h2 className="text-base font-semibold">Projects</h2>
                  <Link href="/project" className="text-white/70 hover:text-white text-xs">
                    View All
                  </Link>
                </div>
                <div className="space-y-2">
                  {sampleProjects.map((project, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-900 p-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-white/70 text-base">💼</span>
                        <div className="flex-1">
                          <p className="text-white font-medium text-xs">{project.title}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Progress value={project.progress} className="w-full h-1 bg-gray-800" />
                            <span className="text-[10px] text-white/70">{project.progress}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notifications Section */}
              <div className="bg-gray-950 rounded-xl p-4 border border-pink-600 space-y-3 h-full">
                <div className="flex justify-between items-center">
                  <h2 className="text-base font-semibold">Notifications</h2>
                  <Link href="#" className="text-white/70 hover:text-white text-xs">
                    View All
                  </Link>
                </div>
                <div className="space-y-2">
                  {sampleNotifications.map((notification, index) => (
                    <div key={index} className="flex items-start gap-2 bg-gray-900 p-2 rounded-lg">
                      <span className="text-base">{notification.icon}</span>
                      <div>
                        <p className="text-white font-medium text-xs">{notification.title}</p>
                        <p className="text-[10px] text-white/70">{notification.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
// ... (rest of the SVG icon components remain unchanged)

// ... (rest of the SVG icon components remain unchanged)
// ... (rest of the SVG icon components remain unchanged)
// ... (rest of the SVG icon components remain unchanged)
function AwardIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
      <circle cx="12" cy="8" r="6" />
    </svg>
  )
}


function BellIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}


function BookOpenIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}


function BriefcaseIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
  )
}


function CalendarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  )
}


function ClipboardIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  )
}


function FrameIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" x2="2" y1="6" y2="6" />
      <line x1="22" x2="2" y1="18" y2="18" />
      <line x1="6" x2="6" y1="2" y2="22" />
      <line x1="18" x2="18" y1="2" y2="22" />
    </svg>
  )
}


function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}


function TrophyIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}