"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { Toaster, toast } from "sonner"
import { useRouter } from "next/navigation"
import SessionDetected from "./Auth/SessionDetected"
import HomePageSkl from "./skeleton/HomePageSkl"
import useFcmToken from "../../hooks/useFcmToken"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Book,
  Briefcase,
  Clock,
  Code,
  Cpu,
  GraduationCap,
  LineChart,
  MessageSquare,
  Rocket,
  Trophy,
  Calendar,
  CheckCircle,
  BarChart3,
  BadgeCheck,
  BellRing
} from "lucide-react"

export default function Home() {
  const router = useRouter();
  const { token } = useFcmToken();
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isansession, setisansession] = useState(false);
  const [stats, setStats] = useState({
    coursesCount: 0,
    assignmentsCount: 0,
    completedLessons: 0,
    overallProgress: 0,
    rank: "Beginner"
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  // Fetch user data and courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/homeauth", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "token": localStorage.getItem("dilmstoken")
          }
        });

        const res = await response.json();
        setLoading(false);

        if (res.success) {
          setData(res.data);
          setUser(res.user);
          
          // Calculate stats based on actual data
          if (res.data && res.data.length > 0) {
            const completedLessons = res.data.reduce((total, course) => 
              total + (course.crcmp ? course.crcmp.length : 0), 0);
            
            const overallProgress = res.data.reduce((total, course) => 
              total + (course.progress || 0), 0) / res.data.length;

            // Determine rank based on progress and completed courses
            let rank = "Beginner";
            if (overallProgress > 75) rank = "Expert";
            else if (overallProgress > 50) rank = "Advanced";
            else if (overallProgress > 25) rank = "Intermediate";

            setStats({
              coursesCount: res.data.length,
              assignmentsCount: Math.min(res.data.length * 2, 10), // Estimate
              completedLessons,
              overallProgress,
              rank
            });

            // Generate recent activity (based on actual course progress)
            const activities = [];
            res.data.forEach(course => {
              if (course.crcmp && course.crcmp.length > 0) {
                // Get the latest completed item
                const latestCompleted = course.crcmp[course.crcmp.length - 1];
                activities.push({
                  type: 'completion',
                  title: `Completed "${latestCompleted.name}"`,
                  course: course.courseid.title,
                  time: '2 days ago',
                  icon: CheckCircle
                });
              }
              
              if (course.progress && course.progress > 0) {
                activities.push({
                  type: 'progress',
                  title: `Made progress in course`,
                  course: course.courseid.title,
                  progress: course.progress,
                  time: '1 day ago',
                  icon: BarChart3
                });
              }
            });

            // Add a message activity if we don't have enough activities
            if (activities.length < 3) {
              activities.push({
                type: 'message',
                title: 'New platform update',
                message: 'Check out the new AI assistant feature!',
                time: '3 days ago',
                icon: BellRing
              });
            }

            setRecentActivity(activities.slice(0, 3));

            // Generate upcoming deadlines and events
            const today = new Date();
            const events = [
              {
                title: "Assignment Deadline",
                course: res.data[0]?.courseid.title || "Your Course",
                date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
                icon: Calendar
              },
              {
                title: "Live Q&A Session",
                course: "All Courses",
                date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
                icon: MessageSquare
              },
              {
                title: "Project Submission",
                course: res.data[0]?.courseid.title || "Your Course",
                date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
                icon: Briefcase
              }
            ];
            setUpcomingEvents(events);
          }
        } else {
          if (res.ansession) {
            setisansession(true);
          }
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }
      } catch (err) {
        setLoading(false);
        console.error("Error fetching data:", err);
        toast.error("Failed to load your dashboard data");
      }
    };

    if (localStorage.getItem("dilmstoken")) {
      fetchData();
    } else {
      router.push("/login");
    }
  }, [router]);

  // Calculate course recommendation
  const getRecommendedCourse = () => {
    if (!data || data.length === 0) return null;
    
    // Find the course with the lowest progress
    const lowestProgressCourse = [...data].sort((a, b) => 
      (a.progress || 0) - (b.progress || 0)
    )[0];
    
    return lowestProgressCourse;
  };

  const recommendedCourse = getRecommendedCourse();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
      <Toaster position="top-center" expand={false} />
      {loading && <HomePageSkl />}
      {isansession && <SessionDetected />}
      
      {!loading && !isansession && (
        <div className="min-h-screen bg-black text-white">
          {/* Hero Section with User Welcome */}
          <div className="bg-gradient-to-br from-gray-900 to-black border-b border-pink-900/30 py-8 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    Welcome back, <span className="text-pink-500">{user?.name?.split(' ')[0] || 'Learner'}</span>
                  </h1>
                  <p className="text-gray-400">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    {' '} • {' '}
                    <span className="text-pink-500 font-medium">
                      {stats.rank} Level
                    </span>
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Link href="/course">
                    <Button variant="outline" className="bg-gray-900 border-pink-700 text-white hover:bg-pink-900/30">
                      <Book className="mr-2 h-4 w-4" />
                      My Courses
                    </Button>
                  </Link>
                  <Link href="/allcourses">
                    <Button className="bg-pink-700 hover:bg-pink-600 text-white">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      Explore Courses
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gray-900 border-pink-900/30 shadow-lg">
                <CardContent className="p-4 flex items-start">
                  <div className="rounded-full bg-pink-500/10 p-3 mr-4">
                    <Book className="h-6 w-6 text-pink-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Enrolled Courses</p>
                    <h3 className="text-2xl font-bold">{stats.coursesCount}</h3>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-pink-900/30 shadow-lg">
                <CardContent className="p-4 flex items-start">
                  <div className="rounded-full bg-purple-500/10 p-3 mr-4">
                    <CheckCircle className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Completed Lessons</p>
                    <h3 className="text-2xl font-bold">{stats.completedLessons}</h3>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-pink-900/30 shadow-lg">
                <CardContent className="p-4 flex items-start">
                  <div className="rounded-full bg-blue-500/10 p-3 mr-4">
                    <Code className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Assignments</p>
                    <h3 className="text-2xl font-bold">{stats.assignmentsCount}</h3>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-pink-900/30 shadow-lg">
                <CardContent className="p-4 flex items-start">
                  <div className="rounded-full bg-yellow-500/10 p-3 mr-4">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Overall Progress</p>
                    <h3 className="text-2xl font-bold">{Math.round(stats.overallProgress || 0)}%</h3>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Course Progress Section */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Book className="mr-2 h-5 w-5 text-pink-500" />
                  Your Course Progress
                </h2>
                
                {data && data.length > 0 ? (
                  <div className="space-y-4">
                    {data.slice(0, 3).map((course, index) => (
                      <Card key={index} className="bg-gray-900 border-pink-900/30 overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row items-center">
                            <div className="w-full md:w-48 h-32 overflow-hidden">
                              <img 
                                src={course.courseid.img} 
                                alt={course.courseid.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-4 flex-1">
                              <h3 className="text-lg font-semibold mb-1 text-white">{course.courseid.title}</h3>
                              <div className="flex flex-wrap items-center text-xs gap-2 mb-3">
                                <Badge variant="outline" className="bg-pink-900/20 text-pink-300 border-pink-500/50">
                                  {course.courseid.duration} months
                                </Badge>
                                {course.courseid.skills.split(',').slice(0, 2).map((skill, i) => (
                                  <Badge key={i} variant="outline" className="bg-gray-800 text-gray-300 border-gray-700">
                                    {skill.trim()}
                                  </Badge>
                                ))}
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-gray-400">Progress</span>
                                  <span className="text-white font-medium">{course.progress || 0}%</span>
                                </div>
                                <Progress value={course.progress || 0} className="h-2 bg-gray-800" />
                              </div>
                              <div className="mt-3 flex justify-end">
                                <Link href={`/course/detail/${course.courseid._id}`}>
                                  <Button variant="outline" size="sm" className="text-white border-pink-700 hover:bg-pink-900/30">
                                    Continue Learning
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {data.length > 3 && (
                      <div className="text-center">
                        <Link href="/course">
                          <Button variant="ghost" className="text-pink-400 hover:text-pink-300 hover:bg-pink-900/20">
                            View All Courses
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <Card className="bg-gray-900 border-pink-900/30">
                    <CardContent className="p-6 text-center">
                      <GraduationCap className="h-12 w-12 mx-auto text-pink-500 mb-3 opacity-80" />
                      <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                      <p className="text-gray-400 mb-4">Start your learning journey by enrolling in a course</p>
                      <Link href="/allcourses">
                        <Button className="bg-pink-700 hover:bg-pink-600">
                          Browse Courses
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
                
                {/* Recent Activity */}
                <div className="mt-8">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-pink-500" />
                    Recent Activity
                  </h2>
                  
                  <Card className="bg-gray-900 border-pink-900/30">
                    <CardContent className="p-4">
                      {recentActivity.length > 0 ? (
                        <div className="space-y-4">
                          {recentActivity.map((activity, index) => (
                            <div key={index} className="flex gap-3 items-start pb-3 border-b border-gray-800 last:border-0 last:pb-0">
                              <div className="rounded-full bg-gray-800 p-2">
                                <activity.icon className="h-4 w-4 text-pink-500" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-medium">{activity.title}</h4>
                                <p className="text-xs text-gray-400">
                                  {activity.course && `In ${activity.course}`}
                                  {activity.message && activity.message}
                                </p>
                                {activity.type === 'progress' && activity.progress && (
                                  <Progress value={activity.progress} className="h-1 mt-2 bg-gray-800 w-32" />
                                )}
                              </div>
                              <div className="text-xs text-gray-500">{activity.time}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-gray-400 py-2">No recent activity</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Sidebar Content */}
              <div className="space-y-6">
                {/* Upcoming Events */}
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-pink-500" />
                    Upcoming Events
                  </h2>
                  
                  <Card className="bg-gray-900 border-pink-900/30">
                    <CardContent className="p-4 space-y-4">
                      {upcomingEvents.map((event, index) => (
                        <div key={index} className="flex gap-3 items-start pb-3 border-b border-gray-800 last:border-0 last:pb-0">
                          <div className="rounded-full bg-gray-800 p-2">
                            <event.icon className="h-4 w-4 text-pink-500" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">{event.title}</h4>
                            <p className="text-xs text-gray-400">{event.course}</p>
                            <p className="text-xs text-pink-400 mt-1">
                              Due: {formatDate(event.date)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
                
                {/* Recommended Next Steps */}
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <Rocket className="mr-2 h-5 w-5 text-pink-500" />
                    Recommended Next
                  </h2>
                  
                  <Card className="bg-gray-900 border-pink-900/30">
                    <CardContent className="p-4">
                      {recommendedCourse ? (
                        <div className="space-y-3">
                          <h3 className="text-sm font-medium">Continue Learning</h3>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded overflow-hidden">
                              <img 
                                src={recommendedCourse.courseid.img} 
                                alt={recommendedCourse.courseid.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium">{recommendedCourse.courseid.title}</h4>
                              <Progress value={recommendedCourse.progress || 0} className="h-1 mt-1 bg-gray-800 w-full" />
                            </div>
                          </div>
                          <div className="pt-2">
                            <Link href={`/course/detail/${recommendedCourse.courseid._id}`}>
                              <Button size="sm" className="w-full bg-pink-700 hover:bg-pink-600">
                                Resume Course
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <h3 className="text-sm font-medium">Explore New Courses</h3>
                          <p className="text-xs text-gray-400">Discover courses aligned with your interests</p>
                          <Link href="/allcourses">
                            <Button size="sm" className="w-full bg-pink-700 hover:bg-pink-600">
                              Browse Catalog
                            </Button>
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                {/* Learning Resources */}
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <Cpu className="mr-2 h-5 w-5 text-pink-500" />
                    Learning Resources
                  </h2>
                  
                  <Card className="bg-gray-900 border-pink-900/30">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-gray-800 p-2">
                          <MessageSquare className="h-4 w-4 text-pink-500" />
                        </div>
                        <div>
                        <h4 className="text-sm font-medium">AI Learning Assistant</h4>
                          <p className="text-xs text-gray-400">Get personalized help with your courses</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-gray-800 p-2">
                          <LineChart className="h-4 w-4 text-pink-500" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Learning Analytics</h4>
                          <p className="text-xs text-gray-400">Track your progress and performance</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-gray-800 p-2">
                          <BadgeCheck className="h-4 w-4 text-pink-500" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Certification Path</h4>
                          <p className="text-xs text-gray-400">Earn certificates for your skills</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}