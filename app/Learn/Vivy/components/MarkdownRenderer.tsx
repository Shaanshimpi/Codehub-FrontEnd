import { useState } from "react"
import { Check, Copy } from "lucide-react"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"

interface MarkdownRendererProps {
  content: string
  className?: string
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <div className="relative mb-4">
      <div className="overflow-hidden rounded-lg bg-slate-900 dark:bg-slate-800">
        <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-4 py-2 dark:border-slate-600 dark:bg-slate-700">
          <span className="text-xs font-medium uppercase text-slate-300 dark:text-slate-400">
            {language}
          </span>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-slate-300 transition-colors hover:bg-slate-700 hover:text-white dark:hover:bg-slate-600"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copy
              </>
            )}
          </button>
        </div>
        <pre className="overflow-x-auto p-4">
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    </div>
  )
}

export function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // Headers
          h1: ({ children }) => (
            <h1 className="mb-4 mt-6 border-b border-slate-200 pb-2 text-2xl font-bold text-slate-900 first:mt-0 dark:border-slate-700 dark:text-slate-100">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-3 mt-5 text-xl font-bold text-slate-900 first:mt-0 dark:text-slate-100">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-4 text-lg font-semibold text-slate-900 first:mt-0 dark:text-slate-100">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mb-2 mt-3 text-base font-semibold text-slate-900 first:mt-0 dark:text-slate-100">
              {children}
            </h4>
          ),

          // Paragraphs
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed text-slate-700 last:mb-0 dark:text-slate-300">
              {children}
            </p>
          ),

          // Strong and emphasis
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-900 dark:text-slate-100">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-slate-800 dark:text-slate-200">
              {children}
            </em>
          ),

          // Lists
          ul: ({ children }) => (
            <ul className="mb-4 list-disc space-y-1 pl-6 text-slate-700 dark:text-slate-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 list-decimal space-y-1 pl-6 text-slate-700 dark:text-slate-300">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,

          // Code
          code: ({ inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "")

            // Convert children to string properly - handle arrays and objects
            const getTextContent = (node: any): string => {
              if (typeof node === "string") return node
              if (typeof node === "number") return String(node)
              if (Array.isArray(node)) return node.map(getTextContent).join("")
              if (
                node &&
                typeof node === "object" &&
                node.props &&
                node.props.children
              ) {
                return getTextContent(node.props.children)
              }
              return String(node || "")
            }

            const code = getTextContent(children).replace(/\n$/, "")

            if (!inline && match) {
              // Block code with syntax highlighting
              return <CodeBlock language={match[1]} code={code} />
            }

            // Inline code
            return (
              <code
                className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                {...props}
              >
                {code}
              </code>
            )
          },

          // Block code without language
          pre: ({ children }) => {
            // Extract text content from nested code elements
            const getTextContent = (node: any): string => {
              if (typeof node === "string") return node
              if (typeof node === "number") return String(node)
              if (Array.isArray(node)) return node.map(getTextContent).join("")
              if (
                node &&
                typeof node === "object" &&
                node.props &&
                node.props.children
              ) {
                return getTextContent(node.props.children)
              }
              return String(node || "")
            }

            const textContent = getTextContent(children)

            return (
              <div className="mb-4">
                <div className="overflow-hidden rounded-lg bg-slate-900 dark:bg-slate-800">
                  <pre className="overflow-x-auto p-4 text-slate-100 dark:text-slate-200">
                    <code>{textContent}</code>
                  </pre>
                </div>
              </div>
            )
          },

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="mb-4 rounded-r-lg border-l-4 border-blue-500 bg-blue-50 py-2 pl-4 dark:border-blue-400 dark:bg-blue-900/20">
              <div className="italic text-slate-700 dark:text-slate-300">
                {children}
              </div>
            </blockquote>
          ),

          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 underline transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {children}
            </a>
          ),

          // Tables
          table: ({ children }) => (
            <div className="mb-4 overflow-x-auto">
              <table className="min-w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-50 dark:bg-slate-800">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="bg-white dark:bg-slate-900">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-slate-200 last:border-b-0 dark:border-slate-700">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="border-r border-slate-200 px-4 py-2 text-left font-semibold text-slate-900 last:border-r-0 dark:border-slate-700 dark:text-slate-100">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-r border-slate-200 px-4 py-2 text-slate-700 last:border-r-0 dark:border-slate-700 dark:text-slate-300">
              {children}
            </td>
          ),

          // Horizontal rule
          hr: () => (
            <hr className="my-6 border-slate-200 dark:border-slate-700" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
