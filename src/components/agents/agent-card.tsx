"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { StatusBadge } from "@/components/shared/status-badge"
import type { AgentWithTaskCount } from "@/lib/queries/agents"

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

function timeAgo(date: string | null): string {
  if (!date) return "Nunca ativo"
  const diff = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "Agora"
  if (minutes < 60) return `${minutes}min atrás`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h atrás`
  return `${Math.floor(hours / 24)}d atrás`
}

interface AgentCardProps {
  agent: AgentWithTaskCount
  layout?: "vertical" | "horizontal"
  onClick: () => void
  onRun: () => void
}

export function AgentCard({ agent, layout = "vertical", onClick, onRun }: AgentCardProps) {
  const emoji = agentEmojis[agent.slug] ?? "🤖"

  if (layout === "horizontal") {
    return (
      <Card className="cursor-pointer hover:border-accent/30 transition-colors" onClick={onClick}>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{emoji}</span>
            <div>
              <p className="font-medium text-text-primary">{agent.display_name}</p>
              <p className="text-xs text-text-secondary">{agent.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {agent.pending_tasks > 0 && (
              <Badge variant="default">{agent.pending_tasks} pendentes</Badge>
            )}
            <span className="text-xs text-text-secondary">{timeAgo(agent.last_active_at)}</span>
            <StatusBadge status={agent.status} />
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => { e.stopPropagation(); onRun() }}
            >
              <Play className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="cursor-pointer hover:border-accent/30 transition-colors" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{emoji}</span>
            <div>
              <p className="font-medium text-sm text-text-primary">{agent.display_name}</p>
              <p className="text-xs text-text-secondary truncate max-w-[140px]">{agent.role}</p>
            </div>
          </div>
          <StatusBadge status={agent.status} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-secondary">{timeAgo(agent.last_active_at)}</span>
          <div className="flex items-center gap-2">
            {agent.pending_tasks > 0 && (
              <Badge variant="warning" className="text-xs">{agent.pending_tasks}</Badge>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
              onClick={(e) => { e.stopPropagation(); onRun() }}
            >
              <Play className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
