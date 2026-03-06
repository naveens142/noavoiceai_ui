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
        // Set tokens first - this must happen before API calls
        setTokens(accessToken as string, refreshToken as string)

        // Create a temporary request with the token to ensure it's set
        // Wait a tick to let the store update
        await new Promise(resolve => setTimeout(resolve, 0))

        const user = await getCurrentUser()
        setUser(user)

        // Clean URL
        window.history.replaceState({}, document.title, "/welcome")

        toast.success("Google login successful 🚀")
        navigate("/welcome")
      } catch (error) {
        console.error("Google callback error:", error)
        toast.error("Failed to complete authentication")
        navigate("/")
      }
    }

    completeLogin()
  }, [navigate, setTokens, setUser])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-cyan-400">
      Authenticating with Google...
    </div>
  )
}