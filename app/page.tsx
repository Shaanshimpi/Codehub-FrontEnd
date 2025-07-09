import logosqr from "@/app/assets/logo-sqr.png"
import Script from "next/script"
import ScreenLoaderNew from "./components/ScreenLoaderNew"
import Header from "./layouts/Header"
import BioSection from "./sections/BioSection"
import EndSection from "./sections/EndSection"
import FixedSection from "./sections/FixedSection"
import HeroSection from "./sections/HeroSection"
import ImagesSection from "./sections/ImagesSection"
import PinBackground from "./sections/PinBackground"
import PinInitialSection from "./sections/PinInitialSection"
import PinSection from "./sections/PinSection"
import SliderSection from "./sections/SliderSection"
import SpaceSection from "./sections/SpaceSection"

export const metadata = {
  title: "CodeHub – Learn Programming & Get Job-Ready in Nashik",
  description:
    "CodeHub is Nashik’s leading coding institute offering C, C++, Full Stack, and MERN Stack training with job assistance, daily challenges, and real-world projects.",
  keywords:
    "CodeHub, coding institute Nashik, C programming, C++, Full Stack, MERN Stack, job ready courses, coding classes Nashik, programming bootcamp",
  openGraph: {
    title: "CodeHub – Best Coding Classes in Nashik",
    description:
      "Master programming with CodeHub. Get hands-on training in C, C++, Full Stack, and MERN Stack with daily practice, projects, and placement support.",
    url: "https://codehubindia.in/",
    siteName: "CodeHub India",
    images: [
      {
        url: logosqr.src, // Replace with your actual OG image
        width: 1200,
        height: 630,
        alt: "CodeHub – Best Coding Institute in Nashik",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeHub – Learn Programming & Get Job-Ready in Nashik",
    description:
      "Join CodeHub to learn programming with expert mentors. C, C++, Full Stack, MERN Stack & Placement Training.",
    images: [logosqr.src], // Same OG image
  },
  alternates: {
    canonical: "https://codehubindia.in/",
  },
}

export default function Home() {
  const WALink = `https://wa.me/918637704621?text=I%20Want%20to%20learn%20coding%20and%20be%20successful%20Coder`

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "CodeHub",
    url: "https://codehubindia.in",
    logo: "https://codehubindia.in/logo.png", // replace with your logo URL
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-8637704621",
      contactType: "Customer Support",
      areaServed: "IN",
    },
    sameAs: [
      "https://www.instagram.com/codehub_nashik",
      "https://www.linkedin.com/company/codehubindia",
      "https://www.youtube.com/@codehub",
    ],
    description:
      "CodeHub is Nashik’s leading coding institute offering beginner to advanced training in programming with job-oriented support.",
  }

  return (
    <div className="max-w-screen bg-primary-ch h-auto overflow-hidden">
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {process.env.ENVIRONMENT != "DEV" && <ScreenLoaderNew />}
      <Header />
      <HeroSection />
      <FixedSection WALink={WALink} />
      <PinSection WALink={WALink} />
      <PinInitialSection WALink={WALink} />
      <PinBackground />
      <SpaceSection />
      <SliderSection />
      <BioSection WALink={WALink} />
      <ImagesSection WALink={WALink} />
      <EndSection WALink={WALink} />
    </div>
  )
}
