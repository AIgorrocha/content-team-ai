"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/shared/status-badge"
import { formatDateTime } from "@/lib/utils"
import { X, Play, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { api } from "@/lib/api"
import type { AgentDetail } from "@/lib/queries/agents"

const taskStatusColors: Record<string, "default" | "success" | "error" | "warning" | "secondary"> = {
  pending: "warning",
  in_progress: "default",
  completed: "success",
  failed: "error",
  cancelled: "secondary",
}

const agentEmojis: Record<string, string> = {
  "content-director": "🎯", "editor-chief": "📅", "tech-chief": "⚙️",
  "design-director": "🎨", "copywriter": "✍️", "content-curator": "🔄",
  "clone-agent": "🎬", "carousel-creator": "🎠", "listening-director": "👂",
  "audience-director": "📧", "channel-controller": "📡", "relations-manager": "🤝",
  "content-searcher": "🔍",
}

interface AgentDetailModalProps {
  slug: string
  onClose: () => void
  onRun: () => void
}

export function AgentDetailModal({ slug, onClose, onRun }: AgentDetailModalProps) {
  const [detail, setDetail] = useState<AgentDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.agents.get(slug)
      .then(setDetail)
      .catch(() => setDetail(null))
      .finally(() => setLoading(false))
  }, [slug])

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-surface border-l border-border overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-text-primary">Detalhes do Agente</h2>
            <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
              <X size={20} />
            </button>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-surface-hover rounded" />
              <div className="h-4 bg-surface-hover rounded w-3/4" />
              <div className="h-32 bg-surface-hover rounded" />
            </div>
          ) : detail ? (
            <div className="space-y-6">
              {/* Agent Info */}
              <div className="flex items-center gap-4">
                <span className="text-4xl">{agentEmojis[detail.agent.slug] ?? "🤖"}</span>
                <div className="flex-1">
                  <p className="text-xl font-bold text-text-primary">{detail.agent.display_name}</p>
                  <p className="text-sm text-text-secondary">{detail.agent.role}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <StatusBadge status={detail.agent.status} />
                    <Button size="sm" onClick={onRun}>
                      <Play className="w-3 h-3 mr-1" /> Executar
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <Card>
                  <CardContent className="p-3 text-center">
                    <Clock className="w-4 h-4 mx-auto mb-1 text-yellow-400" />
                    <p className="text-lg font-bold text-text-primary">{detail.pendingTasks}</p>
                    <p className="text-xs text-text-secondary">Pendentes</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <CheckCircle className="w-4 h-4 mx-auto mb-1 text-green-400" />
                    <p className="text-lg font-bold text-text-primary">
                      {detail.tasks.filter((t) => t.status === "completed").length}
                    </p>
                    <p className="text-xs text-text-secondary">Concluídas</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <AlertCircle className="w-4 h-4 mx-auto mb-1 text-red-400" />
                    <p className="text-lg font-bold text-text-primary">
                      {detail.tasks.filter((t) => t.status === "failed").length}
                    </p>
                    <p className="text-xs text-text-secondary">Falharam</p>
                  </CardContent>
                </Card>
              </div>

              {/* Task History */}
              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-3">
                  Histórico ({detail.tasks.length})
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
                            <span>{formatDateTime(task.created_at)}</span>
                            {task.completed_at && <span>Concluída: {formatDateTime(task.completed_at)}</span>}
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
  )
}
