import agent from "../assets/ai-agent.png";

const AgentHero = () => {
  return (
    <div className="relative h-full flex flex-col justify-center px-20 text-white fade-in">
      <div className="flex flex-col items-center justify-center text-center">
      <div className="relative w-[480px] float-agent">

        {/* Halo Ring */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full border border-indigo-400/40 rotate-ring pulse-glow" />

        {/* Soft Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 via-purple-500/20 to-pink-500/30 blur-3xl rounded-full -z-10" />
    
        {/* Robot Image */}
        <img
          src={agent}
          alt="AI Agent"
          className="relative z-10 select-none"
        />
      </div>

      {/* Branding */}
      <div className="mt-10">
        <h1 className="text-5xl font-bold">
          <span>NoaVoice</span>
          <span className="text-indigo-400">AI</span>
        </h1>

        <p className="mt-4 text-xl text-indigo-200">
          Dynamic Agent Infrastructure
        </p>

        <p className="mt-6 text-indigo-300">
          Build. Configure. Deploy.
        </p>
      </div>
      </div>
    </div>
  );
};

export default AgentHero;