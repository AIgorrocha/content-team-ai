"use client"

import { useState, useCallback } from "react"
import { usePolling } from "@/hooks/use-polling"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDateTime } from "@/lib/utils"
import type { Task } from "@/lib/types"

const statusIcons: Record<string, string> = {
  pending: "⏳",
  in_progress: "🔄",
  completed: "✅",
  failed: "❌",
  cancelled: "⏹️",
}

export function TaskFeed() {
  const fetcher = useCallback(async () => {
    const res = await fetch("/api/agents/tasks/recent")
    if (!res.ok) return []
    const json = await res.json()
    return json.data ?? []
  }, [])

  const { data: tasks, loading } = usePolling<Array<Task & { agent_name?: string }>>({
    fetcher,
    interval: 10000,
  })

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-surface rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12 text-text-secondary">
        <p className="text-lg">Nenhuma atividade recente</p>
        <p className="text-sm mt-1">Quando os agentes trabalharem, as atividades aparecerão aqui</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-text-primary mb-3">Atividade Recente</h3>
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardContent className="p-3 flex items-center gap-3">
            <span className="text-lg">{statusIcons[task.status] ?? "📋"}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{task.title}</p>
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                {task.assigned_agent && (
                  <Badge variant="secondary" className="text-xs">{task.assigned_agent}</Badge>
                )}
                <span>{formatDateTime(task.created_at)}</span>
              </div>
            </div>
            <Badge variant={task.status === "completed" ? "success" : task.status === "failed" ? "error" : "default"}>
              {task.status}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
