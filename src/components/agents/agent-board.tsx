"use client"

import { useState, useCallback } from "react"
import { usePolling } from "@/hooks/use-polling"
import { api } from "@/lib/api"
import { AgentCard } from "./agent-card"
import { AgentDetailModal } from "./agent-detail-modal"
import { RunAgentDialog } from "./run-agent-dialog"
import { TaskFeed } from "./task-feed"
import { Button } from "@/components/ui/button"
import { LayoutGrid, List, Activity } from "lucide-react"
import type { AgentWithTaskCount } from "@/lib/queries/agents"
import type { AgentStatus } from "@/lib/types"

const columns: Array<{ id: AgentStatus | "all"; label: string }> = [
  { id: "all", label: "Todos" },
  { id: "active", label: "Trabalhando" },
  { id: "idle", label: "Disponíveis" },
  { id: "error", label: "Com Erro" },
]

export function AgentBoard() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [runAgent, setRunAgent] = useState<string | null>(null)
  const [view, setView] = useState<"kanban" | "list" | "feed">("kanban")
  const [filter, setFilter] = useState<AgentStatus | "all">("all")

  const fetcher = useCallback(() => api.agents.list(), [])
  const { data: agents, loading } = usePolling<AgentWithTaskCount[]>({ fetcher, interval: 10000 })

  const filtered = agents?.filter((a) => filter === "all" || a.status === filter) ?? []

  const grouped = {
    active: filtered.filter((a) => a.status === "active"),
    idle: filtered.filter((a) => a.status === "idle"),
    error: filtered.filter((a) => a.status === "error"),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Mission Control</h1>
          <p className="text-sm text-text-secondary mt-1">
            {agents?.length ?? 0} agentes | {grouped.active.length} ativos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-border rounded-lg overflow-hidden">
            <button
              className={`p-2 ${view === "kanban" ? "bg-accent text-white" : "text-text-secondary hover:text-text-primary"}`}
              onClick={() => setView("kanban")}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              className={`p-2 ${view === "list" ? "bg-accent text-white" : "text-text-secondary hover:text-text-primary"}`}
              onClick={() => setView("list")}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              className={`p-2 ${view === "feed" ? "bg-accent text-white" : "text-text-secondary hover:text-text-primary"}`}
              onClick={() => setView("feed")}
            >
              <Activity className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {columns.map((col) => {
          const count = col.id === "all" ? (agents?.length ?? 0) : grouped[col.id]?.length ?? 0
          return (
            <Button
              key={col.id}
              variant={filter === col.id ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(col.id)}
            >
              {col.label} ({count})
            </Button>
          )
        })}
      </div>

      {/* Views */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 bg-surface rounded-lg animate-pulse" />
          ))}
        </div>
      ) : view === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Active column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-green-500/30">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-medium text-text-primary">Trabalhando ({grouped.active.length})</span>
            </div>
            {grouped.active.map((agent) => (
              <AgentCard
                key={agent.slug}
                agent={agent}
                onClick={() => setSelectedAgent(agent.slug)}
                onRun={() => setRunAgent(agent.slug)}
              />
            ))}
            {grouped.active.length === 0 && (
              <p className="text-sm text-text-secondary text-center py-8">Nenhum agente trabalhando</p>
            )}
          </div>

          {/* Idle column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-blue-500/30">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-sm font-medium text-text-primary">Disponíveis ({grouped.idle.length})</span>
            </div>
            {grouped.idle.map((agent) => (
              <AgentCard
                key={agent.slug}
                agent={agent}
                onClick={() => setSelectedAgent(agent.slug)}
                onRun={() => setRunAgent(agent.slug)}
              />
            ))}
          </div>

          {/* Error column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-red-500/30">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-sm font-medium text-text-primary">Com Erro ({grouped.error.length})</span>
            </div>
            {grouped.error.map((agent) => (
              <AgentCard
                key={agent.slug}
                agent={agent}
                onClick={() => setSelectedAgent(agent.slug)}
                onRun={() => setRunAgent(agent.slug)}
              />
            ))}
            {grouped.error.length === 0 && (
              <p className="text-sm text-text-secondary text-center py-8">Tudo certo!</p>
            )}
          </div>
        </div>
      ) : view === "list" ? (
        <div className="space-y-2">
          {filtered.map((agent) => (
            <AgentCard
              key={agent.slug}
              agent={agent}
              layout="horizontal"
              onClick={() => setSelectedAgent(agent.slug)}
              onRun={() => setRunAgent(agent.slug)}
            />
          ))}
        </div>
      ) : (
        <TaskFeed />
      )}

      {/* Modals */}
      {selectedAgent && (
        <AgentDetailModal
          slug={selectedAgent}
          onClose={() => setSelectedAgent(null)}
          onRun={() => {
            setRunAgent(selectedAgent)
            setSelectedAgent(null)
          }}
        />
      )}

      {runAgent && (
        <RunAgentDialog
          slug={runAgent}
          onClose={() => setRunAgent(null)}
        />
      )}
    </div>
  )
}
