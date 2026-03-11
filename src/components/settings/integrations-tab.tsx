"use client"

import { cn } from "@/lib/utils"

interface Integration {
  name: string
  description: string
  icon: string
  connected: boolean
}

const integrations: Integration[] = [
  {
    name: "Instagram",
    description: "Publicação automática e métricas de engajamento",
    icon: "📸",
    connected: false,
  },
  {
    name: "YouTube",
    description: "Upload de vídeos e análise de performance",
    icon: "🎬",
    connected: false,
  },
  {
    name: "n8n",
    description: "Automação de workflows e integrações",
    icon: "⚡",
    connected: false,
  },
  {
    name: "Supabase",
    description: "Banco de dados e autenticação",
    icon: "🗄️",
    connected: true,
  },
  {
    name: "Email Provider",
    description: "Envio de campanhas e newsletters",
    icon: "📧",
    connected: false,
  },
]

export function IntegrationsTab() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {integrations.map((integration) => (
        <div
          key={integration.name}
          className="p-4 rounded-lg border border-border bg-surface hover:border-accent/30 transition-colors"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-2xl">{integration.icon}</span>
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium",
                integration.connected
                  ? "bg-green-500/20 text-green-400"
                  : "bg-gray-500/20 text-gray-400"
              )}
            >
              {integration.connected ? "Conectado" : "Desconectado"}
            </span>
          </div>
          <p className="font-medium text-text-primary text-sm">
            {integration.name}
          </p>
          <p className="text-xs text-text-secondary mt-1">
            {integration.description}
          </p>
        </div>
      ))}
    </div>
  )
}
