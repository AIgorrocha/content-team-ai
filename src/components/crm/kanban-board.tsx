"use client"

import { useCallback, useState, DragEvent } from "react"
import { usePolling } from "@/hooks/use-polling"
import { DealCard } from "./deal-card"
import type { PipelineData, StageWithDeals } from "@/lib/queries/crm"

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

async function fetchPipeline(): Promise<PipelineData> {
  const res = await fetch("/api/crm/pipeline")
  if (!res.ok) throw new Error("Erro ao carregar pipeline")
  const json = await res.json()
  return json.data
}

async function moveDeal(dealId: string, stageId: string): Promise<void> {
  const res = await fetch(`/api/crm/deals/${dealId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stage_id: stageId }),
  })
  if (!res.ok) throw new Error("Erro ao mover deal")
}

export function KanbanBoard() {
  const fetcher = useCallback(() => fetchPipeline(), [])
  const { data, loading, error, refresh } = usePolling<PipelineData>({
    fetcher,
    interval: 30000,
  })

  const [dragOverStage, setDragOverStage] = useState<string | null>(null)
  const [optimisticStages, setOptimisticStages] = useState<StageWithDeals[] | null>(null)

  const stages = optimisticStages ?? data?.stages ?? []

  async function handleDrop(e: DragEvent<HTMLDivElement>, targetStageId: string) {
    e.preventDefault()
    setDragOverStage(null)

    const dealId = e.dataTransfer.getData("text/plain")
    if (!dealId) return

    // Optimistic update
    setOptimisticStages((prev) => {
      const current = prev ?? data?.stages ?? []
      let movedDeal = null as (typeof current)[0]["deals"][0] | null

      const withoutDeal = current.map((stage) => ({
        ...stage,
        deals: stage.deals.filter((d) => {
          if (d.id === dealId) {
            movedDeal = d
            return false
          }
          return true
        }),
      }))

      if (!movedDeal) return current

      return withoutDeal.map((stage) =>
        stage.id === targetStageId
          ? { ...stage, deals: [...stage.deals, { ...movedDeal!, stage_id: targetStageId }] }
          : stage
      )
    })

    try {
      await moveDeal(dealId, targetStageId)
      await refresh()
    } catch {
      setOptimisticStages(null)
      await refresh()
    }

    setOptimisticStages(null)
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>, stageId: string) {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverStage(stageId)
  }

  function handleDragLeave() {
    setDragOverStage(null)
  }

  function handleAddDeal() {
    alert("Funcionalidade de adicionar deal sera implementada em breve!")
  }

  if (loading && stages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400">
        Carregando pipeline...
      </div>
    )
  }

  if (error && stages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-red-400">
        Erro: {error}
      </div>
    )
  }

  if (stages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400">
        Nenhum estagio no pipeline. Configure os estagios primeiro.
      </div>
    )
  }

  return (
    <div className="flex overflow-x-auto gap-4 pb-4">
      {stages.map((stage) => {
        const totalValue = stage.deals.reduce(
          (sum, d) => sum + (d.value ?? 0),
          0
        )
        const isOver = dragOverStage === stage.id

        return (
          <div
            key={stage.id}
            onDragOver={(e) => handleDragOver(e, stage.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage.id)}
            className={`min-w-[280px] max-w-[320px] flex-shrink-0 rounded-lg p-2 transition-colors ${
              isOver ? "bg-zinc-700/50 ring-2 ring-zinc-500" : "bg-zinc-900/50"
            }`}
            style={
              stage.color
                ? { backgroundColor: isOver ? undefined : `${stage.color}15` }
                : undefined
            }
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                {stage.color && (
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                )}
                <h3 className="text-sm font-semibold text-zinc-100">
                  {stage.name}
                </h3>
                <span className="text-xs text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">
                  {stage.deals.length}
                </span>
              </div>
              {totalValue > 0 && (
                <span className="text-xs text-zinc-400">
                  {formatCurrency(totalValue)}
                </span>
              )}
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-2 min-h-[100px]">
              {stage.deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>

            {/* Add button */}
            <button
              onClick={handleAddDeal}
              className="mt-2 w-full py-1.5 text-xs text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded transition-colors"
            >
              + Adicionar Deal
            </button>
          </div>
        )
      })}
    </div>
  )
}
