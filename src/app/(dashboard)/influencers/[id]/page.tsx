"use client"

import { useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { usePolling } from "@/hooks/use-polling"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import type { Influencer, Collaboration, InfluencerStatus, CollaborationStatus, CollaborationType } from "@/lib/types"
import { ArrowLeft } from "lucide-react"

interface InfluencerDetailResponse {
  data: Influencer
  collaborations: Collaboration[]
}

const statusConfig: Record<InfluencerStatus, { label: string; variant: "warning" | "default" | "success" | "secondary" }> = {
  prospect: { label: "Prospect", variant: "warning" },
  contacted: { label: "Contatado", variant: "default" },
  active: { label: "Ativo", variant: "success" },
  inactive: { label: "Inativo", variant: "secondary" },
}

const collabStatusConfig: Record<CollaborationStatus, { label: string; variant: "warning" | "default" | "success" | "secondary" | "error" }> = {
  proposed: { label: "Proposto", variant: "warning" },
  accepted: { label: "Aceito", variant: "default" },
  in_progress: { label: "Em Andamento", variant: "default" },
  completed: { label: "Concluido", variant: "success" },
  cancelled: { label: "Cancelado", variant: "error" },
}

const collabTypeLabels: Record<CollaborationType, string> = {
  collab_post: "Post Colaborativo",
  guest: "Participacao",
  interview: "Entrevista",
  cross_promo: "Cross Promo",
  affiliate: "Afiliado",
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

const socialPlatformLinks: Record<string, (handle: string) => string> = {
  instagram: (h) => `https://instagram.com/${h.replace("@", "")}`,
  youtube: (h) => `https://youtube.com/${h.replace("@", "")}`,
  linkedin: (h) => `https://linkedin.com/in/${h}`,
  x: (h) => `https://x.com/${h.replace("@", "")}`,
  tiktok: (h) => `https://tiktok.com/@${h.replace("@", "")}`,
}

export default function InfluencerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const fetcher = useCallback(async (): Promise<InfluencerDetailResponse> => {
    const res = await fetch(`/api/influencers/${id}`)
    if (!res.ok) throw new Error("Erro ao carregar influenciador")
    return res.json()
  }, [id])

  const { data: response, loading } = usePolling<InfluencerDetailResponse>({
    fetcher,
    interval: 60000,
  })

  if (loading && !response) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-zinc-800 animate-pulse rounded" />
        <div className="h-40 bg-zinc-800 animate-pulse rounded-lg" />
        <div className="h-64 bg-zinc-800 animate-pulse rounded-lg" />
      </div>
    )
  }

  if (!response) {
    return <p className="text-text-secondary">Influenciador nao encontrado.</p>
  }

  const { data: influencer, collaborations } = response
  const config = statusConfig[influencer.status]

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push("/influencers")}
        className="flex items-center gap-1 text-text-secondary hover:text-text-primary text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </button>

      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-14 h-14 rounded-full bg-accent/20 text-accent flex items-center justify-center text-lg font-semibold">
            {getInitials(influencer.name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-text-primary">{influencer.name}</h1>
              <Badge variant={config.variant}>{config.label}</Badge>
            </div>
            {influencer.niche && (
              <p className="text-text-secondary text-sm mb-2">{influencer.niche}</p>
            )}
            <p className="text-text-secondary text-sm">
              {formatFollowers(influencer.followers_approx)} seguidores
            </p>
          </div>
        </div>

        {influencer.handles && Object.keys(influencer.handles).length > 0 && (
          <div className="mt-4 pt-4 border-t border-zinc-700">
            <h3 className="text-sm font-medium text-text-primary mb-2">Redes Sociais</h3>
            <div className="flex flex-wrap gap-3">
              {Object.entries(influencer.handles).map(([platform, handle]) => {
                const linkFn = socialPlatformLinks[platform]
                const href = linkFn ? linkFn(handle) : "#"
                return (
                  <a
                    key={platform}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent hover:underline"
                  >
                    {platform}: {handle}
                  </a>
                )
              })}
            </div>
          </div>
        )}

        {influencer.notes && (
          <div className="mt-4 pt-4 border-t border-zinc-700">
            <h3 className="text-sm font-medium text-text-primary mb-1">Notas</h3>
            <p className="text-text-secondary text-sm whitespace-pre-wrap">{influencer.notes}</p>
          </div>
        )}
      </div>

      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Colaboracoes ({collaborations.length})
        </h2>

        {collaborations.length === 0 ? (
          <p className="text-text-secondary text-sm">Nenhuma colaboracao registrada.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-700 text-text-secondary">
                  <th className="text-left py-2 pr-4 font-medium">Tipo</th>
                  <th className="text-left py-2 pr-4 font-medium">Status</th>
                  <th className="text-left py-2 pr-4 font-medium">Data</th>
                  <th className="text-left py-2 font-medium">Notas</th>
                </tr>
              </thead>
              <tbody>
                {collaborations.map((collab) => {
                  const cConfig = collab.status
                    ? collabStatusConfig[collab.status]
                    : { label: "-", variant: "secondary" as const }
                  return (
                    <tr key={collab.id} className="border-b border-zinc-700/50">
                      <td className="py-3 pr-4 text-text-primary">
                        {collab.type ? collabTypeLabels[collab.type] ?? collab.type : "-"}
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant={cConfig.variant}>{cConfig.label}</Badge>
                      </td>
                      <td className="py-3 pr-4 text-text-secondary">
                        {collab.scheduled_at ? formatDate(collab.scheduled_at) : formatDate(collab.created_at)}
                      </td>
                      <td className="py-3 text-text-secondary truncate max-w-[200px]">
                        {collab.notes ?? "-"}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
