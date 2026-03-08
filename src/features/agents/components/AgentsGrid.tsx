import type { Agent } from "../types"
import AgentCard from "./AgentCard"
import { useNavigate } from "react-router-dom"

interface Props {
  agents: Agent[]
}

export default function AgentsGrid({ agents }: Props) {
  const navigate = useNavigate()
  if (agents.length === 0) {
    return (
      <div className="text-gray-400 text-center py-20">
        No AI agents found.
      </div>
    )
  }

return (
  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
    {agents.map((agent) => (
      <div
        key={agent.id}
        onClick={() => navigate(`/dashboard/agents/${agent.id}`)}
        className="cursor-pointer"
      >
        <AgentCard agent={agent} />
      </div>
    ))}
  </div>
)
}