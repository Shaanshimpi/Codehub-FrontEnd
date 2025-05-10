import "./MainSpace.css"

function MainSpace({ tutorial }: { tutorial: any }) {
  return (
    <div className="p-8 pt-[10vh]">
      <h1 className="mb-4 text-3xl font-bold">{tutorial.Title}</h1>
      <div
        className="content-container dark:bg-black dark:text-white"
        dangerouslySetInnerHTML={{ __html: tutorial.Content }}
      />
    </div>
  )
}

export default MainSpace
