import { useState } from "react"
import { createAgent } from "../api"

export default function useCreateAgent() {
  const [loading, setLoading] = useState(false)

  const create = async (payload: { name: string; description: string }) => {
    setLoading(true)

    try {
      const data = await createAgent(payload)
      return data
    } finally {
      setLoading(false)
    }
  }

  return { create, loading }
}