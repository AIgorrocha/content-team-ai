"use client"

import { use } from "react"
import { CampaignDetail } from "@/components/email/campaign-detail"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function CampaignDetailPage({ params }: PageProps) {
  const { id } = use(params)

  return (
    <div>
      <CampaignDetail campaignId={id} />
    </div>
  )
}
