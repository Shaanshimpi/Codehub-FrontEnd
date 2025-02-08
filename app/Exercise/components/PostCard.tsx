import React from "react"
import Link from "next/link"

function PostCard({ post }: { post: any }) {
  return (
    <Link href={`/Exercise/${post.documentId}`} className="block">
      <div className="relative z-0 flex max-h-[300px] min-h-[200px] flex-col rounded-lg border border-white p-3 pb-20 transition-colors hover:bg-gray-800">
        <span className="text-xl font-bold">{post.index + 1}.</span>
        <h3 className="text-lg">{post?.Title}</h3>

        <div className="meta absolute bottom-0 right-0 flex flex-col gap-1 pb-2 pr-2">
          <div className="flex flex-grow flex-row-reverse gap-2">
            {post.programming_languages?.map((lang: object) => {
              return (
                <span
                  className="rounded-md border bg-white p-[3px] text-black"
                  key={lang.documentId}
                >
                  {" "}
                  {lang.Name}
                </span>
              )
            })}
          </div>
          <div className="flex flex-grow flex-row-reverse gap-2">
            {post.topics?.map((topic: object) => {
              return (
                <span
                  className="rounded-md border bg-white p-1 text-black"
                  key={topic.documentId}
                >
                  {" "}
                  {topic.Name}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PostCard
