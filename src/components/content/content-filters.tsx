"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"

export interface ContentFilters {
  search?: string
  status?: string
  platform?: string
  type?: string
}

interface ContentFiltersProps {
  filters: ContentFilters
  onChange: (filters: ContentFilters) => void
}

export function ContentFiltersBar({ filters, onChange }: ContentFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search ?? "")

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange({ ...filters, search: searchValue || undefined })
    }, 300)
    return () => clearTimeout(timer)
  }, [searchValue])

  function handleSelect(key: keyof ContentFilters, value: string) {
    onChange({ ...filters, [key]: value || undefined })
  }

  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative min-w-[200px] flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
        <Input
          placeholder="Buscar conteúdo..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select
        value={filters.status ?? ""}
        onChange={(e) => handleSelect("status", e.target.value)}
        className="w-[160px]"
      >
        <option value="">Status: Todos</option>
        <option value="idea">Ideia</option>
        <option value="draft">Rascunho</option>
        <option value="review">Revisão</option>
        <option value="approved">Aprovado</option>
        <option value="scheduled">Agendado</option>
        <option value="published">Publicado</option>
        <option value="rejected">Rejeitado</option>
      </Select>
      <Select
        value={filters.platform ?? ""}
        onChange={(e) => handleSelect("platform", e.target.value)}
        className="w-[160px]"
      >
        <option value="">Plataforma: Todos</option>
        <option value="instagram">Instagram</option>
        <option value="youtube">YouTube</option>
        <option value="linkedin">LinkedIn</option>
        <option value="x">X</option>
        <option value="email">Email</option>
        <option value="tiktok">TikTok</option>
      </Select>
      <Select
        value={filters.type ?? ""}
        onChange={(e) => handleSelect("type", e.target.value)}
        className="w-[160px]"
      >
        <option value="">Tipo: Todos</option>
        <option value="post">Post</option>
        <option value="carousel">Carrossel</option>
        <option value="reel">Reels</option>
        <option value="video">Vídeo</option>
        <option value="story">Story</option>
        <option value="article">Artigo</option>
        <option value="email">Email</option>
        <option value="thread">Thread</option>
      </Select>
    </div>
  )
}
