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
    // Get the authenticated user from the request
    const meResponse = await fetch(`${payloadApiUrl}/users/me`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    })

    if (!meResponse.ok) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const userData = await meResponse.json()
    const user = userData.user

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    // Parse the form data from request body
    const formData = await request.json()

    // Validate required fields
    const requiredFields = ["firstName", "lastName", "phone"]
    const missingFields = requiredFields.filter(
      (field) => !formData[field]?.trim()
    )

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          missingFields,
        },
        { status: 400 }
      )
    }

    console.log(
      `📝 Processing Gold application submission for user: ${user.email}`
    )
    console.log(`📝 Current user data:`, JSON.stringify(user, null, 2))
    console.log(`📝 Form data received:`, JSON.stringify(formData, null, 2))

    // Prepare the update data
    const updateData = {
      // Update basic user information
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),

      // Update application status
      goldApplicationStatus: "submitted",

      // Store application data
      goldApplicationData: {
        phone: formData.phone.trim(),
        submittedAt: new Date().toISOString(),
      },
    }

    console.log(
      `📦 Update data being sent:`,
      JSON.stringify(updateData, null, 2)
    )

    // Update the user record
    const updateResponse = await fetch(`${payloadApiUrl}/users/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        cookie: request.headers.get("cookie") || "",
      },
      body: JSON.stringify(updateData),
    })

    console.log(`🔄 Submit update response status:`, updateResponse.status)

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text()
      console.error("❌ Failed to update user application:", errorText)
      throw new Error(`HTTP error ${updateResponse.status}: ${errorText}`)
    }

    const updatedUser = await updateResponse.json()
    console.log(
      `✅ Final updated user data:`,
      JSON.stringify(updatedUser, null, 2)
    )

    console.log(
      `✅ Successfully processed Gold application for user: ${user.email}`
    )

    // Here you could add email notification logic
    // await sendApplicationNotification(updatedUser)

    return NextResponse.json({
      success: true,
      message: "Gold application submitted successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        goldApplicationStatus: updatedUser.goldApplicationStatus,
        goldApplicationDate: updatedUser.goldApplicationDate,
        goldApplicationData: updatedUser.goldApplicationData,
      },
    })
  } catch (error) {
    console.error("❌ Error processing Gold application submission:", error)
    return NextResponse.json(
      {
        error: "Failed to submit application",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

// GET endpoint to check if user can submit (has 'interested' status)
export async function GET(request: NextRequest) {
  const payloadApiUrl = process.env.PAYLOAD_API_URL

  if (!payloadApiUrl) {
    return NextResponse.json(
      { error: "API configuration error" },
      { status: 500 }
    )
  }

  try {
    // Get the authenticated user
    const meResponse = await fetch(`${payloadApiUrl}/users/me`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    })

    if (!meResponse.ok) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const userData = await meResponse.json()
    const user = userData.user

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    // Check if user is eligible to submit application
    const canSubmit = user.goldApplicationStatus === "interested"
    const hasSubmitted = [
      "submitted",
      "under_review",
      "approved",
      "rejected",
    ].includes(user.goldApplicationStatus)

    return NextResponse.json({
      canSubmit,
      hasSubmitted,
      currentStatus: user.goldApplicationStatus || "none",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        goldApplicationData: user.goldApplicationData,
      },
    })
  } catch (error) {
    console.error("❌ Error checking submission eligibility:", error)
    return NextResponse.json(
      { error: "Failed to check submission status" },
      { status: 500 }
    )
  }
}
