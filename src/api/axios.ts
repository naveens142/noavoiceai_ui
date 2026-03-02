import axios from "axios"
import { useAuthStore } from "../features/auth/store"
import { refreshToken as refreshTokenApi } from "../features/auth/api"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const refreshToken = useAuthStore.getState().refreshToken

    if (error.response?.status === 401 && refreshToken) {
      try {
        const data = await refreshTokenApi(refreshToken)

        useAuthStore
          .getState()
          .setTokens(data.access_token, data.refresh_token)

        originalRequest.headers.Authorization = `Bearer ${data.access_token}`
        return api(originalRequest)
      } catch (err) {
        useAuthStore.getState().logout()
        window.location.href = "/"
      }
    }

    return Promise.reject(error)
  }
)

export default api