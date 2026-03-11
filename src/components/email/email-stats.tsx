"use client"

import type { SubscriberStats } from "@/lib/queries/email"
import type { EmailCampaign } from "@/lib/types"

interface EmailStatsProps {
  subscriberStats: SubscriberStats | null
  campaignsSent: number
  latestCampaign: EmailCampaign | null
}

const statusLabels: Record<string, string> = {
  draft: "Rascunho",
  scheduled: "Agendada",
  sending: "Enviando",
  sent: "Enviada",
  failed: "Falhou",
}

function StatCard({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
    </div>
  )
}

export function EmailStats({
  subscriberStats,
  campaignsSent,
  latestCampaign,
}: EmailStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        label="Total Assinantes"
        value={subscriberStats?.total ?? 0}
      />
      <StatCard
        label="Ativos"
        value={subscriberStats?.active ?? 0}
      />
      <StatCard
        label="Campanhas Enviadas"
        value={campaignsSent}
      />
      <StatCard
        label="Ultima Campanha"
        value={
          latestCampaign
            ? statusLabels[latestCampaign.status] ?? latestCampaign.status
            : "Nenhuma"
        }
      />
    </div>
  )
}
