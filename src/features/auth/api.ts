import api from "../../api/axios"
import type { LoginResponse } from "./types"
import type { User } from "./types"

export const registerUser = async (data: {
  email: string
  password: string
  name: string
}) => {
  const response = await api.post<User>("/api/v1/auth/register", data)
  return response.data
}

export const loginUser = async (data: {
  email: string
  password: string
}) => {
  const response = await api.post<LoginResponse>("/api/v1/auth/login", data)
  return response.data
}

export const refreshToken = async (refreshToken: string) => {
  const response = await api.post<LoginResponse>("/api/v1/auth/refresh-token", {
    refreshToken,
  })
  return response.data
}

export const getCurrentUser = async () => {
  const response = await api.get<User>("/api/v1/auth/me")
  return response.data
}

export const logoutUser = async () => {
  await api.post("/api/v1/auth/logout")
}