import type { Agent } from "../types"

interface Props {
  agent: Agent
}

export default function PhoneNumberTab({ }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Assigned Phone Number */}
      <div className="bg-white/5 border border-cyan-400/20 rounded-xl p-5 backdrop-blur-xl">
        <label className="text-sm text-gray-300 block mb-2">
          Assigned Phone Number
        </label>
        <input
          type="text"
          placeholder="Example: +1 234 567 8901"
          defaultValue="+91 987 654 3210"
          className="w-full bg-white/5 border border-cyan-400/20 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
        />
      </div>
    </div>
  )
}