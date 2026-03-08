interface Props {
  formData: {
    name: string
    voice: string
    language: string
    timezone: string
  }
  onFormChange: (data: any) => void
}

const voiceOptions = ["Alloy", "Echo", "Fable", "Onyx", "Nova", "Shimmer"]

const languageOptions = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Russian",
  "Japanese",
  "Chinese",
  "Korean",
]

const timezoneOptions = [
  "UTC",
  "EST",
  "CST",
  "MST",
  "PST",
  "UTC+1",
  "UTC+2",
  "UTC+5:30",
  "UTC+8",
]

export default function ConfigureTab({ formData, onFormChange }: Props) {
  
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Agent Name */}
        <div className="bg-white/5 border border-cyan-400/20 rounded-xl p-5 backdrop-blur-xl">
          <label className="text-sm text-gray-300 block mb-2">
            Agent Name / Role
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
            placeholder="Example: Customer Support Assistant"
            className="w-full bg-white/5 border border-cyan-400/20 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
          />
        </div>

        {/* Voice */}
        <div className="bg-white/5 border border-cyan-400/20 rounded-xl p-5 backdrop-blur-xl">
          <label className="text-sm text-gray-400 block mb-2">
            Voice
          </label>
          <select
            value={formData.voice}
            onChange={(e) => onFormChange({ ...formData, voice: e.target.value })}
            className="w-full bg-black/40 border border-cyan-400/20 rounded-lg p-2 text-sm text-white outline-none focus:border-cyan-400"
          >
            {voiceOptions.map((voice) => (
              <option key={voice} value={voice}>
                {voice}
              </option>
            ))}
          </select>
        </div>

        {/* Language */}
        <div className="bg-white/5 border border-cyan-400/20 rounded-xl p-5 backdrop-blur-xl">
          <label className="text-sm text-gray-400 block mb-2">
            Language
          </label>
          <select
            value={formData.language}
            onChange={(e) => onFormChange({ ...formData, language: e.target.value })}
            className="w-full bg-black/40 border border-cyan-400/20 rounded-lg p-2 text-sm text-white outline-none focus:border-cyan-400"
          >
            {languageOptions.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Timezone */}
        <div className="bg-white/5 border border-cyan-400/20 rounded-xl p-5 backdrop-blur-xl">
          <label className="text-sm text-gray-400 block mb-2">
            Timezone
          </label>
          <select
            value={formData.timezone}
            onChange={(e) => onFormChange({ ...formData, timezone: e.target.value })}
            className="w-full bg-black/40 border border-cyan-400/20 rounded-lg p-2 text-sm text-white outline-none focus:border-cyan-400"
          >
            {timezoneOptions.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}