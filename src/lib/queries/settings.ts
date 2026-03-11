import { query, queryOne } from "@/lib/db"

export interface NotificationSettings {
  email_digest: boolean
  content_ready: boolean
  campaign_sent: boolean
  agent_errors: boolean
}

export interface Settings {
  platform_name: string
  timezone: string
  language: string
  default_platform: string
  notifications: NotificationSettings
}

const DEFAULT_SETTINGS: Settings = {
  platform_name: "Content Team AI",
  timezone: "America/Sao_Paulo",
  language: "pt-BR",
  default_platform: "instagram",
  notifications: {
    email_digest: true,
    content_ready: true,
    campaign_sent: false,
    agent_errors: true,
  },
}

interface SettingsRow {
  id: number
  settings_data: Settings
  updated_at: string
}

export async function getSettings(): Promise<Settings> {
  const row = await queryOne<SettingsRow>(
    "SELECT id, settings_data, updated_at FROM ct_settings ORDER BY id LIMIT 1"
  )
  if (!row) return DEFAULT_SETTINGS
  return { ...DEFAULT_SETTINGS, ...row.settings_data }
}

export async function updateSettings(data: Partial<Settings>): Promise<Settings> {
  const current = await getSettings()
  const merged: Settings = {
    ...current,
    ...data,
    notifications: {
      ...current.notifications,
      ...(data.notifications ?? {}),
    },
  }

  const existing = await queryOne<SettingsRow>(
    "SELECT id FROM ct_settings ORDER BY id LIMIT 1"
  )

  if (existing) {
    await query(
      "UPDATE ct_settings SET settings_data = $1, updated_at = NOW() WHERE id = $2",
      [JSON.stringify(merged), existing.id]
    )
  } else {
    await query(
      "INSERT INTO ct_settings (settings_data, updated_at) VALUES ($1, NOW())",
      [JSON.stringify(merged)]
    )
  }

  return merged
}
