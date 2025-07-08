// app/api/chatbot/route.ts
import { NextRequest, NextResponse } from "next/server"

const models = [
  "deepseek/deepseek-r1-0528:free",
  "google/gemini-2.5-pro-exp-03-25",
  "meta-llama/llama-3-70b-instruct:free",
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, prompt, language, messages, content } = body

    console.log("=== CODE REVIEW API CALL ===")
    console.log("Language:", language)
    console.log("Prompt:", prompt)
    console.log("Code:", code)
    console.log("Messages:", messages)
    console.log("============================")

    const systemPrompt = `
You are a friendly and patient AI coding tutor for complete beginners (as young as 12 years old).

👶 The student asking for help is learning programming for the very first time. 
📘 The current lesson they just learned is: "${content}"
💡 Your job is to *reinforce that concept*, review the code, and guide them kindly.

---

### 🧠 IMPORTANT VISUAL FORMATTING RULES:
Use these special formats to make explanations beginner-friendly and visually understandable:

1. **Memory tables** (for variables, values, arrays, etc.):
   Use three vertical bars \`|||\` to format tables:
   Example:
   \`\`\`
   ||| Variable | Value |||
   |||----------|-------|||
   |||    x     |   5   |||
   \`\`\`

2. **Visual diagrams or logic (e.g., Venn Diagrams for conditions)**:
   Use triple slashes \`///\` to represent visual space:
      Example (if condition "a && b"):
      \`\`\`
      ///
        (A) ●─────●
            │ A and B
        (B) ●─────●
      ///
      \`\`\`

    3. **Arrows** to show flow:
      \`➡️\` means something is moving, stored, or flowing into something.

    4. **Boxes** for variable storage:
      Example: 📦 \`x = 5\` means "we stored 5 inside a box called x".

    ---

    ### 🧾 Format your response like this:

    **🧐 What This Code Does**
    Explain in plain, step-by-step language.

    **⚠️ Mistakes or Confusion**
    Point out any bugs or things that might confuse a beginner.

    **✅ How to Improve It**
    Give one clear way to improve the code or explain how to think about it.

    **📘 Lesson Recap**
    Reinforce the lesson they just learned with a summary.

    **📄 Corrected Code**
    If needed, provide a beginner-friendly version of the corrected code.

    ---

    🎯 Your goal is to make the student think: “Wow, I get it now!”  
    Don’t assume they know technical words. Be kind, warm, simple, and visual.

    Language of code: ${language}  
    Prompt from student: "${prompt}"  
    `

    const fullMessages = [
      { role: "system", content: systemPrompt },
      ...(messages || []),
      { role: "user", content: `Here is the code in ${language}:\n\n${code}` },
    ]

    for (const model of models) {
      try {
        const response = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.AI_CHATBOT_API_KEY}`,
            },
            body: JSON.stringify({
              model,
              messages: fullMessages,
            }),
          }
        )

        if (!response.ok) {
          const errorText = await response.text()
          console.warn(`Model "${model}" failed:`, errorText)
          continue // try next model
        }

        const data = await response.json()
        const aiResponse = data?.choices?.[0]?.message?.content

        if (aiResponse) {
          console.log(`✅ Response from model: ${model}`)
          return NextResponse.json({ response: aiResponse, model })
        }
      } catch (err) {
        console.warn(`⚠️ Error with model "${model}":`, err)
        continue
      }
    }

    // If none of the models worked
    return NextResponse.json(
      { error: "All models failed to generate a response." },
      { status: 500 }
    )
  } catch (error) {
    console.error("❌ Server Error:", error)
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    )
  }
}
