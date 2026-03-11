"use client"

import { cn } from "@/lib/utils"

export type SettingsTab = "general" | "integrations" | "api-keys" | "notifications" | "billing"

interface SettingsTabsProps {
  activeTab: SettingsTab
  onTabChange: (tab: SettingsTab) => void
}

const tabs: { id: SettingsTab; label: string }[] = [
  { id: "general", label: "Geral" },
  { id: "integrations", label: "Integrações" },
  { id: "api-keys", label: "Chaves de API" },
  { id: "notifications", label: "Notificações" },
  { id: "billing", label: "Plano & Billing" },
]

export function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  return (
    <div className="flex gap-1 border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-4 py-2.5 text-sm font-medium transition-colors rounded-t-lg",
            activeTab === tab.id
              ? "text-accent border-b-2 border-accent bg-accent/10"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
