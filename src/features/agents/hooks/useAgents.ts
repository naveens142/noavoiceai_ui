import { useEffect, useState } from "react"
import type { Agent } from "../types"
import { getAgents, searchAgents } from "../api"

export default function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [skip, setSkip] = useState(0)

  const fetchAgents = async () => {
    try {
      setLoading(true)
      const data = await getAgents(skip, 20)
      setAgents(data)
    } catch (err) {
      setError("Failed to load agents")
    } finally {
      setLoading(false)
    }
  }

  const search = async (query: string) => {
    try {
      setLoading(true)
      if (!query) {
        await fetchAgents()
        return
      }
      const data = await searchAgents(query)
      setAgents(data)
    } catch {
      setError("Search failed")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgents()
  }, [skip])

  return {
    agents,
    loading,
    error,
    search,
    setSkip,
    skip,
  }
}