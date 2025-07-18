const Title = ({ title }: { title: string }) => {
  return (
    <div className="mb-6">
      <h2 className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-3xl font-bold leading-relaxed text-white shadow-lg">
        {title}
      </h2>
    </div>
  )
}

export default Title
