"use client"

import { useEffect } from "react"
import { disableScroll, enableScroll } from "@/lib/utils"
import gsap from "gsap"
import Typewriter from 'typewriter-effect';
import './Loading.css'

export default function ScreenLoaderNew() {
    
    useEffect(() => {

        disableScroll()
    
        gsap.to(".loader-screen", {
          height: 0,
          opacity:0,
          duration: 1,
          delay: 6,
    
          onComplete: () => {
            enableScroll()
            document.body.scrollTop = 0
            gsap.set(".loader-screen", {
              display: "none",
            })
          },
        })
      }, [])
      
    return (
    <div className="loader-screen fixed z-50 flex h-screen w-screen items-center justify-center bg-black text-white text-[6vw]">
        <div className="pendulum">
          <div className="pendulum_box">
            <div className="ball first"></div>
              <div className="ball"></div>
              <div className="ball"></div>
              <div className="ball"></div>
              <div className="ball last"></div>
          </div>
        </div>
        <br />
        <Typewriter
            onInit={(typewriter) => {
                typewriter.changeDelay(20)
                .changeDeleteSpeed(5)
                .typeString('Compiling creativity...')
                .pauseFor(500)
                .deleteChars(25)
                .pauseFor(50)
                .typeString('Transforming ideas into code.')
                .pauseFor(500)
                .start();
            }}
        />
    </div>
    )
}