"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { usePolling } from "@/hooks/use-polling"
import { Badge } from "@/components/ui/badge"
import { ContentPagination } from "@/components/content/content-pagination"
import { formatDate } from "@/lib/utils"
import type { EmailCampaign, CampaignStatus, PaginatedResponse } from "@/lib/types"

const statusVariant: Record<CampaignStatus, "secondary" | "default" | "warning" | "success" | "error"> = {
  draft: "secondary",
  scheduled: "default",
  sending: "warning",
  sent: "success",
  failed: "error",
}

const statusLabels: Record<CampaignStatus, string> = {
  draft: "Rascunho",
  scheduled: "Agendada",
  sending: "Enviando",
  sent: "Enviada",
  failed: "Falhou",
}

const typeLabels: Record<string, string> = {
  broadcast: "Broadcast",
  sequence: "Sequencia",
  trigger: "Gatilho",
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Todos os status" },
  { value: "draft", label: "Rascunho" },
  { value: "scheduled", label: "Agendada" },
  { value: "sending", label: "Enviando" },
  { value: "sent", label: "Enviada" },
  { value: "failed", label: "Falhou" },
]

interface CampaignListProps {
  onCampaignsLoaded?: (campaigns: EmailCampaign[]) => void
}

export function CampaignList({ onCampaignsLoaded }: CampaignListProps) {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState("")
  const [page, setPage] = useState(1)

  const fetcher = useCallback(async (): Promise<PaginatedResponse<EmailCampaign>> => {
    const params = new URLSearchParams()
    if (statusFilter) params.set("status", statusFilter)
    params.set("page", String(page))
    params.set("limit", "20")

    const res = await fetch(`/api/email/campaigns?${params.toString()}`)
    if (!res.ok) throw new Error("Erro ao carregar campanhas")
    return res.json()
  }, [statusFilter, page])

  const { data, loading } = usePolling<PaginatedResponse<EmailCampaign>>({
    fetcher,
    interval: 30000,
  })

  if (data?.data && onCampaignsLoaded) {
    onCampaignsLoaded(data.data)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-zinc-600"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {loading && !data ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 rounded-md bg-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : data && data.data.length === 0 ? (
        <div className="text-center py-12 text-zinc-400">
          Nenhuma campanha encontrada.
        </div>
      ) : data ? (
        <>
          <div className="overflow-x-auto rounded-lg border border-zinc-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-700 bg-zinc-800">
                  <th className="text-left px-4 py-3 font-medium text-zinc-400">Nome</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-400">Assunto</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-400">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-400">Tipo</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-400">Enviado em</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-400">Stats</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((campaign) => {
                  const stats = campaign.stats as Record<string, number> | null
                  return (
                    <tr
                      key={campaign.id}
                      onClick={() => router.push(`/email/campaigns/${campaign.id}`)}
                      className="border-b border-zinc-700 cursor-pointer hover:bg-zinc-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-white font-medium">
                        {campaign.name}
                      </td>
                      <td className="px-4 py-3 text-zinc-300 max-w-[250px] truncate">
                        {campaign.subject}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusVariant[campaign.status]}>
                          {statusLabels[campaign.status]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-zinc-300">
                        {campaign.campaign_type
                          ? typeLabels[campaign.campaign_type] ?? campaign.campaign_type
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-zinc-300">
                        {campaign.sent_at ? formatDate(campaign.sent_at) : "-"}
                      </td>
                      <td className="px-4 py-3 text-zinc-400 text-xs">
                        {stats ? (
                          <span>
                            {stats.opens ?? 0} aberturas / {stats.clicks ?? 0} cliques
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <ContentPagination
            page={data.meta.page}
            totalPages={data.meta.totalPages}
            total={data.meta.total}
            onPageChange={setPage}
          />
        </>
      ) : null}
    </div>
  )
}
