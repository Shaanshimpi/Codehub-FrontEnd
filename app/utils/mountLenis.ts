import { useEffect } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/dist/ScrollTrigger"
import Lenis from "lenis"

export default function mountLenis() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
    })

    lenis.on("scroll", ScrollTrigger.update)

    gsap.registerPlugin(ScrollTrigger)

    gsap.ticker.add((time) => {
      lenis.raf(time * 600)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      lenis.destroy()
    }
  }, [])

  return null
}
