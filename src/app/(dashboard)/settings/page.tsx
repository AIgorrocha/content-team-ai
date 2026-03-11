"use client"

import { useState, useEffect, useCallback } from "react"
import { SettingsTabs, type SettingsTab } from "@/components/settings/settings-tabs"
import { GeneralTab } from "@/components/settings/general-tab"
import { IntegrationsTab } from "@/components/settings/integrations-tab"
import { ApiKeysTab } from "@/components/settings/api-keys-tab"
import { NotificationsTab } from "@/components/settings/notifications-tab"
import type { Settings } from "@/lib/queries/settings"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general")
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings")
      if (!res.ok) throw new Error("Failed to fetch settings")
      const data = await res.json()
      setSettings(data)
    } catch {
      setSettings({
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
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  function handleChange(partial: Partial<Settings>) {
    if (!settings) return
    setSettings({
      ...settings,
      ...partial,
      notifications: {
        ...settings.notifications,
        ...(partial.notifications ?? {}),
      },
    })
  }

  async function handleSave() {
    if (!settings) return
    setSaving(true)
    setSaveMessage("")
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error("Failed to save")
      const updated = await res.json()
      setSettings(updated)
      setSaveMessage("Salvo com sucesso!")
      setTimeout(() => setSaveMessage(""), 3000)
    } catch {
      setSaveMessage("Erro ao salvar. Tente novamente.")
      setTimeout(() => setSaveMessage(""), 3000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-surface-hover rounded animate-pulse" />
        <div className="h-10 w-full bg-surface-hover rounded animate-pulse" />
        <div className="h-64 w-full bg-surface-hover rounded animate-pulse" />
      </div>
    )
  }

  if (!settings) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Configurações</h1>
        <div className="flex items-center gap-3">
          {saveMessage && (
            <span
              className={
                saveMessage.includes("sucesso")
                  ? "text-sm text-green-400"
                  : "text-sm text-red-400"
              }
            >
              {saveMessage}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-50 transition-colors"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>

      <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="pt-2">
        {activeTab === "general" && (
          <GeneralTab settings={settings} onChange={handleChange} />
        )}
        {activeTab === "integrations" && <IntegrationsTab />}
        {activeTab === "api-keys" && <ApiKeysTab />}
        {activeTab === "notifications" && (
          <NotificationsTab
            notifications={settings.notifications}
            onChange={(notifications) => handleChange({ notifications })}
          />
        )}
      </div>
    </div>
  )
}
