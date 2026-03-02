import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "./store"
import { getCurrentUser } from "./api"
import { toast } from "sonner"

export default function GoogleCallback() {
  const navigate = useNavigate()
  const { setTokens, setUser } = useAuthStore()

  useEffect(() => {
    const hash = window.location.hash.substring(1) // remove #

    const params = new URLSearchParams(hash)

    const accessToken = params.get("access_token")
    const refreshToken = params.get("refresh_token")

    if (!accessToken || !refreshToken) {
      toast.error("Google authentication failed")
      navigate("/")
      return
    }

    async function completeLogin() {
      try {
        setTokens(accessToken as string, refreshToken as string)

        const user = await getCurrentUser()
        setUser(user)

        // Clean URL
        window.history.replaceState({}, document.title, "/auth/callback")

        toast.success("Google login successful 🚀")
        navigate("/welcome")
      } catch (error) {
        toast.error("Failed to fetch user")
        navigate("/")
      }
    }

    completeLogin()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-cyan-400">
      Authenticating with Google...
    </div>
  )
}