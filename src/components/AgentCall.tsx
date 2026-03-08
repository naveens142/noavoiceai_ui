/**
 * AgentCall.tsx
 *
 * Voice agent component using the Pipecat SDK.
 *
 * Install:
 *   npm install @pipecat-ai/client-js @pipecat-ai/client-react @pipecat-ai/small-webrtc-transport
 *
 * The React SDK only exports:
 *   - PipecatClientProvider
 *   - PipecatClientAudio
 *   - usePipecatClient
 *
 * Events are handled via callbacks passed to PipecatClient constructor,
 * NOT via a useRTVIClientEvent / usePipecatClientEvent hook.
 */

import { useState, useEffect, useCallback, useRef } from "react"
import { PipecatClient } from "@pipecat-ai/client-js"
import {
  PipecatClientAudio,
  PipecatClientProvider,
  usePipecatClient,
} from "@pipecat-ai/client-react"
import { SmallWebRTCTransport } from "@pipecat-ai/small-webrtc-transport"
import { Mic, MicOff, Phone, PhoneOff, Loader2 } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type SessionState = "idle" | "connecting" | "connected" | "disconnecting" | "error"

interface TranscriptEntry {
  role: "user" | "agent" | "system"
  text: string
  ts: number
}

interface AgentCallProps {
  apiBaseUrl?: string
}

interface AgentCallInnerProps {
  apiBaseUrl: string
}

// ─── Inner component (must live inside PipecatClientProvider) ─────────────────

function AgentCallInner({ apiBaseUrl = "" }: AgentCallInnerProps) {
  const client = usePipecatClient()
  const [state, setState] = useState<SessionState>("idle")
  const [isMuted, setIsMuted] = useState(false)
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([])
  const [error, setError] = useState<string | null>(null)
  const [agentSpeaking, setAgentSpeaking] = useState(false)
  const [userSpeaking, setUserSpeaking] = useState(false)
  const [duration, setDuration] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const transcriptRef = useRef<HTMLDivElement>(null)

  // ── Register callbacks on the client once on mount ────────────────────────
  // Events come via client.on() — there is no usePipecatClientEvent hook
  useEffect(() => {
    if (!client) return

    const addEntry = (role: TranscriptEntry["role"], text: string) => {
      if (!text?.trim()) return
      setTranscript(prev => [...prev, { role, text: text.trim(), ts: Date.now() }])
    }

    client.on("connected", () => {
      setState("connected")
      setError(null)
      addEntry("system", "Connected to agent")
    })

    client.on("disconnected", () => {
      setState("idle")
      addEntry("system", "Session ended")
    })

    client.on("error", (err: any) => {
      console.error("Pipecat error:", err)
      setError(err?.message ?? "Connection error. Please try again.")
      setState("error")
    })

    client.on("botStartedSpeaking", () => setAgentSpeaking(true))
    client.on("botStoppedSpeaking", () => setAgentSpeaking(false))
    client.on("userStartedSpeaking", () => setUserSpeaking(true))
    client.on("userStoppedSpeaking", () => setUserSpeaking(false))

    client.on("botTranscript", (data: any) => {
      addEntry("agent", data?.text ?? "")
    })

    client.on("userTranscript", (data: any) => {
      if (data?.final) addEntry("user", data?.text ?? "")
    })

    // Cleanup listeners on unmount
    return () => {
      client.removeAllListeners?.()
    }
  }, [client])

  // ── Duration timer ────────────────────────────────────────────────────────
  useEffect(() => {
    if (state === "connected") {
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
      if (state === "idle") setDuration(0)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [state])

  // ── Auto-scroll transcript ────────────────────────────────────────────────
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight
    }
  }, [transcript])

  const formatDuration = (secs: number): string => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0")
    const s = (secs % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleConnect = useCallback(async () => {
    if (!client) {
      setError("Client not initialized")
      setState("error")
      return
    }
    setError(null)
    setTranscript([])
    setState("connecting")
    try {
      // Get fresh connection details from the backend
      const resp = await fetch(`${apiBaseUrl}/api/v1/api/agent/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!resp.ok) {
        throw new Error(`Failed to get connection details: ${resp.status}`)
      }

      const { rtc_url, session_id } = await resp.json()
      console.log("[AgentCall] handleConnect - rtc_url:", rtc_url, "session_id:", session_id)

      // Call connect with proper connection params for the transport
      // The endpoint is the WebRTC offer URL and requestData contains the session_id
      await client.connect({
        webrtcRequestParams: {
          endpoint: rtc_url,
          requestData: session_id ? { session_id } : undefined,
        },
      } as any)
    } catch (err: any) {
      console.error("Connect failed:", err)
      setError(err?.message ?? "Failed to connect. Is the agent running?")
      setState("error")
    }
  }, [client, apiBaseUrl])

  const handleDisconnect = useCallback(async () => {
    if (!client) return
    setState("disconnecting")
    try {
      await client.disconnect()
    } catch (err: any) {
      console.error("Disconnect error:", err)
    } finally {
      setState("idle")
    }
  }, [client])

  const handleMute = useCallback(async () => {
    if (!client) return
    const next = !isMuted
    await client.enableMic(!next)
    setIsMuted(next)
  }, [client, isMuted])

  const isConnected = state === "connected"
  const isConnecting = state === "connecting" || state === "disconnecting"

  // ── Render ────────────────────────────────────────────────────────────────
return (
  <div className="flex gap-6 h-[600px] w-full overflow-hidden">

    {/* LEFT PANEL (Fixed) */}
    <div className="flex flex-col items-center justify-center gap-8 w-38 flex-shrink-0">

      {/* Agent */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">

          <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
            agentSpeaking
              ? "bg-cyan-500/40 blur-2xl scale-110 animate-pulse"
              : "bg-cyan-500/0"
          }`} />

          <div className={`relative w-32 h-32 rounded-full bg-black/50 border-2 flex items-center justify-center overflow-hidden transition-all duration-300 ${
            agentSpeaking
              ? "border-cyan-400 scale-110 shadow-lg shadow-cyan-500/50 ring-2 ring-cyan-500/30"
              : "border-cyan-500/40 ring-2 ring-cyan-500/20"
          }`}>
            <img src="/agent.webp" className="w-full h-full object-cover" />
          </div>

          {agentSpeaking && (
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-cyan-500 rounded-full animate-pulse border-2 border-white" />
          )}
        </div>

        <div className="text-center">
          <h4 className="text-sm font-bold text-white">Agent</h4>
          <p className={`text-xs ${
            agentSpeaking
              ? "text-cyan-400 font-medium"
              : "text-gray-500"
          }`}>
            {agentSpeaking ? "🎤 Speaking..." : "Listening"}
          </p>
        </div>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

      {/* User */}
      <div className="flex flex-col items-center gap-4">

        <div className="relative">

          <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
            userSpeaking
              ? "bg-purple-500/40 blur-2xl scale-110 animate-pulse"
              : "bg-purple-500/0"
          }`} />

          <div className={`relative w-32 h-32 rounded-full bg-black/50 border-2 flex items-center justify-center overflow-hidden transition-all duration-300 ${
            userSpeaking
              ? "border-purple-400 scale-110 shadow-lg shadow-purple-500/50 ring-2 ring-purple-500/30"
              : "border-purple-500/40 ring-2 ring-purple-500/20"
          }`}>
            <img src="/user.webp" className="w-full h-full object-cover" />
          </div>

          {userSpeaking && (
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-purple-500 rounded-full animate-pulse border-2 border-white" />
          )}
        </div>

        <div className="text-center">
          <h4 className="text-sm font-bold text-white">You</h4>
          <p className={`text-xs ${
            userSpeaking
              ? "text-purple-400 font-medium"
              : "text-gray-500"
          }`}>
            {userSpeaking ? "🎙️ Speaking..." : "Ready"}
          </p>
        </div>
      </div>

    </div>

    {/* RIGHT PANEL */}
    <div className="flex flex-col flex-1 min-w-0 h-full">

      {/* STATUS BAR */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 bg-black/30 rounded-lg border border-white/5 mb-3">

        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${
            isConnected
              ? "bg-emerald-400"
              : state === "error"
              ? "bg-red-500"
              : "bg-amber-500"
          }`} />

          <span className={`text-xs font-medium ${
            isConnected
              ? "text-emerald-400"
              : state === "error"
              ? "text-red-400"
              : "text-amber-400"
          }`}>
            {isConnected ? "Live" : state === "error" ? "Error" : "Ready"}
          </span>
        </div>

        {isConnected && (
          <span className="text-xs text-gray-500 font-mono">
            {formatDuration(duration)}
          </span>
        )}

      </div>

      {/* CONVERSATION (SCROLLABLE) */}
      <div className="flex-1 min-h-0 bg-black/40 rounded-xl border border-white/5 p-4 flex flex-col">

        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Conversation
        </div>

        <div
          ref={transcriptRef}
          className="flex-1 overflow-y-auto pr-2 flex flex-col gap-2"
        >

          {transcript.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
              {isConnected
                ? "Start speaking..."
                : 'Click "Start Call" to begin'}
            </div>
          )}

          {transcript.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user"
                  ? "justify-end"
                  : msg.role === "system"
                  ? "justify-center"
                  : "justify-start"
              }`}
            >

              {msg.role === "system" ? (
                <span className="text-xs text-gray-600 italic">
                  {msg.text}
                </span>
              ) : (
                <div className={`max-w-xs px-3 py-2 rounded-lg text-xs ${
                  msg.role === "user"
                    ? "bg-purple-600/30 border border-purple-400/30"
                    : "bg-cyan-600/30 border border-cyan-400/30"
                }`}>
                  {msg.text}
                </div>
              )}

            </div>
          ))}

        </div>
      </div>

      {/* FOOTER CONTROLS (FIXED) */}
      <div className="flex-shrink-0 pt-3">

        <div className="flex gap-2">

          {!isConnected && !isConnecting ? (
            <button
              onClick={handleConnect}
              className="flex-1 flex items-center justify-center gap-2 bg-cyan-600/40 hover:bg-cyan-600/60 border border-cyan-400/40 px-4 py-2.5 rounded-lg text-cyan-300 text-sm"
            >
              <Phone size={16} />
              Start Call
            </button>
          ) : isConnected ? (
            <>
              <button
                onClick={handleMute}
                className="px-3 py-2.5 rounded-lg border bg-white/10 border-white/20"
              >
                {isMuted ? <MicOff size={16}/> : <Mic size={16}/>}
              </button>

              <button
                onClick={handleDisconnect}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600/40 hover:bg-red-600/60 border border-red-400/40 px-4 py-2.5 rounded-lg text-red-300 text-sm"
              >
                <PhoneOff size={16} />
                End Call
              </button>
            </>
          ) : (
            <button
              disabled
              className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-lg text-gray-500"
            >
              <Loader2 size={16} className="animate-spin"/>
              Connecting...
            </button>
          )}

        </div>

      </div>

    </div>

    <PipecatClientAudio />

  </div>
)
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function AgentCall({ apiBaseUrl = "" }: AgentCallProps) {
  const [pipecatClient, setPipecatClient] = useState<PipecatClient | null>(null)
  const [initError, setInitError] = useState<string | null>(null)

  const initClient = useCallback(async () => {
    setInitError(null)
    try {
      // Create transport without connection params yet
      const transport = new SmallWebRTCTransport()

      const client = new PipecatClient({
        transport,
        enableMic: true,
        enableCam: false,
        callbacks: {
          onConnected: () => console.log("[AgentCall] Connected"),
          onDisconnected: () => console.log("[AgentCall] Disconnected"),
          onBotReady: () => console.log("[AgentCall] Bot ready"),
        },
      })

      setPipecatClient(client)
    } catch (err: any) {
      console.error("AgentCall init error:", err)
      setInitError(err.message ?? "Failed to reach agent")
    }
  }, [])

  useEffect(() => {
    initClient()
  }, [initClient])

  // Cleanup on unmount and tab close
  useEffect(() => {
    const cleanup = () => { pipecatClient?.disconnect().catch(() => {}) }
    window.addEventListener("beforeunload", cleanup)
    return () => {
      window.removeEventListener("beforeunload", cleanup)
      cleanup()
    }
  }, [pipecatClient])

  if (initError) {
    return (
      <div className="flex flex-col gap-3">
        <div className="bg-red-500/10 border border-red-400/20 rounded-lg px-3 py-2 text-xs text-red-300">
          ⚠️ {initError}
        </div>
        <button
          onClick={initClient}
          className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl text-gray-300 text-sm transition"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!pipecatClient) {
    return (
      <div className="flex items-center justify-center py-8 gap-2 text-gray-500 text-sm">
        <Loader2 size={16} className="animate-spin" />
        Initialising…
      </div>
    )
  }

  return (
    <PipecatClientProvider client={pipecatClient}>
      <AgentCallInner apiBaseUrl={apiBaseUrl} />
    </PipecatClientProvider>
  )
}
