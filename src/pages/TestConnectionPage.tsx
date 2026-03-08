import TestAgentConnection from "../components/TestAgentConnection"

export default function TestConnectionPage() {
  return (
    <div className="min-h-screen bg-[#080b1a] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-cyan-300 mb-2">Connection Test</h1>
          <p className="text-gray-400">Verify that your agent backend is responding to WebRTC connection requests</p>
        </div>
        <TestAgentConnection />
      </div>
    </div>
  )
}
