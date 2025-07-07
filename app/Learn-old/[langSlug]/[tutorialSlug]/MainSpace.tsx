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
    <div
      className="scrollbar-hidden flex-1 overflow-y-auto sm:p-8"
      data-lenis-prevent
    >
      <h1 className="mb-4 ml-2 mt-[10vh] text-3xl font-bold md:ml-0">
        {tutorial.Title}
      </h1>
      <div
        className="content-container dark:bg-black dark:text-white"
        dangerouslySetInnerHTML={{ __html: formattedContent }}
      />
    </div>
  )
}

export default MainSpace
