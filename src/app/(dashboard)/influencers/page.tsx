"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { usePolling } from "@/hooks/use-polling"
import { InfluencerCard } from "@/components/influencers/influencer-card"
import { InfluencerFilters } from "@/components/influencers/influencer-filters"
import type { InfluencerStatus } from "@/lib/types"

interface InfluencerWithCount {
  id: string
  name: string
  handles: Record<string, string> | null
  niche: string | null
  followers_approx: number | null
  status: InfluencerStatus
  notes: string | null
  last_contact_at: string | null
  metadata: Record<string, unknown>
  created_at: string
  collaboration_count: number
}

interface InfluencerListResponse {
  data: InfluencerWithCount[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}

export default function InfluencersPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<InfluencerStatus | "">("")
  const [page, setPage] = useState(1)

  const fetcher = useCallback(async (): Promise<InfluencerListResponse> => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (status) params.set("status", status)
    params.set("page", String(page))
    params.set("limit", "20")

    const res = await fetch(`/api/influencers?${params.toString()}`)
    if (!res.ok) throw new Error("Erro ao carregar influenciadores")
    return res.json()
  }, [search, status, page])

  const { data: response, loading } = usePolling<InfluencerListResponse>({
    fetcher,
    interval: 60000,
  })

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleStatusChange = (value: InfluencerStatus | "") => {
    setStatus(value)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Influenciadores</h1>

      <InfluencerFilters
        search={search}
        status={status}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
      />

      {loading && !response ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 rounded-lg bg-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {response?.data.map((inf) => (
              <InfluencerCard
                key={inf.id}
                id={inf.id}
                name={inf.name}
                niche={inf.niche}
                followers_approx={inf.followers_approx}
                status={inf.status}
                collaboration_count={inf.collaboration_count}
                onClick={(id) => router.push(`/influencers/${id}`)}
              />
            ))}
          </div>

          {response && response.meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 text-sm rounded bg-zinc-800 border border-zinc-700 text-text-secondary hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="text-sm text-text-secondary">
                {page} / {response.meta.totalPages}
              </span>
              <button
                disabled={page >= response.meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 text-sm rounded bg-zinc-800 border border-zinc-700 text-text-secondary hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proximo
              </button>
            </div>
          )}

          {response?.data.length === 0 && (
            <p className="text-center text-text-secondary py-8">
              Nenhum influenciador encontrado.
            </p>
          )}
        </>
      )}
    </div>
  )
}
