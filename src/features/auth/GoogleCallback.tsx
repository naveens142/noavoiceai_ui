import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuthStore } from "./store"
import { getCurrentUser } from "./api"
import { toast } from "sonner"
import api from "../../api/axios"

export default function GoogleCallback() {
  const navigate = useNavigate()
  const { setTokens, setUser } = useAuthStore()

  useEffect(() => {
    const hash = window.location.hash.substring(1) // remove #

    const params = new URLSearchParams(hash)

    const accessToken = params.get("access_token")
    const refreshToken = params.get("refresh_token")

    console.log("🔑 GoogleCallback - Tokens received:", {
      accessToken: accessToken ? "✓ Present" : "✗ Missing",
      refreshToken: refreshToken ? "✓ Present" : "✗ Missing",
    })

    if (!accessToken || !refreshToken) {
      toast.error("Google authentication failed")
      navigate("/login")
      return
    }

    async function completeLogin() {
      try {
        // Set authorization header directly first
        console.log("💾 Setting Authorization header...")
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`

        // Save tokens to store and localStorage
        console.log("💾 Saving tokens to store...")
        setTokens(accessToken as string, refreshToken as string)

        // Wait for localStorage to be written (zustand persist middleware)
        await new Promise(resolve => setTimeout(resolve, 100))

        console.log("✅ Tokens saved, fetching user...")
        
        // Add timeout to getCurrentUser call
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("User fetch timeout")), 5000)
        )
        
        const user = await Promise.race([getCurrentUser(), timeoutPromise])
        setUser(user as any)

        // Clean URL
        window.history.replaceState({}, document.title, "/welcome")

        toast.success("Google login successful 🚀")
        navigate("/welcome")
      } catch (error) {
        console.error("Google callback error:", error)
        
        // Check if it's a network error
        if (axios.isAxiosError(error)) {
          console.error("API Error Details:", {
            status: error.response?.status,
            message: error.message,
            url: error.config?.url,
          })
          
          if (!error.response) {
            toast.error("Network error. Check if API server is running at: " + api.defaults.baseURL)
          } else {
            toast.error(`API Error: ${error.response.status} - ${error.response.statusText}`)
          }
        } else {
          toast.error("Failed to complete authentication: " + (error as Error).message)
        }
        
        // Clear the auth header on error
        delete api.defaults.headers.common["Authorization"]
        navigate("/login")
      }
    }

    completeLogin()
  }, [navigate, setTokens, setUser])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-cyan-400 gap-4">
      <div>Authenticating with Google...</div>
      <div className="text-sm text-cyan-300">
        If this page doesn't redirect, please check your network connection
      </div>
    </div>
  )
}