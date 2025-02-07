import { cn } from "@/lib/utils"
import {
  InstagramLogoIcon,
} from "@radix-ui/react-icons"
import { FaWhatsapp, FaYoutube } from "react-icons/fa";
import { PoppinFont } from "../fonts"

export default function EndSection({WALink}: {WALink: string}) {

  return (
    <section
      id="end-section"
      className={cn(
        PoppinFont.className,
        "relative z-[32] h-auto w-screen"
      )}
      style={{backgroundImage: `linear-gradient(135deg, #0f4c9c , #da7a40 60%)`}}
    >
      <div className="flex h-full w-full flex-col justify-between gap-10 px-2 pb-3 pt-[8%]">
        <div className="grid grid-cols-6 gap-10 lg:grid-cols-12 lg:gap-0 lg:px-10">
          <div className="col-span-6">
            <div className="flex flex-col gap-2">
              <div className="text-xl tracking-tight text-white">
                CodeHub equips aspiring tech professionals with the skills to excel in programming and development. With practical training and industry-focused courses, we help turn your passion for coding into a successful career.
              </div>
              <div className="tracking-tight text-white">
                @2024 CodeHub
              </div>
            </div>
          </div>
          <div className="col-span-6 md:col-span-3">
            <div className="text-xs text-white">
              Empowering the next generation of tech leaders.
            </div>
          </div>
          <div className="col-span-6 md:col-span-3">
            <div className="flex flex-row items-start justify-between gap-5 lg:flex-col lg:pl-[60%]">
              <a
                href={`https://www.instagram.com/code.hub.india/`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2"
              >
                <InstagramLogoIcon className="text-white" />
                <div className="text-xs text-white">instagram</div>
              </a>
              <a
                href={`https://www.youtube.com/@CodeHubIndia-uo5ig`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2"
              >
                <FaYoutube className="text-white" />
                <div className="text-xs text-white">YouTube</div>
              </a>
              <a
                href={WALink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2"
              >
                <FaWhatsapp className="text-white" />
                <div className="text-xs text-white">WhatsApp</div>
              </a>
            </div>
          </div>
        </div>
        <div
          className={
            "text-6xl font-bold uppercase leading-[1] tracking-tighter text-gray-200 md:text-8xl lg:text-[200px]"
          }
        >
          CodeHub
        </div>
      </div>
    </section>
  )
}
