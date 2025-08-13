import { NextRequest, NextResponse } from "next/server"
import qs from "qs"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Build query parameters for Payload CMS
    const queryObject: Record<string, any> = {}

    // Extract standard parameters
    if (searchParams.get("depth")) queryObject.depth = searchParams.get("depth")
    if (searchParams.get("sort")) queryObject.sort = searchParams.get("sort")
    if (searchParams.get("limit")) queryObject.limit = searchParams.get("limit")
    if (searchParams.get("page")) queryObject.page = searchParams.get("page")

    // Handle where clause (programming language filter)
    if (searchParams.get("where[programmingLanguage][equals]")) {
      queryObject["where[programmingLanguage][equals]"] = searchParams.get(
        "where[programmingLanguage][equals]"
      )
    }

    // Handle search (OR queries for title and description)
    if (searchParams.get("where[or][0][title][contains]")) {
      queryObject["where[or][0][title][contains]"] = searchParams.get(
        "where[or][0][title][contains]"
      )
      queryObject["where[or][1][description][contains]"] = searchParams.get(
        "where[or][1][description][contains]"
      )
    }

    const queryString = qs.stringify(queryObject, {
      addQueryPrefix: true,
      encode: false,
    })

    // Use private server-side environment variable
    const apiUrl = process.env.PAYLOAD_API_URL || "http://localhost:3001/api"
    const url = `${apiUrl}/tutorials${queryString}`

    console.log("🔗 Proxying request to:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Disable caching for admin data
    })

    if (!response.ok) {
      console.error(
        "❌ Payload API Error:",
        response.status,
        response.statusText
      )
      return NextResponse.json(
        {
          error: `Payload API error: ${response.status} ${response.statusText}`,
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ API Route Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
