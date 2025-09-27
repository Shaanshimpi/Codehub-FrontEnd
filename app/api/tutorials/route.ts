import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  // Build query parameters for filtering
  const language = searchParams.get("language")

  // Build the query string for Payload API
  let queryParams = new URLSearchParams()

  if (language) {
    queryParams.append("where[programmingLanguage][equals]", language)
  }

  // Add sorting by index
  queryParams.append("sort", "index")

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ""

  const payloadApiUrl = process.env.PAYLOAD_API_URL

  if (!payloadApiUrl) {
    console.error("❌ PAYLOAD_API_URL environment variable not configured")
    return NextResponse.json(
      { error: "API configuration error" },
      { status: 500 }
    )
  }

  const url = `${payloadApiUrl}/tutorials${queryString}`

  console.log(`🔄 Fetching tutorials from:`, url)

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      console.error(`❌ Payload API Error: ${res.status} ${res.statusText}`)
      throw new Error(`HTTP error ${res.status}`)
    }

    const data = await res.json()
    console.log(
      `✅ Successfully fetched tutorials:`,
      data?.docs?.length || 0,
      "items"
    )

    // Return the docs array directly for easier consumption
    return NextResponse.json(data)
  } catch (error) {
    console.error(`❌ Failed to fetch tutorials:`, error)
    return NextResponse.json(
      { error: `Failed to fetch tutorials` },
      { status: 500 }
    )
  }
}
