"use client"

import { useCallback } from "react"
import { FileText, Calendar, Bot, DollarSign } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { StatCard } from "@/components/dashboard/stat-card"
import { AgentGrid } from "@/components/dashboard/agent-grid"
import { PipelineSummary } from "@/components/dashboard/pipeline-summary"
import { usePolling } from "@/hooks/use-polling"
import { api } from "@/lib/api"
import { formatCurrency } from "@/lib/utils"
import type { DashboardStats } from "@/lib/types"

export default function OverviewPage() {
  const fetcher = useCallback(() => api.stats.get(), [])
  const { data: stats, loading } = usePolling<DashboardStats>({ fetcher })

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-text-primary">Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Conteúdo"
          value={loading ? "..." : stats?.content.thisWeek ?? 0}
          subtitle="Esta semana"
          icon={FileText}
        />
        <StatCard
          title="Agendados"
          value={loading ? "..." : stats?.content.scheduled ?? 0}
          subtitle="Aguardando publicação"
          icon={Calendar}
        />
        <StatCard
          title="Agentes Ativos"
          value={loading ? "..." : stats?.agents.active ?? 0}
          subtitle={`de ${stats?.agents.total ?? 13} agentes`}
          icon={Bot}
        />
        <StatCard
          title="Pipeline"
          value={loading ? "..." : formatCurrency(stats?.pipeline.totalValue ?? 0)}
          subtitle={`${stats?.pipeline.totalDeals ?? 0} deals abertos`}
          icon={DollarSign}
        />
      </div>

      {/* Agent Status Grid */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Status dos Agentes</h2>
        <AgentGrid />
      </div>

      {/* Pipeline Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pipeline de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="animate-pulse h-32" />
          ) : stats ? (
            <PipelineSummary
              byStage={stats.pipeline.byStage}
              totalDeals={stats.pipeline.totalDeals}
              totalValue={stats.pipeline.totalValue}
            />
          ) : (
            <p className="text-text-secondary text-sm">Sem dados disponíveis</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
