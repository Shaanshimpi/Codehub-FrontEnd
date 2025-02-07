"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import ScrollTrigger from "gsap/dist/ScrollTrigger"
import SplitType from "split-type"
import gif1 from "@/app/assets/gif/gif1.gif"
import gif2 from "@/app/assets/gif/gif2.gif"
import gif3 from "@/app/assets/gif/gif3.gif"


gsap.registerPlugin(ScrollTrigger)

const images = [
  gif1.src,
  gif2.src,
  gif3.src,
]

export default function PinSection({WALink}: {WALink: string}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  /* Box Scale Animation */
  useEffect(() => {
    gsap.to(".pinned", {
      scrollTrigger: {
        trigger: ".pinned",
        start: "top top",
        endTrigger: "#space-section",
        end: "bottom top",
        pin: true,
        pinSpacing: false,
      },
    })

    gsap.to(".pin-box", {
      scaleX: 0.9,
      scaleY: 1.7,
      ease: "power3.out",
      duration: 5,
      immediateRender: false,
      scrollTrigger: {
        // markers: true,
        trigger: "#pin-content-section-1",
        start: "32% bottom",
        end: "80% bottom",
        scrub: true,
      },
    })

    let mm = gsap.matchMedia()

    /* Desktop */
    mm.add("(min-width: 800px)", () => {
      gsap.to(".pin-box",{
        scaleX: 1.4,
        scaleY: 1.2,
        ease: "power3.out",
        duration: 5,

        immediateRender: false,
        scrollTrigger: {
          // markers: true,
          trigger: "#pin-content-section-2",
          start: "32% bottom",
          end: "80% bottom",
          scrub: true,
        },
      })
      
    gsap.to(".pin-box", {
      scaleX: 0.9,
      scaleY: 1.7,
      ease: "power3.out",
      duration: 5,
      immediateRender: false,
      scrollTrigger: {
        // markers: true,
        trigger: "#pin-content-section-1",
        start: "32% bottom",
        end: "80% bottom",
        scrub: true,
      },
    })
    })

    mm.add("(min-width: 800px)", () => {
      gsap.to(".pin-box", {
        opacity:1,
        scrollTrigger: {
          // markers: true,
          trigger: "#space-section",
          start: "20% bottom",
          end: "bottom bottom",
          scrub: true,
          immediateRender: false,

          onUpdate: (self) => {
            const scale = 1 + 10 * self.progress

            gsap.to(".pin-box", {
              scale,
              ease: "none",
            })
          },
        },
      })
    })

    /* Mobile */
    mm.add("(max-width: 799px)", () => {
      gsap.to(".pin-box", {
        scaleX: 1.8,
        scaleY: .7,
        ease: "none",
        duration: 5,
        immediateRender: false,
        scrollTrigger: {
          trigger: "#pin-content-section-2",
          start: "32% bottom",
          end: "80% bottom",
          scrub: true,
          // markers:true
        },
      })

      gsap.to(".pin-box", {
        scaleX: 0.9,
        scaleY: 1.7,
        opacity:0,
        ease: "power3.out",
        duration: 5,
        immediateRender: false,
        scrollTrigger: {
          // markers: true,
          trigger: "#pin-content-section-1",
          start: "32% bottom",
          end: "80% bottom",
          scrub: true,
        },
      })
    })

    mm.add("(max-width: 799px)", () => {
      gsap.to(".pin-box", {
        opacity:1,
        scrollTrigger: {
          trigger: "#space-section",
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
          immediateRender: false,
        // onUpdate: (self) => {
          //   const scale = 20 * self.progress

          //   gsap.to(".pin-box", {
          //     scale,
          //     ease: "none",
          //   })
          // },
        // markers:true
      },
        ease: "none",
        scaleX: 4,
        scaleY: 20,
      })
    })
  }, [])

  /* Box Slider Animation */
  useEffect(() => {
    gsap.to("#slider-1", {
      scrollTrigger: {
        trigger: "#pin-content-section-1",
        start: "30% bottom",
        end: "50% bottom",
        scrub: true,
        onLeave: () => {
          setActiveImageIndex(1)
        },
        onLeaveBack: () => {
          setActiveImageIndex(0)
        },
      },
      height: "100%",
    })

    gsap.to("#slider-1", {
      scrollTrigger: {
        trigger: "#pin-content-section-1",
        start: "70% bottom",
        end: "bottom bottom",
        scrub: true,
      },
      yPercent: -100,
    })

    gsap.to("#slider-2", {
      scrollTrigger: {
        trigger: "#pin-content-section-2",
        start: "20% bottom",
        end: "40% bottom",
        scrub: true,
        onLeave: () => {
          setActiveImageIndex(2)
        },
        onLeaveBack: () => {
          setActiveImageIndex(1)
        },
      },
      height: "100%",
    })

    gsap.to("#slider-2", {
      scrollTrigger: {
        trigger: "#pin-content-section-2",
        start: "70% bottom",
        end: "bottom bottom",
        scrub: true,
      },
      yPercent: -100,
    })

    gsap.to("#slider-3", {
      scrollTrigger: {
        trigger: "#space-section",
        start: "5% bottom",
        end: "25% bottom",
        scrub: true,
      },
      height: "100%",
    })
  }, [])

  /* Content Animation 1 */
  useEffect(() => {
    /* Content Intro */
    const pinContentDescripton1 = new SplitType("#pin-content-description-1", {
      types: "lines",
      tagName: "span",
      lineClass: "translate-y-[100%]",
    })

    if (!pinContentDescripton1.lines) return
    ;[...pinContentDescripton1.lines]?.forEach((line) => {
      const wrapper = document.createElement("div")
      wrapper.classList.add("overflow-hidden")
      line.parentNode?.insertBefore(wrapper, line)
      wrapper.appendChild(line)
    })

    gsap.to(["#pin-content-text-1"], {
      scrollTrigger: {
        trigger: "#pin-content-section-1",
        start: "70% bottom",
        end: "bottom bottom",
        scrub: true,
      },
      yPercent: -100,
    })

    gsap.to(pinContentDescripton1.lines, {
      scrollTrigger: {
        trigger: "#pin-content-section-1",
        start: "70% bottom",
        end: "bottom bottom",
        scrub: true,
      },
      yPercent: -100,
    })
    /* Content Intro */

    /* Content Leave */
    gsap.to("#content-section", {
      scrollTrigger: {
        trigger: "#pin-content-section-2",
        start: "32% bottom",
        end: "70% bottom",
        scrub: true,
      },
      ease: "none",
      yPercent: -300,
    })
    /* Content Leave */
  }, [])

  /* Content Animation 2 */
  useEffect(() => {
    /* Content Intro */
    const pinContentDescripton2 = new SplitType("#pin-content-description-2", {
      types: "lines",
      tagName: "span",
      lineClass: "translate-y-[100%]",
    })

    if (!pinContentDescripton2.lines) return
    ;[...pinContentDescripton2.lines]?.forEach((line) => {
      const wrapper = document.createElement("div")
      wrapper.classList.add("overflow-hidden")
      line.parentNode?.insertBefore(wrapper, line)
      wrapper.appendChild(line)
    })

    gsap.to(["#pin-content-text-2"], {
      scrollTrigger: {
        trigger: "#pin-content-section-2",
        start: "70% bottom",
        end: "bottom bottom",
        scrub: true,
      },
      yPercent: -100,
    })

    gsap.to(pinContentDescripton2.lines, {
      scrollTrigger: {
        trigger: "#pin-content-section-2",
        start: "70% bottom",
        end: "bottom bottom",
        scrub: true,
      },
      yPercent: -100,
    })
    /* Content Intro */

    /* Content Leave */
    gsap.to("#content-section-2", {
      scrollTrigger: {
        trigger: "#space-section",
        start: "20% bottom",
        end: "80% bottom",
        scrub: true,
      },
      ease: "none",
      yPercent: -300,
    })
    
  }, [])
  
  /* call to action */
  useEffect(()=>{
    const ctaTl = gsap.timeline();

    setInterval(()=>{
      ctaTl.to('.call-to-action', {
        duration: .3,
        y: -60,
        scale:1.2,
        backgroundColor: `#002f6d`
      })
      
      ctaTl.to('.call-to-action', {
        duration: .3,
        delay:.5,
        y: 0,
        scale:1,
        backgroundColor: `#000`
      })

    },3000)
  },[])
  return (
    <section className="pinned absolute top-[100vh] z-20 h-screen w-screen md:top-[100vh]">
        <div className="call-to-action rounded-[20px] absolute bottom-2 z-20 text-white left-[50%] translate-x-[-50%] bg-primary-ch">
          <a href={WALink}>
            <h3 className="py-[5px] px-[15px] text-center text-xl">Learn Coding Now</h3>
          </a>
        </div>
      {/* Box */}
      <div className="pin-box absolute left-1/2 top-[10%] z-10 h-[160px] w-[200px] -translate-x-1/2 scale-100 overflow-hidden border-[1px] border-white bg-white shadow-md md:top-1/2 md:h-[260px] md:w-[300px] md:-translate-y-1/2">
        <div className="pin-gif-wrapper absolute left-0 top-0 z-[5] h-full w-full object-cover">
          {images.map((src, index) => (
            <img
              key={index}
              alt={`pin-gif-${index + 1}`}
              className={cn(`pin-gif-${index + 1} h-full w-full`, {
                hidden: activeImageIndex !== index,
              })}
              src={src}
            />
          ))}
        </div>
        {/* Slider */}
        <div
          id="slider-1"
          className="absolute bottom-0 right-0 z-10 h-0 w-full bg-white"
        />
        <div
          id="slider-2"
          className="absolute bottom-0 right-0 z-10 h-0 w-full bg-white"
        />

        <div
          id="slider-3"
          className="absolute bottom-0 right-0 z-10 h-0 w-full bg-white"
        />

        {/* Slider */}
      </div>
      {/* Box */}

      {/* Content */}
      <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center md:mt-0">
        <div
          id="content-section"
          className="h-fit w-full max-w-[85%] md:max-w-[95%]"
        >
          <div className="flex w-full flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex w-full flex-col gap-1 md:w-[30%]">
              <div className="flex flex-col gap-1">
                <div className="overflow-hidden">
                  <div
                    id="pin-content-text-1"
                    className="translate-y-[100%] text-5xl font-medium leading-[1] tracking-wider text-white"
                  >
                    Basics of
                  </div>
                </div>
                <div className="overflow-hidden">
                  <div
                    id="pin-content-text-1"
                    className="translate-y-[100%] text-5xl font-medium leading-[1] text-primary-ch"
                  >
                    Programming
                  </div>
                </div>
              </div>

              <div
                id="pin-content-description-1"
                className="text-sm font-normal leading-[1.5] tracking-tight text-white"
              >
                The Fundamentals module equips you with the skills to write efficient, clean, and reliable code, giving you the confidence to tackle advanced topics and excel in your tech journey. 
              </div>
            </div>

            <div className="flex w-full flex-col gap-1 pr-[2%] md:w-[30%]">
              <div className="overflow-hidden">
                <div
                  id="pin-content-text-1"
                  className="translate-y-[100%] text-5xl font-medium tracking-wider text-white text-primary-ch"
                >
                  C/C++
                </div>
              </div>
              <div
                id="pin-content-description-1"
                className="pin-bg-description-2 text-sm font-normal leading-[1.5] tracking-tight text-white"
              >
                At CodeHub, we understand that a solid foundation in programming is the key to success. Our Fundamentals module focuses on essential programming that forms the basics of software development: C and C++.
              </div>
              <div className="overflow-hidden">
                <div
                  id="pin-content-text-1"
                  className="translate-y-[100%] text-sm font-medium uppercase tracking-tight text-indigo-300"
                >
                  keep scroll
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-0 top-0 mt-[10%] flex h-full w-full items-center justify-center md:mt-0">
        <div
          id="content-section-2"
          className="h-fit w-full max-w-[85%] md:max-w-[95%]"
        >
          <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
            <div className="flex w-full flex-col gap-2 md:w-[30%]">
              <div className="flex flex-col gap-1">
                <div className="overflow-hidden">
                  <div
                    id="pin-content-text-2"
                    className="translate-y-[100%] text-4xl font-medium leading-[1] tracking-wider text-white"
                  >
                    Turning Code into
                  </div>
                </div>
                <div className="overflow-hidden">
                  <div
                    id="pin-content-text-2"
                    className="translate-y-[100%] text-4xl font-medium leading-[1] text-primary-ch"
                  >
                    Products.
                  </div>
                </div>
              </div>

              <div
                id="pin-content-description-2"
                className="text-sm font-normal leading-[1.5] tracking-tight text-white"
              >
                  While C and C++ provide a strong foundation in programming and problem-solving, they focus on backend logic and systems-level development. While ideal for performance-critical applications like operating systems and real-time simulations, they lack the tools needed to create modern, interactive user interfaces essential for today&apos;s web and mobile applications.              </div>
              </div>

            <div className="flex w-full flex-col gap-2 pr-[2%] md:w-[30%]">
              <div className="overflow-hidden">
                <div
                  id="pin-content-text-2"
                  className="translate-y-[100%] text-4xl font-medium tracking-wider text-white text-primary-ch"
                >
                  Conventional Full Stack
                </div>
              </div>
              <div
                id="pin-content-description-2"
                className="text-sm font-normal leading-[1.5] tracking-tight text-white"
              >
                Conventional Full-Stack Development bridges the gap between backend logic and frontend design, using technologies like HTML, CSS, JavaScript, Java, and SQL. It empowers developers to create complete, user-focused products, from dynamic interfaces to efficient server-side logic, turning ideas into functional, engaging applications.
              </div>
              <div className="overflow-hidden">
                <div
                  id="pin-content-text-2"
                  className="translate-y-[100%] text-sm font-medium uppercase tracking-tight text-indigo-300"
                >
                  KEEP DOING
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Content */}
    </section>
  )
}
