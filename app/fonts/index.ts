import {
  Afacad,
  Agdasima,
  EB_Garamond,
  Poppins,
  Schibsted_Grotesk,
  Syne,
} from "next/font/google"
import localFont from "next/font/local"

export const geistSans = localFont({
  src: "./GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})

export const geistMono = localFont({
  src: "./GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const reckoner = localFont({
  src: [
    {
      path: "./Reckoner.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./Reckoner_Bold.ttf",
      weight: "700",
      style: "bold",
    },
  ],
})

export const Ebgramond = EB_Garamond({
  subsets: ["latin"],
  display: "swap",
})

export const PoppinFont = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
})

export const SyneFont = Syne({
  subsets: ["latin"],
  display: "swap",
})

export const AgdasimaFont = Agdasima({
  subsets: ["latin"],
  display: "swap",
  weight: "700",
})

export const AfacadFont = Afacad({
  subsets: ["latin"],
  display: "swap",
})

export const SchibstedFont = Schibsted_Grotesk({
  subsets: ["latin"],
  display: "swap",
})
