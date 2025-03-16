import React from "react"
import Link from "next/link"

function PostCard({ post }: { post: any }) {
  return (
    <Link href={`/Exercise/${post.documentId}`} className="block">
      <div className="relative z-0 flex max-h-[300px] min-h-[200px] flex-col rounded-lg bg-blue-900 bg-opacity-30 p-3 pb-20 text-white transition-colors">
        <span className="text-xl font-bold">{post.index + 1}.</span>
        <h3 className="text-2xl">{post?.Title}</h3>

        <div className="meta absolute bottom-0 left-0 right-0 flex flex-col gap-1 pb-2 pr-2">
          <div className="show-answer">
            <button className="ml-2 rounded-lg bg-sky-600 px-3 py-1 text-lg hover:bg-blue-900">
              Learn more
            </button>
          </div>
          <div className="flex flex-grow flex-row-reverse gap-2 text-gray-200">
            {post.programming_languages?.slice(0, 2).map((lang: object) => {
              return (
                <span
                  className="min-w-[60px] rounded-md bg-slate-50 bg-opacity-20 p-1 text-center text-xs"
                  key={lang.documentId}
                >
                  {" "}
                  {lang.Name}
                </span>
              )
            })}
            {post.topics?.slice(0, 2).map((topic: object) => {
              return (
                <span
                  className="rounded-md bg-slate-50 bg-opacity-20 p-1 text-xs"
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
