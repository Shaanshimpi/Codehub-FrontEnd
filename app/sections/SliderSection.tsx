/* eslint-disable react/self-closing-comp */
"use client"

import { useEffect, useState } from "react"
import MERN from "@/app/assets/slider/MERN.png"
import Challenge from "@/app/assets/slider/challenge.webp"
import Project from "@/app/assets/slider/Project.jpg"
import Interview from "@/app/assets/slider/Interview.png"
import Industry from "@/app/assets/slider/Industry.jpg"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import ScrollTrigger from "gsap/dist/ScrollTrigger"
import { ArrowDown } from "lucide-react"
import Image from "next/image"
import SplitType from "split-type"
import { AfacadFont, SyneFont, reckoner } from "../fonts"

export default function SliderSection() {
  const [sliderTitle, setSliderTitle] = useState(`BUT MODERN <br /> <span class="text-primary-ch"> MERN</span> STACK.`);
  const [sliderDesc, setSliderDesc] = useState(`The Modern <span class="bg-primary-ch text-white px-1">MERN</span> Stack combines <span className="text-primary-ch">MongoDB, Express.js, React.js,</span> and <span className="text-primary-ch">Node.js</span> to bridge backend logic with frontend design, enabling developers to create scalable, user-focused applications with dynamic interfaces and efficient processing.`);
  /* Scroll Animation */
  useEffect(() => {
    let mm = gsap.matchMedia()

    gsap.to(".header-icon #inner-1,#inner-2,#path-1,#path-2", {
      scrollTrigger: {
        trigger: "#slider-cards-section",
        start: "top bottom",
        end: "bottom top",
      },
      fill: "black",
    })

    gsap.to("#slider-cards-section", {
      scrollTrigger: {
        trigger: "#slider-section",
        start: "top top",
        endTrigger: "#slider-space",
        end: "bottom top",
        pin: true,
        pinSpacing: false,
      },
    })

    // desktop slider
    mm.add("(min-width: 800px)", () => {
      gsap.to(".slider-cards-wrapper", {
        scrollTrigger: {
          trigger: "#slider-section",
          start: "top top",
          end: () => `+=2000`,
          scrub: true,
        },
        xPercent: -80,
      })
    })
    
    // mobile slider
    mm.add("(max-width: 800px)", () => {
      gsap.to(".slider-cards-wrapper", {
        scrollTrigger: {
          trigger: "#slider-section",
          start: "top top",
          end: () => `+=2000`,
          scrub: true,
        },
        xPercent: -100,
      })
    })

    ScrollTrigger.create({
      trigger: "#slider-section",
      start: "top bottom",
      end: () => "bottom top",
      scrub: true,
      onEnter: () => {
        gsap.to(".header-icon #inner-1,#inner-2,#path-1,#path-2", {
          fill: "black",
        })
      },
      onLeave: () => {
        gsap.to(".header-icon #inner-1,#inner-2,#path-1,#path-2", {
          fill: "white",
        })
      },
      onLeaveBack: () => {
        gsap.to(".header-icon #inner-1,#inner-2,#path-1,#path-2", {
          fill: "white",
        })
      },
    })
  }, [])

  /* Grid Animation */
  useEffect(() => {
    gsap.to(".grid-section", {
      scrollTrigger: {
        trigger: "#slider-cards-section",
        start: "center bottom",
        endTrigger: "#slider-section",
        end: "bottom top",
      },

      opacity: 1,
    })

    const tl = gsap.timeline()
    tl.to(".scaler", {
      duration: 1,
      scale: 1,

      ease: "power1.inOut",
      stagger: {
        amount: 1.5,
        grid: [12, 8],
        ease: "none",
        from: "center",
      },

      scrollTrigger: {
        trigger: "#slider-space",
        start: "60% bottom",
        end: "bottom bottom",
        scrub: true,
      },
    })

    gsap.to(".grid-section", {
      scrollTrigger: {
        trigger: "#slider-space",
        start: "80% bottom",
        end: "bottom bottom",
        scrub: true,
      },
      zIndex: 3,
    })

    gsap.to(".scaler-wrapper", {
      scrollTrigger: {
        trigger: "#slider-space",
        start: "80% bottom",
        end: "bottom bottom",
        scrub: true,
      },
      border: "transparent",
    })
  }, [])

  /* Transition */
  useEffect(() => {
    new SplitType(".slider-title", {
      types: "chars",
      tagName: "span",
    })

    const tl = gsap.timeline()

    tl.from(".slider-title .char", {
      opacity: 0.3,
      duration: 0.5,
      ease: "power1.out",
      stagger: 0.1,

      scrollTrigger: {
        trigger: "#slider-cards-section",
        start: "center bottom",
        endTrigger: "#slider-section",
        end: "bottom top",
        scrub: true,
      },
    })

    tl.fromTo(
      ".slider-description,.bullet-title",
      {
        y: 100,
      },
      {
        y: 0,
        scrollTrigger: {
          trigger: "#slider-cards-section",
          start: "center bottom",
          endTrigger: "#slider-section",
          end: "bottom top",
          scrub: true,
        },
      }
    )

    gsap.to(".slider-circle-svg", {
      scrollTrigger: {
        trigger: "#slider-section",
        start: "top top",
        end: () => `+=1200`,
        scrub: true,
      },
      rotate: 270,
    })

    gsap.to(`.slider-title`,{
      duration: 2,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: ".slider-title",
        start: "bottom+=400 20%",
        end: "bottom+=400 top",
        onLeaveBack:() => {

                  setSliderTitle(`BUT MODERN <br /> <span class="text-primary-ch"> MERN</span> STACK.`);
                  setSliderDesc(`The Modern <span class="bg-primary-ch text-white px-1">MERN</span> Stack combines <span className="text-primary-ch">MongoDB, Express.js, React.js,</span> and <span className="text-primary-ch">Node.js</span> to bridge backend logic with frontend design, enabling developers to create scalable, user-focused applications with dynamic interfaces and efficient processing.`)
                },
        onEnter:() => {

                  setSliderTitle(`Train Your Mind with <br /> <span class="text-primary-ch">Daily Challenges</span>`);
                  setSliderDesc(`At CodeHub, we believe consistent practice is the key to mastery. Our Daily Challenges push you to apply concepts through real-world problems, reinforcing your learning and sharpening your problem-solving skills.`)
                },
        onEnterBack:() => {

                  setSliderTitle(`Train Your Mind with <br /> <span class="text-primary-ch">Daily Challenges</span>`);
                  setSliderDesc(`At CodeHub, we believe consistent practice is the key to mastery. Our Daily Challenges push you to apply concepts through real-world problems, reinforcing your learning and sharpening your problem-solving skills.`)
                },
        scrub: true,
      },
    })
    gsap.to(`.slider-title`,{
      duration: 2,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: ".slider-title",
        start: "bottom+=600 20%",
        end: "bottom+=600 top",
        onEnter:() => {

                  setSliderTitle(`Work on<br/> <span class="text-primary-ch">Live Projects</span>`);
                  setSliderDesc(`Gain real-world experience by working on live projects at CodeHub. Collaborate with peers and mentors to build fully functional applications that address real-world problems. From planning and coding to deployment, you’ll learn the end-to-end development process, preparing you for the challenges of the tech industry while adding impressive projects to your portfolio.`)
                },
        onEnterBack:() => {

                  setSliderTitle(`Work on<br/> <span class="text-primary-ch">Live Projects</span>`);
                  setSliderDesc(`Gain real-world experience by working on live projects at CodeHub. Collaborate with peers and mentors to build fully functional applications that address real-world problems. From planning and coding to deployment, you’ll learn the end-to-end development process, preparing you for the challenges of the tech industry while adding impressive projects to your portfolio.`)
                },
        scrub: true,
      },
    })
    gsap.to(`.slider-title`,{
      duration: 2,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: ".slider-title",
        start: "bottom+=800 20%",
        end: "bottom+=800 top",
        onEnter:() => {

                  setSliderTitle(`Ace Your Interviews<br/> with <span class="text-primary-ch">Mock Sessions</span>`);
                  setSliderDesc(`Prepare for success with mock interviews at CodeHub. Simulate real-world interview scenarios with expert feedback to identify strengths and areas for improvement. Our sessions cover technical, behavioral, and industry-specific questions, ensuring you build confidence, refine your approach, and excel in your actual interviews.`)
                },
        onEnterBack:() => {

                  setSliderTitle(`Ace Your Interviews<br/> with <span class="text-primary-ch">Mock Sessions</span>`);
                  setSliderDesc(`Prepare for success with mock interviews at CodeHub. Simulate real-world interview scenarios with expert feedback to identify strengths and areas for improvement. Our sessions cover technical, behavioral, and industry-specific questions, ensuring you build confidence, refine your approach, and excel in your actual interviews.`)
                },
        scrub: true,
      },
    })
    gsap.to(`.slider-title`,{
      duration: 2,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: ".slider-title",
        start: "bottom+=1000 20%",
        end: "bottom+=1000 top",
        onEnter:() => {

                  setSliderTitle(`Tailored Training for<br/> <span class="text-primary-ch">Industry-Specific</span> Roles`);
                  setSliderDesc(`At CodeHub, we go beyond general training with industry-specific preparation designed to meet the unique demands of various fields. Whether it's e-commerce, fintech, healthcare, or any niche sector, our curriculum focuses on relevant technologies, frameworks, and problem-solving techniques.`)
                },
        onEnterBack:() => {

                  setSliderTitle(`Tailored Training for<br/> <span class="text-primary-ch">Industry-Specific</span> Roles`);
                  setSliderDesc(`At CodeHub, we go beyond general training with industry-specific preparation designed to meet the unique demands of various fields. Whether it's e-commerce, fintech, healthcare, or any niche sector, our curriculum focuses on relevant technologies, frameworks, and problem-solving techniques.`)
                },
        scrub: true,
      },
    })
  }, [])

  // return (
  //   <>
  //     <section
  //       id="slider-section"
  //       className="relative z-20 max-h-screen w-screen bg-white"
  //     >
  //       <div
  //         id="slider-cards-section"
  //         className="absolute top-0 z-[2] flex h-full w-full flex-col items-start gap-[6%] px-5 py-10 md:gap-[15%] md:px-10 md:py-10 lg:gap-[6%]"
  //       >
  //         <div className="absolute bottom-10 right-2 md:bottom-4 md:right-4">
  //           <ScrollSvg />
  //         </div>

  //         <div className="flex flex-col max-h-[38vh] h-[38vh] items-start ">
  //           <div
  //             className={cn(
  //               reckoner.className,
  //               "slider-title text-4xl  md:text-6xl font-bold md:leading-[0.7] lg:text-7xl"
  //             )}
  //             dangerouslySetInnerHTML={{ __html: sliderTitle }}
  //           >
              
  //           </div>

  //           <div
  //             className={cn(
  //               AfacadFont.className,
  //               "slider-description text-md md:w-[60%] md:text-xl font-semibold leading-[1] tracking-normal text-black"
  //             )}
  //             dangerouslySetInnerHTML={{ __html: sliderDesc }}
  //           >
              
  //           </div>
  //         </div>

  //         <div className="slider-cards-wrapper ml-[65%] flex flex-nowrap items-center gap-28 overflow-visible">
  //           {cards.map((card) => (
  //             <div
  //               key={card.id}
  //               className={cn(
  //                 "card relative h-[50vh] w-[300px] shrink-0 rounded-md bg-black shadow-sm"
  //               )}
  //             >
  //               <div
  //                 className={cn(
  //                   reckoner.className,
  //                   "absolute bottom-[2%] left-[5%] right-[5%] z-[1] whitespace-pre-wrap break-words text-6xl font-extrabold uppercase text-white mix-blend-difference bg-[#0f4c9ca6]"
  //                 )}
  //               >
  //                 {card.name.split(" ").join("\n")}
  //               </div>
  //               <Image
  //                 className="absolute left-1/2 top-3 h-[92%] w-[92%] -translate-x-1/2 object-cover"
  //                 src={card.image}
  //                 alt={card.name}
  //               />

  //               <div className="absolute bottom-[5px] left-1/2 flex w-[92%] -translate-x-1/2 items-center justify-between">
  //                 <div
  //                   className={cn(SyneFont.className, "text-[10px] text-white")}
  //                 >
  //                   CodeHub
  //                 </div>
  //                 <div
  //                   className={cn(SyneFont.className, "text-[10px] text-white")}
  //                 >
  //                   India
  //                 </div>
  //               </div>
  //             </div>
  //           ))}
  //         </div>

  //         <div
  //           className={cn(
  //             AfacadFont.className,
  //             "absolute bottom-4 left-4 flex items-center gap-24 md:left-10"
  //           )}
  //         >
  //           <div className="bullet-title text-xs font-semibold tracking-tight">
  //             Determine.
  //           </div>
  //           <div className="bullet-title text-xs font-semibold tracking-tight">
  //             Design.
  //           </div>
  //           <div className="bullet-title text-xs font-semibold tracking-tight">
  //             Develop.
  //           </div>
  //         </div>
  //       </div>

  //       <div className="grid-section absolute top-0 z-[1] grid h-full w-full grid-cols-4 grid-rows-8 opacity-0 md:grid-cols-6 lg:grid-cols-12">
  //         {[...new Array(100)].map((_, index) => (
  //           <div
  //             key={index}
  //             className="scaler-wrapper col-span-1 h-full w-full border-[0.1px] border-gray-100"
  //           >
  //             <div className="scaler h-full w-full origin-center scale-0 bg-black" />
  //           </div>
  //         ))}
  //       </div>
  //     </section>

  //     <section id="slider-space" className="relative z-[-1] h-[280vh] w-full" />
  //   </>
  // )
  return (
    <>
      <section
        id="slider-section"
        className="relative z-20 h-screen w-screen overflow-hidden bg-white"
      >
        <div
          id="slider-cards-section"
          className="absolute top-0 z-[2] flex h-full w-full flex-col items-start gap-[6%] px-5 py-10 md:gap-[15%] md:px-10 md:py-10 lg:gap-[6%]"
          // className="absolute top-0 z-[2] flex h-full w-full flex-col items-start gap-[6%] px-5 py-32 md:gap-[15%] md:px-10 md:py-10 lg:gap-[6%]"
        >
          <div className="absolute bottom-10 right-2 md:bottom-4 md:right-4">
            <ScrollSvg />
          </div>

          <div className="flex flex-col items-start h-[30vh] pt-5">
            <div
              className={cn(
                reckoner.className,
                "slider-title text-4xl  md:text-6xl font-bold  lg:text-[7vh]"
                // "slider-title text-8xl font-bold leading-[0.7] lg:text-9xl"
              )}
              dangerouslySetInnerHTML={{ __html: sliderTitle }}
            
            >
            </div>

            <div
              className={cn(
                AfacadFont.className,
                "slider-description text-md md:w-[60%] md:text-[3vh] font-semibold leading-[1] tracking-normal text-black"
                // "slider-description w-[60%] text-xs font-semibold leading-[1] tracking-normal text-black"
              )}
              dangerouslySetInnerHTML={{ __html: sliderDesc }}
            >
            </div>
          </div>

          <div className="slider-cards-wrapper ml-[65%] flex flex-nowrap items-center gap-28 overflow-visible">
            {cards.map((card) => (
              <div
                key={card.id}
                className={cn(
                  "card relative h-[50vh] w-[250px] md:h-[55vh] md:w-[280px] shrink-0 rounded-md bg-black shadow-sm"
                )}
              >
                <div
                  className={cn(
                    reckoner.className,
                    "absolute bottom-[2%] left-[5%] z-[1] whitespace-pre-wrap break-words text-6xl font-extrabold uppercase text-white mix-blend-difference"
                  )}
                >
                  {card.name.split(" ").join("\n")}
                </div>
                <Image
                  unoptimized
                  className="absolute left-1/2 top-3 h-[92%] w-[92%] -translate-x-1/2 object-cover"
                  // className="absolute left-1/2 top-3 h-[92%] w-[92%] -translate-x-1/2"
                  src={card.image}
                  alt={card.name}
                />

                <div className="absolute bottom-[5px] left-1/2 flex w-[92%] -translate-x-1/2 items-center justify-between">
                  <div
                    className={cn(SyneFont.className, "text-[10px] text-white")}
                  >
                    CodeHub
                  </div>
                  <div
                    className={cn(SyneFont.className, "text-[10px] text-white")}
                  >
                    India
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className={cn(
              AfacadFont.className,
              "absolute bottom-4 left-4 flex items-center gap-24 md:left-10"
            )}
          >
            <div className="bullet-title text-xs font-semibold tracking-tight">
              Determine.
            </div>
            <div className="bullet-title text-xs font-semibold tracking-tight">
              Design.
            </div>
            <div className="bullet-title text-xs font-semibold tracking-tight">
              Develop.
            </div>
          </div>
        </div>

        <div className="grid-section absolute top-0 z-[1] grid h-full w-full grid-cols-4 grid-rows-8 opacity-0 md:grid-cols-6 lg:grid-cols-12">
          {[...new Array(100)].map((_, index) => (
            <div
              key={index}
              className="scaler-wrapper col-span-1 h-full w-full border-[0.1px] border-gray-100"
            >
              <div className="scaler h-full w-full origin-center scale-0 bg-black" />
            </div>
          ))}
        </div>
      </section>

      <section id="slider-space" className="relative z-[-1] h-[280vh] w-full" />
    </>
  )
}

const cards = [
  {
    id: 1,
    name: "MERN STACK",
    image: MERN,
  },
  {
    id: 2,
    name: "Daily Challenges",
    image: Challenge,
  },
  {
    id: 3,
    name: "Live Projects",
    image: Project,
  },
  {
    id: 4,
    name: "Mock Interview",
    image: Interview,
  },
  {
    id: 5,
    name: "Industry Preparation",
    image: Industry,
  },
]

const ScrollSvg = () => {
  return (
    <div className="relative h-[100px] w-[100px] md:h-[130px] md:w-[130px]">
      <svg
        width="192"
        height="192"
        viewBox="0 0 192 192"
        fill="none"
        className="slider-circle-svg absolute h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M130.603 37.0719C130.285 37.6096 130.201 38.1499 130.368 38.687C130.527 39.2234 130.909 39.6755 131.499 40.0418C132.082 40.4004 132.615 40.5614 133.11 40.5332C133.597 40.5044 133.97 40.2785 134.226 39.8627C134.576 39.2925 134.202 38.4778 133.107 37.4045C133.035 37.3402 132.99 37.2929 132.964 37.2618C132.084 36.3885 131.568 35.709 131.412 35.2157C131.255 34.7223 131.343 34.2039 131.676 33.6605C132.078 33.003 132.651 32.6265 133.395 32.531C134.139 32.4355 134.917 32.6356 135.728 33.1385C136.567 33.6513 137.096 34.268 137.316 34.9815C137.543 35.6958 137.426 36.4251 136.987 37.1644L136.008 36.559C136.274 36.0444 136.338 35.5592 136.191 35.1096C136.044 34.66 135.7 34.2615 135.156 33.9284C134.653 33.6208 134.182 33.4803 133.745 33.5072C133.307 33.534 132.981 33.7289 132.767 34.0848C132.416 34.655 132.784 35.4619 133.852 36.5182C134.008 36.6695 134.131 36.7889 134.216 36.8687C134.236 36.885 134.268 36.9168 134.313 36.9712C135.012 37.6622 135.428 38.2032 135.56 38.5872C135.666 38.8759 135.693 39.1708 135.654 39.4805C135.609 39.7823 135.5 40.0848 135.321 40.3801C134.885 41.0912 134.273 41.4994 133.493 41.5984C132.713 41.6973 131.873 41.4766 130.982 40.9229C130.062 40.3592 129.481 39.6944 129.246 38.9223C129.01 38.1572 129.136 37.3362 129.624 36.4665L130.617 37.0733L130.603 37.0719Z"
          fill="#3730a3"
        />
        <path
          d="M142.817 45.3383C142.123 46.1301 141.304 46.5528 140.378 46.6156C139.445 46.6706 138.557 46.3665 137.707 45.6816C136.724 44.8977 136.221 43.9629 136.182 42.8687C136.151 41.7752 136.592 40.6584 137.507 39.5043C138.356 38.4432 139.323 37.8359 140.409 37.6754C141.494 37.5148 142.524 37.8332 143.513 38.6248C144.297 39.2532 144.788 39.9658 144.971 40.7611C145.161 41.5572 145.018 42.3336 144.543 43.0765L143.614 42.3336C143.88 41.819 143.946 41.3055 143.812 40.8002C143.678 40.2949 143.347 39.8337 142.82 39.4096C142.115 38.8463 141.379 38.6504 140.606 38.8213C139.833 38.9922 139.096 39.516 138.387 40.3917C137.725 41.2224 137.392 42.0438 137.394 42.8635C137.397 43.6833 137.734 44.366 138.407 44.8975C138.973 45.3541 139.581 45.5512 140.221 45.4951C140.861 45.4389 141.419 45.1393 141.901 44.5968L142.818 45.3312L142.817 45.3383Z"
          fill="#3730a3"
        />
        <path
          d="M150.235 45.0994C150.629 45.5028 150.897 45.815 151.053 46.0375C151.201 46.2592 151.314 46.4845 151.377 46.7047C151.493 47.1084 151.488 47.5069 151.369 47.9011C151.251 48.2953 151.022 48.6568 150.674 48.9921C150.342 49.3147 149.979 49.5201 149.6 49.6027C149.214 49.6847 148.819 49.6445 148.408 49.4816C148.582 49.7987 148.639 50.0823 148.577 50.3397C148.522 50.5979 148.311 50.9256 147.956 51.3314L147.007 52.3895C146.8 52.6107 146.666 52.8037 146.601 52.9539C146.536 53.1041 146.528 53.2529 146.564 53.3849L146.39 53.5525L145.416 52.5485C145.466 52.3398 145.683 52.0199 146.085 51.576L146.109 51.55L146.872 50.7081C147.258 50.277 147.443 49.9253 147.421 49.6522C147.399 49.3792 147.087 48.9343 146.494 48.3182L145.133 46.9115L142.469 49.4914L141.637 48.6301L147.859 42.599L150.259 45.0804L150.235 45.0994ZM145.823 46.2261L147.261 47.712C147.778 48.2419 148.233 48.5375 148.611 48.5973C148.997 48.6579 149.385 48.4906 149.78 48.1103C150.151 47.756 150.309 47.3943 150.259 47.0401C150.21 46.6859 149.914 46.2283 149.366 45.6596L147.927 44.1737L145.816 46.2184L145.823 46.2261Z"
          fill="#3730a3"
        />
        <path
          d="M153.707 50.4131C154.8 50.5312 155.737 51.1252 156.528 52.1818C157.311 53.2448 157.602 54.3076 157.4 55.3846C157.198 56.4615 156.516 57.4255 155.36 58.2773C154.212 59.1298 153.091 59.4935 151.998 59.3824C150.904 59.2714 149.966 58.6773 149.183 57.6144C148.4 56.5514 148.11 55.4815 148.312 54.4046C148.515 53.3206 149.197 52.3566 150.346 51.5041C151.494 50.6516 152.615 50.2879 153.707 50.406L153.707 50.4131ZM149.459 54.6921C149.264 55.4847 149.449 56.2589 150.001 57.0061C150.553 57.7463 151.232 58.1431 152.047 58.1903C152.862 58.2374 153.713 57.9319 154.607 57.2744C155.508 56.6105 156.052 55.8819 156.239 55.0956C156.426 54.3093 156.248 53.5359 155.697 52.7886C155.145 52.0414 154.459 51.6368 153.644 51.5897C152.83 51.5355 151.979 51.8481 151.077 52.5119C150.184 53.1694 149.646 53.8987 149.452 54.6914L149.459 54.6921Z"
          fill="#3730a3"
        />
        <path
          d="M160.017 57.7107L160.621 58.7768L154.034 62.5048L156.216 66.3607L155.263 66.8982L152.477 61.9761L160.017 57.7036L160.017 57.7107Z"
          fill="#3730a3"
        />
        <path
          d="M163.498 64.1227L163.991 65.2416L157.053 68.2854L158.836 72.3431L157.829 72.7825L155.554 67.5987L163.492 64.1149L163.498 64.1227Z"
          fill="#3730a3"
        />
        <path
          d="M166.968 76.5721L166.253 73.8556L167.271 73.5884L169.002 80.1992L167.984 80.4664L167.269 77.7499L159.896 79.6735L159.587 78.5019L166.96 76.5784L166.968 76.5721Z"
          fill="#3730a3"
        />
        <path
          d="M168.51 82.9237C169.408 83.5635 169.936 84.5365 170.103 85.8433C170.269 87.15 170.003 88.2275 169.298 89.061C168.593 89.9015 167.529 90.4064 166.1 90.589C164.677 90.7652 163.524 90.5412 162.626 89.9084C161.728 89.2756 161.2 88.3027 161.033 86.9959C160.866 85.6891 161.14 84.6123 161.845 83.7718C162.551 82.9313 163.615 82.4194 165.037 82.2431C166.459 82.0669 167.612 82.2909 168.51 82.9307L168.51 82.9237ZM162.711 84.5795C162.151 85.1783 161.938 85.9405 162.051 86.8642C162.165 87.7807 162.574 88.4565 163.256 88.8964C163.946 89.3369 164.836 89.4844 165.941 89.3471C167.052 89.2106 167.881 88.8387 168.433 88.2463C168.985 87.6538 169.205 86.8923 169.085 85.9679C168.965 85.0436 168.564 84.3615 167.882 83.9216C167.199 83.4818 166.302 83.3336 165.19 83.4702C164.093 83.6081 163.264 83.98 162.704 84.5788L162.711 84.5795Z"
          fill="#3730a3"
        />
        <path
          d="M170.471 96.1761L170.07 102.513L169 102.447L169.322 97.3136L166.737 97.1508L166.44 101.895L165.427 101.835L165.724 97.0907L162.827 96.9105L162.494 102.15L161.41 102.083L161.815 95.6462L170.463 96.1895L170.471 96.1761Z"
          fill="#3730a3"
        />
        <path
          d="M165.218 106.155L169.906 104.073L169.636 105.535L166.098 107.036L168.868 109.733L168.613 111.118L164.994 107.515L160.052 109.714L160.322 108.252L164.185 106.635L161.137 103.802L161.405 102.355L165.224 106.163L165.218 106.155Z"
          fill="#3730a3"
        />
        <path
          d="M168.13 112.92L167.164 116.05C167.006 116.554 166.867 116.932 166.734 117.19C166.609 117.441 166.452 117.653 166.271 117.827C165.977 118.117 165.624 118.295 165.203 118.374C164.782 118.445 164.337 118.407 163.853 118.258C163.39 118.118 163.013 117.895 162.715 117.601C162.417 117.307 162.225 116.953 162.126 116.529C162.064 116.288 162.056 116.016 162.086 115.727C162.115 115.438 162.234 114.972 162.433 114.344L162.974 112.596L159.484 111.515L159.844 110.354L168.124 112.912L168.13 112.92ZM163.38 114.846C163.169 115.516 163.133 116.019 163.263 116.352C163.393 116.686 163.71 116.932 164.214 117.09C164.705 117.24 165.099 117.216 165.397 117.025C165.695 116.827 165.936 116.417 166.128 115.795L166.753 113.778L163.975 112.919L163.371 114.86L163.38 114.846Z"
          fill="#3730a3"
        />
        <path
          d="M165.439 121.006L164.947 122.132L158.006 119.097L156.225 123.156L155.222 122.719L157.494 117.541L165.439 121.013L165.439 121.006Z"
          fill="#3730a3"
        />
        <path
          d="M161.389 127.501C161.71 128.552 161.534 129.653 160.863 130.789C160.192 131.925 159.323 132.614 158.252 132.847C157.18 133.081 156.029 132.835 154.785 132.103C153.554 131.38 152.775 130.488 152.453 129.444C152.132 128.392 152.308 127.298 152.979 126.162C153.65 125.026 154.519 124.337 155.597 124.105C156.676 123.872 157.827 124.117 159.058 124.841C160.289 125.564 161.068 126.456 161.389 127.508L161.389 127.501ZM155.785 125.271C154.981 125.403 154.341 125.873 153.867 126.68C153.401 127.48 153.3 128.261 153.579 129.03C153.857 129.8 154.466 130.467 155.429 131.028C156.39 131.596 157.273 131.814 158.071 131.682C158.868 131.549 159.508 131.079 159.981 130.279C160.455 129.472 160.556 128.691 160.285 127.923C160.013 127.154 159.397 126.486 158.435 125.925C157.479 125.365 156.596 125.147 155.791 125.286L155.785 125.271Z"
          fill="#3730a3"
        />
        <path
          d="M154.956 138.97C154.612 139.412 154.339 139.719 154.135 139.898C153.932 140.077 153.732 140.214 153.516 140.306C153.129 140.473 152.731 140.525 152.332 140.456C151.926 140.386 151.538 140.205 151.162 139.91C150.799 139.623 150.547 139.292 150.414 138.922C150.28 138.552 150.264 138.151 150.372 137.72C150.079 137.933 149.806 138.026 149.544 138.007C149.283 137.987 148.929 137.823 148.475 137.52L147.295 136.716C147.041 136.541 146.839 136.428 146.679 136.39C146.52 136.346 146.376 136.359 146.249 136.411L146.058 136.263L146.924 135.168C147.136 135.19 147.489 135.368 147.982 135.703L148.008 135.727L148.941 136.371C149.421 136.697 149.792 136.828 150.061 136.776C150.33 136.725 150.724 136.352 151.256 135.679L152.467 134.142L149.551 131.836L150.295 130.893L157.099 136.265L154.956 138.977L154.956 138.97ZM153.254 134.742L151.971 136.365C151.512 136.945 151.277 137.434 151.273 137.826C151.269 138.218 151.482 138.581 151.911 138.917C152.313 139.236 152.687 139.345 153.039 139.252C153.39 139.16 153.804 138.803 154.287 138.189L155.571 136.566L153.262 134.743L153.254 134.742Z"
          fill="#3730a3"
        />
        <path
          d="M151.376 143.223L146.86 147.681L146.104 146.92L149.764 143.301L147.942 141.456L144.559 144.797L143.848 144.076L147.231 140.735L145.188 138.668L141.456 142.358L140.693 141.589L145.28 137.06L151.383 143.224L151.376 143.223Z"
          fill="#3730a3"
        />
        <path
          d="M129.609 152.728C129.323 152.172 128.91 151.817 128.369 151.669C127.828 151.521 127.243 151.597 126.62 151.912C126.005 152.213 125.582 152.583 125.346 153.015C125.11 153.447 125.101 153.881 125.321 154.317C125.616 154.917 126.51 155.029 127.993 154.674C128.081 154.647 128.147 154.632 128.19 154.629C129.395 154.346 130.244 154.268 130.75 154.405C131.25 154.534 131.642 154.887 131.926 155.458C132.27 156.148 132.286 156.834 131.974 157.515C131.663 158.196 131.079 158.75 130.224 159.169C129.345 159.607 128.542 159.725 127.813 159.537C127.084 159.342 126.527 158.865 126.141 158.099L127.169 157.59C127.461 158.09 127.843 158.4 128.302 158.51C128.768 158.629 129.282 158.546 129.853 158.262C130.386 157.995 130.753 157.676 130.956 157.291C131.159 156.905 131.169 156.528 130.986 156.153C130.691 155.553 129.812 155.436 128.343 155.785C128.132 155.835 127.964 155.875 127.854 155.907C127.831 155.918 127.787 155.928 127.715 155.935C126.759 156.159 126.082 156.225 125.685 156.135C125.385 156.069 125.114 155.935 124.884 155.74C124.647 155.545 124.452 155.29 124.298 154.982C123.925 154.232 123.906 153.503 124.236 152.788C124.565 152.074 125.202 151.483 126.141 151.015C127.109 150.536 127.978 150.396 128.756 150.604C129.533 150.811 130.155 151.351 130.637 152.227L129.594 152.741L129.609 152.728Z"
          fill="#3730a3"
        />
        <path
          d="M116.137 158.68C115.833 157.672 115.905 156.753 116.351 155.936C116.798 155.119 117.528 154.531 118.556 154.165C119.738 153.75 120.801 153.816 121.75 154.368C122.692 154.92 123.406 155.89 123.893 157.272C124.34 158.551 124.345 159.698 123.902 160.694C123.458 161.696 122.644 162.405 121.455 162.818C120.502 163.149 119.643 163.183 118.864 162.919C118.093 162.655 117.512 162.126 117.129 161.332L118.253 160.94C118.551 161.44 118.946 161.765 119.451 161.916C119.949 162.067 120.522 162.032 121.158 161.812C122.008 161.513 122.567 160.993 122.835 160.25C123.102 159.508 123.052 158.605 122.682 157.541C122.334 156.544 121.809 155.821 121.111 155.394C120.414 154.959 119.658 154.89 118.853 155.164C118.166 155.401 117.676 155.807 117.382 156.383C117.089 156.952 117.046 157.589 117.254 158.28L116.146 158.666L116.137 158.68Z"
          fill="#3730a3"
        />
        <path
          d="M112.378 165.095C111.832 165.211 111.419 165.276 111.154 165.292C110.888 165.308 110.642 165.275 110.413 165.217C110.004 165.097 109.67 164.885 109.401 164.579C109.133 164.274 108.944 163.884 108.85 163.412C108.754 162.953 108.767 162.541 108.904 162.177C109.041 161.813 109.28 161.489 109.635 161.225C109.274 161.203 108.999 161.097 108.818 160.914C108.63 160.731 108.459 160.379 108.305 159.857L107.91 158.485C107.833 158.192 107.741 157.976 107.648 157.838C107.548 157.7 107.435 157.617 107.303 157.582L107.256 157.349L108.625 157.061C108.774 157.211 108.93 157.569 109.1 158.142L109.11 158.179L109.42 159.272C109.584 159.831 109.785 160.172 110.022 160.295C110.266 160.42 110.803 160.396 111.641 160.21L113.551 159.799L112.771 156.171L113.944 155.919L115.757 164.391L112.377 165.11L112.378 165.095ZM113.767 160.754L111.742 161.183C111.014 161.337 110.527 161.565 110.276 161.86C110.025 162.156 109.955 162.569 110.071 163.108C110.177 163.611 110.393 163.939 110.72 164.086C111.047 164.233 111.597 164.225 112.362 164.061L114.387 163.632L113.774 160.755L113.767 160.754Z"
          fill="#3730a3"
        />
        <path
          d="M106.042 165.223C105.363 166.087 104.365 166.577 103.05 166.679C101.736 166.781 100.677 166.467 99.8679 165.729C99.0597 164.984 98.5999 163.897 98.4884 162.467C98.3692 161.044 98.6497 159.897 99.3291 159.032C100.009 158.168 100.999 157.684 102.314 157.575C103.629 157.467 104.695 157.789 105.503 158.533C106.311 159.278 106.778 160.366 106.89 161.788C107.009 163.212 106.722 164.358 106.042 165.223ZM104.65 159.352C104.075 158.766 103.323 158.519 102.396 158.589C101.476 158.666 100.776 159.037 100.309 159.702C99.8351 160.367 99.6454 161.252 99.7397 162.359C99.8333 163.473 100.161 164.319 100.729 164.897C101.298 165.475 102.049 165.729 102.976 165.652C103.904 165.576 104.604 165.205 105.077 164.548C105.551 163.883 105.741 162.997 105.647 161.883C105.56 160.777 105.225 159.931 104.65 159.352V159.352Z"
          fill="#3730a3"
        />
        <path
          d="M96.566 166.739L95.3447 166.694L95.6144 159.125L91.1896 158.968L91.2294 157.874L96.8826 158.078L96.5731 166.74L96.566 166.739Z"
          fill="#3730a3"
        />
        <path
          d="M89.3419 166.362L88.1249 166.203L89.1086 158.692L84.719 158.118L84.8583 157.028L90.4649 157.761L89.3426 166.355L89.3419 166.362Z"
          fill="#3730a3"
        />
        <path
          d="M76.9207 162.949L79.6221 163.722L79.3341 164.734L72.7668 162.862L73.0548 161.851L75.7562 162.624L77.8475 155.297L79.0113 155.629L76.92 162.956L76.9207 162.949Z"
          fill="#3730a3"
        />
        <path
          d="M70.6961 161.062C69.6948 161.516 68.5856 161.489 67.3691 160.973C66.1527 160.458 65.3615 159.686 64.9883 158.658C64.6152 157.63 64.7136 156.449 65.2689 155.123C65.8234 153.804 66.6044 152.922 67.5987 152.467C68.5929 152.012 69.7021 152.039 70.9185 152.554C72.135 153.07 72.9262 153.841 73.3057 154.878C73.6852 155.914 73.5874 157.087 73.0329 158.406C72.4784 159.725 71.6974 160.608 70.6961 161.062V161.062ZM72.167 155.211C71.9255 154.431 71.378 153.855 70.5234 153.498C69.6687 153.14 68.884 153.146 68.1545 153.521C67.425 153.896 66.8482 154.592 66.4169 155.61C65.9842 156.643 65.8855 157.545 66.1207 158.317C66.3559 159.089 66.9033 159.665 67.765 160.023C68.6268 160.381 69.4178 160.383 70.1395 160.015C70.8612 159.646 71.4458 158.943 71.8778 157.918C72.3091 156.9 72.4008 155.997 72.167 155.211V155.211Z"
          fill="#3730a3"
        />
        <path
          d="M58.2676 156.185L52.9453 152.723L53.5281 151.827L57.8473 154.639L59.2654 152.467L55.2803 149.874L55.8299 149.025L59.8149 151.618L61.4021 149.185L57.0025 146.322L57.5938 145.413L62.9958 148.933L58.2598 156.191L58.2676 156.185Z"
          fill="#3730a3"
        />
        <path
          d="M52.1942 146.731L51.7328 151.837L50.5883 150.894L50.9977 147.073L47.2936 148.172L46.2089 147.271L51.1194 145.874L51.6018 140.493L52.7463 141.436L52.2806 145.6L56.2447 144.328L57.3829 145.263L52.2013 146.732L52.1942 146.731Z"
          fill="#3730a3"
        />
        <path
          d="M44.8771 145.988L42.6008 143.626C42.233 143.247 41.9724 142.935 41.8105 142.705C41.6492 142.468 41.5374 142.236 41.4764 141.994C41.3598 141.598 41.3788 141.2 41.512 140.801C41.6524 140.402 41.8978 140.02 42.2681 139.673C42.6157 139.338 42.988 139.112 43.3918 138.996C43.7956 138.88 44.202 138.879 44.6104 138.999C44.853 139.066 45.0906 139.183 45.3296 139.357C45.5685 139.531 45.9138 139.851 46.3718 140.325L47.642 141.644L50.2729 139.111L51.1184 139.98L44.8764 145.995L44.8771 145.988ZM45.479 140.904C44.9957 140.399 44.5748 140.121 44.2164 140.07C43.8651 140.021 43.4923 140.182 43.1128 140.55C42.7418 140.904 42.5698 141.264 42.6052 141.617C42.6336 141.969 42.8765 142.386 43.3281 142.852L44.7984 144.377L46.8923 142.359L45.4867 140.898L45.479 140.904Z"
          fill="#3730a3"
        />
        <path
          d="M39.1088 139.761L38.3588 138.794L44.3397 134.157L41.6304 130.653L42.4972 129.979L45.9636 134.45L39.1159 139.762L39.1088 139.761Z"
          fill="#3730a3"
        />
        <path
          d="M35.3608 133.115C34.2857 132.891 33.399 132.217 32.7226 131.087C32.0392 129.955 31.8503 128.867 32.1497 127.814C32.4561 126.762 33.2174 125.863 34.4478 125.119C35.6703 124.381 36.823 124.12 37.8988 124.336C38.9746 124.552 39.8542 125.226 40.5376 126.357C41.2211 127.489 41.41 128.577 41.1028 129.636C40.7957 130.695 40.0344 131.594 38.8118 132.332C37.5892 133.07 36.4365 133.331 35.3615 133.108L35.3608 133.115ZM39.9878 129.245C40.2515 128.473 40.1461 127.686 39.664 126.889C39.1882 126.099 38.5432 125.642 37.7361 125.517C36.9291 125.392 36.0509 125.617 35.1017 126.19C34.1447 126.77 33.5347 127.442 33.2718 128.206C33.0088 128.971 33.1142 129.758 33.6034 130.556C34.0855 131.353 34.7298 131.818 35.5368 131.942C36.3439 132.067 37.222 131.843 38.179 131.263C39.1283 130.689 39.7312 130.017 40.0019 129.246L39.9878 129.245Z"
          fill="#3730a3"
        />
        <path
          d="M28.3213 122.04C28.0956 121.525 27.9564 121.141 27.8905 120.878C27.8246 120.614 27.8066 120.37 27.8232 120.137C27.8662 119.713 28.0036 119.343 28.2504 119.018C28.4971 118.694 28.844 118.437 29.2909 118.248C29.716 118.063 30.1289 117.998 30.5148 118.058C30.9014 118.112 31.261 118.291 31.5943 118.588C31.5448 118.234 31.5953 117.947 31.7389 117.727C31.8824 117.506 32.1989 117.267 32.6735 117.016L33.9376 116.361C34.208 116.224 34.4065 116.095 34.5189 115.971C34.6313 115.847 34.6943 115.718 34.7008 115.583L34.9247 115.485L35.4788 116.767C35.3614 116.94 35.0385 117.171 34.5117 117.445L34.4821 117.456L33.4743 117.974C32.9624 118.243 32.6649 118.505 32.5883 118.768C32.5117 119.031 32.6443 119.55 32.9846 120.34L33.7644 122.137L37.172 120.659L37.6516 121.762L29.7031 125.209L28.3284 122.041L28.3213 122.04ZM32.8465 122.542L32.0266 120.649C31.7319 119.971 31.413 119.532 31.0759 119.341C30.7389 119.15 30.317 119.164 29.81 119.384C29.3404 119.585 29.0627 119.863 28.9845 120.212C28.9064 120.56 29.0157 121.099 29.3279 121.814L30.1478 123.708L32.8472 122.535L32.8465 122.542Z"
          fill="#3730a3"
        />
        <path
          d="M26.2675 116.859L24.4844 110.764L25.513 110.462L26.957 115.404L29.4469 114.681L28.1138 110.12L29.0837 109.834L30.4168 114.395L33.2011 113.58L31.7311 108.542L32.7745 108.235L34.5836 114.426L26.2675 116.859V116.859Z"
          fill="#3730a3"
        />
        <path
          d="M28.3664 93.1618C28.9916 93.1825 29.5021 92.9992 29.8992 92.5977C30.2964 92.1962 30.5089 91.6477 30.5431 90.9599C30.5766 90.2792 30.4617 89.7259 30.2041 89.3149C29.9394 88.9033 29.57 88.6805 29.0803 88.6592C28.4135 88.6272 27.8776 89.3424 27.464 90.8182C27.4405 90.9085 27.427 90.9713 27.4086 91.0121C27.0667 92.2031 26.7169 92.98 26.3509 93.3561C25.9848 93.7323 25.4899 93.9029 24.8591 93.8674C24.0865 93.8245 23.4843 93.5069 23.04 92.8988C22.5957 92.2907 22.4035 91.5158 22.4508 90.5585C22.5003 89.5801 22.7844 88.818 23.3095 88.2798C23.8346 87.7417 24.523 87.4909 25.3817 87.5282L25.3221 88.6766C24.7434 88.6891 24.2901 88.8711 23.9629 89.2156C23.6357 89.5601 23.4571 90.055 23.4216 90.6856C23.3896 91.281 23.4905 91.7616 23.7313 92.1281C23.965 92.4939 24.2942 92.6912 24.7126 92.7123C25.3794 92.7444 25.9147 92.0363 26.3325 90.5893C26.3899 90.3742 26.4346 90.2149 26.4673 90.1042C26.4694 90.083 26.4815 90.0343 26.5091 89.973C26.7829 89.0317 27.0527 88.4106 27.3255 88.1105C27.527 87.8815 27.7791 87.7147 28.0616 87.6009C28.3503 87.4948 28.6616 87.448 29.0094 87.462C29.8463 87.5042 30.4956 87.8481 30.9583 88.4865C31.4209 89.125 31.6278 89.9655 31.5711 91.0144C31.5187 92.0923 31.2063 92.9228 30.6494 93.4934C30.0917 94.071 29.3081 94.3477 28.311 94.3391L28.3721 93.1766L28.3664 93.1618Z"
          fill="#3730a3"
        />
        <path
          d="M29.8111 78.5149C30.8346 78.7543 31.5952 79.2662 32.0922 80.0578C32.5892 80.8494 32.7373 81.7766 32.5431 82.8472C32.3182 84.0786 31.7354 84.9743 30.7891 85.5195C29.8427 86.0648 28.645 86.2068 27.196 85.9456C25.8592 85.703 24.8616 85.1385 24.2095 84.2599C23.5574 83.3813 23.3438 82.3263 23.5701 81.0808C23.7487 80.0941 24.1479 79.3223 24.7583 78.7857C25.3695 78.242 26.1207 78.0047 26.9984 78.0654L26.7871 79.234C26.2014 79.2458 25.7262 79.4327 25.3411 79.7855C24.9623 80.1461 24.7111 80.6551 24.5936 81.3201C24.4328 82.2017 24.6067 82.9462 25.123 83.5474C25.6393 84.1485 26.4467 84.5512 27.5598 84.7498C28.6025 84.9412 29.4896 84.8388 30.2064 84.4484C30.9303 84.0587 31.3638 83.44 31.521 82.5937C31.6505 81.88 31.5428 81.2562 31.1915 80.7146C30.8395 80.18 30.3122 79.8271 29.6019 79.6624L29.8118 78.5079L29.8111 78.5149Z"
          fill="#3730a3"
        />
        <path
          d="M26.1212 72.0553C26.2963 71.5244 26.443 71.1331 26.5668 70.8963C26.6906 70.6594 26.8391 70.4607 27.0052 70.2994C27.3126 70.01 27.6664 69.825 28.0666 69.7445C28.4668 69.664 28.8979 69.7006 29.3535 69.8467C29.795 69.9913 30.1433 70.2119 30.3983 70.5086C30.6533 70.8053 30.8079 71.1773 30.856 71.6169C31.0575 71.3167 31.2829 71.1329 31.5321 71.0656C31.7883 70.999 32.1778 71.0243 32.6998 71.1485L34.083 71.4957C34.3814 71.5758 34.6064 71.6058 34.7723 71.587C34.9381 71.5683 35.0716 71.5177 35.1677 71.4134L35.3955 71.4864L34.968 72.8184C34.7626 72.8759 34.3752 72.8294 33.7912 72.6846L33.7559 72.681L32.6584 72.3985C32.0948 72.2629 31.7024 72.2658 31.4665 72.4129C31.2377 72.5607 30.9893 73.0414 30.7284 73.8558L30.1258 75.7187L33.6593 76.8614L33.2941 78.0002L25.0472 75.3312L26.1078 72.0468L26.1212 72.0553ZM29.1863 75.4238L29.8208 73.4572C30.0491 72.7535 30.0965 72.2168 29.97 71.8476C29.8436 71.4785 29.5145 71.2099 28.9968 71.0433C28.5066 70.8866 28.1192 70.9114 27.8274 71.1169C27.5357 71.3225 27.2732 71.8018 27.0265 72.5463L26.392 74.5129L29.187 75.4167L29.1863 75.4238Z"
          fill="#3730a3"
        />
        <path
          d="M29.2201 66.4543C28.818 65.4301 28.9086 64.3276 29.4855 63.1391C30.0624 61.9506 30.8729 61.1991 31.9241 60.8854C32.9682 60.571 34.1428 60.7259 35.4332 61.3558C36.7172 61.9779 37.5669 62.8054 37.9697 63.8225C38.3718 64.8468 38.2812 65.9493 37.705 67.1307C37.1289 68.3122 36.3106 69.07 35.2587 69.3907C34.2068 69.7115 33.0392 69.5573 31.7482 68.9344C30.4642 68.3123 29.6215 67.4856 29.2194 66.4614L29.2201 66.4543ZM34.9838 68.2369C35.7738 68.0392 36.375 67.523 36.7813 66.6806C37.1862 65.8523 37.2163 65.0644 36.8858 64.3182C36.5482 63.5713 35.8838 62.9551 34.8846 62.4759C33.8791 61.989 32.9818 61.8409 32.1989 62.0393C31.409 62.237 30.8148 62.7539 30.4092 63.5892C30.0036 64.4245 29.9657 65.2188 30.2962 65.965C30.6268 66.7112 31.299 67.3211 32.2967 67.8143C33.2952 68.3005 34.1862 68.4409 34.9831 68.2439L34.9838 68.2369Z"
          fill="#3730a3"
        />
        <path
          d="M32.7828 57.4729L33.4505 56.4433L39.795 60.5794L42.211 56.8626L43.1267 57.4616L40.0437 62.201L32.7836 57.4659L32.7828 57.4729Z"
          fill="#3730a3"
        />
        <path
          d="M36.8641 51.4532L37.6312 50.4978L43.521 55.2505L46.3014 51.8058L47.1585 52.4915L43.6039 56.8908L36.8571 51.4524L36.8641 51.4532Z"
          fill="#3730a3"
        />
        <path
          d="M46.2921 42.642L44.2111 44.5329L43.5059 43.7558L48.5631 39.1599L49.2683 39.937L47.1873 41.8279L52.3102 47.4648L51.4149 48.2789L46.2921 42.642V42.642Z"
          fill="#3730a3"
        />
        <path
          d="M51.1913 38.3434C51.3376 37.2537 51.9522 36.3256 53.0273 35.5654C54.1024 34.8052 55.1846 34.5374 56.2519 34.7669C57.3191 34.9964 58.2672 35.6984 59.0959 36.8729C59.9183 38.0396 60.2595 39.1717 60.1203 40.2621C59.981 41.3525 59.3672 42.2736 58.285 43.0331C57.2028 43.7926 56.1277 44.0611 55.0534 43.8309C53.9791 43.6006 53.031 42.8986 52.2016 41.7312C51.3792 40.5645 51.0379 39.4324 51.1842 38.3427L51.1913 38.3434ZM55.3684 42.6942C56.1598 42.9028 56.932 42.7389 57.6992 42.204C58.4515 41.6747 58.8695 40.9974 58.9307 40.1841C58.999 39.3715 58.7159 38.509 58.0738 37.6029C57.4323 36.6897 56.7198 36.1256 55.9354 35.9177C55.1511 35.7098 54.3789 35.8737 53.6188 36.4093C52.8587 36.945 52.4407 37.6223 52.3724 38.4349C52.3041 39.2474 52.5872 40.11 53.2286 41.0231C53.8637 41.9285 54.5833 42.4933 55.3677 42.7012L55.3684 42.6942Z"
          fill="#3730a3"
        />
        <path
          d="M61.9204 30.3951L67.6796 27.7304L68.1297 28.7025L63.4552 30.8645L64.5425 33.2126L68.8584 31.2137L69.2853 32.1336L64.9695 34.1324L66.1919 36.765L70.9561 34.5623L71.4119 35.5492L65.563 38.2547L61.9204 30.3951Z"
          fill="#3730a3"
        />
        <path
          d="M73.1703 30.2567L69.0872 27.1555L70.4964 26.6857L73.52 29.0594L74.5537 25.3376L75.8958 24.8967L74.4715 29.7974L78.78 33.064L77.3709 33.5338L74.0929 30.9276L73.0707 34.957L71.6693 35.4204L73.171 30.2497L73.1703 30.2567Z"
          fill="#3730a3"
        />
        <path
          d="M77.6544 24.4548L80.8597 23.7755C81.3771 23.6641 81.7752 23.6048 82.061 23.5982C82.3475 23.5845 82.6078 23.6181 82.8427 23.6918C83.2377 23.8032 83.5711 24.0295 83.8373 24.3558C84.1035 24.6822 84.2892 25.1001 84.3957 25.5955C84.4973 26.069 84.4889 26.5028 84.3768 26.9048C84.2647 27.3067 84.0511 27.6556 83.7296 27.9436C83.5479 28.1176 83.3205 28.2513 83.0452 28.3658C82.7698 28.4804 82.3159 28.5982 81.6672 28.739L79.875 29.1199L80.631 32.6957L79.4437 32.9457L77.6459 24.4682L77.6544 24.4548ZM81.6484 27.661C82.3331 27.5167 82.7892 27.3065 83.0168 27.0303C83.2445 26.7542 83.3058 26.3613 83.1943 25.844C83.0886 25.3416 82.8731 25.0062 82.5615 24.8462C82.2428 24.6856 81.7665 24.6729 81.1326 24.808L79.0638 25.2464L79.6663 28.0868L81.6547 27.6688L81.6484 27.661Z"
          fill="#3730a3"
        />
        <path
          d="M85.9945 22.8626L87.2119 22.7368L87.9943 30.2632L92.4031 29.8059L92.5129 30.9002L86.8867 31.4833L85.9945 22.8626V22.8626Z"
          fill="#3730a3"
        />
        <path
          d="M93.5941 23.1872C94.3454 22.387 95.3832 21.9936 96.7013 21.9992C98.0187 22.0118 99.0462 22.4226 99.7838 23.2315C100.521 24.0404 100.884 25.1676 100.874 26.606C100.864 28.0374 100.48 29.1528 99.7355 29.9537C98.9842 30.754 97.9534 31.1481 96.6289 31.1347C95.3116 31.1221 94.277 30.7106 93.5402 29.8947C92.8033 29.0787 92.4324 27.9579 92.4494 26.5272C92.4593 25.0958 92.8435 23.9804 93.5948 23.1802L93.5941 23.1872ZM94.4635 29.1547C94.984 29.7847 95.7068 30.1076 96.6404 30.1097C97.5662 30.1182 98.2892 29.8068 98.8222 29.1911C99.3552 28.5754 99.6218 27.7045 99.6277 26.5935C99.6343 25.4753 99.3809 24.6016 98.8668 23.9793C98.3533 23.3499 97.6298 23.0341 96.697 23.0249C95.7641 23.0157 95.0348 23.3193 94.5081 23.9428C93.9815 24.5663 93.7085 25.4294 93.7019 26.5475C93.696 27.6586 93.9501 28.5253 94.4706 29.1554L94.4635 29.1547Z"
          fill="#3730a3"
        />
        <path
          d="M106.676 22.9687C107.231 23.0464 107.637 23.1232 107.893 23.1991C108.148 23.2821 108.373 23.3904 108.558 23.5303C108.896 23.7785 109.142 24.0956 109.289 24.474C109.436 24.8523 109.478 25.2841 109.415 25.7623C109.353 26.2264 109.193 26.6092 108.949 26.9122C108.704 27.2152 108.362 27.4298 107.935 27.5575C108.263 27.6977 108.486 27.8914 108.597 28.1307C108.708 28.37 108.754 28.7595 108.721 29.2977L108.626 30.7205C108.595 31.0238 108.614 31.2608 108.655 31.4147C108.696 31.5756 108.776 31.6978 108.89 31.7734L108.866 32.0132L107.474 31.822C107.386 31.6349 107.355 31.2398 107.394 30.6452L107.397 30.6099L107.476 29.4778C107.514 28.8972 107.439 28.5119 107.253 28.3078C107.066 28.1106 106.548 27.9511 105.697 27.8362L103.756 27.575L103.255 31.251L102.067 31.0876L103.238 22.5054L106.661 22.9743L106.676 22.9687ZM103.901 26.5777L105.946 26.8567C106.684 26.9602 107.217 26.9074 107.558 26.7139C107.898 26.5204 108.099 26.156 108.175 25.6151C108.241 25.1086 108.151 24.729 107.892 24.4746C107.632 24.2273 107.116 24.0466 106.342 23.9395L104.297 23.6605L103.901 26.5706L103.901 26.5777Z"
          fill="#3730a3"
        />
        <path
          d="M112.121 23.8633L118.269 25.4426L117.999 26.4841L113.012 25.2008L112.371 27.7155L116.977 28.8959L116.728 29.8754L112.122 28.695L111.402 31.5079L116.487 32.8154L116.216 33.8639L109.971 32.2605L112.121 23.8633V23.8633Z"
          fill="#3730a3"
        />
        <path
          d="M6.67578 95.6708C6.67578 46.5199 46.5204 6.67529 95.6713 6.67529V6.67529C144.822 6.67529 184.667 46.5199 184.667 95.6708V95.6708C184.667 144.822 144.822 184.666 95.6713 184.666V184.666C46.5204 184.666 6.67578 144.822 6.67578 95.6708V95.6708Z"
          stroke="#3730a3"
          strokeOpacity="0.3"
          strokeWidth="0.816508"
          strokeMiterlimit="10"
          strokeLinecap="square"
          strokeLinejoin="round"
        />
        <path
          d="M47.5518 94.6641C47.5518 67.5328 69.546 45.5386 96.6773 45.5386V45.5386C123.809 45.5386 145.803 67.5328 145.803 94.6641V94.6641C145.803 121.795 123.809 143.79 96.6773 143.79V143.79C69.546 143.79 47.5518 121.795 47.5518 94.6641V94.6641Z"
          stroke="#3730a3"
          strokeOpacity="0.3"
          strokeWidth="0.816508"
          strokeMiterlimit="10"
          strokeLinecap="square"
          strokeLinejoin="round"
        />
      </svg>

      <ArrowDown
        size={18}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  )
}
