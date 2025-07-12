import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  try {
    const response = await fetch(`${process.env.PAYLOAD_API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.errors?.[0]?.message || "Signup failed" },
        { status: response.status }
      )
    }

    // Automatically log in the user after successful signup
    const loginResponse = await fetch(
      `${process.env.PAYLOAD_API_URL}/users/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    )

    const loginData = await loginResponse.json()

    if (!loginResponse.ok) {
      return NextResponse.json(
        { message: "Signup successful, but login failed." },
        { status: 201 }
      )
    }

    const { token, user } = loginData
    const responseWithCookie = NextResponse.json({ user })

    responseWithCookie.cookies.set("payload-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return responseWithCookie
  } catch (error) {
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    )
  }
}
