"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import ScrollTrigger from "gsap/dist/ScrollTrigger"
import { RoughNotation } from "react-rough-notation"
import { PoppinFont, reckoner } from "../fonts"

export default function PinInitialSection({WALink}: {WALink: string}) {
  const [notation, setNotation] = useState(false)

  useEffect(() => {
    gsap.fromTo(
      "#pin-initial-section",
      {
        scale: 0.5,
        rotate: 20,
      },
      {
        scrollTrigger: {
          trigger: "#pin-initial-section",
          start: "10% bottom",
          end: "bottom bottom",
          scrub: true,
        },

        scale: 1,
        rotate: 0,
        ease: "slow(0.7,0.7,false)",
      }
    )

    ScrollTrigger.create({
      trigger: "#pin-initial-section",
      start: "80% bottom",
      scrub: true,
      onEnter: () => {
        setNotation(true)
      },
      onLeaveBack: () => {
        setNotation(false)
      },
    })
  }, [])

  return (
    <section
      id="pin-initial-section"
      style={{
        transform: "50% 0%",
      }}
      className="relative h-[120vh] w-screen bg-black"
    >
      <section className="flex h-full w-full flex-col items-start gap-48 px-4 py-4 pt-[80%] md:pt-4">
        <div className="flex w-full items-center gap-4">
          <div className="flex w-full flex-col items-start ">
            <p
              className={cn(
                reckoner.className,
                "text-7xl font-bold leading-[1] tracking-wide text-[#da7a40] sm:text-9xl"
              )}
            >
              YOU ARE <span className="title-stroke">VALU</span>ABLE
              <span className="title-stroke">.</span>
            </p>
            <p
              className={cn(
                reckoner.className,
                "text-lg font-large tracking-tight text-gray-400"
              )}
            >
              CODEHUB IS MORE THAN JUST AN INSTITUTE.
            </p>
          </div>
        </div>

        <div className="flex h-full w-full flex-col items-center justify-between gap-10 md:flex-row md:items-start overflow-hidden">
          <div className="flex h-full flex-col items-end justify-between gap-10">
            <div className="flex w-full flex-col items-start gap-2">
              <div className="">
                <div
                  className={cn(
                    reckoner.className,
                    "pin-initial-text text-lg font-medium text-gray-400"
                  )}
                >
                  By <span className="text-white">Shaan</span> Shimpi.
                </div>
              </div>
              <div className="overflow-hidden">
                <div
                  className={cn(
                    reckoner.className,
                    "pin-initial-text text-[88px] font-extrabold leading-[1] text-white"
                  )}
                >
                  CODING.
                </div>
              </div>
              <div
                className={cn(
                  PoppinFont.className,
                  "pin-initial-description-2 max-w-[340px] text-xs font-medium text-gray-300"
                )}
              >
                Remember that progress isn&apos;t always linear, and setbacks
                are just part of the process.
              </div>
              <div className="overflow-hidden">
                <div
                  className={cn(
                    reckoner.className,
                    "pin-initial-text w-fit bg-primary-ch px-8 py-1 text-lg font-medium text-white"
                  )}
                >
                  Cool Right?
                </div>
              </div>
            </div>

            <div
              className={cn(
                reckoner.className,
                "pin-initial-description text-lg tracking-widest text-white lg:w-[400px]"
              )}
            >
              At CodeHub, we believe in empowering the next generation of tech enthusiasts with the skills they need to thrive in today’s competitive landscape. Whether you’re a complete beginner or an experienced developer looking to level up, our hands-on, industry-focused courses are designed to turn your ambitions into achievements.
            </div>
          </div>

          <div className="flex h-full flex-col items-start justify-between gap-10 pr-[5%]">
            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center justify-between gap-16 overflow-hidden">
                <div
                  className={cn(
                    reckoner.className,
                    "pin-initial-text text-7xl font-bold italic text-primary-ch"
                  )}
                >
                  Practical.
                </div>
                <div
                  className={cn(
                    reckoner.className,
                    "pin-initial-text text-7xl font-bold text-white"
                  )}
                >
                  O.1
                </div>
              </div>
              <div
                className={cn(
                  PoppinFont.className,
                  "pin-initial-description-2 max-w-[340px] text-xs font-medium text-gray-300"
                )}
              >
                Welcome to Motion Scape, where stunning animations and smooth
                transitions come to life! Powered by GSAP (GreenSock Animation
                Platform), we specialize in creating dynamic, engaging visuals
                that elevate user experience.
              </div>
            </div>

            <div
              className={
                "relative flex flex-col items-start gap-6 overflow-hidden text-white"
              }
            >
              <a href={WALink}>
                <RoughNotation color="#da7a40" type="highlight" show={notation}>
                  <div
                    className={cn(
                      reckoner.className,
                      "px-4 py-1 text-3xl font-medium tracking-widest"
                    )}
                  >
                    Start Coding
                  </div>
                </RoughNotation>

              </a>

              <div
                className={cn(
                  PoppinFont.className,
                  "pin-initial-description-2 max-w-[340px] text-xs font-medium text-gray-300"
                )}
              >
                Surround yourself with people who push you to grow, inspire you
                to reach higher, and remind you of your potential. Remember that
                progress isn&apos;t always linear, and setbacks are just part of
                the process.
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  )
}
