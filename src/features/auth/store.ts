import { create } from "zustand"
import type { User } from "./types"

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  setTokens: (accessToken: string, refreshToken: string) => void
  setUser: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: localStorage.getItem("access_token"),
  refreshToken: localStorage.getItem("refresh_token"),

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem("access_token", accessToken)
    localStorage.setItem("refresh_token", refreshToken)

    set({
      accessToken,
      refreshToken,
    })
  },

  setUser: (user) => {
    set({ user })
  },

  logout: () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    set({ user: null, accessToken: null, refreshToken: null })
  },
}))