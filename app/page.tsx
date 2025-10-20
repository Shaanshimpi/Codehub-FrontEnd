"use client"

import { useState } from "react"
import Script from "next/script"
import NavigationPopup from "./components/NavigationPopup"
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

export default function Home() {
  const [showNavPopup, setShowNavPopup] = useState(true)
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
      {showNavPopup && (
        <NavigationPopup onClose={() => setShowNavPopup(false)} />
      )}
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
