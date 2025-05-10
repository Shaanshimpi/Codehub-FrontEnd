import { type MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://codehubindia.in/sitemap.xml",
    host: "https://codehubindia.in",
  }
}
