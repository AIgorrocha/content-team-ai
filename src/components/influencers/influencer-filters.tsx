"use client"

import type { InfluencerStatus } from "@/lib/types"

interface InfluencerFiltersProps {
  search: string
  status: InfluencerStatus | ""
  onSearchChange: (value: string) => void
  onStatusChange: (value: InfluencerStatus | "") => void
}

const statusOptions: Array<{ value: InfluencerStatus | ""; label: string }> = [
  { value: "", label: "Todos os status" },
  { value: "prospect", label: "Prospect" },
  { value: "contacted", label: "Contatado" },
  { value: "active", label: "Ativo" },
  { value: "inactive", label: "Inativo" },
]

export function InfluencerFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: InfluencerFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        placeholder="Buscar por nome ou nicho..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-text-primary placeholder:text-text-secondary text-sm focus:outline-none focus:border-accent"
      />
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as InfluencerStatus | "")}
        className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent"
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
