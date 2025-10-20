import { NextResponse } from "next/server"

export async function GET() {
  const payloadApiUrl = process.env.PAYLOAD_API_URL

  if (!payloadApiUrl) {
    console.error("❌ PAYLOAD_API_URL environment variable not configured")
    return NextResponse.json(
      { error: "API configuration error" },
      { status: 500 }
    )
  }

  // Fetch top languages sorted by index
  const url = `${payloadApiUrl}/programming-languages?sort=index&limit=10`

  console.log(`🔄 Fetching languages from:`, url)

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    })

    if (!res.ok) {
      console.error(`❌ Payload API Error: ${res.status} ${res.statusText}`)
      throw new Error(`HTTP error ${res.status}`)
    }

    const data = await res.json()
    console.log(
      `✅ Successfully fetched languages:`,
      data?.docs?.length || 0,
      "items"
    )

    // Return the docs array directly for easier consumption
    return NextResponse.json(data.docs || [])
  } catch (error) {
    console.error(`❌ Failed to fetch languages:`, error)
    return NextResponse.json(
      { error: `Failed to fetch languages` },
      { status: 500 }
    )
  }
}
