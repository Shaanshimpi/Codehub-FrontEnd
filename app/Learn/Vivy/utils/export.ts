import { Conversation } from "../hooks/useConversations"

export type ExportFormat = "json" | "markdown" | "txt"

export interface ExportOptions {
  format: ExportFormat
  includeMetadata?: boolean
  includeTimestamps?: boolean
  includeTokenCount?: boolean
}

// Export conversation to JSON format
export function exportToJSON(
  conversation: Conversation,
  options: ExportOptions = { format: "json" }
) {
  const data: any = {
    title: conversation.title,
    messages: conversation.messages,
  }

  if (options.includeMetadata) {
    data.metadata = {
      id: conversation.id,
      model: conversation.model,
      totalTokens: conversation.totalTokens,
      estimatedCost: conversation.estimatedCost,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      tags: conversation.tags,
      isPublic: conversation.isPublic,
    }
  }

  return JSON.stringify(data, null, 2)
}

// Export conversation to Markdown format
export function exportToMarkdown(
  conversation: Conversation,
  options: ExportOptions = { format: "markdown" }
) {
  let markdown = `# ${conversation.title}\n\n`

  if (options.includeMetadata) {
    markdown += `## Conversation Details\n\n`
    markdown += `- **Model**: ${getModelDisplayName(conversation.model)}\n`
    markdown += `- **Created**: ${new Date(conversation.createdAt).toLocaleString()}\n`
    markdown += `- **Updated**: ${new Date(conversation.updatedAt).toLocaleString()}\n`

    if (options.includeTokenCount && conversation.totalTokens > 0) {
      markdown += `- **Total Tokens**: ${conversation.totalTokens.toLocaleString()}\n`
      if (conversation.estimatedCost > 0) {
        markdown += `- **Estimated Cost**: $${conversation.estimatedCost.toFixed(4)}\n`
      }
    }

    if (conversation.tags && conversation.tags.length > 0) {
      markdown += `- **Tags**: ${conversation.tags.join(", ")}\n`
    }

    markdown += `\n---\n\n`
  }

  markdown += `## Conversation\n\n`

  conversation.messages.forEach((message, index) => {
    const role = message.role === "user" ? "**You**" : "**Vivy**"
    const timestamp = options.includeTimestamps
      ? ` *(${new Date(message.timestamp).toLocaleString()})*`
      : ""

    markdown += `### ${role}${timestamp}\n\n`
    markdown += `${message.content}\n\n`

    if (index < conversation.messages.length - 1) {
      markdown += `---\n\n`
    }
  })

  if (options.includeMetadata) {
    markdown += `\n---\n\n`
    markdown += `*Exported from Vivy AI Chat - ${new Date().toLocaleString()}*\n`
  }

  return markdown
}

// Export conversation to plain text format
export function exportToText(
  conversation: Conversation,
  options: ExportOptions = { format: "txt" }
) {
  let text = `${conversation.title}\n`
  text += `${"=".repeat(conversation.title.length)}\n\n`

  if (options.includeMetadata) {
    text += `Conversation Details:\n`
    text += `Model: ${getModelDisplayName(conversation.model)}\n`
    text += `Created: ${new Date(conversation.createdAt).toLocaleString()}\n`
    text += `Updated: ${new Date(conversation.updatedAt).toLocaleString()}\n`

    if (options.includeTokenCount && conversation.totalTokens > 0) {
      text += `Total Tokens: ${conversation.totalTokens.toLocaleString()}\n`
      if (conversation.estimatedCost > 0) {
        text += `Estimated Cost: $${conversation.estimatedCost.toFixed(4)}\n`
      }
    }

    if (conversation.tags && conversation.tags.length > 0) {
      text += `Tags: ${conversation.tags.join(", ")}\n`
    }

    text += `\n${"-".repeat(50)}\n\n`
  }

  conversation.messages.forEach((message, index) => {
    const role = message.role === "user" ? "You" : "Vivy"
    const timestamp = options.includeTimestamps
      ? ` (${new Date(message.timestamp).toLocaleString()})`
      : ""

    text += `${role}${timestamp}:\n`
    text += `${message.content}\n\n`

    if (index < conversation.messages.length - 1) {
      text += `${"-".repeat(30)}\n\n`
    }
  })

  if (options.includeMetadata) {
    text += `\n${"=".repeat(50)}\n`
    text += `Exported from Vivy AI Chat - ${new Date().toLocaleString()}\n`
  }

  return text
}

// Main export function
export function exportConversation(
  conversation: Conversation,
  options: ExportOptions
) {
  switch (options.format) {
    case "json":
      return exportToJSON(conversation, options)
    case "markdown":
      return exportToMarkdown(conversation, options)
    case "txt":
      return exportToText(conversation, options)
    default:
      throw new Error(`Unsupported export format: ${options.format}`)
  }
}

// Download exported conversation
export function downloadConversation(
  conversation: Conversation,
  options: ExportOptions
) {
  const content = exportConversation(conversation, options)
  const filename = generateFilename(conversation, options.format)
  const mimeType = getMimeType(options.format)

  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Generate filename for export
function generateFilename(
  conversation: Conversation,
  format: ExportFormat
): string {
  const timestamp = new Date().toISOString().split("T")[0] // YYYY-MM-DD
  const sanitizedTitle = conversation.title
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .slice(0, 50) // Limit length

  return `vivy-chat-${sanitizedTitle}-${timestamp}.${format}`
}

// Get MIME type for format
function getMimeType(format: ExportFormat): string {
  switch (format) {
    case "json":
      return "application/json"
    case "markdown":
      return "text/markdown"
    case "txt":
      return "text/plain"
    default:
      return "text/plain"
  }
}

// Get display name for model
function getModelDisplayName(model: string): string {
  const modelMap: { [key: string]: string } = {
    "deepseek/deepseek-chat": "DeepSeek Chat",
    "openai/gpt-4o-mini": "GPT-4o Mini",
    "google/gemini-flash-1.5": "Gemini 1.5 Flash",
    "meta-llama/llama-3.3-70b-instruct": "Llama 3.3 70B",
    "openai/gpt-4o": "GPT-4o",
    "anthropic/claude-3.5-sonnet": "Claude 3.5 Sonnet",
  }

  return modelMap[model] || model
}

// Export multiple conversations
export function exportMultipleConversations(
  conversations: Conversation[],
  options: ExportOptions
) {
  if (options.format === "json") {
    const data = {
      exportDate: new Date().toISOString(),
      totalConversations: conversations.length,
      conversations: conversations.map((conv) => ({
        title: conv.title,
        model: conv.model,
        messages: conv.messages,
        ...(options.includeMetadata && {
          metadata: {
            id: conv.id,
            totalTokens: conv.totalTokens,
            estimatedCost: conv.estimatedCost,
            createdAt: conv.createdAt,
            updatedAt: conv.updatedAt,
            tags: conv.tags,
            isPublic: conv.isPublic,
          },
        }),
      })),
    }
    return JSON.stringify(data, null, 2)
  } else {
    // For markdown/text, combine all conversations
    return conversations
      .map((conv) => exportConversation(conv, options))
      .join("\n\n" + "=".repeat(80) + "\n\n")
  }
}

// Download multiple conversations
export function downloadMultipleConversations(
  conversations: Conversation[],
  options: ExportOptions
) {
  const content = exportMultipleConversations(conversations, options)
  const timestamp = new Date().toISOString().split("T")[0]
  const filename = `vivy-chat-export-${conversations.length}-conversations-${timestamp}.${options.format}`
  const mimeType = getMimeType(options.format)

  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
