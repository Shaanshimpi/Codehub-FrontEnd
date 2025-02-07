import React from 'react'
import Link from 'next/link'

function PostCard({post}:{post:any}) {
  return (
    <Link href={`/Exercise/${post.documentId}`} className='block'>
      <div className='min-h-[200px] max-h-[300px] border-white border rounded-lg p-3 pb-20 relative flex flex-col hover:bg-gray-800 transition-colors'>
          <span className='text-xl font-bold'>{post.index+1}.</span>
          <h3 className='text-lg'>{post?.Title}</h3>

          <div className="meta absolute bottom-0 pb-2 right-0 pr-2 flex flex-col gap-1">
              <div className=' flex gap-2 flex-grow flex-row-reverse'>
                  {post.programming_languages?.map((lang:object) =>{
                      return <span className='border rounded-md p-[3px] bg-white text-black' key={lang.documentId}> {lang.Name}</span>
                  })}
              </div>
              <div className=' flex gap-2 flex-grow flex-row-reverse'>
                  {post.topics?.map((topic:object) =>{
                      return <span className='border rounded-md p-1 bg-white text-black' key={topic.documentId}> {topic.Name}</span>
                  })}
              </div>
          </div>
      </div>
    </Link>
  )
}

export default PostCard