import { ChatRequest, ChatResponse, Message } from "../types"

export const createMessage = (
  role: "user" | "assistant",
  content: string,
  model?: string
): Message => ({
  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
  role,
  content: content.trim(),
  timestamp: new Date(),
  model,
})

export const formatTimeString = (
  date: Date | string | null | undefined
): string => {
  if (!date) return "Unknown time"

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date

    // Check if the date is valid
    if (!dateObj || isNaN(dateObj.getTime())) {
      return "Unknown time"
    }

    return dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch (error) {
    console.warn("Date formatting error:", error, "Date value:", date)
    return "Unknown time"
  }
}

export const sendChatMessage = async (
  messages: Message[],
  model: string
): Promise<ChatResponse> => {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages,
      model,
    } as ChatRequest),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
  }

  return await response.json()
}

export const scrollToBottom = (element: HTMLDivElement | null) => {
  element?.scrollIntoView({ behavior: "smooth" })
}
