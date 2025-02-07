"use client"

import { useEffect } from "react"
import Cover from "@/app/assets/bg-2-hd.png"
import Star from "@/app/assets/star.svg"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import ScrollTrigger from "gsap/dist/ScrollTrigger"
import Image from "next/image"
import { SyneFont } from "../fonts"

export default function HeroSection() {
  /* Mouse Hover */
  useEffect(() => {
    function parallax(e: MouseEvent) {
      const object = document.querySelector(".hero-image")
      const loader = document.querySelector(".loader-screen") as HTMLElement

      if (!object || (loader && loader.style.display !== "none")) return

      const moving_value: number =
        Number(object.getAttribute("data-value")) || 0
      const x = (e.clientX * moving_value) / 170

      const y = (e.clientY * moving_value) / 170

      gsap.set(object, {
        x,
        y,
      })
    }

    document.addEventListener("mousemove", parallax)

    return () => {
      document.removeEventListener("mousemove", parallax)
    }
  }, [])

  /* Hero Transition */
  useEffect(() => {
    const heroTimeline = gsap.timeline({
      defaults: {
        stagger: 0.15,
        delay: 2,
      },
    })

    heroTimeline.fromTo(
      ".hero-title",
      {
        scale: 0,
      },
      {
        scale: 1,
      }
    )

    heroTimeline.fromTo(
      ".awward-name",
      {
        x: 100,
      },
      {
        x: 0,
      },
      "-=2.5"
    )

    heroTimeline.fromTo(
      ".bar",
      {
        y: 100,
      },
      {
        y: 0,
      },
      "-=2.2"
    )
  }, [])

  /* Scroll Trigger */
  useEffect(() => {
    gsap.to("#hero-section", {
      scrollTrigger: {
        trigger: "#hero-section",
        start: "top top",
        endTrigger: "#pin-initial-section",
        end: "bottom bottom",
        pin: true,
        pinSpacing: false,
      },
    })

    gsap.to(".hero-image", {
      scrollTrigger: {
        trigger: "#pin-initial-section",
        start: "5% bottom",
        end: "bottom top",
        scrub: true,
      },
      ease: "none",
      xPercent: -30,
    })

    gsap.to(".hero-title", {
      scrollTrigger: {
        trigger: "#pin-initial-section",
        start: "20% bottom",
        end: "bottom bottom",
        scrub: true,
      },
      ease: "none",
      yPercent: -200,
    })

    gsap.to(".bar-section", {
      scrollTrigger: {
        trigger: "#pin-initial-section",
        start: "10% bottom",
        end: "bottom bottom",
        scrub: true,
      },
      ease: "power1.inOut",
      xPercent: -40,
    })

    ScrollTrigger.create({
      trigger: "#pin-initial-section",
      start: "top bottom",
      end: () => "+=100",
      scrub: true,

      onEnter: () => {
        gsap.to(".header-icon", {
          scale: 0.3,
          rotate: 0,
          ease: "none",
          duration: 0.25,
        })
      },

      onEnterBack: () => {
        gsap.to(".header-icon", {
          scale: 0.5,
          rotate: 0,
          ease: "none",
          duration: 0.25,
        })
      },
    })
  }, [])

  return (
    <section id="hero-section" className="relative h-screen w-screen overflow-hidden">
      <Image
        unoptimized
        alt="cover-image"
        src={Cover}
        priority
        data-value={-4}
        className="hero-image absolute bottom-0 left-0 h-[600px] w-[500px] object-cover lg:-left-[25%] lg:h-full lg:w-full lg:object-contain"
      />

      <div className="absolute left-1/2 top-[48%] w-fit -translate-x-1/2 -translate-y-1/2 px-10 mix-blend-difference md:top-[50%] lg:left-[30%] lg:top-[26%] lg:translate-x-0 lg:translate-y-0">
        <div className="hero-title ml-[5%] text-[3rem] font-extrabold leading-[1] tracking-tighter text-white md:ml-[5%] md:text-[5rem] lg:text-[7.2rem]">
          CO
          <span className="title-stroke">DE</span>
        </div>
        <div className="hero-title ml-[10%] text-[3rem] font-extrabold leading-[1] tracking-tighter text-white md:ml-[20%] md:text-[5rem] lg:text-[7.2rem]">
          W<span className="title-stroke">IT</span>H
        </div>
        <div className="hero-title text-[3rem] font-extrabold leading-[1] tracking-tighter text-white md:text-[5rem] lg:text-[7.2rem]">
          CONFIDENCE
        </div>
      </div>

      <div className="bar absolute bottom-0 inline-flex h-auto w-full flex-nowrap items-center overflow-hidden bg-gray-900 px-20 py-1">
        <div className="bar-section flex w-full shrink-0 content-between items-center gap-14">
          <div
            className={cn(
              SyneFont.className,
              "flex-none text-[7vw] md:text-[2vw] font-bold text-white"
            )}
          >
            CODE YOUR WAY
          </div>

          <Image
            unoptimized
            src={Star}
            className="h-7 w-7 object-contain"
            alt="star-icon"
          />

          <div
            className={cn(
              SyneFont.className,
              "flex-none text-[7vw] md:text-[2vw] font-bold text-white"
            )}
          >
            CREATE VISION
          </div>

          <Image
            unoptimized
            src={Star}
            className="h-7 w-7 object-contain"
            alt="star-icon"
          />

          <div
            className={cn(
              SyneFont.className,
              "flex-none text-[7vw] md:text-[2vw] font-bold text-white"
            )}
          >
            BE MOTIVATED
          </div>

          <Image
            unoptimized
            src={Star}
            className="h-7 w-7 object-contain"
            alt="star-icon"
          />

          {/* <div
            className={cn(
              SyneFont.className,
              "flex-none text-[20px] font-extrabold text-white"
            )}
          >
            ALIGN WITH PASSION
          </div> */}
        </div>
      </div>
    </section>
  )
}
