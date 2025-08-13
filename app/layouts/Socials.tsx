"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useTheme } from "../contexts/theme-context"
import { reckoner } from "../fonts"

export default function Socials() {
  const [whiteBg, setWhiteBg] = useState(false)
  const { toggleTheme, theme } = useTheme()
  const pathname = usePathname()

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
    { href: "/", label: "Home.", showMd: false },
    { href: "/Learn", label: "Learn.", showMd: true },
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
        "text-md relative z-[500] w-full bg-black px-1 font-medium tracking-wider text-white mix-blend-difference before:absolute before:left-0 before:top-0 before:z-[-1] before:h-full before:w-0 before:bg-white before:transition-all before:content-[''] hover:text-black hover:before:w-full md:block md:text-lg",
        { "before:bg-primary-ch hover:text-white": whiteBg },
        { hidden: !showMd }
      )}
    >
      {label}
    </a>
  )

  return (
    <div
      id="socials-section"
      className="fixed top-0 z-[100] flex h-[10vh] w-screen items-center justify-end bg-transparent pr-1 md:flex md:pr-10"
      style={{ translate: "none" }}
    >
      <div
        className={cn(
          reckoner.className,
          "absolute right-3 top-3 flex flex-col-reverse items-center gap-2 transition-all md:flex-row"
        )}
      >
        {links.map((link, index) => (
          <LinkItem key={index} {...link} />
        ))}
        {pathname != "/" && (
          <button
            onClick={toggleTheme}
            className={cn(
              reckoner.className,
              "text-md z-[5000] rounded-full border border-gray-300 bg-white px-2 py-1 shadow dark:bg-black dark:text-white md:text-lg"
            )}
          >
            {theme === "dark" ? "🌞" : "🌙"}
          </button>
        )}
      </div>
    </div>
  )
}
