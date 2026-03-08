import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import useKnowledgeBase from "../hooks/useKnowledgeBase"
import KBLoader from "../components/KBLoader"
import type { Agent, KnowledgeBase } from "../types"

interface Props {
  agent: Agent
  selectedKBIds: Set<string>
  onSelectedKBsChange: (ids: Set<string>) => void
}

export default function KnowledgeBasePage({ agent, selectedKBIds, onSelectedKBsChange }: Props) {
  const [allKBs, setAllKBs] = useState<KnowledgeBase[]>([])
  const [loadingData, setLoadingData] = useState(false)

  const {
    agentKBs,
    fetchAgentKnowledgeBases,
    fetchAllKnowledgeBases,
  } = useKnowledgeBase({ agentId: agent.id })

  // Load initial data only once
  useEffect(() => {
    loadData()
  }, [agent.id])

  // Initialize selected KB IDs from agent's current KBs
  useEffect(() => {
    if (agentKBs.length > 0) {
      const savedIds = new Set(agentKBs.map(kb => kb.knowledge_base.id))
      onSelectedKBsChange(savedIds)
    }
  }, [agentKBs])

  const loadData = async () => {
    setLoadingData(true)
    try {
      await fetchAgentKnowledgeBases(agent.id)
      const allResult = await fetchAllKnowledgeBases(0, 100)
      if (allResult) {
        setAllKBs(allResult.items)
      }
    } finally {
      setLoadingData(false)
    }
  }

  const toggleKB = (kbId: string) => {
    const newSelected = new Set(selectedKBIds)
    if (newSelected.has(kbId)) {
      newSelected.delete(kbId)
    } else {
      newSelected.add(kbId)
    }
    onSelectedKBsChange(newSelected)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const getFileIcon = (fileType: string) => {
    const ext = fileType.toLowerCase()
    if (ext.includes("pdf")) return "📄"
    if (ext.includes("word") || ext.includes("docx")) return "📝"
    if (ext.includes("sheet") || ext.includes("xlsx")) return "📊"
    if (ext.includes("text") || ext.includes("txt")) return "📋"
    return "📦"
  }

  const isSaved = (kbId: string) => {
    return agentKBs.some(kb => kb.knowledge_base.id === kbId)
  }

  return (
    <div className="space-y-6 text-white">
      <div>
        <h2 className="text-xl font-semibold mb-6">
          Select Knowledge Documents
        </h2>

        {loadingData ? (
          <KBLoader />
        ) : allKBs.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="mb-2">No knowledge documents available</p>
            <p className="text-sm">Upload documents in Knowledge Base section to get started</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {allKBs.map((kb) => {
                const selected = selectedKBIds.has(kb.id)
                const wasSaved = isSaved(kb.id)

                return (
                  <div
                    key={kb.id}
                    onClick={() => toggleKB(kb.id)}
                    className={`cursor-pointer border rounded-xl p-5 transition flex items-center gap-4
                    ${
                      selected
                        ? "border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/10"
                        : wasSaved
                          ? "border-green-400/40 bg-green-400/5 hover:border-green-400/60"
                          : "border-cyan-500/10 bg-[#0b1220] hover:border-cyan-400/40"
                    }`}
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => {}}
                      className="cursor-pointer w-5 h-5"
                    />

                    {/* File Icon */}
                    <span className="text-2xl">
                      {getFileIcon(kb.file_type)}
                    </span>

                    {/* Document Info */}
                    <div className="flex-1">
                      <div className="font-medium text-white">
                        {kb.document_name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {kb.file_name} • {formatFileSize(kb.file_size)}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      {wasSaved && (
                        <span className="text-xs bg-green-400/20 border border-green-400/40 text-green-300 px-3 py-1 rounded-full flex items-center gap-1">
                          <Check size={12} />
                          Saved
                        </span>
                      )}
                      {!wasSaved && selectedKBIds.has(kb.id) && (
                        <span className="text-xs bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 px-3 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}