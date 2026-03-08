import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { X, Loader } from "lucide-react"
import { createAgent } from "../api"

interface Props {
  open: boolean
  onClose: () => void
}

export default function CreateAgentModal({ open, onClose }: Props) {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const handleCreateAgent = async () => {
    setError(null)
    
    if (!name.trim()) {
      setError("Agent name is required")
      return
    }

    try {
      setLoading(true)

      // Create agent with API call
      const newAgent = await createAgent({
        name: name.trim(),
        description: description.trim(),
      })

      toast.success(`Agent "${newAgent.name}" created successfully!`)

      // Clear form and close modal
      setName("")
      setDescription("")
      onClose()
      
      // Navigate to agent builder with agent data
      navigate(`/dashboard/agents/${newAgent.id}`, { 
        state: { agent: newAgent, isNewAgent: true } 
      })
    } catch (err: any) {
      console.error("Agent creation failed", err)
      const errorMessage = err.response?.data?.detail || err.message || "Failed to create agent"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleCreateAgent()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-[500px] bg-gradient-to-br from-white/5 to-white/3 border border-cyan-400/20 rounded-2xl p-8 shadow-[0_0_40px_rgba(0,255,255,0.2)] backdrop-blur-xl mx-4">
        
        {/* Header with close button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-cyan-300">
              Create AI Agent
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Set up a new AI agent with basic information
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Agent Name */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-300 block mb-2">
            Agent Name *
          </label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError(null)
            }}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-cyan-400/20 focus:border-cyan-400 focus:bg-white/10 outline-none text-white transition disabled:opacity-50"
            placeholder="e.g., Customer Support Agent"
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-1">
            This will be the name of your AI agent
          </p>
        </div>

        {/* Description */}
        <div className="mb-8">
          <label className="text-sm font-medium text-gray-300 block mb-2">
            Agent Role & Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-cyan-400/20 focus:border-cyan-400 focus:bg-white/10 outline-none text-white resize-none transition disabled:opacity-50"
            placeholder="Describe what this agent will do. e.g., Handles customer support calls, manages appointment scheduling, etc."
          />
          <p className="text-xs text-gray-500 mt-1">
            Keep it brief and descriptive
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-gray-500/20 hover:bg-gray-500/30 border border-gray-400/30 text-gray-300 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateAgent}
            disabled={loading || !name.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Creating...
              </>
            ) : (
              "Create Agent"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}