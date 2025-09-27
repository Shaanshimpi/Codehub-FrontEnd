import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params
  const searchParams = request.nextUrl.searchParams

  // Get query parameters for depth, etc.
  const queryString = request.nextUrl.search || ""

  const payloadApiUrl = process.env.PAYLOAD_API_URL

  if (!payloadApiUrl) {
    console.error("❌ PAYLOAD_API_URL environment variable not configured")
    return NextResponse.json(
      { error: "API configuration error" },
      { status: 500 }
    )
  }

  const url = `${payloadApiUrl}/forms/${id}${queryString}`

  console.log(`🔄 Fetching form ${id} from:`, url)

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
    console.log(`✅ Successfully fetched form ${id}`)
    return NextResponse.json(data)
  } catch (error) {
    console.error(`❌ Failed to fetch form ${id}:`, error)
    return NextResponse.json(
      { error: `Failed to fetch form ${id}` },
      { status: 500 }
    )
  }
}
