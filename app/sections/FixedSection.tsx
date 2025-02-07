"use client"
import gsap from "gsap"
import { useEffect } from "react"


export default function FixedSection({WALink}: {WALink: string}) {
  useEffect(()=>{
    setInterval(()=>{
      const tl = gsap.timeline();
      tl.to(`.cta`,{
        scaleY:2,
        duration:.3,
      })
      tl.to(`.cta`,{
        scaleY:1,
        duration:.3,
      })
    },5000)

  },[])
  return (
    <div className="cta fixed left-0 top-0 z-[50] flex h-screen w-screen items-center justify-end pointer-events-none">
      <a
        href={WALink}
        // aria-label="github-repo"
        target="_blank"
        className="awward-name flex h-fit w-10 flex-col items-center justify-between gap-8 bg-[#a3e635] px-2 py-4 pointer-events-auto"
        rel="noreferrer"
      >
        
        <p className="awward-text text-sm font-semibold tracking-tighter text-black [writing-mode:vertical-lr]">
          Join Now
        </p>
      </a>
    </div>
  )
}
