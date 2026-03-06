export interface Agent {
  id: string
  user_id: string
  name: string
  description: string
  voice: string
  language: string
  timezone: string
  system_prompt: string
  first_message: string
  end_call_message: string
  voicemail_message: string
  first_message_mode: string
  end_call_function_enabled: boolean
  recording_enabled: boolean
  detect_caller_number: boolean
  multi_lingual_enabled: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AgentsResponse {
  items: Agent[]
}