import { Navigate } from "react-router-dom"
import { useAuthStore } from "../../features/auth/store"

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const token = useAuthStore((state) => state.accessToken)

  if (!token) {
    return <Navigate to="/" />
  }

  return <>{children}</>
}