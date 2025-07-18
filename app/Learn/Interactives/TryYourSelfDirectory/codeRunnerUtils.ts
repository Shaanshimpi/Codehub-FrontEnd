// utils/codeRunnerUtils.ts
import { extMap, langMap } from "../../utils"

export const runCodeOnServer = async (
  language: string,
  code: string,
  stdin: string
): Promise<{ output: string; error: string; executionTime: number }> => {
  try {
    const lang = langMap[language.toLowerCase()] || language.toLowerCase()
    const ext = extMap[lang] || "txt"

    const isBrowser = typeof window !== "undefined"

    const getBaseURL = () => {
      if (isBrowser) return ""
      // For server-side calls (tests or SSR)
      return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    }

    const response = await fetch(`${getBaseURL()}/api/run-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: lang,
        stdin,
        files: [{ name: `Main.${ext}`, content: code }],
      }),
    })

    const data = await response.json()

    if (data.status === "success") {
      return {
        output: data.stdout || "",
        error: data.stderr || data.exception || "",
        executionTime: data.executionTime || 0,
      }
    } else {
      throw new Error(data.error || "Execution failed")
    }
  } catch (err: any) {
    throw new Error(err.message || "Request failed")
  }
}
