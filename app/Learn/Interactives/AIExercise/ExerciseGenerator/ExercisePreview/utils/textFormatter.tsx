export const formatExplanation = (text: string) => {
  if (!text) return ""

  // Split by newlines and format each line
  const lines = text.split("\n").map((line, index) => {
    // Check if line contains numbered references like [1], [2], etc.
    const formattedLine = line.replace(
      /\[(\d+)\]/g,
      '<span class="inline-block bg-blue-600 text-white px-2 py-1 rounded text-sm font-semibold mr-2">$1</span>'
    )

    return (
      <p key={index} className="mb-2 leading-relaxed text-slate-300">
        <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
      </p>
    )
  })

  return <div>{lines}</div>
}
