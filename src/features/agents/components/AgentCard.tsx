import type { Agent } from "../types"
import { useNavigate } from "react-router-dom"
import agentImage from "../../../assets/ai-agent.png"

interface Props {
  agent: Agent
}

export default function AgentCard({ agent }: Props) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/agents/${agent.id}`)}
      className="group relative cursor-pointer bg-white/5 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(0,255,255,0.4)]"
    >
      {/* Robot Image */}
      <div className="flex justify-center -mt-6">
        <img
          src={agentImage}
          alt="AI Agent"
          className="w-16 h-16 object-contain rounded-full shadow-[0_0_15px_rgba(0,255,255,0.4)]"
        />
      </div>

      {/* Agent Name */}
      <h3 className="mt-3 text-lg font-bold text-cyan-300 text-center group-hover:text-cyan-200 truncate">
        {agent.name}
      </h3>

      {/* Description */}
      <p className="mt-1 text-sm text-gray-400 text-center line-clamp-1">
        {agent.description || "No description provided"}
      </p>

      {/* Language + Timezone */}
      <div className="mt-3 flex justify-center text-xs text-gray-400 gap-2">
        {agent.language && <span>{agent.language}</span>}
        {agent.timezone && <span>{agent.timezone}</span>}
      </div>

      {/* Status Badge */}
      <div
        className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
          agent.is_active
            ? "bg-green-400 shadow-[0_0_10px_rgba(34,197,94,0.8)]"
            : "bg-red-400 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
        }`}
      />
    </div>
  )
}