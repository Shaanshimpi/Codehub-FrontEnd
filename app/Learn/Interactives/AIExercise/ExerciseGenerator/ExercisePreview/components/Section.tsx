import { Code, Eye, EyeOff, FileText, Info, Lightbulb } from "lucide-react"

const Section = ({
  show,
  setShow,
  label,
  children,
}: {
  show: boolean
  setShow: (show: boolean) => void
  label: string
  children: React.ReactNode
}) => {
  const getIcon = () => {
    if (label.includes("Hints")) return <Lightbulb size={20} />
    if (label.includes("Code")) return <Code size={20} />
    if (label.includes("Explanation")) return <FileText size={20} />
    return <Info size={20} />
  }

  return (
    <div className="mb-6">
      <button
        onClick={() => setShow(!show)}
        className="flex w-full items-center justify-between rounded-lg border border-slate-700 bg-slate-800 p-4 transition-all duration-300 hover:border-blue-500 hover:bg-slate-700"
      >
        <div className="flex items-center gap-3">
          <span className="text-blue-400">{getIcon()}</span>
          <span className="text-lg font-semibold text-white">{label}</span>
        </div>
        <div className="text-blue-400">
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </div>
      </button>

      {show && <div className="animate-fadeIn mt-4">{children}</div>}
    </div>
  )
}
export default Section
