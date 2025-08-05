import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params
  const payloadApiUrl = process.env.PAYLOAD_API_URL

  if (!payloadApiUrl) {
    console.error("❌ PAYLOAD_API_URL environment variable not configured")
    return NextResponse.json(
      { error: "API configuration error" },
      { status: 500 }
    )
  }

  const url = `${payloadApiUrl}/exercises/${id}`

  console.log(`🔄 Fetching exercise ${id} from:`, url)

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
    console.log(`✅ Successfully fetched exercise:`, id)
    return NextResponse.json(data)
  } catch (error) {
    console.error(`❌ Failed to fetch exercise ${id}:`, error)
    return NextResponse.json(
      { error: `Failed to fetch exercise` },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params

  const payloadApiUrl = process.env.PAYLOAD_API_URL

  if (!payloadApiUrl) {
    console.error("❌ PAYLOAD_API_URL environment variable not configured")
    return NextResponse.json(
      { error: "API configuration error" },
      { status: 500 }
    )
  }

  const deleteUrl = `${payloadApiUrl}/exercises/${id}`

  console.log(`🗑️ Deleting exercise:`, id)
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
    console.log(`✅ Successfully deleted exercise:`, id)

    return NextResponse.json({
      success: true,
      message: `Exercise deleted successfully`,
      data,
    })
  } catch (error) {
    console.error(`❌ Failed to delete exercise ${id}:`, error)
    return NextResponse.json(
      {
        error: `Failed to delete exercise`,
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params
  const body = await request.json()

  const payloadApiUrl = process.env.PAYLOAD_API_URL

  if (!payloadApiUrl) {
    console.error("❌ PAYLOAD_API_URL environment variable not configured")
    return NextResponse.json(
      { error: "API configuration error" },
      { status: 500 }
    )
  }

  const updateUrl = `${payloadApiUrl}/exercises/${id}`

  console.log(`🔄 Updating exercise:`, id)
  console.log(`🔄 Update URL:`, updateUrl)

  try {
    const res = await fetch(updateUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      console.error(
        `❌ Payload Update API Error: ${res.status} ${res.statusText}`
      )
      const errorText = await res.text()
      console.error("❌ Error details:", errorText)
      throw new Error(`HTTP error ${res.status}: ${res.statusText}`)
    }

    const data = await res.json()
    console.log(`✅ Successfully updated exercise:`, id)

    return NextResponse.json({
      success: true,
      message: `Exercise updated successfully`,
      data,
    })
  } catch (error) {
    console.error(`❌ Failed to update exercise ${id}:`, error)
    return NextResponse.json(
      {
        error: `Failed to update exercise`,
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
