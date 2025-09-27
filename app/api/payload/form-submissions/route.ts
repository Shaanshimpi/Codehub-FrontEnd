import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const payloadApiUrl = process.env.PAYLOAD_API_URL

  if (!payloadApiUrl) {
    console.error("❌ PAYLOAD_API_URL environment variable not configured")
    return NextResponse.json(
      { error: "API configuration error" },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const url = `${payloadApiUrl}/form-submissions`

    console.log(`🔄 Submitting form data to:`, url)
    console.log(`📝 Form submission data:`, JSON.stringify(body, null, 2))

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error(`❌ Payload API Error: ${res.status} ${res.statusText}`)
      console.error(`❌ Error details:`, errorText)
      throw new Error(`HTTP error ${res.status}: ${res.statusText}`)
    }

    const data = await res.json()
    console.log(`✅ Successfully submitted form`)
    return NextResponse.json(data)
  } catch (error) {
    console.error(`❌ Failed to submit form:`, error)
    return NextResponse.json(
      {
        error: "Failed to submit form",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const queryString = request.nextUrl.search || ""

  const payloadApiUrl = process.env.PAYLOAD_API_URL

  if (!payloadApiUrl) {
    console.error("❌ PAYLOAD_API_URL environment variable not configured")
    return NextResponse.json(
      { error: "API configuration error" },
      { status: 500 }
    )
  }

  const url = `${payloadApiUrl}/form-submissions${queryString}`

  console.log(`🔄 Fetching form submissions from:`, url)

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
      `✅ Successfully fetched form submissions:`,
      data?.docs?.length || 0,
      "items"
    )
    return NextResponse.json(data.docs || [])
  } catch (error) {
    console.error(`❌ Failed to fetch form submissions:`, error)
    return NextResponse.json(
      { error: "Failed to fetch form submissions" },
      { status: 500 }
    )
  }
}
