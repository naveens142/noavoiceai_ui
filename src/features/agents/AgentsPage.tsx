import useAgents from "./hooks/useAgents"
import AgentsHeader from "./components/AgentsHeader"
import AgentsGrid from "./components/AgentsGrid"
import AgentsSkeleton from "./components/AgentsSkeleton"

export default function AgentsPage() {
  const { agents, loading, error, search } = useAgents()

  return (
    <div className="space-y-8">
      <AgentsHeader onSearch={search} />

      {loading && <AgentsSkeleton />}

      {error && (
        <div className="text-red-400 text-sm">{error}</div>
      )}

      {!loading && !error && (
        <AgentsGrid agents={agents} />
      )}
    </div>
  )
}