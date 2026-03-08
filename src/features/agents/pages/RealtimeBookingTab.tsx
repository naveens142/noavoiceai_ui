import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { getAvailableTools, type Tool } from "../api/tools"
import ToolCard from "../components/ToolCard"
import { toast } from "sonner"

export default function RealtimeBookingTab() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTools()
  }, [])

  const loadTools = async () => {
    try {
      setLoading(true)
      setError(null)
      const tools = await getAvailableTools()
      // Filter tools by appointment category
      const appointmentTools = tools.filter(
        tool => tool.category.toLowerCase().includes("appointment")
      )
      setTools(appointmentTools)
    } catch (err: any) {
      console.error("Failed to load tools:", err)
      setError(err.message || "Failed to load tools")
      toast.error("Failed to load available tools")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Realtime Booking</h2>
        <p className="text-gray-400">Schedule appointments and manage booking workflows</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-cyan-400" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-400">{error}</p>
          <button
            onClick={loadTools}
            className="mt-4 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 rounded-lg text-cyan-300 transition"
          >
            Try Again
          </button>
        </div>
      ) : tools.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No appointment tools available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  )
}
