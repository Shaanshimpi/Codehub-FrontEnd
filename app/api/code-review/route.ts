// app/api/chatbot/route.ts
import { NextRequest, NextResponse } from "next/server"

// 🎯 Best AI models for visual code explanation and beginner-friendly tutorials
const models = [
  "google/gemini-2.0-flash-001",
  "qwen/qwen-2.5-coder-32b-instruct:free", // 🔥 Excellent for programming with visual diagrams
  "google/gemini-flash-1.5:free", // 📊 Great at creating text-based visual representations
  "mistralai/mistral-nemo:free", // 🚀 Good balance of speed and educational explanations
  "qwen/qwen2.5-72b-instruct:free", // 🧠 Deep reasoning with clear step-by-step logic
  "meta-llama/llama-3.3-70b-instruct:free", // 📚 Clean explanations, good for beginners
  "openai/gpt-4o-mini:free", // 💡 Solid for educational content and visual text
  "microsoft/wizardlm-2-8x22b:free", // 🎓 Good at educational explanations
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
if code is not provided you have to create a code as simple as possible for them, the code doesn't need to be 
perfect, it just needs to work barely, a bare minimum logic is required only.no need of all the error handling or 

---

### 🧠 IMPORTANT VISUAL FORMATTING RULES:
Use these special formats to make explanations beginner-friendly and visually understandable:

1. **Memory tables** (for variables, values, arrays, etc.):
   Use three vertical bars \`|||\` to format tables:
   \`\`\`
   ||| Variable | Value | Type |||
   |||----------|-------|------|||
   |||    x     |   5   | int  |||
   |||    y     |  "hi" | str  |||
   \`\`\`

2. **Step-by-step execution** (DRY RUN):
   \`\`\`
   🔄 STEP 1: x = 5
   📦 Memory: [x: 5]
   
   🔄 STEP 2: y = x + 3
   📦 Memory: [x: 5, y: 8]
   
   🔄 STEP 3: print(y)
   📺 Output: 8
   \`\`\`

3. **Visual diagrams for logic**:
   Use triple slashes \`///\` for visual space:
   \`\`\`
   ///
   IF condition is TRUE:
   ┌─────────────────┐
   │   Do this code  │
   └─────────────────┘
           ↓
   ELSE (condition is FALSE):
   ┌─────────────────┐
   │   Do other code │
   └─────────────────┘
   ///
   \`\`\`

4. **Flow arrows**: ➡️ means something flows/moves
5. **Boxes for storage**: 📦 \`variable = value\`
6. **Loop visualization**:
   \`\`\`
   ///
   🔄 LOOP: i goes from 0 to 2
   
   i=0: ┌─────┐ ➡️ Do something
        │  0  │
        └─────┘
   
   i=1: ┌─────┐ ➡️ Do something  
        │  1  │
        └─────┘
   
   i=2: ┌─────┐ ➡️ Do something
        │  2  │
        └─────┘
   ///
   \`\`\`

7. **Function call visualization**:
   \`\`\`
   ///
   📞 CALLING: factorial(3)
   
   factorial(3) ➡️ 3 × factorial(2)
                    ↓
   factorial(2) ➡️ 2 × factorial(1)  
                    ↓
   factorial(1) ➡️ 1
   
   📤 RESULT: 3 × 2 × 1 = 6
   ///
   \`\`\`

---

### 🧾 Format your response like this:

**🧐 What This Code Does**
Explain in plain, step-by-step language what the code accomplishes.

**🔄 Line-by-Line Execution (DRY RUN)**
Walk through each line showing exactly what happens in memory and output.

**📊 Visual Representation**
Use diagrams, tables, or visual elements to show how the code works.

**⚠️ Mistakes or Areas for Improvement**
Point out any bugs or confusing parts (keep it simple - no need for complex error handling).

**✅ Beginner-Friendly Version**
If needed, provide a simplified version that focuses on core logic.

**📘 Lesson Connection**
Connect this code back to the lesson: "${content}"

**🎯 Key Takeaway**
One simple sentence about what they should remember.

---

🎯 REMEMBER: 
- Keep code simple (no complex error handling unless essential)
- Focus on core logic understanding
- Use LOTS of visual elements
- Explain like they're 12 years old
- Make them feel successful and confident

Language of code: ${language}  
Student's question: "${prompt}"  
`

    const userParts: string[] = []

    if (prompt?.trim()) {
      userParts.push(`📝 **Prompt/Question:**\n${prompt.trim()}`)
    }

    if (code?.trim()) {
      userParts.push(
        `💻 **Code Snippet in ${language}:**\n\`\`\`${language}\n${code.trim()}\n\`\`\``
      )
    }

    const fullMessages = [
      { role: "system", content: systemPrompt },
      ...(messages || []),
      {
        role: "user",
        content: userParts.join("\n\n") || "Can you help me learn this topic?",
      },
    ]

    // Try models in order of preference for educational explanations
    for (const model of models) {
      try {
        console.log(`🤖 Trying model: ${model} `)

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
              temperature: 0.7, // Good balance for educational content
              max_tokens: 2000, // Enough for detailed explanations
            }),
          }
        )

        if (!response.ok) {
          const errorText = await response.text()
          console.warn(`Model "${model}" failed:`, errorText)
          console.log("[RUN-CODE-ERROR]", response)
          console.log("[RUN-CODE-ERROR]", errorText)

          continue // try next model
        }

        const data = await response.json()
        const aiResponse = data?.choices?.[0]?.message?.content

        if (aiResponse) {
          console.log(`✅ Success with model: ${model}`)
          return NextResponse.json({
            response: aiResponse,
            model,
            success: true,
          })
        }
      } catch (err) {
        console.warn(`⚠️ Error with model "${model}":`, err)
        continue
      }
    }

    // If none of the models worked
    return NextResponse.json(
      {
        error: "All models failed to generate a response. Please try again.",
        success: false,
      },
      { status: 500 }
    )
  } catch (error) {
    console.error("❌ Server Error:", error)
    return NextResponse.json(
      {
        error: "Unexpected server error. Please try again.",
        success: false,
      },
      { status: 500 }
    )
  }
}
