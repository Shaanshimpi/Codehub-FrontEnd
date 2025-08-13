"use client"

import { useState } from "react"
import { useEffect } from "react"
import logo from "@/app/assets/logo.png"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import mountLenis from "../utils/mountLenis"
import Socials from "./Socials"

export default function Header() {
  const [whiteBg, setWhiteBg] = useState(false)
  mountLenis()

  const links = [
    { href: "/", label: "Home.", showMd: true },
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
  useEffect(() => {
    gsap.to(".header-icon", {
      display: "block",
      delay: 2.6,
    })
    gsap.to(`.logo`, {
      x: `-30vw`,
      scale: 0.6,
      duration: 1.5,
      ease: "power3.inOut",
      scrollTrigger: {
        trigger: `.pinned`,
        start: "top center",
        end: "top top",
        // markers: true,
        scrub: true,
      },
    })
  }, [])

  return (
    <div>
      <div className="logo pointer-events-none fixed z-[200] flex h-[10vh] w-screen items-center justify-center mix-blend-difference md:h-[12vh]">
        <a href="/">
          <img
            src={logo.src}
            alt="codehub logo"
            className="pointer-events-auto z-[500] w-[20vw] min-w-[200px] max-w-[300px]"
          />
        </a>
      </div>
      {/* <div
        className={cn(
          reckoner.className,
          "flex items-center gap-3 transition-all"
        )}
      >
        {links.map((link, index) => (
          <LinkItem key={index} {...link} />
        ))}
      </div> */}
      <Socials />
    </div>
  )
}
