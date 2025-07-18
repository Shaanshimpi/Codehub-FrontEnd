const CodeBlock = ({ code }: { code: string }) => {
  const copyToClipboard = () => {
    // Extract text content from HTML
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = code
    const textContent = tempDiv.textContent || tempDiv.innerText || ""

    navigator.clipboard.writeText(textContent).then(() => {
      // You could add a toast notification here
      console.log("Code copied to clipboard")
    })
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-700">
      <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-4 py-2 font-mono text-xs text-slate-400">
        <span>Code</span>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>
          <button
            onClick={copyToClipboard}
            className="rounded bg-slate-700 px-2 py-1 text-xs text-white transition-all duration-300 hover:bg-slate-600"
          >
            Copy
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {code ? (
          <div dangerouslySetInnerHTML={{ __html: code }} />
        ) : (
          <pre className="bg-slate-900 p-4 font-mono text-sm text-white">
            <code>No code available</code>
          </pre>
        )}
      </div>
    </div>
  )
}

export default CodeBlock
