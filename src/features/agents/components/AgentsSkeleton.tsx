export default function AgentsSkeleton() {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-40 bg-white/5 rounded-2xl animate-pulse"
        />
      ))}
    </div>
  )
}