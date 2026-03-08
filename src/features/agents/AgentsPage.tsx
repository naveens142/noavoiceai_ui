import useAgents from "./hooks/useAgents"
import AgentsHeader from "./components/AgentsHeader"
import AgentsGrid from "./components/AgentsGrid"
import AgentsSkeleton from "./components/AgentsSkeleton"
import { useState } from "react"
import CreateAgentModal from "./components/CreateAgentModal"

export default function AgentsPage() {
  const { agents, loading, error, search } = useAgents()
  const [openModal, setOpenModal] = useState(false)

  return (
    <div className="space-y-8">
      <AgentsHeader
        onSearch={search}
        onCreateAgent={() => setOpenModal(true)}
      />
     
      {loading && <AgentsSkeleton />}

      {error && (
        <div className="text-red-400 text-sm">{error}</div>
      )}

      {!loading && !error && (
        <AgentsGrid agents={agents} />
      )}

      <CreateAgentModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  )
}