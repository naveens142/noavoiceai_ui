import axios from "../../api/axios"
import type { Agent, AgentsResponse, KnowledgeBase, KnowledgeBaseAssignment } from "./types"

// ============ AGENT ENDPOINTS ============

export const getAgents = async (
  skip = 0,
  limit = 20
): Promise<Agent[]> => {
  const response = await axios.get<AgentsResponse>(
    `/api/v1/agents?skip=${skip}&limit=${limit}`
  )
  return response.data.items
}

export const searchAgents = async (
  query: string
): Promise<Agent[]> => {
  const response = await axios.get<Agent[]>(
    `/api/v1/agents/search?q=${query}`
  )
  return response.data
}

export const getAgentById = async (
  id: string
): Promise<Agent> => {
  const response = await axios.get<Agent>(
    `/api/v1/agents/${id}`
  )
  return response.data
}

export const createAgent = async (data: {
  name: string
  description: string
}): Promise<Agent> => {
  const res = await axios.post<Agent>("/api/v1/agents", data)
  return res.data
}

export const updateAgent = async (
  id: string,
  data: Partial<Agent>
): Promise<Agent> => {
  const res = await axios.put<Agent>(`/api/v1/agents/${id}`, data)
  return res.data
}

export const deleteAgent = async (id: string): Promise<void> => {
  await axios.delete(`/api/v1/agents/${id}`)
}

// ============ KNOWLEDGE BASE ENDPOINTS ============

// Get all knowledge bases (sidebar view - document info only)
export const getAllKnowledgeBases = async (
  skip = 0,
  limit = 20
): Promise<{ items: KnowledgeBase[]; total: number }> => {
  const response = await axios.get<{ items: KnowledgeBase[]; total: number }>(
    `/api/v1/agents/knowledge-bases?skip=${skip}&limit=${limit}`
  )
  return response.data
}

// Upload a knowledge base document
export const uploadKnowledgeBase = async (
  file: File,
  documentName: string
): Promise<KnowledgeBase> => {
  const formData = new FormData()
  formData.append("file", file)

  const response = await axios.post<KnowledgeBase>(
    `/api/v1/agents/knowledge-bases/upload?document_name=${encodeURIComponent(documentName)}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )
  return response.data
}

// Get agent's knowledge bases (agent builder view - agent + KB info)
export const getAgentKnowledgeBases = async (agentId: string): Promise<KnowledgeBaseAssignment[]> => {
  const response = await axios.get<KnowledgeBaseAssignment[]>(
    `/api/v1/agents/${agentId}/knowledge-bases`
  )
  return response.data
}

// Assign knowledge base to agent
export const assignKnowledgeBaseToAgent = async (
  agentId: string,
  knowledgeBaseId: string
): Promise<{ id: string; message: string }> => {
  const response = await axios.post<{ id: string; message: string }>(
    `/api/v1/agents/${agentId}/knowledge-bases`,
    { knowledge_base_id: knowledgeBaseId }
  )
  return response.data
}

// Update knowledge base assignment (enable/disable)
export const updateKnowledgeBaseAssignment = async (
  agentId: string,
  knowledgeBaseId: string,
  isEnabled: boolean
): Promise<{ id: string; is_enabled: boolean; message: string }> => {
  const response = await axios.patch<{ id: string; is_enabled: boolean; message: string }>(
    `/api/v1/agents/${agentId}/knowledge-bases/${knowledgeBaseId}?is_enabled=${isEnabled}`
  )
  return response.data
}

// Remove knowledge base from agent
export const removeKnowledgeBaseFromAgent = async (
  agentId: string,
  knowledgeBaseId: string
): Promise<void> => {
  await axios.delete(
    `/api/v1/agents/${agentId}/knowledge-bases/${knowledgeBaseId}`
  )
}

// Delete knowledge base permanently
export const deleteKnowledgeBase = async (knowledgeBaseId: string): Promise<void> => {
  await axios.delete(`/api/v1/agents/knowledge-bases/${knowledgeBaseId}`)
}