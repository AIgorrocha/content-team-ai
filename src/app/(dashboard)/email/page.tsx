"use client"

import { useState, useCallback } from "react"
import { EmailStats } from "@/components/email/email-stats"
import { SubscriberTable } from "@/components/email/subscriber-table"
import { CampaignList } from "@/components/email/campaign-list"
import type { SubscriberStats } from "@/lib/queries/email"
import type { EmailCampaign } from "@/lib/types"

type Tab = "subscribers" | "campaigns"

export default function EmailPage() {
  const [activeTab, setActiveTab] = useState<Tab>("subscribers")
  const [subscriberStats, setSubscriberStats] = useState<SubscriberStats | null>(null)
  const [campaignsSent, setCampaignsSent] = useState(0)
  const [latestCampaign, setLatestCampaign] = useState<EmailCampaign | null>(null)

  const handleStatsLoaded = useCallback((stats: SubscriberStats) => {
    setSubscriberStats(stats)
  }, [])

  const handleCampaignsLoaded = useCallback((campaigns: EmailCampaign[]) => {
    const sent = campaigns.filter((c) => c.status === "sent").length
    setCampaignsSent(sent)
    if (campaigns.length > 0) {
      setLatestCampaign(campaigns[0])
    }
  }, [])

  const tabs: { key: Tab; label: string }[] = [
    { key: "subscribers", label: "Assinantes" },
    { key: "campaigns", label: "Campanhas" },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Email Marketing</h1>

      <EmailStats
        subscriberStats={subscriberStats}
        campaignsSent={campaignsSent}
        latestCampaign={latestCampaign}
      />

      <div className="flex gap-1 border-b border-zinc-700">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab.key
                ? "bg-zinc-700 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "subscribers" && (
        <SubscriberTable onStatsLoaded={handleStatsLoaded} />
      )}

      {activeTab === "campaigns" && (
        <CampaignList onCampaignsLoaded={handleCampaignsLoaded} />
      )}
    </div>
  )
}
