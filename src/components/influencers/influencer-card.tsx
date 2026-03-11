"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { InfluencerStatus } from "@/lib/types"

interface InfluencerCardProps {
  id: string
  name: string
  niche: string | null
  followers_approx: number | null
  status: InfluencerStatus
  collaboration_count: number
  onClick: (id: string) => void
}

const statusConfig: Record<InfluencerStatus, { label: string; variant: "warning" | "default" | "success" | "secondary" }> = {
  prospect: { label: "Prospect", variant: "warning" },
  contacted: { label: "Contatado", variant: "default" },
  active: { label: "Ativo", variant: "success" },
  inactive: { label: "Inativo", variant: "secondary" },
}

function formatFollowers(count: number | null): string {
  if (count === null || count === 0) return "N/A"
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`
  return count.toString()
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
}

export function InfluencerCard({
  id,
  name,
  niche,
  followers_approx,
  status,
  collaboration_count,
  onClick,
}: InfluencerCardProps) {
  const config = statusConfig[status]

  return (
    <div
      onClick={() => onClick(id)}
      className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 hover:border-zinc-600 cursor-pointer transition-colors"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="shrink-0 w-10 h-10 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-semibold">
          {getInitials(name)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-text-primary font-medium truncate">{name}</h3>
          {niche && (
            <p className="text-text-secondary text-sm truncate">{niche}</p>
          )}
        </div>
        <Badge variant={config.variant}>{config.label}</Badge>
      </div>

      <div className="flex items-center justify-between text-sm text-text-secondary">
        <span>{formatFollowers(followers_approx)} seguidores</span>
        <span>
          {collaboration_count} {collaboration_count === 1 ? "colab" : "colabs"}
        </span>
      </div>
    </div>
  )
}
