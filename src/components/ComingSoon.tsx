import { Zap } from "lucide-react";

interface Props {
  title: string;
  description?: string;
}

export default function ComingSoon({ title, description }: Props) {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-400/30 mb-6">
          <Zap size={40} className="text-cyan-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-3">
          {title}
        </h1>
        
        <p className="text-gray-400 mb-8">
          {description || "This feature is coming soon. Stay tuned!"}
        </p>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-400/30">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
          <span className="text-cyan-300 text-sm font-medium">Coming Soon</span>
        </div>
      </div>
    </div>
  );
}
