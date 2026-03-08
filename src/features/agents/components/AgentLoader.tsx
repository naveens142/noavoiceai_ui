import { Bot } from "lucide-react"

export default function AgentLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="space-y-8 text-center">
        {/* Animated Orbs */}
        <div className="flex justify-center items-center gap-4 h-24">
          {/* Left Orb */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-lg opacity-75 animate-pulse" />
            <div className="absolute inset-2 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full border border-cyan-400/50" />
            <div className="absolute inset-3 flex items-center justify-center">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
            </div>
          </div>

          {/* Center Bot Icon with Glow */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-blue-500 rounded-full blur-2xl opacity-50 animate-pulse" />
            <div className="relative bg-gradient-to-br from-cyan-400/20 to-purple-500/20 p-4 rounded-full border border-cyan-400/30 backdrop-blur-xl">
              <Bot size={40} className="text-cyan-300 animate-spin" />
            </div>
          </div>

          {/* Right Orb */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-75 animate-pulse" />
            <div className="absolute inset-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-400/50" />
            <div className="absolute inset-3 flex items-center justify-center">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-cyan-300 animate-pulse">
            Initializing Agent
          </h2>
          <p className="text-gray-400 text-sm">
            <span className="inline-block">
              Configuring AI Assistant
              <span className="inline-flex ml-1">
                <span className="animate-bounce" style={{ animationDelay: "0s" }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
              </span>
            </span>
          </p>
        </div>

        {/* Loading Bar */}
        <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 rounded-full animate-pulse" style={{
            animation: "loading 2s ease-in-out infinite"
          }} />
        </div>

        {/* Floating particles effect */}
        <div className="flex justify-center gap-2 mt-8 opacity-60">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 bg-cyan-400 rounded-full"
              style={{
                animation: `float 3s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>

        <style>{`
          @keyframes loading {
            0%, 100% { width: 0; }
            50% { width: 100%; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); opacity: 0.3; }
            50% { transform: translateY(-20px); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  )
}
