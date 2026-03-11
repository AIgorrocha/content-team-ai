"use client"

import { useCallback } from "react"
import { usePolling } from "@/hooks/use-polling"
import { Badge } from "@/components/ui/badge"
import { formatDateTime } from "@/lib/utils"
import type { EmailCampaign, CampaignStatus } from "@/lib/types"

interface CampaignDetailProps {
  campaignId: string
}

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

function StatsCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
    </div>
  )
}

export function CampaignDetail({ campaignId }: CampaignDetailProps) {
  const fetcher = useCallback(async (): Promise<EmailCampaign> => {
    const res = await fetch(`/api/email/campaigns/${campaignId}`)
    if (!res.ok) throw new Error("Erro ao carregar campanha")
    return res.json()
  }, [campaignId])

  const { data: campaign, loading, error } = usePolling<EmailCampaign>({
    fetcher,
    interval: 30000,
  })

  if (loading && !campaign) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 bg-zinc-800 animate-pulse rounded" />
        <div className="h-48 bg-zinc-800 animate-pulse rounded-lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-400">
        Erro ao carregar campanha: {error}
      </div>
    )
  }

  if (!campaign) return null

  const stats = campaign.stats as Record<string, number> | null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{campaign.name}</h1>
        <p className="text-zinc-400 mt-1">{campaign.subject}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Badge variant={statusVariant[campaign.status]}>
          {statusLabels[campaign.status]}
        </Badge>
        {campaign.campaign_type && (
          <Badge variant="secondary">
            {typeLabels[campaign.campaign_type] ?? campaign.campaign_type}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {campaign.scheduled_at && (
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
            <p className="text-sm text-zinc-400">Agendada para</p>
            <p className="text-sm font-medium text-white mt-1">
              {formatDateTime(campaign.scheduled_at)}
            </p>
          </div>
        )}
        {campaign.sent_at && (
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
            <p className="text-sm text-zinc-400">Enviada em</p>
            <p className="text-sm font-medium text-white mt-1">
              {formatDateTime(campaign.sent_at)}
            </p>
          </div>
        )}
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
          <p className="text-sm text-zinc-400">Criada em</p>
          <p className="text-sm font-medium text-white mt-1">
            {formatDateTime(campaign.created_at)}
          </p>
        </div>
      </div>

      {stats && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Estatisticas</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatsCard label="Aberturas" value={stats.opens ?? 0} />
            <StatsCard label="Cliques" value={stats.clicks ?? 0} />
            <StatsCard label="Bounces" value={stats.bounces ?? 0} />
          </div>
        </div>
      )}

      {campaign.body_html && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Preview do Email</h2>
          <div className="border border-zinc-700 rounded-lg overflow-hidden bg-white">
            <iframe
              srcDoc={campaign.body_html}
              title="Email preview"
              className="w-full min-h-[400px] border-0"
              sandbox=""
            />
          </div>
        </div>
      )}

      {campaign.recipient_tags && campaign.recipient_tags.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Tags dos destinatarios</h2>
          <div className="flex flex-wrap gap-2">
            {campaign.recipient_tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
