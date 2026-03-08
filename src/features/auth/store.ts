import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { User } from "./types"

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  _hasHydrated: boolean
  setTokens: (accessToken: string, refreshToken: string) => void
  setUser: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      _hasHydrated: false,

      setTokens: (accessToken, refreshToken) => {
        console.log("🔐 setTokens called with:", {
          accessToken: accessToken ? "✓ Present" : "✗ Missing",
          refreshToken: refreshToken ? "✓ Present" : "✗ Missing",
        })
        set({
          accessToken,
          refreshToken,
          _hasHydrated: true,
        })
      },

      setUser: (user) => {
        console.log("👤 setUser called:", user)
        set({ user })
      },

      logout: () => {
        console.log("🚪 logout called")
        set({ user: null, accessToken: null, refreshToken: null, _hasHydrated: true })
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => {
        // Wrap localStorage with logging
        return {
          getItem: (name: string) => {
            try {
              const item = localStorage.getItem(name)
              console.log(`📖 localStorage.getItem("${name}"):`, item ? "✓ Found" : "✗ Not found")
              return item
            } catch (e) {
              console.error("Error reading from localStorage:", e)
              return null
            }
          },
          setItem: (name: string, value: string) => {
            try {
              console.log(`📝 localStorage.setItem("${name}")`)
              localStorage.setItem(name, value)
            } catch (e) {
              console.error("Error writing to localStorage:", e)
            }
          },
          removeItem: (name: string) => {
            try {
              console.log(`🗑️ localStorage.removeItem("${name}")`)
              localStorage.removeItem(name)
            } catch (e) {
              console.error("Error removing from localStorage:", e)
            }
          },
        }
      }),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
      onRehydrateStorage: () => {
        console.log("🔄 onRehydrateStorage starting")
        return (state) => {
          console.log("🔄 onRehydrateStorage complete, state:", state)
          if (state) {
            state._hasHydrated = true
          }
        }
      },
    }
  )
)