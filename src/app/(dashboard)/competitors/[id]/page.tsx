"use client"

import { useParams } from "next/navigation"
import { CompetitorDetail } from "@/components/competitors/competitor-detail"

export default function CompetitorDetailPage() {
  const params = useParams()
  const competitorId = params.id as string

  return <CompetitorDetail competitorId={competitorId} />
}
