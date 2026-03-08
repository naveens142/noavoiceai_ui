import { FileText } from "lucide-react"

export default function KBLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <style>{`
        @keyframes pulse-fade {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes slide-in {
          0% { width: 0; }
          100% { width: 100%; }
        }
        .kb-loader-file {
          animation: pulse-fade 2s ease-in-out infinite;
        }
        .kb-loader-bar {
          animation: slide-in 1.5s ease-in-out infinite;
        }
      `}</style>

      {/* File Icon with Pulsing Effect */}
      <div className="mb-4 relative">
        <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full"></div>
        <FileText
          size={48}
          className="kb-loader-file text-cyan-400 relative"
        />
      </div>

      {/* Loading Text */}
      <p className="text-cyan-300 text-sm font-medium mb-6 flex items-center gap-2">
        Loading Knowledge Base
        <span className="flex gap-1">
          <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></span>
          <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
          <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
        </span>
      </p>

      {/* Loading Bar */}
      <div className="w-32 h-1 bg-cyan-400/20 rounded-full overflow-hidden">
        <div className="kb-loader-bar h-full bg-gradient-to-r from-cyan-400 to-cyan-300"></div>
      </div>
    </div>
  )
}
