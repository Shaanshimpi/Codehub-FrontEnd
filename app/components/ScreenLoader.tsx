"use client"

import { useEffect } from "react"
import { disableScroll, enableScroll } from "@/lib/utils"
import gsap from "gsap"

export default function ScreenLoader() {
  useEffect(() => {
    disableScroll()

    gsap.to(".loader-screen", {
      height: 0,
      duration: 0.6,
      delay: 2,

      onComplete: () => {
        enableScroll()
        gsap.set(".loader-screen", {
          display: "none",
        })
      },
    })
  }, [])

  useEffect(() => {
    const timeline = gsap.timeline({
      defaults: {
        duration: 1.5,
      },
    })

    timeline.fromTo(".screen-loader-icon", { rotate: 360 }, { rotate: 0 })

    timeline.fromTo(
      "#loader-path-1",
      {
        x: -130,
        y: -140,
        ease: "power1.inOut",
      },
      {
        x: 0,
        y: 0,
      },
      "<"
    )

    timeline.fromTo(
      "#loader-path-2",
      {
        x: 130,
        y: -140,
        ease: "power1.inOut",
      },
      {
        x: 0,
        y: 0,
      },
      "<"
    )

    timeline.fromTo(
      "#loader-inner-1",
      {
        x: 60,
        y: -124,
        ease: "power1.inOut",
      },
      {
        x: 0,
        y: 0,
        duration: 1.2,
      },
      "<"
    )

    timeline.fromTo(
      "#loader-inner-2",
      {
        x: -60,
        y: -124,
        ease: "power1.inOut",
      },
      {
        x: 0,
        y: 0,
        duration: 1.2,
      },
      "<"
    )

    timeline.to(
      ".screen-loader-icon",
      {
        opacity: 0.1,
        duration: 0.3,
      },
      "-=0.2"
    )

    timeline.to(".screen-loader-icon", {
      opacity: 1,
      duration: 0.1,
    })

    timeline.fromTo(
      ".screen-loader-icon",
      {
        rotate: 180,
        scale: 1,
      },
      {
        scale: 0.5,
        rotate: 0,
        y: 60,
        duration: 0.5,
      },
      "+=0.4"
    )
  }, [])

  return (
    <div className="loader-screen fixed z-50 flex h-screen w-screen items-center justify-center bg-black">
      <svg
        width="150"
        height="150"
        className="screen-loader-icon overflow-visible"
        viewBox="0 0 52 66"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          id="loader-inner-1"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M29.5145 19.1441C28.848 18.7441 28 19.2242 28 20.0015V53.5805C28 53.9395 27.8075 54.271 27.4957 54.449L26 55.3026V65.6652L36.4957 59.6751C36.8075 59.4972 37 59.1657 37 58.8066V57.0644V57L37 24.2015C37 23.8503 36.8157 23.5248 36.5145 23.344L29.5145 19.1441Z"
          fill="white"
        />
        <path
          id="loader-inner-2"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M22.4855 19.1441C23.152 18.7441 24 19.2242 24 20.0015V53.5805C24 53.9395 24.1925 54.271 24.5043 54.449L26 55.3026V65.6652L15.5043 59.6751C15.1925 59.4972 15 59.1657 15 58.8066V57.0644V57L15 24.2015C15 23.8503 15.1843 23.5248 15.4855 23.344L22.4855 19.1441Z"
          fill="white"
        />
        <path
          id="loader-path-1"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M26 0V12.6159L11.488 21.2651C11.1854 21.4455 11 21.7718 11 22.1241V56.0542L10.9999 56.0685C10.9936 56.5202 10.4382 56.6026 10.0452 56.3798L0.506987 50.9749C0.193654 50.7973 0 50.465 0 50.1048V24.5542V20.0437V15.9386C0 15.6642 0.144426 15.41 0.380188 15.2694C0.448758 15.2152 0.524602 15.1698 0.606019 15.1348L26 0Z"
          fill="white"
        />
        <path
          id="loader-path-2"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M26 0V12.616L40.512 21.2651C40.8146 21.4455 41 21.7718 41 22.1241V56.0542L41.0001 56.0685C41.0064 56.5202 41.5618 56.6026 41.9548 56.3798L51.493 50.9749C51.8063 50.7973 52 50.465 52 50.1048V24.5542V20.0437V15.9386C52 15.6642 51.8556 15.41 51.6198 15.2694C51.5512 15.2152 51.4754 15.1698 51.394 15.1348L26 0Z"
          fill="white"
        />
      </svg>
    </div>
  )
}
