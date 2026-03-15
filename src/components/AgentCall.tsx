/**
 * AgentCall.tsx — Daily.co SDK-based Agent Call Component
 *
 * Uses Daily.co SDK to connect to a Pipecat agent with Daily transport.
 * Endpoint: POST http://localhost:8000/api/v1/agent/sessions/with-bot
 */

import { useEffect, useRef, useCallback, useState } from "react";
import { Mic, MicOff, Phone, PhoneOff, Send } from "lucide-react";

// ════════════════════════════════════════════════════════════════════════════
// ── Types
// ════════════════════════════════════════════════════════════════════════════

type SessionState = "idle" | "connecting" | "connected" | "disconnecting" | "error";

interface TranscriptEntry {
  id: string;
  role: "user" | "agent" | "system";
  text: string;
  ts: number;
  isStreaming?: boolean;
}

interface SessionResponse {
  session_id: string;
  room_url: string;
  token: string;
  user_name?: string;
  status: string;
  created_at: string;
}

interface DailyCallObject {
  on: (event: string, handler: (evt: any) => void) => DailyCallObject;
  removeAllListeners?: () => void;
  join: (opts: { url: string; token: string }) => Promise<void>;
  leave: () => Promise<void>;
  destroy: () => void;
  setLocalAudio: (enabled: boolean) => Promise<void>;
  sendAppMessage: (msg: any, target: string) => Promise<void>;
}

interface DailySDK {
  createCallObject: (options: any) => DailyCallObject;
}

declare global {
  interface Window {
    Daily?: DailySDK;
    DailyIframe?: DailySDK;
  }
}

// ════════════════════════════════════════════════════════════════════════════
// ── AgentCall Component
// ════════════════════════════════════════════════════════════════════════════

export default function AgentCall() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
  return <AgentCallInner apiBaseUrl={apiBaseUrl} />;
}

/**
 * ────────────────────────────────────────────────────────────────────────────
 * Main Call Component
 * ────────────────────────────────────────────────────────────────────────────
 */
function AgentCallInner({ apiBaseUrl }: { apiBaseUrl: string }) {
  // UI state
  const [state, setState] = useState<SessionState>("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [textInput, setTextInput] = useState("");
  const [revealedLength, setRevealedLength] = useState<Record<string, number>>({});

  // Track original transcript count to prevent accidental losses
  const transcriptCountRef = useRef(0);

  // Refs
  const callObjectRef = useRef<DailyCallObject | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const sdkLoadedRef = useRef(false);

  // Chat streaming state
  const botStreamIdRef = useRef<string | null>(null);
  const botStreamTextRef = useRef("");
  const interimMsgIdRef = useRef<string | null>(null);

  // Generate unique user ID on mount
  const userIdRef = useRef<string>("");
  useEffect(() => {
    if (!userIdRef.current) {
      userIdRef.current =
        crypto.randomUUID?.() || `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    }
  }, []);

  // ────────────────────────────────────────────────────────────────────────
  // Load Daily.co SDK
  // ────────────────────────────────────────────────────────────────────────
  const loadDailySDK = useCallback(async (): Promise<DailySDK> => {
    if (sdkLoadedRef.current && (window.Daily || window.DailyIframe)) {
      return (window.Daily || window.DailyIframe)!;
    }

    const urls = [
      "https://unpkg.com/@daily-co/daily-js",
      "https://cdn.daily.co/daily-js.js",
      "https://cdn.jsdelivr.net/npm/@daily-co/daily-js",
    ];

    for (const url of urls) {
      try {
        const script = document.createElement("script");
        script.src = url;
        script.async = false;
        script.crossOrigin = "anonymous";

        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(
            () => reject(new Error("timeout")),
            15000
          );
          script.onload = () => {
            clearTimeout(timeout);
            resolve();
          };
          script.onerror = () => {
            clearTimeout(timeout);
            reject(new Error("failed"));
          };
          document.head.appendChild(script);
        });

        // Wait for SDK to be available
        for (let i = 0; i < 100; i++) {
          if (window.Daily?.createCallObject || window.DailyIframe?.createCallObject) {
            sdkLoadedRef.current = true;
            return (window.Daily || window.DailyIframe)!;
          }
          await new Promise((r) => setTimeout(r, 50));
        }
      } catch (e) {
        console.warn(`Daily SDK CDN failed: ${url}`, e);
      }
    }

    throw new Error("Could not load Daily.co SDK from any CDN");
  }, []);

  // ────────────────────────────────────────────────────────────────────────
  // Helper: Add transcript entry
  // ────────────────────────────────────────────────────────────────────────
  const addEntry = useCallback(
    (role: TranscriptEntry["role"], text: string, id?: string) => {
      if (!text?.trim()) return;
      setTranscript((prev) => [
        ...prev,
        {
          id: id || `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          role,
          text: text.trim(),
          ts: Date.now(),
        },
      ]);
    },
    []
  );

  const updateEntryTextById = useCallback((id: string, text: string) => {
    setTranscript((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, text } : entry))
    );
  }, []);

  // ────────────────────────────────────────────────────────────────────────
  // App Message Handler
  // ────────────────────────────────────────────────────────────────────────
  const handleAppMessage = useCallback(
    (evt: any) => {
      try {
        const msg =
          typeof evt.data === "string" ? JSON.parse(evt.data) : evt.data;
        if (!msg?.type) return;

        console.log(`[AppMessage] Received: ${msg.type}`, msg);

        switch (msg.type) {
          case "user_transcript": {
            const text = (msg.text || "").trim();
            if (!text) break;

            if (!msg.final) {
              // Interim: create or update grey placeholder
              if (!interimMsgIdRef.current) {
                interimMsgIdRef.current = `interim-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
                setTranscript((prev) => [
                  ...prev,
                  {
                    id: interimMsgIdRef.current!,
                    role: "user",
                    text,
                    ts: Date.now(),
                  },
                ]);
              } else {
                // Update the specific interim user entry by ID
                updateEntryTextById(interimMsgIdRef.current, text);
              }
            } else {
              // Final: ensure interim text is persisted, even if final arrives first.
              if (interimMsgIdRef.current) {
                updateEntryTextById(interimMsgIdRef.current, text);
                interimMsgIdRef.current = null;
              } else {
                addEntry("user", text);
              }
            }
            break;
          }

          case "bot_text_start": {
            console.log("[AppMessage] Starting bot text stream");
            botStreamTextRef.current = "";
            botStreamIdRef.current = `bot-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
            // Create initial empty message that will be filled with chunks
            setTranscript((prev) => {
              const updated = [
                ...prev,
                {
                  id: botStreamIdRef.current!,
                  role: "agent" as TranscriptEntry["role"],
                  text: "",
                  ts: Date.now(),
                  isStreaming: true,
                },
              ];
              console.log("[AppMessage] Created empty bot message. Total messages:", updated.length);
              return updated;
            });
            // Reset reveal length for this message
            setRevealedLength((prev) => ({ ...prev, [botStreamIdRef.current!]: 0 }));
            break;
          }

          case "bot_text_chunk": {
            const chunk = msg.text || "";
            if (!chunk) break;

            console.log(`[AppMessage] Bot chunk: +${chunk.length} chars`);

            if (!botStreamIdRef.current) {
              // Fallback: if start event was missed, create the message now
              console.log("[AppMessage] No stream started, creating bot message now");
              botStreamTextRef.current = chunk;
              botStreamIdRef.current = `bot-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
              setTranscript((prev) => [
                ...prev,
                {
                  id: botStreamIdRef.current!,
                  role: "agent",
                  text: chunk,
                  ts: Date.now(),
                },
              ]);
            } else {
              botStreamTextRef.current += chunk;
              updateEntryTextById(botStreamIdRef.current, botStreamTextRef.current);
              console.log("[AppMessage] Updated bot message. Text length:", botStreamTextRef.current.length);
            }
            break;
          }

          case "bot_text_done": {
            console.log("[AppMessage] Bot stream complete");
            if (botStreamIdRef.current && botStreamTextRef.current) {
              updateEntryTextById(botStreamIdRef.current, botStreamTextRef.current);
              // Mark message as done streaming
              setTranscript((prev) =>
                prev.map((entry) =>
                  entry.id === botStreamIdRef.current
                    ? { ...entry, isStreaming: false }
                    : entry
                )
              );
              // Reveal full text
              setRevealedLength((prev) => ({
                ...prev,
                [botStreamIdRef.current!]: botStreamTextRef.current.length,
              }));
            }
            // Just clear the streaming state - message stays in transcript
            botStreamIdRef.current = null;
            botStreamTextRef.current = "";
            break;
          }
        }
      } catch (e) {
        console.error("Error handling app message:", e);
      }
    },
    [addEntry, updateEntryTextById]
  );

  // ────────────────────────────────────────────────────────────────────────
  // Daily Event Handlers
  // ────────────────────────────────────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────
  // Daily Event Handlers
  // ────────────────────────────────────────────────────────────────────────
  const handleJoined = useCallback(() => {
    console.log("[Daily] ✅ Joined room successfully");
    setState("connected");
    setError(null);
    addEntry("system", "Connected to session - waiting for agent...");
  }, [addEntry]);

  const handleLeft = useCallback(() => {
    console.log("[Daily] ⚠️ LEFT ROOM EVENT");
    console.log("[Daily] Transcript at disconnect:", transcript.length, "messages");
    console.log("[Daily] Full transcript:", transcript);
    setState("idle");
    addEntry("system", "Session ended");
  }, [addEntry, transcript]);

  const handleParticipantJoined = useCallback(
    (evt: any) => {
      const name = evt.participant?.user_name || "Unknown";
      console.log(`[Daily] Participant joined: ${name}`);
      if (name === "Pipecat Agent") {
        console.log("[Daily] Agent online");
        addEntry("system", "Agent connected");
      }
    },
    [addEntry]
  );

  const handleParticipantLeft = useCallback(
    (evt: any) => {
      const name = evt.participant?.user_name || "Unknown";
      console.log(`[Daily] Participant left: ${name}`);
      console.log(`[Daily] Current transcript: ${transcript.length} messages`);
      if (name === "Pipecat Agent") {
        console.log("[Daily] Agent disconnected");
        addEntry("system", "Agent disconnected");
      }
    },
    [addEntry, transcript]
  );

  const handleActiveSpeaker = useCallback((evt: any) => {
    // Track active speaker for audio cues or future UI enhancements
    const name = evt.activeSpeaker?.user_name || "";
    console.log("[Daily] Active speaker:", name);
  }, []);

  const handleTrackStarted = useCallback((evt: any) => {
    if (evt.track?.kind !== "audio") return;
    const name = evt.participant?.user_name || "unknown";
    console.log(`[Daily] Audio track from: ${name}`);
    if (name === "Pipecat Agent") {
      try {
        const audio = new Audio();
        audio.srcObject = new MediaStream([evt.track]);
        audio.autoplay = true;
        audio.volume = 1.0;
        document.body.appendChild(audio);
        audio.play().catch((e) => console.warn("Audio playback error:", e));
      } catch (e) {
        console.error("Audio setup error:", e);
      }
    }
  }, []);

  const handleDailyError = useCallback((err: any) => {
    const msg =
      err?.message || err?.errorMsg || JSON.stringify(err) || "Unknown error";
    console.error("[Daily] Error:", msg);
    setError(msg);
    setState("error");
  }, []);



  // ────────────────────────────────────────────────────────────────────────
  // Start Session
  // ────────────────────────────────────────────────────────────────────────
  const handleConnect = useCallback(async () => {
    setError(null);
    console.log("[handleConnect] Starting connection, clearing old transcript");
    setTranscript([]);
    transcriptCountRef.current = 0;
    botStreamIdRef.current = null;
    botStreamTextRef.current = "";
    interimMsgIdRef.current = null;
    setState("connecting");

    try {
      // Request microphone
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (e: any) {
        throw new Error(`Microphone access denied: ${e.message}`);
      }

      // Load Daily SDK
      const DailySDK = await loadDailySDK();
      console.log("[AgentCall] Daily SDK loaded successfully");

      // Create session via FastAPI endpoint
      console.log("[AgentCall] Creating session with:", {
        user_name: "User",
        user_id: userIdRef.current,
        endpoint: `${apiBaseUrl}/api/v1/agent/sessions/with-bot`,
      });

      const resp = await fetch(
        `${apiBaseUrl}/api/v1/agent/sessions/with-bot`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            user_name: "User",
            user_id: userIdRef.current 
          }),
        }
      );

      console.log("[AgentCall] Session response status:", resp.status);

      if (!resp.ok) {
        const errText = await resp.text();
        console.error("[AgentCall] Session creation failed:", errText);
        throw new Error(`Failed to create session: ${resp.status} - ${errText}`);
      }

      const sessionData: SessionResponse = await resp.json();
      console.log("[AgentCall] Session created successfully:", {
        sessionId: sessionData.session_id,
        roomUrl: sessionData.room_url,
        token: sessionData.token ? sessionData.token.substring(0, 20) + "..." : "none",
        status: sessionData.status,
      });

      if (!sessionData.room_url || !sessionData.token) {
        console.error("[AgentCall] Missing room_url or token in response:", sessionData);
        throw new Error("Invalid session response - missing room_url or token");
      }

      // Create call object
      const callObject = DailySDK.createCallObject({
        audioSource: true,
        videoSource: false,
      });
      console.log("[AgentCall] Daily.co call object created");

      // Register event handlers
      console.log("[AgentCall] Registering event handlers...");
      callObject
        .on("joined-meeting", () => {
          console.log("[Daily Event] joined-meeting fired");
          handleJoined();
        })
        .on("left-meeting", () => {
          console.log("[Daily Event] left-meeting fired");
          console.log("[Daily] Transcript at disconnect:", transcript.length, "messages");
          handleLeft();
        })
        .on("participant-joined", (evt) => {
          console.log("[Daily Event] participant-joined:", evt.participant?.user_name);
          handleParticipantJoined(evt);
        })
        .on("participant-left", (evt) => {
          console.log("[Daily Event] participant-left:", evt.participant?.user_name);
          handleParticipantLeft(evt);
        })
        .on("active-speaker-change", (evt) => {
          console.log("[Daily Event] active-speaker-change:", evt.activeSpeaker?.user_name);
          handleActiveSpeaker(evt);
        })
        .on("track-started", (evt) => {
          console.log("[Daily Event] track-started from:", evt.participant?.user_name);
          handleTrackStarted(evt);
        })
        .on("app-message", (evt) => {
          console.log("[Daily Event] app-message received:", evt.data);
          handleAppMessage(evt);
        })
        .on("error", (evt) => {
          console.log("[Daily Event] error:", evt);
          handleDailyError(evt);
        });
      console.log("[AgentCall] Event handlers registered");

      // Join the room
      console.log("[AgentCall] Joining room with URL:", sessionData.room_url);
      await callObject.join({
        url: sessionData.room_url,
        token: sessionData.token,
      });
      console.log("[AgentCall] Successfully joined room");

      callObjectRef.current = callObject;
      addEntry("system", "Waiting for agent...");
    } catch (err: any) {
      console.error("[AgentCall] Connect error:", err);
      setError(err?.message || "Failed to start session");
      setState("error");
    }
  }, [
    apiBaseUrl,
    loadDailySDK,
    addEntry,
    handleJoined,
    handleLeft,
    handleParticipantJoined,
    handleParticipantLeft,
    handleActiveSpeaker,
    handleTrackStarted,
    handleAppMessage,
    handleDailyError,
  ]);

  // ────────────────────────────────────────────────────────────────────────
  // Disconnect
  // ────────────────────────────────────────────────────────────────────────
  const handleDisconnect = useCallback(async () => {
    if (!callObjectRef.current) return;

    setState("disconnecting");
    try {
      await callObjectRef.current.leave();
      callObjectRef.current.destroy();
      callObjectRef.current = null;
    } catch (err) {
      console.error("Disconnect error:", err);
    } finally {
      setState("idle");
      setIsMuted(false);
      
      botStreamIdRef.current = null;
      botStreamTextRef.current = "";
      interimMsgIdRef.current = null;
    }
  }, []);

  // ────────────────────────────────────────────────────────────────────────
  // Mute/Unmute
  // ────────────────────────────────────────────────────────────────────────
  const handleMute = useCallback(async () => {
    if (!callObjectRef.current) return;
    const nextMuted = !isMuted;
    try {
      await callObjectRef.current.setLocalAudio(!nextMuted);
      setIsMuted(nextMuted);
    } catch (err) {
      console.error("Mute error:", err);
    }
  }, [isMuted]);

  // ────────────────────────────────────────────────────────────────────────
  // Send Text Message
  // ────────────────────────────────────────────────────────────────────────
  const handleSendMessage = useCallback(async () => {
    const msg = textInput.trim();
    if (!msg || !callObjectRef.current) return;

    try {
      // Clear input immediately for UX feedback
      setTextInput("");

      // Send message to backend - it will echo back via user_transcript event
      await callObjectRef.current.sendAppMessage(
        {
          id: `msg-${Date.now()}`,
          label: "rtvi-ai",
          type: "user-llm-text",
          data: { text: msg },
        },
        "*"
      );
    } catch (err) {
      console.error("Send message error:", err);
    }
  }, [textInput]);


  // ────────────────────────────────────────────────────────────────────────
  // Duration Timer
  // ────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (state === "connected") {
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (state === "idle") setDuration(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state]);

  // ────────────────────────────────────────────────────────────────────────
  // Progressive Text Reveal for Streaming Messages
  // ────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const streamingMessages = transcript.filter((msg) => msg.isStreaming);
    if (streamingMessages.length === 0) return;

    const interval = setInterval(() => {
      setRevealedLength((prev) => {
        const updated = { ...prev };
        let hasChanges = false;
        for (const msg of streamingMessages) {
          const current = prev[msg.id] || 0;
          const max = msg.text.length;
          if (current < max) {
            // Reveal 2-4 characters at a time for smooth animation
            const charsToReveal = Math.min(4, max - current);
            updated[msg.id] = current + charsToReveal;
            hasChanges = true;
          }
        }
        return hasChanges ? updated : prev;
      });
    }, 20); // Update every 20ms for smooth animation

    return () => clearInterval(interval);
  }, [transcript]);

  // ────────────────────────────────────────────────────────────────────────
  // Monitor Transcript Changes (Debug)
  // ────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const ts = new Date().toLocaleTimeString();
    if (transcript.length > transcriptCountRef.current) {
      const newMsg = transcript[transcript.length - 1];
      console.log(
        `[${ts}] [Transcript] Added message #${transcript.length}: ${newMsg.role.toUpperCase()}`,
        newMsg.text.substring(0, 60)
      );
      transcriptCountRef.current = transcript.length;
    } else if (transcript.length < transcriptCountRef.current) {
      console.warn(
        `[${ts}] [Transcript] ⚠️ MESSAGES REMOVED! Was: ${transcriptCountRef.current}, now: ${transcript.length}`
      );
      console.log("[Transcript] Remaining messages:", transcript);
      transcriptCountRef.current = transcript.length;
    }
  }, [transcript]);

  // ────────────────────────────────────────────────────────────────────────
  // Auto-scroll Transcript
  // ────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  // ────────────────────────────────────────────────────────────────────────
  // Keyboard Shortcuts
  // ────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && state === "connected") {
        handleDisconnect();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state, handleDisconnect]);

  // ────────────────────────────────────────────────────────────────────────
  // Formatting Helpers
  // ────────────────────────────────────────────────────────────────────────
  const formatDuration = (secs: number): string => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const isConnected = state === "connected";
  const isConnecting = state === "connecting" || state === "disconnecting";

  // ════════════════════════════════════════════════════════════════════════════
  // ── Render
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="flex flex-col h-[600px] w-full overflow-hidden bg-gradient-to-b from-black/40 to-black/20">
      {/* CHAT CONTAINER */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        {/* STATUS BAR */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 bg-black/30 rounded-lg border border-white/5 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected
                  ? "bg-emerald-400"
                  : state === "error"
                    ? "bg-red-500"
                    : "bg-amber-500"
              }`}
            />
            <span
              className={`text-xs font-medium ${
                isConnected
                  ? "text-emerald-400"
                  : state === "error"
                    ? "text-red-400"
                    : "text-amber-400"
              }`}
            >
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
        <div className="flex-1 min-h-0 bg-black/40 rounded-xl border border-white/5 p-4 flex flex-col overflow-hidden">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Conversation
          </div>

          <div
            ref={transcriptRef}
            className="flex-1 overflow-y-auto flex flex-col gap-2"
          >
            {transcript.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                {isConnected
                  ? "Start speaking or type a message..."
                  : 'Click "Start Call" to begin'}
              </div>
            )}

            {transcript.map((msg) => {
              const displayText =
                msg.role === "agent" && msg.isStreaming
                  ? msg.text.substring(0, revealedLength[msg.id] ?? 0)
                  : msg.text;
              
              // Hide empty agent messages that are still streaming (waiting for chunks)
              if (msg.role === "agent" && msg.isStreaming && displayText.length === 0) {
                return null;
              }
              
              return (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user"
                      ? "justify-end"
                      : msg.role === "system"
                        ? "justify-center"
                        : "justify-start"
                  } pr-2`}
                >
                  {msg.role === "system" ? (
                    <span className="text-xs text-gray-600 italic">
                      {msg.text}
                    </span>
                  ) : (
                    <div
                      className={`max-w-[90%] sm:max-w-xl md:max-w-2xl lg:max-w-3xl px-3 py-2 rounded-lg text-xs break-words ${
                        msg.role === "user"
                          ? "bg-purple-600/30 border border-purple-400/30"
                          : "bg-cyan-600/30 border border-cyan-400/30"
                      }`}
                    >
                      {displayText}
                      {msg.isStreaming && displayText.length > 0 && (
                        <span className="animate-pulse">▍</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* TEXT INPUT */}
        {isConnected && (
          <div className="flex-shrink-0 flex gap-2 mt-3">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type a message..."
              disabled={!isConnected}
              className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={!textInput.trim() || !isConnected}
              className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 disabled:opacity-50 text-white rounded-lg p-2 transition-colors"
              title="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        )}

        {/* CONTROLS */}
        <div className="flex-shrink-0 flex gap-3 mt-4">
          {!isConnected ? (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex-1 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 disabled:opacity-50 text-white font-semibold rounded-lg py-3 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <PhoneOff size={18} /> Start Call
            </button>
          ) : (
            <>
              <button
                onClick={handleMute}
                title={isMuted ? "Unmute" : "Mute"}
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isMuted
                    ? "bg-red-900/40 border border-red-500/50 text-red-400"
                    : "bg-cyan-900/40 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/60"
                }`}
              >
                {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <button
                onClick={handleDisconnect}
                disabled={isConnecting}
                className="flex-1 bg-red-600/20 border border-red-500/50 hover:bg-red-600/30 text-red-400 font-semibold rounded-lg py-3 transition-all flex items-center justify-center gap-2"
              >
                <Phone size={18} /> End Call
              </button>
            </>
          )}
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="flex-shrink-0 mt-2 p-2 bg-red-900/20 border border-red-500/30 rounded text-xs text-red-300">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
