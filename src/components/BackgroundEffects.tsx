    import { useEffect, useState } from "react"

export default function BackgroundEffects() {
  const [particles, setParticles] = useState<
    { id: number; top: string; left: string; size: number; delay: number }[]
  >([])

  useEffect(() => {
    const generated = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 6 + 4,
      delay: Math.random() * 20,
    }))
    setParticles(generated)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Moving Gradient Glow */}
      <div className="absolute w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl animate-slowFloat top-[-200px] left-[-200px]" />
      <div className="absolute w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-slowFloat2 bottom-[-200px] right-[-200px]" />

      {/* Floating Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bg-cyan-400/30 rounded-full animate-particle"
          style={{
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}