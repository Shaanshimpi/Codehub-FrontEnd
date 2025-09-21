import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { collection: string } }
) {
  const { collection } = await params
  const searchParams = request.nextUrl.searchParams

  // Simply pass through the entire query string as-is
  const queryString = request.nextUrl.search || ""

  const payloadApiUrl = process.env.PAYLOAD_API_URL

  if (!payloadApiUrl) {
    console.error("❌ PAYLOAD_API_URL environment variable not configured")
    return NextResponse.json(
      { error: "API configuration error" },
      { status: 500 }
    )
  }

  const url = `${payloadApiUrl}/${collection}${queryString}`

  console.log(`🔄 Fetching ${collection} from:`, url)

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
      `✅ Successfully fetched ${collection}:`,
      data?.docs?.length || 0,
      "items"
    )
    return NextResponse.json(data.docs || [])
  } catch (error) {
    console.error(`❌ Failed to fetch ${collection}:`, error)
    return NextResponse.json(
      { error: `Failed to fetch ${collection}` },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { collection: string } }
) {
  const { collection } = await params
  const url = new URL(request.url)
  const pathSegments = url.pathname.split("/")
  const itemId = pathSegments[pathSegments.length - 1]

  const payloadApiUrl = process.env.PAYLOAD_API_URL

  if (!payloadApiUrl) {
    console.error("❌ PAYLOAD_API_URL environment variable not configured")
    return NextResponse.json(
      { error: "API configuration error" },
      { status: 500 }
    )
  }

  const deleteUrl = `${payloadApiUrl}/${collection}/${itemId}`

  console.log(`🗑️ Deleting ${collection} item:`, itemId)
  console.log(`🔄 Delete URL:`, deleteUrl)

  try {
    const res = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      console.error(
        `❌ Payload Delete API Error: ${res.status} ${res.statusText}`
      )
      const errorText = await res.text()
      console.error("❌ Error details:", errorText)
      throw new Error(`HTTP error ${res.status}: ${res.statusText}`)
    }

    const data = await res.json()
    console.log(`✅ Successfully deleted ${collection} item:`, itemId)

    return NextResponse.json({
      success: true,
      message: `${collection} item deleted successfully`,
      data,
    })
  } catch (error) {
    console.error(`❌ Failed to delete ${collection} item ${itemId}:`, error)
    return NextResponse.json(
      {
        error: `Failed to delete ${collection} item`,
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
