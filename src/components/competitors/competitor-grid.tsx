"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { usePolling } from "@/hooks/use-polling"
import { Plus } from "lucide-react"
import type { Competitor, Platform } from "@/lib/types"

const platformBadgeStyles: Record<string, { bg: string; text: string; label: string }> = {
  instagram: { bg: "bg-pink-500/20", text: "text-pink-400", label: "Instagram" },
  youtube: { bg: "bg-red-500/20", text: "text-red-400", label: "YouTube" },
  linkedin: { bg: "bg-blue-500/20", text: "text-blue-400", label: "LinkedIn" },
  x: { bg: "bg-gray-500/20", text: "text-gray-400", label: "X" },
  tiktok: { bg: "bg-cyan-500/20", text: "text-cyan-400", label: "TikTok" },
}

function formatRelativeTime(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return "agora"
  if (diffMins < 60) return `${diffMins}min atrás`
  if (diffHours < 24) return `${diffHours}h atrás`
  if (diffDays < 30) return `${diffDays}d atrás`
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(date)
}

export function CompetitorGrid() {
  const router = useRouter()

  const fetcher = useCallback(async (): Promise<Competitor[]> => {
    const res = await fetch("/api/competitors")
    if (!res.ok) throw new Error("Erro ao carregar concorrentes")
    return res.json()
  }, [])

  const { data: competitors, loading } = usePolling<Competitor[]>({
    fetcher,
    interval: 60000,
  })

  if (loading && !competitors) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-36 rounded-lg bg-zinc-800 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {competitors?.map((competitor) => {
        const badge = platformBadgeStyles[competitor.platform] ?? {
          bg: "bg-gray-500/20",
          text: "text-gray-400",
          label: competitor.platform,
        }

        return (
          <div
            key={competitor.id}
            onClick={() => router.push(`/competitors/${competitor.id}`)}
            className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 hover:border-zinc-600 cursor-pointer transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="min-w-0">
                <h3 className="text-text-primary font-medium truncate">
                  {competitor.display_name ?? competitor.handle}
                </h3>
                <p className="text-text-secondary text-sm">@{competitor.handle}</p>
              </div>
              <span className={`shrink-0 ml-2 text-xs px-2 py-1 rounded-full font-medium ${badge.bg} ${badge.text}`}>
                {badge.label}
              </span>
            </div>

            {competitor.niche && (
              <p className="text-text-secondary text-sm mb-3 truncate">{competitor.niche}</p>
            )}

            <div className="text-xs text-text-secondary">
              {competitor.last_scraped_at
                ? `Atualizado ${formatRelativeTime(competitor.last_scraped_at)}`
                : "Nunca coletado"}
            </div>
          </div>
        )
      })}

      <button
        className="bg-zinc-800/50 border border-zinc-700 border-dashed rounded-lg p-4 hover:border-zinc-600 cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 min-h-[144px] text-text-secondary hover:text-text-primary"
        onClick={() => {/* placeholder */}}
      >
        <Plus className="h-6 w-6" />
        <span className="text-sm font-medium">Adicionar Concorrente</span>
      </button>
    </div>
  )
}
