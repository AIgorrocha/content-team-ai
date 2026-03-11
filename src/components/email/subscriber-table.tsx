"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { usePolling } from "@/hooks/use-polling"
import { Badge } from "@/components/ui/badge"
import { ContentPagination } from "@/components/content/content-pagination"
import { formatDate } from "@/lib/utils"
import type { Subscriber, SubscriberStatus, PaginatedResponse } from "@/lib/types"
import type { SubscriberStats } from "@/lib/queries/email"

interface SubscribersResponse extends PaginatedResponse<Subscriber> {
  stats: SubscriberStats
}

interface SubscriberTableProps {
  onStatsLoaded?: (stats: SubscriberStats) => void
}

const statusVariant: Record<SubscriberStatus, "success" | "warning" | "error"> = {
  active: "success",
  unsubscribed: "warning",
  bounced: "error",
}

const statusLabels: Record<SubscriberStatus, string> = {
  active: "Ativo",
  unsubscribed: "Cancelado",
  bounced: "Bounce",
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Todos os status" },
  { value: "active", label: "Ativo" },
  { value: "unsubscribed", label: "Cancelado" },
  { value: "bounced", label: "Bounce" },
]

export function SubscriberTable({ onStatsLoaded }: SubscriberTableProps) {
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [page, setPage] = useState(1)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [search])

  const fetcher = useCallback(async (): Promise<SubscribersResponse> => {
    const params = new URLSearchParams()
    if (debouncedSearch) params.set("search", debouncedSearch)
    if (statusFilter) params.set("status", statusFilter)
    params.set("page", String(page))
    params.set("limit", "20")

    const res = await fetch(`/api/email/subscribers?${params.toString()}`)
    if (!res.ok) throw new Error("Erro ao carregar assinantes")
    return res.json()
  }, [debouncedSearch, statusFilter, page])

  const { data, loading } = usePolling<SubscribersResponse>({
    fetcher,
    interval: 30000,
  })

  useEffect(() => {
    if (data?.stats && onStatsLoaded) {
      onStatsLoaded(data.stats)
    }
  }, [data?.stats, onStatsLoaded])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Buscar por email ou nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600"
        />
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
            <div key={i} className="h-12 rounded-md bg-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : data && data.data.length === 0 ? (
        <div className="text-center py-12 text-zinc-400">
          Nenhum assinante encontrado.
        </div>
      ) : data ? (
        <>
          <div className="overflow-x-auto rounded-lg border border-zinc-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-700 bg-zinc-800">
                  <th className="text-left px-4 py-3 font-medium text-zinc-400">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-400">Nome</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-400">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-400">Tags</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-400">Origem</th>
                  <th className="text-left px-4 py-3 font-medium text-zinc-400">Inscrito em</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((sub) => (
                  <tr
                    key={sub.id}
                    className="border-b border-zinc-700 hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-white">{sub.email}</td>
                    <td className="px-4 py-3 text-zinc-300">{sub.name ?? "-"}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[sub.status]}>
                        {statusLabels[sub.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {sub.tags && sub.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {sub.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-zinc-500">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-zinc-300">{sub.source ?? "-"}</td>
                    <td className="px-4 py-3 text-zinc-300">
                      {formatDate(sub.subscribed_at)}
                    </td>
                  </tr>
                ))}
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
