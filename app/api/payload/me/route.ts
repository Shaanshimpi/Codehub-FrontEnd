import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const cookie = await cookies()
  const token = cookie.get("payload-token")?.value
  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  try {
    const response = await fetch(`${process.env.PAYLOAD_API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ user: null }, { status: response.status })
    }

    return NextResponse.json({ user: data.user })
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 500 })
  }
}
