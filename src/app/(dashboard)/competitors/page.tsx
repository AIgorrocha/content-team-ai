"use client"

import { CompetitorGrid } from "@/components/competitors/competitor-grid"

export default function CompetitorsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Competitor Monitoring</h1>
      <CompetitorGrid />
    </div>
  )
}
