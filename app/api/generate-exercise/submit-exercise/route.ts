export async function POST(request: Request) {
  try {
    const payload = await request.json()

    // Print the payload to console
    console.log("Received exercise payload:", JSON.stringify(payload, null, 2))

    // You can also log specific fields if needed
    console.log("Payload keys:", Object.keys(payload))

    // Return success response
    return new Response(
      JSON.stringify({
        message: "Exercise submitted successfully",
        received: payload,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  } catch (error) {
    console.error("Error processing exercise submission:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
