import React from "react"

function page({ params }) {
  const { langSlug } = params
  return <div className="mt-[20vh]">this is {langSlug} page</div>
}

export default page
