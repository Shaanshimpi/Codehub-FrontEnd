import { NextRequest, NextResponse } from "next/server"
import qs from "qs"

export async function GET(
  request: NextRequest,
  { params }: { params: { collection: string } }
) {
  const { collection } = await params
  const searchParams = request.nextUrl.searchParams

  const queryObject: Record<string, any> = {}

  if (searchParams.has("depth")) {
    queryObject.depth = parseInt(searchParams.get("depth") || "1")
  }

  if (searchParams.has("limit")) {
    queryObject.limit = parseInt(searchParams.get("limit") || "100")
  }

  if (searchParams.has("sort")) {
    queryObject.sort = searchParams.get("sort")
  }

  if (searchParams.has("where")) {
    try {
      queryObject.where = JSON.parse(searchParams.get("where") || "{}")
    } catch (e) {
      console.error("Error parsing where clause:", e)
    }
  }

  const queryString = qs.stringify(queryObject, {
    addQueryPrefix: true,
    encode: false,
  })

  const url = `${process.env.PAYLOAD_API_URL}/${collection}${queryString.replace(`where=`, `where`)}`

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) throw new Error(`HTTP error ${res.status}`)
    const data = await res.json()
    return NextResponse.json(data.docs)
  } catch (error) {
    console.error(`❌ Failed to fetch ${collection}:`, error)
    return NextResponse.json([], { status: 500 })
  }
}
