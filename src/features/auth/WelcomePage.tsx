import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { LogOut, LayoutDashboard } from "lucide-react"
import { motion } from "framer-motion"
import axios from "axios"

interface User {
  email: string
  provider: string
}

export default function WelcomePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("access_token")

    if (!token) {
      navigate("/login")
      return
    }

    axios
      .get("http://localhost:8000/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data)
        setLoading(false)
      })
      .catch(() => {
        navigate("/login")
      })
  }, [navigate])

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  const handleGoDashboard = () => {
      localStorage.setItem("onboarding_complete", "true")
      navigate("/dashboard")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#3b0764] text-white flex flex-col overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"
          animate={{ x: [0, 30, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6 border-b border-white/10">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {/* Sound wave bars */}
              <path d="M8 12a1 1 0 0 1 0-2 1 1 0 0 1 0 2z"/>
              <path d="M12 6v12"/>
              <path d="M16 9v6"/>
              <path d="M4 10v4"/>
              <path d="M20 10v4"/>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">NoaVoiceAI</h1>
          </div>
        </motion.div>
        <motion.button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600/20 border border-red-500/50 text-red-400 px-5 py-2 rounded-lg hover:bg-red-600/40 hover:border-red-500 transition backdrop-blur-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </motion.button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center text-center px-4">
        
        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl w-full"
        >
            <motion.div
              className="flex justify-center mb-8"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-75"></div>
                <div className="relative w-28 h-28 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-full flex items-center justify-center p-2 shadow-2xl shadow-purple-500/50">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-white drop-shadow-lg">
                    {/* Center circle */}
                    <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.8"/>
                    
                    {/* Waveform bars */}
                    <g fill="currentColor">
                      {/* Left wave bars */}
                      <rect x="28" y="40" width="3" height="20" rx="1.5" opacity="0.8"/>
                      <rect x="20" y="35" width="3" height="30" rx="1.5" opacity="0.6"/>
                      <rect x="12" y="45" width="3" height="10" rx="1.5" opacity="0.4"/>
                      
                      {/* Right wave bars */}
                      <rect x="69" y="40" width="3" height="20" rx="1.5" opacity="0.8"/>
                      <rect x="77" y="35" width="3" height="30" rx="1.5" opacity="0.6"/>
                      <rect x="85" y="45" width="3" height="10" rx="1.5" opacity="0.4"/>
                    </g>
                    
                    {/* Outer circle accent */}
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
                  </svg>
                </div>
              </div>
            </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Welcome!
            </h2>
            <p className="text-xl text-slate-300 font-light">
              {user?.email}
            </p>
            <p className="text-sm text-slate-400 mt-3">
              Build intelligent voice AI agents with dynamic conversations
            </p>
          </motion.div>

          {/* Buttons Container */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Go to Dashboard Button */}
            <motion.button
              onClick={handleGoDashboard}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold flex items-center justify-center gap-2 hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/30"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              <LayoutDashboard className="w-5 h-5" />
              Go to Dashboard
            </motion.button>

            {/* Secondary Action */}
            <motion.button
              onClick={handleLogout}
              className="px-8 py-4 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Out
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Status Badge */}
        <motion.div
          className="mt-16 flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-300">Connected & Ready</span>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-slate-500 p-6 text-sm border-t border-white/10">
        © 2026 NoaVoiceAI. Your AI Voice Identity.
      </footer>
    </div>
  )
}
