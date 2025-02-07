"use client"

import { useEffect } from "react"
import Cover from "@/app/assets/robots/robot-4.jpg"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import SplitType from "split-type"
import { PoppinFont } from "../fonts"

export default function BioSection({WALink}: {WALink: string}) {
  /* Layout Transition */
  useEffect(() => {
    gsap.to("#bio-section-container", {
      scrollTrigger: {
        trigger: "#bio-section-container",
        start: "top top",
        endTrigger: "#images-section-container",
        end: "180px bottom",
        pin: true,
        pinSpacing: false,
        onLeaveBack: () => {
          gsap.to(".bio-section", {
            scale: 1,
          })
        },
        onEnter: () => {
          gsap.to(".bio-section", {
            scale: 0.5,
          })
        },
        onEnterBack: () => {
          gsap.to(".bio-section", {
            scale: 0.5,
          })
        },
      },
    })
  }, [])

  /* Page Transition */
  useEffect(() => {
    const bioText = new SplitType(".bio-text", {
      types: "lines",
      tagName: "span",
    })

    gsap.set(bioText.lines, {
      display: "inline-block",
    })

    const tl = gsap.timeline({
      defaults: {
        stagger: 0.2,
      },
    })

    tl.fromTo(
      bioText.lines,
      {
        xPercent: 30,
        opacity: 0,
      },
      {
        xPercent: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: "#bio-section-container",
          start: "40% bottom",
          end: "top top",
          scrub: true,
        },
      }
    )

    tl.fromTo(
      ".bio-image",
      {
        height: 0,
      },
      {
        height: 405,
        scrollTrigger: {
          trigger: "#bio-section-container",
          start: "40% bottom",
          end: "top top",
          scrub: true,
        },
      }
    )
  }, [])
  // calll to action
  useEffect(() => {
    const ctaTl = gsap.timeline();

    setInterval(() => {
      for (let i = 0; i <2; i++) {
        setTimeout(() => {
          ctaTl.to(".call-to-action-bio", {
            x:100,
            ease: "power2.inOut",
            duration: .3,
            color:`#000`,
            background:`#da7a40`
          })
          ctaTl.to(".call-to-action-bio", {
            x:0,
            ease: "power2.inOut",
            duration: .3,
            color:`#fff`,
            background:`#002f6d`
          })
        },i*2000)

      }
    }, 5000)
  },[])

  return (
    <section
      id="bio-section-container"
      className="relative z-20 h-screen w-screen bg-white overflow-hidden"
    >
      <div className="bio-section overflow-hidden h-full w-full origin-center bg-black p-5">
        <div
          className={cn(
            PoppinFont.className,
            "flex h-full w-full flex-col items-center gap-16 lg:flex-row"
          )}
        >
          <div className="relative flex h-full flex-1 flex-col items-center justify-center">
            <div className="absolute left-0 top-0 flex w-full items-center gap-28">
              <div className="text-xs font-semibold tracking-widest text-white">
                0001/
              </div>
              <div className="text-xs tracking-widest text-white">Project</div>
            </div>

            <div className="mt-10 w-full md:w-3/4 lg:mt-0">
              <Image
                unoptimized
                alt="cover"
                src={Cover}
                className="bio-image mx-auto h-full rounded-md object-cover shadow-sm"
              />
            </div>
          </div>

          <div className="relative flex h-full w-full flex-col items-center justify-center lg:w-[40%] lg:pr-20">
            <div className="absolute left-0 top-0 flex w-full items-center gap-28">
              <div className="text-xs font-semibold tracking-widest text-white">
                0001/
              </div>
              <div className="text-xs tracking-widest text-white">Project</div>
            </div>

            <div className="mt-10 flex w-full flex-col items-start gap-10 lg:mt-0">
              <div className="bio-text overflow-hidden text-2xl md:text-4xl text-white">
              Crafting Careers,
              <br />
              One Code at a Time
              </div>
              <div className="bio-text hidden w-full overflow-hidden text-white md:block lg:w-[80%]">
              At CodeHub, we’re not just teaching code—we’re shaping the future of tech professionals. 
              Through cutting-edge training, hands-on projects, and industry-aligned preparation,
               we empower you to innovate, excel, and lead in the ever-evolving world of technology. 
               Together, we’re building a future driven by creativity, skill, and passion.
              </div>
              <a href={WALink}>
                <button className="call-to-action-bio items-center gap-4 rounded-full bg-primary-ch text-white px-5 py-2 md:flex">
                  <div className="text-lg ">Make my Career</div>
                  <ArrowRight size={20} />
                </button>

              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
