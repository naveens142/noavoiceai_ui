export interface User {
  id: string
  email: string
  full_name: string
  picture: string
  provider: string
  is_verified: boolean
  created_at: string
  last_login: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}