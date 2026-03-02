import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { registerUser } from "./api"
import { toast } from "sonner"

export default function RegisterPage() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await registerUser({
        name,
        email,
        password,
      })

      toast.success("Account created successfully 🎉")
      navigate("/")
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-950/70 backdrop-blur-xl border border-purple-500/20 p-10 rounded-2xl w-full max-w-md shadow-2xl"
      >
        <h1 className="text-3xl font-bold text-center text-purple-400 mb-6">
          Create Your AI Identity
        </h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 bg-black border border-gray-700 rounded-lg focus:border-purple-400 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-black border border-gray-700 rounded-lg focus:border-purple-400 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-black border border-gray-700 rounded-lg focus:border-purple-400 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-500 hover:bg-purple-400 transition p-3 rounded-lg font-semibold"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-400">
          Already have an account?{" "}
          <Link to="/" className="text-purple-400 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  )
}