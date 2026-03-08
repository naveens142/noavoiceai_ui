import { useState } from "react"
import { Calendar, Bell, PhoneForwarded, Code, Settings } from "lucide-react"
import RealtimeBookingTab from "./RealtimeBookingTab"
import CustomFunctionTab from "./CustomFunctionTab"

export default function ActionsPage() {
  const [activeTab, setActiveTab] = useState("realtime-booking")

  const tabs = [
    {
      id: "realtime-booking",
      label: "Realtime Booking",
      icon: Calendar,
      description: "Schedule appointments and manage booking workflows",
    },
    {
      id: "send-notification",
      label: "Send Notification",
      icon: Bell,
      description: "Alert users & teams",
    },
    {
      id: "call-transfer",
      label: "Call Transfer",
      icon: PhoneForwarded,
      description: "Transfers call to real user",
    },
    {
      id: "custom-function",
      label: "Custom Function",
      icon: Code,
      description: "Define and call external APIs",
    },
    {
      id: "global-variables",
      label: "Global Variables",
      icon: Settings,
      description: "Manage shared variables",
    },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "realtime-booking":
        return <RealtimeBookingTab />
      case "send-notification":
        return (
          <div className="text-center py-12 text-gray-400">
            <Bell size={48} className="mx-auto mb-4 opacity-50" />
            <p>Send Notification configuration coming soon</p>
          </div>
        )
      case "call-transfer":
        return (
          <div className="text-center py-12 text-gray-400">
            <PhoneForwarded size={48} className="mx-auto mb-4 opacity-50" />
            <p>Call Transfer configuration coming soon</p>
          </div>
        )
      case "custom-function":
        return <CustomFunctionTab />
      case "global-variables":
        return (
          <div className="text-center py-12 text-gray-400">
            <Settings size={48} className="mx-auto mb-4 opacity-50" />
            <p>Global Variables configuration coming soon</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-cyan-300 mb-2">Actions Setup</h1>
        <p className="text-gray-400">Configure automated actions</p>
      </div>

      {/* Sidebar Tabs */}
      <div className="flex gap-6">
        <div className="w-56 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-start gap-3 p-4 rounded-xl transition text-left
                ${
                  activeTab === tab.id
                    ? "bg-cyan-500/20 border border-cyan-400/30"
                    : "hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon size={20} className={activeTab === tab.id ? "text-cyan-300" : "text-gray-400"} />
                <div>
                  <div className={`text-sm font-medium ${activeTab === tab.id ? "text-cyan-300" : "text-gray-300"}`}>
                    {tab.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{tab.description}</div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}
