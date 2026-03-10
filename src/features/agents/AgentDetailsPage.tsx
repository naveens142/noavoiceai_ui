import { useState, useEffect, useRef } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import AgentTabs from "./components/AgentTabs.tsx"
import AgentLoader from "./components/AgentLoader"
import AgentCall from "../../components/AgentCall.tsx"
import { PlayCircle, Rocket, Trash2, Loader2, X } from "lucide-react"
import { getAgentById, updateAgent } from "./api"
import useDeleteAgent from "./hooks/useDeleteAgent"
import useKnowledgeBase from "./hooks/useKnowledgeBase"
import type { Agent } from "./types"

export default function AgentDetailsPage() {
  const { agentId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [deploying, setDeploying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showTestModal, setShowTestModal] = useState(false)   // ← new

  // Form states for each tab
  const [configFormData, setConfigFormData] = useState({
    name: "",
    voice: "",
    language: "",
    timezone: "",
  })
  const [promptFormData, setPromptFormData] = useState({
    system_prompt: "",
    first_message: "",
    end_call_message: "",
  })
  const [selectedKBIds, setSelectedKBIds] = useState<Set<string>>(new Set())
  const [originalKBIds, setOriginalKBIds] = useState<Set<string>>(new Set())

  const { Delete, loading: deleteLoading } = useDeleteAgent()
  const { agentKBs, fetchAgentKnowledgeBases, assign, remove } = useKnowledgeBase({ agentId: agentId || "" })

  // Prevent concurrent deploy calls
  const deployInProgressRef = useRef(false)

  useEffect(() => {
    if (!agentId) return

    const fetchAgent = async () => {
      try {
        setLoading(true)

        const locationState = location.state as {
          agent?: Agent
          isNewAgent?: boolean
        } | undefined

        let loadedAgent: Agent
        if (locationState?.isNewAgent && locationState?.agent) {
          loadedAgent = locationState.agent
        } else {
          loadedAgent = await getAgentById(agentId)
        }

        setAgent(loadedAgent)
        await fetchAgentKnowledgeBases(agentId)

        setConfigFormData({
          name: loadedAgent.name || "",
          voice: loadedAgent.voice || "Alloy",
          language: loadedAgent.language || "English",
          timezone: loadedAgent.timezone || "Asia/Kolkata",
        })

        setPromptFormData({
          system_prompt: loadedAgent.system_prompt || "",
          first_message: loadedAgent.first_message || "",
          end_call_message: loadedAgent.end_call_message || "",
        })
      } catch (err: any) {
        console.error("Failed to fetch agent:", err)
        setError(err.message || "Failed to load agent")
      } finally {
        setLoading(false)
      }
    }

    fetchAgent()
  }, [agentId])

  useEffect(() => {
    if (agentKBs.length > 0) {
      const kbIds = new Set(agentKBs.map(kb => kb.knowledge_base.id))
      setOriginalKBIds(kbIds)
      setSelectedKBIds(new Set(kbIds))
    }
  }, [agentKBs])

  const handleDeleteAgent = async () => {
    if (!agent) return
    try {
      const result = await Delete(agent.id)
      if (result.success) {
        toast.success("Agent deleted successfully!")
        setShowDeleteModal(false)
        setTimeout(() => navigate("/dashboard/agents"), 1000)
      } else {
        toast.error(result.error || "Failed to delete agent")
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred")
    }
  }

  const handleDeploy = async () => {
    if (!agent) return
    
    // Prevent concurrent deploy requests
    if (deployInProgressRef.current) {
      toast.error("Deployment in progress. Please wait.")
      return
    }
    
    deployInProgressRef.current = true
    
    try {
      setDeploying(true)

      const updateData = { ...configFormData, ...promptFormData }
      await updateAgent(agent.id, updateData)

      const currentKBIds = originalKBIds
      const toAdd = Array.from(selectedKBIds).filter((id: string) => !currentKBIds.has(id))
      const toRemove = Array.from(currentKBIds).filter((id: string) => !selectedKBIds.has(id))

      for (const kbId of toAdd) {
        const result = await assign(agent.id, kbId as string)
        if (!result.success) { toast.error("Failed to assign KB"); return }
      }
      for (const kbId of toRemove) {
        const result = await remove(agent.id, kbId as string)
        if (!result.success) { toast.error("Failed to remove KB"); return }
      }

      setOriginalKBIds(new Set(selectedKBIds))

      // const refreshedAgent = await getAgentById(agent.id)
      // setAgent(refreshedAgent)
      // await fetchAgentKnowledgeBases(agent.id)

      // setConfigFormData({
      //   name: refreshedAgent.name || "",
      //   voice: refreshedAgent.voice || "Alloy",
      //   language: refreshedAgent.language || "English",
      //   timezone: refreshedAgent.timezone || "Asia/Kolkata",
      // })
      // setPromptFormData({
      //   system_prompt: refreshedAgent.system_prompt || "",
      //   first_message: refreshedAgent.first_message || "",
      //   end_call_message: refreshedAgent.end_call_message || "",
      // })

      toast.success("Agent deployed successfully!")
    } catch (error: any) {
      toast.error(error.message || "Failed to deploy agent")
    } finally {
      setDeploying(false)
      deployInProgressRef.current = false
    }
  }

  return (
    <div className="space-y-8">
      {loading ? (
        <AgentLoader />
      ) : error ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-red-400">Error: {error}</div>
        </div>
      ) : agent ? (
        <>
          {/* Agent Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-cyan-300">Agent Builder</h1>
              <p className="text-gray-400 text-xs sm:text-sm">Agent: {agent.name}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">

              {/* ── Test Assistant button ── */}
              <button
                onClick={() => setShowTestModal(true)}
                className="flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 px-3 sm:px-4 py-2 rounded-xl text-cyan-300 text-xs sm:text-sm transition flex-1 sm:flex-none justify-center sm:justify-start"
              >
                <PlayCircle size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Test Assistant</span>
                <span className="sm:hidden">Test</span>
              </button>

              <button
                onClick={handleDeploy}
                disabled={deploying}
                className="flex items-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-400/30 px-3 sm:px-4 py-2 rounded-xl text-purple-300 text-xs sm:text-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none justify-center sm:justify-start"
              >
                {deploying ? (
                  <><Loader2 size={14} className="animate-spin sm:w-4 sm:h-4" /><span className="hidden sm:inline">Deploying...</span><span className="sm:hidden">Deploying</span></>
                ) : (
                  <><Rocket size={14} className="sm:w-4 sm:h-4" /><span className="hidden sm:inline">Deploy</span><span className="sm:hidden">Deploy</span></>
                )}
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-400/30 px-3 sm:px-4 py-2 rounded-xl text-red-300 text-xs sm:text-sm transition flex-1 sm:flex-none justify-center sm:justify-start"
              >
                <Trash2 size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Delete</span>
                <span className="sm:hidden">Delete</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <AgentTabs
            agent={agent}
            configFormData={configFormData}
            onConfigChange={setConfigFormData}
            promptFormData={promptFormData}
            onPromptChange={setPromptFormData}
            selectedKBIds={selectedKBIds}
            onSelectedKBsChange={setSelectedKBIds}
          />

          {/* ── Test Assistant Modal ────────────────────────────────────── */}
          {showTestModal && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="bg-[#0b1220] border border-cyan-400/20 rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col">

                {/* Modal header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-gradient-to-r from-cyan-500/5 to-transparent">
                  <div>
                    <h3 className="text-xl font-bold text-white">Test Voice Assistant</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{agent.name}</p>
                  </div>
                  <button
                    onClick={() => setShowTestModal(false)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* AgentCall component */}
                <div className="flex-1 overflow-hidden p-6">
                  <AgentCall
                    apiBaseUrl={import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000"}
                  />
                </div>

              </div>
            </div>
          )}

          {/* ── Delete Confirmation Modal ───────────────────────────────── */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="bg-[#0b1220] border border-red-400/30 rounded-2xl p-6 max-w-md shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Delete Agent</h3>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    disabled={deleteLoading}
                    className="text-gray-400 hover:text-white disabled:opacity-50"
                  >
                    <X size={20} />
                  </button>
                </div>

                <p className="text-gray-400 mb-6">
                  Are you sure you want to delete the agent{" "}
                  <span className="font-semibold text-white">"{agent.name}"</span>?
                </p>

                <p className="text-sm text-gray-500 mb-6 bg-red-400/10 border border-red-400/20 rounded-lg p-3">
                  ⚠️ This action cannot be undone. All agent configurations will be
                  permanently removed.
                </p>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    disabled={deleteLoading}
                    className="px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-400/30 rounded-lg text-gray-300 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleDeleteAgent}
                    disabled={deleteLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/50 rounded-lg text-red-300 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteLoading ? (
                      <><Loader2 size={16} className="animate-spin" />Deleting...</>
                    ) : (
                      <><Trash2 size={16} />Delete Agent</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  )
}