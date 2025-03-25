
import Home from "@/utilities/Home";

export const metadata = {
  title: "LearnX-AI",
  description:
    "DevSomeWare's Learning Platform offers a comprehensive online learning experience. Explore a wide range of courses, build your skills, and collaborate with expert mentors in various fields.",
  keywords: [
    "DevSomeWare Learning Platform",
    "Online Learning",
    "LMS Platform",
    "Learn DevSomeWare",
    "Tech Courses Online",
    "Skill Development",
    "Developer Learning",
    "Course Platform",
    "Education for Developers",
    "Online Learning Platform",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "LearnX-AI",
    description:
      "Join DevSomeWare's Learning Platform to enhance your skills with curated courses. Learn from industry experts, collaborate with peers, and boost your career with quality online education.",
   
    type: "website",
    images: [
      {
        url: "/alogo.png",
        width: 1200,
        height: 630,
        alt: "LearnX-AI Learning Platform",
      },
    ],
  },
  
};


export default function Page() {
  return (
   <Home/>
  // <Login/>
  );
}
