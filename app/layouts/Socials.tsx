"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { reckoner } from "../fonts"

export default function Socials() {
  const [whiteBg, setWhiteBg] = useState(false)

  // useEffect(() => {
  //   ScrollTrigger.create({
  //     trigger: "#slider-section",
  //     start: "top bottom",
  //     end: "bottom top",
  //     onEnterBack: () => {
  //       setWhiteBg(false)
  //     },
  //     onEnter: () => {
  //       setWhiteBg(true)
  //     },
  //     onLeave: () => {
  //       setWhiteBg(false)
  //     },
  //     onLeaveBack: () => {
  //       setWhiteBg(false)
  //     },
  //   })

  //   // gsap.from("#socials-section", {
  //   //   delay: 2.6,
  //   //   yPercent: -100,
  //   //   ease: "circ",
  //   // })
  // }, [])
  const links = [
    { href: "/", label: "Home.", showMd: true },
    { href: "/Exercise", label: "Exercise.", showMd: true },
    {
      href: "https://www.instagram.com/code.hub.india/",
      label: "Instagram.",
      showMd: false,
    },
    {
      href: "https://www.youtube.com/@CodeHubIndia-uo5ig",
      label: "YouTube.",
      showMd: false,
    },
  ]

  const LinkItem = ({ href, label, showMd }) => (
    <a
      href={href}
      aria-label={label.toLowerCase()}
      target={href.startsWith("http") ? "_blank" : "_self"}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className={cn(
        "relative bg-black px-2 text-lg font-medium tracking-wider text-white mix-blend-difference before:absolute before:left-0 before:top-0 before:z-[-1] before:h-full before:w-0 before:bg-white before:transition-all before:content-[''] hover:text-black hover:before:w-full md:block",
        { "before:bg-primary-ch hover:text-white": whiteBg },
        { hidden: label != "Exercise." }
      )}
    >
      {label}
    </a>
  )

  return (
    <div
      id="socials-section"
      className="fixed top-0 z-50 flex h-[15vh] w-screen items-center justify-end bg-transparent pr-3 md:flex md:pr-10"
      style={{ translate: "none" }}
    >
      <div
        className={cn(
          reckoner.className,
          "flex items-center gap-3 transition-all"
        )}
      >
        {links.map((link, index) => (
          <LinkItem key={index} {...link} />
        ))}
      </div>
    </div>
  )
}
