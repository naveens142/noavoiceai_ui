import axios from "../../api/axios"
import type { Agent, AgentsResponse } from "./types"

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