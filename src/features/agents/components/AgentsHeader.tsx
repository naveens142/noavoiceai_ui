import { Search, Plus } from "lucide-react"
import { useState } from "react"

interface Props {
  onSearch: (query: string) => void
}

export default function AgentsHeader({ onSearch }: Props) {
  const [query, setQuery] = useState("")

  const handleChange = (value: string) => {
    setQuery(value)
    onSearch(value)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-cyan-300">
        AI Agents
      </h2>

      <div className="relative group">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur opacity-0 group-focus-within:opacity-100 transition" />

        <div className="relative flex items-center bg-white/5 backdrop-blur-xl border border-cyan-400/20 rounded-2xl px-4 py-4">
          <Search className="text-cyan-400 mr-3" size={20} />

          <input
            type="text"
            placeholder="Search your AI agents intelligently..."
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-400"
          />

          <button className="ml-4 flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 px-4 py-2 rounded-xl text-cyan-300 text-sm transition shadow-[0_0_15px_rgba(0,255,255,0.3)]">
            <Plus size={16} />
            Create Agent
          </button>
        </div>
      </div>
    </div>
  )
}