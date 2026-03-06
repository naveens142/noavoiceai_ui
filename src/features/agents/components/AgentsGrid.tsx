import type { Agent } from "../types"
import AgentCard from "./AgentCard"

interface Props {
  agents: Agent[]
}

export default function AgentsGrid({ agents }: Props) {
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
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  )
}