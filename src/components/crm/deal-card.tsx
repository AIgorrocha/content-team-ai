"use client"

import type { DealWithContact } from "@/lib/queries/crm"
import type { DealStatus } from "@/lib/types"
import { DragEvent } from "react"

interface DealCardProps {
  deal: DealWithContact
  draggable?: boolean
}

const STATUS_STYLES: Record<DealStatus, { label: string; className: string }> = {
  open: { label: "Aberto", className: "bg-emerald-500/20 text-emerald-400" },
  won: { label: "Ganho", className: "bg-blue-500/20 text-blue-400" },
  lost: { label: "Perdido", className: "bg-red-500/20 text-red-400" },
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Hoje"
  if (diffDays === 1) return "Amanha"
  if (diffDays === -1) return "Ontem"
  if (diffDays > 0) return `Em ${diffDays} dias`
  return `${Math.abs(diffDays)} dias atras`
}

export function DealCard({ deal, draggable = true }: DealCardProps) {
  const status = STATUS_STYLES[deal.status] ?? STATUS_STYLES.open

  function handleDragStart(e: DragEvent<HTMLDivElement>) {
    e.dataTransfer.setData("text/plain", deal.id)
    e.dataTransfer.effectAllowed = "move"
  }

  return (
    <div
      draggable={draggable}
      onDragStart={handleDragStart}
      className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-zinc-600 transition-colors"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-medium text-zinc-100 truncate">
          {deal.title}
        </h4>
        <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${status.className}`}>
          {status.label}
        </span>
      </div>

      {deal.contact_name && (
        <p className="text-xs text-zinc-400 mb-1">{deal.contact_name}</p>
      )}

      <div className="flex items-center justify-between mt-2">
        {deal.value != null && (
          <span className="text-xs font-medium text-zinc-300">
            {formatCurrency(deal.value)}
          </span>
        )}
        {deal.expected_close_at && (
          <span className="text-xs text-zinc-500">
            {formatRelativeDate(deal.expected_close_at)}
          </span>
        )}
      </div>
    </div>
  )
}
