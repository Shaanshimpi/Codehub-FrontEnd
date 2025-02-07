import BioSection from "./sections/BioSection"
import EndSection from "./sections/EndSection"
import FixedSection from "./sections/FixedSection"
import HeroSection from "./sections/HeroSection"
import ImagesSection from "./sections/ImagesSection"
import PinBackground from "./sections/PinBackground"
import PinInitialSection from "./sections/PinInitialSection"
import PinSection from "./sections/PinSection"
import SliderSection from "./sections/SliderSection"
import SpaceSection from "./sections/SpaceSection"
export default function Home() {
  const WALink = `https://wa.me/918637704621?text=I%20Want%20to%20learn%20coding%20and%20be%20successful%20Coder`;
  
  return (
    <div className="h-auto max-w-screen bg-primary-ch overflow-hidden">
      
        <HeroSection />
        <FixedSection WALink={WALink}/>
        <PinSection WALink={WALink}/>
        <PinInitialSection WALink={WALink}/>
        <PinBackground />
        <SpaceSection />
        <SliderSection />
        <BioSection WALink={WALink}/>
        <ImagesSection WALink={WALink}/>
        <EndSection WALink={WALink}/>
    </div>
  )
}
