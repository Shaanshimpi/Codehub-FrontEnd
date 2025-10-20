import logosqr from "@/app/assets/logo-sqr.png"

export const metadata = {
  title: "CodeHub – Learn Programming & Get Job-Ready in Nashik",
  description:
    "CodeHub is Nashik's leading coding institute offering C, C++, Full Stack, and MERN Stack training with job assistance, daily challenges, and real-world projects.",
  keywords:
    "CodeHub, coding institute Nashik, C programming, C++, Full Stack, MERN Stack, job ready courses, coding classes Nashik, programming bootcamp",
  openGraph: {
    title: "CodeHub – Best Coding Classes in Nashik",
    description:
      "Master programming with CodeHub. Get hands-on training in C, C++, Full Stack, and MERN Stack with daily practice, projects, and placement support.",
    url: "https://codehubindia.in/",
    siteName: "CodeHub India",
    images: [
      {
        url: logosqr.src, // Replace with your actual OG image
        width: 1200,
        height: 630,
        alt: "CodeHub – Best Coding Institute in Nashik",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeHub – Best Coding Classes in Nashik",
    description:
      "Master programming with CodeHub. Get hands-on training in C, C++, Full Stack, and MERN Stack with daily practice, projects, and placement support.",
    images: [logosqr.src],
  },

  alternates: {
    canonical: "https://codehubindia.in/",
  },
}
