import axios from "../../../api/axios"

export interface Tool {
  id: string
  display_name: string
  category: string
  description: string
  created_at?: string
  updated_at?: string
}

export async function getAvailableTools(): Promise<Tool[]> {
  const response = await axios.get<Tool[]>("/api/v1/agents/tools/available")
  return response.data
}
