"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import ScrollTrigger from "gsap/dist/ScrollTrigger"
import { reckoner } from "../fonts"


export default function Socials() {
  const [whiteBg, setWhiteBg] = useState(false)

  useEffect(() => {
    ScrollTrigger.create({
      trigger: "#slider-section",
      start: "top bottom",
      end: "bottom top",
      onEnterBack: () => {
        setWhiteBg(false)
      },
      onEnter: () => {
        setWhiteBg(true)
      },
      onLeave: () => {
        setWhiteBg(false)
      },
      onLeaveBack: () => {
        setWhiteBg(false)
      },
    })

    // gsap.from("#socials-section", {
    //   delay: 2.6,
    //   yPercent: -100,
    //   ease: "circ",
    // })
  }, [])
  return (
    <div
      id="socials-section"
      className="fixed top-0 z-50 flex w-screen justify-end bg-transparent h-[15vh] items-center pr-3 md:pr-10 md:flex"
      style={{translate:"none"}}
    >
      <div
        className={cn(
          reckoner.className,
          "flex items-center gap-3 transition-all"
        )}
      >
      <a
        href={`/Exercise`}
        aria-label="Exercise"
        className={cn(
          "relative md:block px-2 text-lg font-medium tracking-wider text-white before:absolute before:left-0 before:top-0 before:z-[-1] before:h-full before:w-0 before:bg-white before:transition-all before:content-[''] hover:text-black hover:before:w-full",
          { " before:bg-primary-ch hover:text-white": whiteBg }
        )}
      >
        Exercise.
      </a>
        <a
          href={`https://www.instagram.com/code.hub.india/`}
          aria-label="insta"
          target="_blank"
          rel="noreferrer"
          className={cn(
            "relative hidden md:block px-2 text-lg font-medium tracking-wider text-white before:absolute before:left-0 before:top-0 before:z-[-1] before:h-full before:w-0 before:bg-white before:transition-all before:content-[''] hover:text-black hover:before:w-full",
            { "text-black before:bg-primary-ch hover:text-white": whiteBg }
          )}
        >
          Instagram.
        </a>
        <a
          href={`https://www.youtube.com/@CodeHubIndia-uo5ig`}
          aria-label="youtube"
          target="_blank"
          rel="noreferrer"
          className={cn(
            "relative hidden md:block px-2 text-lg font-medium tracking-wider text-white before:absolute before:left-0 before:top-0 before:z-[-1] before:h-full before:w-0 before:bg-white before:transition-all before:content-[''] hover:text-black hover:before:w-full",
            { "text-black before:bg-primary-ch hover:text-white": whiteBg }
          )}
        >
          YouTube.
        </a>
        {/* <a
          href={PORTFOLIO_LINK}
          aria-label="github acc"
          target="_blank"
          rel="noreferrer"
          className={cn(
            "relative cursor-pointer bg-primary-ch px-2 text-lg font-medium tracking-wider text-white transition-all hover:bg-primary-ch"
          )}
        >
          Portfolio.
        </a> */}
      </div>
    </div>
  )
}
