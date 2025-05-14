import "./MainSpace.css"

function formatContent(rawContent: string) {
  return (
    rawContent
      // Bold: **text**
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      // Inline code: `code`
      .replace(/`([^`]+?)`/g, '<span class="keyword">$1</span>')
  )
}

function MainSpace({ tutorial }: { tutorial: any }) {
  const formattedContent = formatContent(tutorial.Content || "")

  return (
    <div className="p-8 pt-[10vh]">
      <h1 className="mb-4 text-3xl font-bold">{tutorial.Title}</h1>
      <div
        className="content-container dark:bg-black dark:text-white"
        dangerouslySetInnerHTML={{ __html: formattedContent }}
      />
    </div>
  )
}

export default MainSpace
