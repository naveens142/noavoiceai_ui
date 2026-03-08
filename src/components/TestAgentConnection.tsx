import { useState } from "react"
import { Loader2 } from "lucide-react"

export default function TestAgentConnection() {
  const [status, setStatus] = useState<string>("")
  const [logs, setLogs] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs((prev) => [...prev, `[${timestamp}] ${msg}`])
    console.log(msg)
  }

  const testConnection = async () => {
    setLoading(true)
    setLogs([])
    setStatus("")

    try {
      addLog("1️⃣ Calling /api/v1/api/agent/connect...")
      const connectResp = await fetch("http://localhost:3173/api/v1/api/agent/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!connectResp.ok) {
        throw new Error(`Connect failed: ${connectResp.status}`)
      }

      const { rtc_url, agent_url, session_id } = await connectResp.json()
      addLog(`✅ Connect response received`)
      addLog(`   - rtc_url: ${rtc_url}`)
      addLog(`   - agent_url: ${agent_url}`)
      addLog(`   - session_id: ${session_id}`)

      addLog("")
      addLog("2️⃣ Testing WebRTC offer endpoint...")
      addLog(`   POST to: ${rtc_url}`)

      // Create a minimal SDP offer to test the endpoint
      const testOffer = {
        type: "offer",
        sdp: "v=0\r\no=test 0 0 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\nm=application 0 UDP/TLS/RTP/SAVPF 0\r\na=recvonly\r\n",
        request_data: { session_id },
      }

      addLog(`   Sending: ${JSON.stringify(testOffer, null, 2)}`)

      const offerResp = await fetch(rtc_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testOffer),
      })

      if (!offerResp.ok) {
        const errText = await offerResp.text()
        throw new Error(`Offer failed: ${offerResp.status} - ${errText}`)
      }

      const answerData = await offerResp.json()
      addLog(`✅ Answer received from WebRTC endpoint`)
      addLog(`   Response: ${JSON.stringify(answerData, null, 2)}`)

      setStatus("✅ Connection test PASSED - Agent is responding!")
    } catch (err: any) {
      addLog(`❌ Error: ${err.message}`)
      setStatus(`❌ Connection test FAILED: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-[#0b1220] border border-cyan-400/20 rounded-2xl">
      <h2 className="text-xl font-bold text-cyan-300 mb-4">🧪 Agent Connection Test</h2>

      <button
        onClick={testConnection}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 px-4 py-3 rounded-xl text-cyan-300 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Testing Connection...
          </>
        ) : (
          "Test Agent Connection"
        )}
      </button>

      {status && (
        <div className={`mt-4 p-3 rounded-lg border ${
          status.includes("PASSED")
            ? "bg-emerald-500/10 border-emerald-400/20 text-emerald-300"
            : "bg-red-500/10 border-red-400/20 text-red-300"
        }`}>
          {status}
        </div>
      )}

      {logs.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Connection Logs:</h3>
          <div className="bg-black/50 border border-gray-600 rounded-lg p-4 max-h-96 overflow-y-auto font-mono text-xs text-gray-300 space-y-1">
            {logs.map((log, i) => (
              <div key={i} className="whitespace-pre-wrap break-words">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
