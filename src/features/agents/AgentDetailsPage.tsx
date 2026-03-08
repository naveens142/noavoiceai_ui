import { useState, useEffect } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import AgentTabs from "./components/AgentTabs.tsx"
import AgentLoader from "./components/AgentLoader"
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

  // Load agent data only once on mount
  useEffect(() => {
    if (!agentId) return

    const fetchAgent = async () => {
      try {
        setLoading(true)

        // Check if agent data is passed through navigation state (new agent)
        const locationState = location.state as {
          agent?: Agent
          isNewAgent?: boolean
        } | undefined

        let loadedAgent: Agent
        if (locationState?.isNewAgent && locationState?.agent) {
          loadedAgent = locationState.agent
        } else {
          // Fetch existing agent from API only once
          loadedAgent = await getAgentById(agentId)
        }

        setAgent(loadedAgent)
        
        // Fetch agent's knowledge bases
        await fetchAgentKnowledgeBases(agentId)
        
        // Initialize form data
        setConfigFormData({
          name: loadedAgent.name || "",
          voice: loadedAgent.voice || "Alloy",
          language: loadedAgent.language || "English",
          timezone: loadedAgent.timezone || "Asia/Kolkata",
        })

        // Initialize prompt form data
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

  // Initialize selected KB IDs from loaded agent KBs
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
        setTimeout(() => {
          navigate("/dashboard/agents")
        }, 1000)
      } else {
        toast.error(result.error || "Failed to delete agent")
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred")
    }
  }

  const handleDeploy = async () => {
    if (!agent) return

    try {
      setDeploying(true)

      // Combine config and prompt data for update
      const updateData = {
        ...configFormData,
        ...promptFormData,
      }

      // Save all changes (config + prompt)
      await updateAgent(agent.id, updateData)
      
      // Handle Knowledge Base changes
      const currentKBIds = originalKBIds
      
      // Find KBs to add (newly selected)
      const toAdd = Array.from(selectedKBIds).filter((id: string) => !currentKBIds.has(id))
      // Find KBs to remove (unchecked)
      const toRemove = Array.from(currentKBIds).filter((id: string) => !selectedKBIds.has(id))

      // Assign new KBs
      for (const kbId of toAdd) {
        const result = await assign(agent.id, kbId as string)
        if (!result.success) {
          toast.error(`Failed to assign KB`)
          return
        }
      }

      // Remove KBs
      for (const kbId of toRemove) {
        const result = await remove(agent.id, kbId as string)
        if (!result.success) {
          toast.error(`Failed to remove KB`)
          return
        }
      }

      // Update original KB IDs to reflect new state
      setOriginalKBIds(new Set(selectedKBIds))

      // Fetch the updated agent to show latest saved data
      const refreshedAgent = await getAgentById(agent.id)
      setAgent(refreshedAgent)

      // Refetch agent's knowledge bases to update "Saved" badges
      await fetchAgentKnowledgeBases(agent.id)
      
      // Update form data with refreshed agent data
      setConfigFormData({
        name: refreshedAgent.name || "",
        voice: refreshedAgent.voice || "Alloy",
        language: refreshedAgent.language || "English",
        timezone: refreshedAgent.timezone || "Asia/Kolkata",
      })

      setPromptFormData({
        system_prompt: refreshedAgent.system_prompt || "",
        first_message: refreshedAgent.first_message || "",
        end_call_message: refreshedAgent.end_call_message || "",
      })

      toast.success("Agent deployed successfully!")
    } catch (error: any) {
      toast.error(error.message || "Failed to deploy agent")
    } finally {
      setDeploying(false)
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-cyan-300">
                Agent Builder
              </h1>

              <p className="text-gray-400 text-sm">
                Agent: {agent.name}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 px-4 py-2 rounded-xl text-cyan-300 text-sm transition">
                <PlayCircle size={16} />
                Test Assistant
              </button>

              <button
                onClick={handleDeploy}
                disabled={deploying}
                className="flex items-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-400/30 px-4 py-2 rounded-xl text-purple-300 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deploying ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Rocket size={16} />
                    Deploy
                  </>
                )}
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-400/30 px-4 py-2 rounded-xl text-red-300 text-sm transition"
              >
                <Trash2 size={16} />
                Delete
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

          {/* Delete Confirmation Modal */}
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
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        Delete Agent
                      </>
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