"use client"

import { cn } from "@/lib/utils"
import type { NotificationSettings } from "@/lib/queries/settings"

interface NotificationsTabProps {
  notifications: NotificationSettings
  onChange: (updated: NotificationSettings) => void
}

interface ToggleItem {
  key: keyof NotificationSettings
  label: string
  description: string
}

const toggleItems: ToggleItem[] = [
  {
    key: "email_digest",
    label: "Resumo por Email",
    description: "Receba um resumo diário de todas as atividades da plataforma",
  },
  {
    key: "content_ready",
    label: "Conteúdo Pronto",
    description: "Notificação quando um conteúdo precisa de aprovação",
  },
  {
    key: "campaign_sent",
    label: "Campanha Enviada",
    description: "Notificação quando uma campanha de email é concluída",
  },
  {
    key: "agent_errors",
    label: "Erros de Agentes",
    description: "Alerta quando um agente falha ao executar uma tarefa",
  },
]

function ToggleSwitch({
  enabled,
  onToggle,
}: {
  enabled: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onToggle}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors",
        enabled ? "bg-accent" : "bg-gray-600"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform mt-0.5",
          enabled ? "translate-x-5 ml-0.5" : "translate-x-0.5"
        )}
      />
    </button>
  )
}

export function NotificationsTab({
  notifications,
  onChange,
}: NotificationsTabProps) {
  function handleToggle(key: keyof NotificationSettings) {
    onChange({
      ...notifications,
      [key]: !notifications[key],
    })
  }

  return (
    <div className="space-y-1 max-w-lg">
      {toggleItems.map((item) => (
        <div
          key={item.key}
          className="flex items-center justify-between p-4 rounded-lg hover:bg-surface-hover/50 transition-colors"
        >
          <div className="space-y-0.5 pr-4">
            <p className="text-sm font-medium text-text-primary">
              {item.label}
            </p>
            <p className="text-xs text-text-secondary">{item.description}</p>
          </div>
          <ToggleSwitch
            enabled={notifications[item.key]}
            onToggle={() => handleToggle(item.key)}
          />
        </div>
      ))}
    </div>
  )
}
