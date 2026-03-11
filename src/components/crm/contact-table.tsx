"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ContentPagination } from "@/components/content/content-pagination"
import type { Contact, PaginatedResponse } from "@/lib/types"
import { formatDate } from "@/lib/utils"

const SOURCE_OPTIONS = [
  { value: "", label: "Todas as origens" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "website", label: "Website" },
  { value: "referral", label: "Indicacao" },
  { value: "event", label: "Evento" },
  { value: "other", label: "Outro" },
]

export function ContactTable() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [source, setSource] = useState("")
  const [page, setPage] = useState(1)
  const [data, setData] = useState<PaginatedResponse<Contact> | null>(null)
  const [loading, setLoading] = useState(true)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [search])

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (debouncedSearch) params.set("search", debouncedSearch)
      if (source) params.set("source", source)
      params.set("page", String(page))
      params.set("limit", "20")

      const res = await fetch(`/api/crm/contacts?${params.toString()}`)
      if (!res.ok) throw new Error("Erro ao carregar contatos")
      const result = await res.json()
      setData(result)
    } catch {
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, source, page])

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  function handleSourceChange(value: string) {
    setSource(value)
    setPage(1)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={source}
          onChange={(e) => handleSourceChange(e.target.value)}
          className="h-9 rounded-md border border-border bg-surface px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {SOURCE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {loading && !data ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 rounded-md bg-surface animate-pulse" />
          ))}
        </div>
      ) : data && data.data.length > 0 ? (
        <>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Nome</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Telefone</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Empresa</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Origem</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Tags</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((contact) => (
                  <tr
                    key={contact.id}
                    onClick={() => router.push(`/crm/contacts/${contact.id}`)}
                    className="border-b border-border cursor-pointer hover:bg-surface-hover transition-colors"
                  >
                    <td className="px-4 py-3 text-text-primary font-medium">
                      {contact.name}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {contact.email ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {contact.phone ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {contact.company ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {contact.source ?? "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.length > 0 ? (
                          contact.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-text-secondary">-</span>
                        )}
                      </div>
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
      ) : (
        <div className="text-center py-12 text-text-secondary">
          Nenhum contato encontrado.
        </div>
      )}
    </div>
  )
}
