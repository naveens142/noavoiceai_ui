import { useState } from "react"

import ConfigureTab from "../tabs/ConfigureTab"
import PromptPage from "../tabs/PromtPage"
import PhoneNumberTab from "../tabs/PhoneNumberPage"
import KnowledgeBaseTab from "../tabs/KnowledgeBasePage"
import type { Agent } from "../types"

interface Props {
  agent: Agent
  configFormData: {
    name: string
    voice: string
    language: string
    timezone: string
  }
  onConfigChange: (data: any) => void
  promptFormData: {
    system_prompt: string
    first_message: string
    end_call_message: string
  }
  onPromptChange: (data: any) => void
  selectedKBIds: Set<string>
  onSelectedKBsChange: (ids: Set<string>) => void
}

export default function AgentTabs({
  agent,
  configFormData,
  onConfigChange,
  promptFormData,
  onPromptChange,
  selectedKBIds,
  onSelectedKBsChange,
}: Props) {

  const [activeTab, setActiveTab] = useState("configure")

  const tabs = [
    { id: "configure", label: "Configure" },
    { id: "prompt", label: "Prompt" },
    { id: "phone", label: "Phone Number" },
    { id: "provider", label: "Provider" },
    { id: "actions", label: "Actions" },
    { id: "knowledge", label: "Knowledge Base" },
  ]

  return (
    <div className="space-y-6">

      {/* Tabs Header */}
      <div className="flex flex-wrap gap-2 border-b border-cyan-400/20 pb-3">

        {tabs.map((tab) => (

          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm transition
            ${
              activeTab === tab.id
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>

        ))}

      </div>

      {/* Tab Content */}
      <div>

        {activeTab === "configure" && (
          <ConfigureTab
            formData={configFormData}
            onFormChange={onConfigChange}
          />
        )}

        {activeTab === "prompt" && (
          <PromptPage 
            agent={agent} 
            formData={promptFormData}
            onFormChange={onPromptChange}
          />
        )}

        {activeTab === "phone" && <PhoneNumberTab agent={agent} />}

        {activeTab === "provider" && (
          <div className="text-gray-400 text-sm">Provider configuration coming soon</div>
        )}

        {activeTab === "actions" && (
          <div className="text-gray-400 text-sm">Actions configuration coming soon</div>
        )}

        {activeTab === "knowledge" && (
          <KnowledgeBaseTab
            agent={agent}
            selectedKBIds={selectedKBIds}
            onSelectedKBsChange={onSelectedKBsChange}
          />
        )}

      </div>

    </div>
  )
}