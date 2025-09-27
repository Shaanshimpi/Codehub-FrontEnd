import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  // Build query parameters for filtering
  const language = searchParams.get("language")
  const tutorial = searchParams.get("tutorial")
  const search = searchParams.get("search")
  const sort = searchParams.get("sort")
  const limit = searchParams.get("limit")
  const page = searchParams.get("page")

  // Build the query string for Payload API
  let queryParams = new URLSearchParams()

  if (language) {
    queryParams.append("where[programmingLanguage][equals]", language)
  }

  if (tutorial) {
    queryParams.append("where[tutorial][equals]", tutorial)
  }

  if (search) {
    queryParams.append("where[or][0][title][contains]", search)
    queryParams.append("where[or][1][description][contains]", search)
  }

  // Add sorting - default to index if not specified
  queryParams.append("sort", sort || "index")

  // Add pagination
  if (limit) {
    queryParams.append("limit", limit)
  }

  if (page) {
    queryParams.append("page", page)
  }

  // Add depth for related data
  queryParams.append("depth", "2")

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ""

  const payloadApiUrl = process.env.PAYLOAD_API_URL

  if (!payloadApiUrl) {
    console.error("❌ PAYLOAD_API_URL environment variable not configured")
    return NextResponse.json(
      { error: "API configuration error" },
      { status: 500 }
    )
  }

  const url = `${payloadApiUrl}/exercises${queryString}`

  console.log(`🔄 Fetching exercises from:`, url)

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
      `✅ Successfully fetched exercises:`,
      data?.docs?.length || 0,
      "items"
    )

    return NextResponse.json(data)
  } catch (error) {
    console.error(`❌ Failed to fetch exercises:`, error)
    return NextResponse.json(
      { error: `Failed to fetch exercises` },
      { status: 500 }
    )
  }
}

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

    const response = await fetch(`${payloadApiUrl}/exercises`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Failed to create exercise:", errorText)
      throw new Error(`HTTP error ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("✅ Exercise created successfully:", data.id)

    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ Error creating exercise:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create exercise",
      },
      { status: 500 }
    )
  }
}
