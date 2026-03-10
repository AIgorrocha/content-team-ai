"use client"

import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "@/components/shared/status-badge"
import { usePolling } from "@/hooks/use-polling"
import { api } from "@/lib/api"
import { formatDateTime } from "@/lib/utils"
import { Search, X } from "lucide-react"
import type { AgentWithTaskCount, AgentDetail } from "@/lib/queries/agents"
import type { AgentStatus } from "@/lib/types"

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
  const days = Math.floor(hours / 24)
  return `${days}d atrás`
}

const taskStatusColors: Record<string, "default" | "success" | "error" | "warning" | "secondary"> = {
  pending: "warning",
  in_progress: "default",
  completed: "success",
  failed: "error",
  cancelled: "secondary",
}

export default function AgentsPage() {
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<AgentStatus | null>(null)
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [detail, setDetail] = useState<AgentDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const fetcher = useCallback(() => api.agents.list(), [])
  const { data: agents, loading } = usePolling<AgentWithTaskCount[]>({ fetcher })

  async function openDetail(slug: string) {
    setSelectedSlug(slug)
    setDetailLoading(true)
    try {
      const data = await api.agents.get(slug)
      setDetail(data)
    } catch {
      setDetail(null)
    } finally {
      setDetailLoading(false)
    }
  }

  function closeDetail() {
    setSelectedSlug(null)
    setDetail(null)
  }

  const filtered = agents?.filter((a) => {
    if (search && !a.display_name.toLowerCase().includes(search.toLowerCase()) && !a.slug.includes(search.toLowerCase())) {
      return false
    }
    if (filterStatus && a.status !== filterStatus) return false
    return true
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Agentes</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <Input
            placeholder="Buscar agente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {(["active", "idle", "error"] as AgentStatus[]).map((s) => (
            <Button
              key={s}
              variant={filterStatus === s ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus(filterStatus === s ? null : s)}
            >
              {s === "active" ? "Ativos" : s === "idle" ? "Inativos" : "Erro"}
            </Button>
          ))}
        </div>
      </div>

      {/* Agent Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 13 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-5 h-28" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered?.map((agent) => (
            <Card
              key={agent.slug}
              className="cursor-pointer hover:border-accent/30 transition-colors"
              onClick={() => openDetail(agent.slug)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{agentEmojis[agent.slug] ?? "🤖"}</span>
                    <div>
                      <p className="font-medium text-text-primary">{agent.display_name}</p>
                      <p className="text-xs text-text-secondary">{agent.role}</p>
                    </div>
                  </div>
                  <StatusBadge status={agent.status} />
                </div>
                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <span>{timeAgo(agent.last_active_at)}</span>
                  {agent.pending_tasks > 0 && (
                    <Badge variant="default">{agent.pending_tasks} pendentes</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Drawer */}
      {selectedSlug && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={closeDetail} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-surface border-l border-border overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-text-primary">Detalhes do Agente</h2>
                <button onClick={closeDetail} className="text-text-secondary hover:text-text-primary">
                  <X size={20} />
                </button>
              </div>

              {detailLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-surface-hover rounded" />
                  <div className="h-4 bg-surface-hover rounded w-3/4" />
                  <div className="h-32 bg-surface-hover rounded" />
                </div>
              ) : detail ? (
                <div className="space-y-6">
                  {/* Agent Info */}
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{agentEmojis[detail.agent.slug] ?? "🤖"}</span>
                    <div>
                      <p className="text-xl font-bold text-text-primary">{detail.agent.display_name}</p>
                      <p className="text-sm text-text-secondary">{detail.agent.role}</p>
                      <div className="mt-1">
                        <StatusBadge status={detail.agent.status} />
                      </div>
                    </div>
                  </div>

                  <div className="text-sm space-y-1 text-text-secondary">
                    <p>Slug: <code className="text-accent">{detail.agent.slug}</code></p>
                    <p>Última atividade: {timeAgo(detail.agent.last_active_at)}</p>
                    <p>Tasks pendentes: {detail.pendingTasks}</p>
                  </div>

                  {/* Task History */}
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary mb-3">
                      Histórico de Tasks ({detail.tasks.length})
                    </h3>
                    {detail.tasks.length === 0 ? (
                      <p className="text-sm text-text-secondary">Nenhuma task registrada</p>
                    ) : (
                      <div className="space-y-2">
                        {detail.tasks.map((task) => (
                          <Card key={task.id}>
                            <CardContent className="p-3">
                              <div className="flex items-start justify-between">
                                <p className="text-sm font-medium text-text-primary">{task.title}</p>
                                <Badge variant={taskStatusColors[task.status] ?? "secondary"}>
                                  {task.status}
                                </Badge>
                              </div>
                              <div className="flex gap-4 mt-1 text-xs text-text-secondary">
                                <span>Criada: {formatDateTime(task.created_at)}</span>
                                {task.completed_at && (
                                  <span>Concluída: {formatDateTime(task.completed_at)}</span>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-text-secondary">Erro ao carregar detalhes</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
