import { NextRequest, NextResponse } from "next/server"

interface RouteParams {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const payloadApiUrl = process.env.PAYLOAD_API_URL

  if (!payloadApiUrl) {
    console.error("❌ PAYLOAD_API_URL environment variable not configured")
    return NextResponse.json(
      { error: "API configuration error" },
      { status: 500 }
    )
  }

  const url = `${payloadApiUrl}/exercises/${id}?depth=2`

  console.log(`🔄 Fetching exercise from:`, url)

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      console.error(`❌ Payload API Error: ${res.status} ${res.statusText}`)
      if (res.status === 404) {
        return NextResponse.json(
          { error: "Exercise not found" },
          { status: 404 }
        )
      }
      throw new Error(`HTTP error ${res.status}`)
    }

    const data = await res.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error(`❌ Failed to fetch exercise:`, error)
    return NextResponse.json(
      { error: `Failed to fetch exercise` },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
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

    const response = await fetch(`${payloadApiUrl}/exercises/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Failed to update exercise:", errorText)
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Exercise not found" },
          { status: 404 }
        )
      }
      throw new Error(`HTTP error ${response.status}: ${errorText}`)
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ Error updating exercise:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update exercise",
      },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const payloadApiUrl = process.env.PAYLOAD_API_URL

  if (!payloadApiUrl) {
    console.error("❌ PAYLOAD_API_URL environment variable not configured")
    return NextResponse.json(
      { error: "API configuration error" },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(`${payloadApiUrl}/exercises/${params.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Failed to delete exercise:", errorText)
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Exercise not found" },
          { status: 404 }
        )
      }
      throw new Error(`HTTP error ${response.status}: ${errorText}`)
    }

    return NextResponse.json({ success: true, id: params.id })
  } catch (error) {
    console.error("❌ Error deleting exercise:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to delete exercise",
      },
      { status: 500 }
    )
  }
}
