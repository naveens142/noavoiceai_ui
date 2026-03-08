import { useState } from "react"
import { deleteAgent } from "../api"

export default function useDeleteAgent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const Delete = async (agentId: string) => {
    setLoading(true)
    setError(null)

    try {
      await deleteAgent(agentId)
      return { success: true }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || "Failed to delete agent"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return { Delete, loading, error }
}
