import { Navigate } from "react-router-dom"
import { useAuthStore } from "../../features/auth/store"

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const token = useAuthStore((state) => state.accessToken)
  const hasHydrated = useAuthStore((state) => state._hasHydrated)

  console.log("🛡️ ProtectedRoute Check:", {
    hasHydrated,
    tokenPresent: token ? "✓ Yes" : "✗ No",
    storeState: useAuthStore.getState(),
  })

  // Wait for store to hydrate from localStorage before checking auth
  if (!hasHydrated) {
    console.log("⏳ Waiting for store hydration...")
    return <div className="min-h-screen bg-black" /> // Loading state
  }

  if (!token) {
    console.log("❌ No token found, redirecting to login")
    return <Navigate to="/login" />
  }

  console.log("✅ Token present, allowing access")
  return <>{children}</>
}