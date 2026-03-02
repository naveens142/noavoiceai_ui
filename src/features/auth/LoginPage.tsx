import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { loginUser, getCurrentUser } from "./api"
import { useAuthStore } from "./store"
import { toast } from "sonner"

export default function LoginPage() {
  const navigate = useNavigate()
  const { setTokens, setUser } = useAuthStore()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const loginData = await loginUser({ email, password })

      setTokens(loginData.access_token, loginData.refresh_token)

      const user = await getCurrentUser()
      setUser(user)

      toast.success("Welcome back to NoaVoiceAI 🚀")
      navigate("/welcome")
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-950/70 backdrop-blur-xl border border-cyan-500/20 p-10 rounded-2xl w-full max-w-md shadow-2xl"
      >
        <h1 className="text-3xl font-bold text-center text-cyan-400 mb-6">
          NoaVoiceAI
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-black border border-gray-700 rounded-lg focus:border-cyan-400 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-black border border-gray-700 rounded-lg focus:border-cyan-400 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 transition p-3 rounded-lg font-semibold"
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-700"></div>
            <span className="mx-4 text-gray-500 text-sm">OR</span>
            <div className="flex-grow h-px bg-gray-700"></div>
        </div>

        {/* Google Button */}
        <button
            type="button"
            onClick={() =>
                (window.location.href =
                "http://localhost:8000/api/v1/auth/google")
            }
            className="w-full border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition p-3 rounded-lg font-semibold"
            >
            Continue with Google
        </button>

        <p className="text-sm text-center mt-4 text-gray-400">
          Don’t have an account?{" "}
          <Link to="/register" className="text-cyan-400 hover:underline">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  )
}