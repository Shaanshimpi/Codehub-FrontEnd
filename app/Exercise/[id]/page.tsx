import React from 'react'
import { fetchAllPosts } from '../FetchData'
import CodeBlock from './CodeBlock';

export async function generateStaticParams() {
  const posts = await fetchAllPosts();
  
  return posts.map(post => ({
    id: post.documentId.toString()
  }))
}

const extractCodeFromJSON = (codeArray) => {
    return codeArray
      .map((block) => block.children.map((child) => child.text).join("\n"))
      .join("\n");
  };

// If you need posts data in the component, you'll need to fetch it again
// or pass it as props
async function ExercisePage({params}) {
  const posts = await fetchAllPosts();
  const post = posts.find(post => post.documentId === params.id);
  const codeString = extractCodeFromJSON(post.Code);
  const language = post.programming_languages[0]?.Name.toLowerCase() || "c";
  
  return (
    <div className="pt-14 px-5 overflow-hidden">
        <h2 className='text-xl bg-primary-ch text-white rounded-md p-3'>
            {post.Title}
        </h2>
        <pre className="bg-gray-900 text-white p-4 rounded mt-4">
            <CodeBlock code={codeString} language={language} />
        </pre>

    </div>
  )
}

export default ExercisePage