import { Edit, Trash2, Calendar, Bell, PhoneForwarded, Code, Settings } from "lucide-react"
import type { Tool } from "../api/tools"

interface Props {
  tool: Tool
}

const getCategoryIcon = (description: string) => {
  const desc = description.toLowerCase()
  if (desc.includes("appointment") || desc.includes("booking") || desc.includes("schedule")) {
    return <Calendar size={32} className="text-blue-400" />
  }
  if (desc.includes("notification") || desc.includes("alert") || desc.includes("notify")) {
    return <Bell size={32} className="text-yellow-400" />
  }
  if (desc.includes("transfer") || desc.includes("call")) {
    return <PhoneForwarded size={32} className="text-green-400" />
  }
  if (desc.includes("function") || desc.includes("api")) {
    return <Code size={32} className="text-purple-400" />
  }
  return <Settings size={32} className="text-cyan-400" />
}

const getTodayDate = () => {
  const today = new Date()
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
  return today.toLocaleDateString('en-US', options)
}

export default function ToolCard({ tool }: Props) {
  return (
    <div className="border border-cyan-400/20 rounded-xl bg-white/5 backdrop-blur-xl p-5 hover:border-cyan-400/40 transition">
      {/* Header with icon and status */}
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-cyan-400/10 rounded-lg">
          {getCategoryIcon(tool.description)}
        </div>
        <span className="text-xs bg-green-400/20 border border-green-400/40 text-green-300 px-2 py-1 rounded-full">
          Active
        </span>
      </div>

      {/* Tool name */}
      <h3 className="text-lg font-semibold text-white mb-2">
        {tool.display_name}
      </h3>

      {/* Category and description */}
      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-300">
          <span className="text-gray-500">Category:</span> {tool.category}
        </p>
        <p className="text-sm text-gray-400">
          {tool.description}
        </p>
      </div>

      {/* Footer with date and actions */}
      <div className="flex items-center justify-between pt-4 border-t border-cyan-400/10">
        <span className="text-xs text-gray-500">
          Created {getTodayDate()}
        </span>
        <div className="flex gap-3">
          <button className="p-2 hover:bg-cyan-400/10 rounded-lg transition text-gray-400 hover:text-cyan-300">
            <Edit size={18} />
          </button>
          <button className="p-2 hover:bg-red-400/10 rounded-lg transition text-gray-400 hover:text-red-300">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
