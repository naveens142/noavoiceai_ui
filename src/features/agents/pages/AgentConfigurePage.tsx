import { NavLink, useParams } from "react-router-dom"

export default function AgentConfigSidebar() {
  const { agentId } = useParams()

  const links = [
    { label: "Configure", path: "configure" },
    { label: "Prompt", path: "prompt" },
    { label: "Phone Number", path: "phone" },
    { label: "Providers", path: "providers" },
    { label: "Actions", path: "actions" },
    { label: "Knowledge Base", path: "knowledge" },
  ]

  return (
    <div className="w-64 border-r border-cyan-500/10 p-4">
      {links.map(link => (
        <NavLink
          key={link.path}
          to={`/agents/${agentId}/${link.path}`}
          className={({ isActive }) =>
            `block p-3 rounded-lg mb-2 transition ${
              isActive
                ? "bg-cyan-500/20 text-cyan-300"
                : "text-gray-400 hover:bg-cyan-500/10"
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </div>
  )
}