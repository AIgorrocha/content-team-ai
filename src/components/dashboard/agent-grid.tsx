"use client"

import { useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/shared/status-badge"
import { usePolling } from "@/hooks/use-polling"
import { api } from "@/lib/api"
import type { AgentWithTaskCount } from "@/lib/queries/agents"

function timeAgo(date: string | null): string {
  if (!date) return "Nunca"
  const diff = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "Agora"
  if (minutes < 60) return `${minutes}min atrás`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h atrás`
  const days = Math.floor(hours / 24)
  return `${days}d atrás`
}

const agentEmojis: Record<string, string> = {
  "content-director": "🎯",
  "editor-chief": "📅",
  "tech-chief": "⚙️",
  "design-director": "🎨",
  "copywriter": "✍️",
  "content-curator": "🔄",
  "clone-agent": "🎬",
  "carousel-creator": "🎠",
  "listening-director": "👂",
  "audience-director": "📧",
  "channel-controller": "📡",
  "relations-manager": "🤝",
  "content-searcher": "🔍",
}

export function AgentGrid() {
  const fetcher = useCallback(() => api.agents.list(), [])
  const { data: agents, loading } = usePolling<AgentWithTaskCount[]>({
    fetcher,
  })

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 13 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 h-24" />
          </Card>
        ))}
      </div>
    )
  }

  if (!agents) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {agents.map((agent) => (
        <Card key={agent.slug} className="hover:border-accent/30 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{agentEmojis[agent.slug] ?? "🤖"}</span>
                <div>
                  <p className="text-sm font-medium text-text-primary leading-tight">
                    {agent.display_name}
                  </p>
                  <p className="text-xs text-text-secondary">{agent.role}</p>
                </div>
              </div>
              <StatusBadge status={agent.status} />
            </div>
            <div className="flex items-center justify-between text-xs text-text-secondary mt-3">
              <span>{timeAgo(agent.last_active_at)}</span>
              {agent.pending_tasks > 0 && (
                <span className="text-accent">{agent.pending_tasks} pendentes</span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
