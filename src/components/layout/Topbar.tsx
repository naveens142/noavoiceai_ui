import { Menu, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "../../api/axios"

interface Props {
  onMenuClick: () => void
  onHideSidebar?: () => void
}

interface User {
  full_name: string
  email: string
}

export default function Topbar({ onMenuClick }: Props) {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/v1/auth/me")
        setUser(res.data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    // Keep onboarding flag as per our temporary logic
    navigate("/login")
  }

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/5 border-b border-cyan-400/10 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          className="md:hidden text-gray-300 hover:text-cyan-400 transition"
          onClick={onMenuClick}
        >
          <Menu size={22} />
        </button>

        <h1 className="text-xl font-semibold text-cyan-300">
          Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-gray-400">
            Welcome back, <span className="text-cyan-300">{user.full_name}</span>
          </span>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-sm text-red-400 hover:text-red-500 transition"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </header>
  )
}