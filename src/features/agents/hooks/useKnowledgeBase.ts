import { useEffect, useState } from "react"
import type { KnowledgeBase, KnowledgeBaseAssignment } from "../types"
import {
  getAllKnowledgeBases,
  uploadKnowledgeBase,
  getAgentKnowledgeBases,
  assignKnowledgeBaseToAgent,
  updateKnowledgeBaseAssignment,
  removeKnowledgeBaseFromAgent,
  deleteKnowledgeBase,
} from "../api"

interface UseKnowledgeBaseOptions {
  agentId?: string
}

export default function useKnowledgeBase(options?: UseKnowledgeBaseOptions) {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([])
  const [agentKBs, setAgentKBs] = useState<KnowledgeBaseAssignment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all knowledge bases (for sidebar)
  const fetchAllKnowledgeBases = async (skip = 0, limit = 20) => {
    setLoading(true)
    setError(null)

    try {
      const response = await getAllKnowledgeBases(skip, limit)
      setKnowledgeBases(response.items)
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || "Failed to fetch knowledge bases"
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Fetch agent's knowledge bases (for agent builder)
  const fetchAgentKnowledgeBases = async (agentId: string) => {
    setLoading(true)
    setError(null)

    try {
      const data = await getAgentKnowledgeBases(agentId)
      setAgentKBs(data)
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || "Failed to fetch agent knowledge bases"
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Upload knowledge base
  const upload = async (file: File, documentName: string) => {
    setLoading(true)
    setError(null)

    try {
      const data = await uploadKnowledgeBase(file, documentName)
      setKnowledgeBases((prev) => [...prev, data])
      return { success: true, data }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || "Failed to upload knowledge base"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Assign knowledge base to agent
  const assign = async (agentId: string, kbId: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await assignKnowledgeBaseToAgent(agentId, kbId)
      // Refetch agent's KBs
      await fetchAgentKnowledgeBases(agentId)
      return { success: true, data: response }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || "Failed to assign knowledge base"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Update knowledge base assignment (enable/disable)
  const updateAssignment = async (agentId: string, kbId: string, isEnabled: boolean) => {
    setLoading(true)
    setError(null)

    try {
      const response = await updateKnowledgeBaseAssignment(agentId, kbId, isEnabled)
      // Update local state
      setAgentKBs((prev) =>
        prev.map((item) => (item.knowledge_base.id === kbId ? { ...item, is_enabled: isEnabled } : item))
      )
      return { success: true, data: response }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || "Failed to update knowledge base assignment"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Remove knowledge base from agent
  const remove = async (agentId: string, kbId: string) => {
    setLoading(true)
    setError(null)

    try {
      await removeKnowledgeBaseFromAgent(agentId, kbId)
      // Update local state
      setAgentKBs((prev) => prev.filter((item) => item.knowledge_base.id !== kbId))
      return { success: true }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || "Failed to remove knowledge base"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Delete knowledge base permanently
  const Delete = async (kbId: string) => {
    setLoading(true)
    setError(null)

    try {
      await deleteKnowledgeBase(kbId)
      // Update local state
      setKnowledgeBases((prev) => prev.filter((kb) => kb.id !== kbId))
      return { success: true }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || "Failed to delete knowledge base"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Load initial data if agentId is provided
  useEffect(() => {
    if (options?.agentId) {
      fetchAgentKnowledgeBases(options.agentId)
    }
  }, [options?.agentId])

  return {
    knowledgeBases,
    agentKBs,
    loading,
    error,
    fetchAllKnowledgeBases,
    fetchAgentKnowledgeBases,
    upload,
    assign,
    updateAssignment,
    remove,
    Delete,
  }
}
