import { Suspense } from "react"
import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next"
import Script from "next/script"
// import Header from "./layouts/Header"
// import EndSection from "./sections/EndSection"
// 👈 import theme provider
import { UserProvider } from "./(payload)/_providers/UserProvider"
import "./Learn/Exercise/styles/playground.css"
import "./Learn/Exercise/styles/scrollbar.css"
import ScrollToTop from "./ScrollToTop"
import { LanguageProvider } from "./contexts/LanguageContext"
import ThemeClientWrapper from "./contexts/theme-client-wrapper"
import { ThemeProvider } from "./contexts/theme-context"
import { geistMono, geistSans } from "./fonts"
import "./globals.css"

export const metadata: Metadata = {
  title: "CodeHub",
  description:
    "CodeHub is a premier tech institute focused on empowering individuals with cutting-edge programming and development skills. We specialize in full-stack and MERN stack development to prepare students for real-world challenges.",
  generator: "Next.js",
  applicationName: "CodeHub",
  referrer: "origin-when-cross-origin",
  metadataBase: new URL("https://codehubindia.in/"),
  icons: {
    icon: "/logo-sqr.png",
    shortcut: "/logo-sqr.png",
    apple: "/logo-sqr.png",
    other: {
      rel: "icon",
      url: "/logo-sqr.png",
    },
  },
  keywords: [
    // ... keyword list unchanged ...
  ],
  category: "education",
  authors: [{ name: "CodeHub Team", url: "https://codehubindia.in/" }],
  creator: "CodeHub Team",
  publisher: "CodeHub",
  openGraph: {
    title: "CodeHub - Empowering Future Innovators",
    description:
      "CodeHub is your destination for mastering programming and development. Learn from industry experts and work on live projects to transform your skills into a successful career.",
    url: "https://codehubindia.in/",
    siteName: "CodeHub",
    images: [
      {
        url: "https://your-image-url.com/preview.png",
        alt: "CodeHub Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeHub - Empowering Future Innovators",
    description:
      "Join CodeHub to master modern programming and full-stack development. Learn through hands-on training, live projects, and expert mentoring.",
    creator: "@CodeHubIndia",
    images: {
      url: "https://your-image-url.com/preview.png",
      alt: "CodeHub Banner",
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      {/* <!-- Google tag (gtag.js) --> */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-WSTK7J1CKR"
        strategy="afterInteractive"
      />
      <Script strategy="afterInteractive" id="google-analytics">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        // GA4
        gtag('config', 'G-WSTK7J1CKR');

        // Google Ads
        gtag('config', 'AW-16774184716');
      `}
      </Script>

      <body
        className={`relative ${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ScrollToTop />
        <LanguageProvider defaultLanguage="en">
          <UserProvider>
            <ThemeProvider>
              <ThemeClientWrapper>
                <Suspense>
                  <div className="flex min-h-screen flex-col">
                    {/* <Header /> */}
                    <main className="flex-1">{children}</main>
                    {/* <EndSection WALink={WALink} /> */}
                  </div>
                  <Analytics />
                </Suspense>
                {/* {process.env.ENVIRONMENT != "DEV" && <PopupForm />} */}
              </ThemeClientWrapper>
            </ThemeProvider>
          </UserProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
