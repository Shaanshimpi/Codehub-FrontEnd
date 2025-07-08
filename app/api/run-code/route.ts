// app/api/run-code/route.ts
import { extMap, langMap } from "@/app/Learn/[langSlug]/utils"

export async function POST(req: Request) {
  try {
    const { language, stdin, files } = await req.json()

    const lang = langMap[language.toLowerCase()] || language.toLowerCase()
    const ext = extMap[lang] || "txt"
    const response = await fetch(process.env.ONE_COMPILER_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-key": process.env.ONE_COMPILER_KEY!,
        "x-rapidapi-host": process.env.ONE_COMPILER_HOST!,
      },
      body: JSON.stringify({
        language: lang,
        stdin,
        files,
      }),
    })

    const result = await response.json()
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    console.error("[RUN-CODE-ERROR]", err)
    return new Response(
      JSON.stringify({ status: "error", error: "Internal Server Error" }),
      { status: 500 }
    )
  }
}
