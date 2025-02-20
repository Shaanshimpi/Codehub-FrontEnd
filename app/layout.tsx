import { Suspense } from "react"
import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next"
import { geistMono, geistSans } from "./fonts"
import "./globals.css"
import Header from "./layouts/Header"
import Socials from "./layouts/Socials"
import EndSection from "./sections/EndSection"

const WALink = `https://wa.me/918637704621?text=I%20Want%20to%20learn%20coding%20and%20be%20successful%20Coder`

export const metadata: Metadata = {
  title: "CodeHub",
  description:
    "CodeHub is a premier tech institute focused on empowering individuals with cutting-edge programming and development skills. We specialize in full-stack and MERN stack development to prepare students for real-world challenges.",
  generator: "Next.js",
  applicationName: "CodeHub",
  referrer: "origin-when-cross-origin",
  metadataBase: new URL("https://codehubindia.in/"),
  keywords: [
    "CodeHub",
    "Programming",
    "Web Development",
    "Full-Stack",
    "MERN Stack",
    "Tech Careers",
    "Coding Institute",
    "Best full-stack course in Nashik",
    "MERN stack training in Nashik",
    "Advanced MERN stack course",
    "Full-stack web development classes",
    "Software development institute in Nashik",
    "Learn MERN stack development",
    "Full-stack developer course near me",
    "Best coding classes in Nashik",
    "Full-stack training for beginners",
    "Professional MERN stack course",
    "Software development training programs",
    "Top web development institute",
    "Best institute for software development in Nashik",
    "Complete full-stack developer guide",
    "Job-oriented MERN stack course",
    "Advanced web development classes",
    "Best MERN stack course with job placement in Nashik",
    "Affordable full-stack developer classes near me",
    "Comprehensive software development training for beginners",
    "Hands-on MERN stack projects in Nashik",
    "Full-stack development course with real-world projects",
    "Learn software development from scratch in Nashik",
    "Best institute for advanced MERN stack training",
    "Top-rated coding classes for web development in Nashik",
    "Enroll in the best MERN stack course",
    "Master full-stack development in Nashik",
    "Kickstart your software development career",
    "Build a career in MERN stack development",
    "Learn advanced full-stack web development techniques",
  ],
  category: "education",
  authors: [{ name: "CodeHub Team", url: "https://codehubindia.in/" }],
  creator: "CodeHub Team",
  publisher: "CodeHub",
  openGraph: {
    title: "CodeHub - Empowering Future Innovators",
    description:
      "CodeHub is your destination for mastering programming and development. Learn from industry experts and work on live projects to transform your skills into a successful career.",
    url: "https://codehubindia.in/",
    siteName: "CodeHub",
    images: [
      {
        url: "https://your-image-url.com/preview.png",
        alt: "CodeHub Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeHub - Empowering Future Innovators",
    description:
      "Join CodeHub to master modern programming and full-stack development. Learn through hands-on training, live projects, and expert mentoring.",
    creator: "@CodeHubIndia",
    images: {
      url: "https://your-image-url.com/preview.png",
      alt: "CodeHub Banner",
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense>
          <Header />
          <Socials />
          <Analytics />
          {children}
          <EndSection WALink={WALink} />
        </Suspense>
      </body>
    </html>
  )
}
