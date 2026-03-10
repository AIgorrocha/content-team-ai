"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { usePolling } from "@/hooks/use-polling"
import { Badge } from "@/components/ui/badge"
import { ContentFiltersBar, type ContentFilters } from "@/components/content/content-filters"
import { ContentTable } from "@/components/content/content-table"
import { ContentPagination } from "@/components/content/content-pagination"
import type { ContentItem, PaginatedResponse } from "@/lib/types"

export default function ContentPage() {
  const router = useRouter()
  const [filters, setFilters] = useState<ContentFilters>({})
  const [page, setPage] = useState(1)

  const fetcher = useCallback(async (): Promise<PaginatedResponse<ContentItem>> => {
    const params = new URLSearchParams()
    if (filters.search) params.set("search", filters.search)
    if (filters.status) params.set("status", filters.status)
    if (filters.platform) params.set("platform", filters.platform)
    if (filters.type) params.set("type", filters.type)
    params.set("page", String(page))
    params.set("limit", "20")

    const res = await fetch(`/api/content?${params.toString()}`)
    if (!res.ok) throw new Error("Erro ao carregar conteúdo")
    return res.json()
  }, [filters.search, filters.status, filters.platform, filters.type, page])

  const { data, loading } = usePolling<PaginatedResponse<ContentItem>>({
    fetcher,
    interval: 30000,
  })

  function handleFiltersChange(newFilters: ContentFilters) {
    setFilters(newFilters)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-text-primary">Conteúdo</h1>
        {data && (
          <Badge variant="secondary">{data.meta.total} itens</Badge>
        )}
      </div>

      <ContentFiltersBar filters={filters} onChange={handleFiltersChange} />

      {loading && !data ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 rounded-md bg-surface animate-pulse" />
          ))}
        </div>
      ) : data ? (
        <>
          <ContentTable
            items={data.data}
            onRowClick={(id) => router.push(`/content/${id}`)}
          />
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
