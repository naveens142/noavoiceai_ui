import { useState } from "react"
import type { Agent } from "../types"
import { updateAgent } from "../api"

export default function useUpdateAgent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = async (agentId: string, data: Partial<Agent>) => {
    setLoading(true)
    setError(null)

    try {
      const updatedAgent = await updateAgent(agentId, data)
      return { success: true, data: updatedAgent }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || "Failed to update agent"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return { update, loading, error }
}
