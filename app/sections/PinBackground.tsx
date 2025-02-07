"use client"

import { cn } from "@/lib/utils"
import { SchibstedFont } from "../fonts"

export default function PinBackground() {
  return (
    <>
      <section
        id="pin-content-section-1"
        className={cn(
          SchibstedFont.className,
          "relative z-10 flex h-[150vh] w-screen flex-col items-center bg-black px-[4%] lg:flex-row"
        )}
      >
        <div className="m-auto hidden pt-[30%] text-8xl font-extrabold uppercase text-gray-300 md:block text-center mix-blend-difference">
          Not Just <br /> <span className="text-[#da7a40]">Fundamentals</span>
        </div>
        <div className="m-auto block pt-[30%] text-3xl font-extrabold uppercase text-gray-300 opacity-40 md:hidden md:opacity-80 text-center">
          Not Just <br /> <span className="text-[#da7a40]">Fundamentals</span>
        </div>
      </section>
      <section
        id="pin-content-section-2"
        className={cn(
          SchibstedFont.className,
          "relative z-10 flex h-[150vh] w-screen flex-col items-center bg-black px-[4%] lg:flex-row"
        )}
      >
        <div className="m-auto hidden pt-[30%] text-8xl font-extrabold uppercase text-gray-300 md:block text-center">
          Neither<br /> <br /> <span className="text-[#da7a40]">Old Full Stack</span>
        </div>
        <div className="m-auto block pt-[30%] text-3xl font-extrabold uppercase text-gray-300 opacity-40 md:hidden md:opacity-80 text-center">
          Neither<br /> <br /> <span className="text-[#da7a40]">Old Full Stack</span>
        </div>
      </section>
    </>
  )
}
