"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { truncate, formatDate } from "@/lib/utils"
import type { Competitor, CompetitorPost } from "@/lib/types"

const platformBadgeStyles: Record<string, { bg: string; text: string; label: string }> = {
  instagram: { bg: "bg-pink-500/20", text: "text-pink-400", label: "Instagram" },
  youtube: { bg: "bg-red-500/20", text: "text-red-400", label: "YouTube" },
  linkedin: { bg: "bg-blue-500/20", text: "text-blue-400", label: "LinkedIn" },
  x: { bg: "bg-gray-500/20", text: "text-gray-400", label: "X" },
  tiktok: { bg: "bg-cyan-500/20", text: "text-cyan-400", label: "TikTok" },
}

const postTypeLabels: Record<string, string> = {
  post: "Post",
  carousel: "Carrossel",
  reel: "Reels",
  video: "Video",
  story: "Story",
  article: "Artigo",
  thread: "Thread",
}

interface CompetitorDetailProps {
  competitorId: string
}

interface CompetitorResponse {
  data: CompetitorPost[]
  competitor: Competitor
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export function CompetitorDetail({ competitorId }: CompetitorDetailProps) {
  const router = useRouter()
  const [response, setResponse] = useState<CompetitorResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [postType, setPostType] = useState("")
  const [viralOnly, setViralOnly] = useState(false)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (postType) params.set("post_type", postType)
      if (viralOnly) params.set("viral", "true")
      params.set("page", String(page))
      params.set("limit", "20")

      const res = await fetch(`/api/competitors/${competitorId}?${params.toString()}`)
      if (!res.ok) throw new Error("Erro ao carregar dados")
      const data: CompetitorResponse = await res.json()
      setResponse(data)
    } catch {
      setResponse(null)
    } finally {
      setLoading(false)
    }
  }, [competitorId, postType, viralOnly, page])

  useEffect(() => {
    setLoading(true)
    fetchData()
  }, [fetchData])

  function handleFilterChange(type: string, viral: boolean) {
    setPostType(type)
    setViralOnly(viral)
    setPage(1)
  }

  function formatEngagement(engagement: Record<string, unknown> | null): string {
    if (!engagement) return "-"
    const parts: string[] = []
    if (engagement.likes != null) parts.push(`${engagement.likes} likes`)
    if (engagement.comments != null) parts.push(`${engagement.comments} comments`)
    if (engagement.shares != null) parts.push(`${engagement.shares} shares`)
    if (engagement.views != null) parts.push(`${engagement.views} views`)
    return parts.length > 0 ? parts.join(", ") : "-"
  }

  if (loading && !response) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 rounded bg-surface animate-pulse" />
        <div className="h-64 rounded bg-surface animate-pulse" />
      </div>
    )
  }

  if (!response) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.push("/competitors")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <p className="text-text-secondary">Concorrente nao encontrado.</p>
      </div>
    )
  }

  const { competitor, data: posts, meta } = response
  const badge = platformBadgeStyles[competitor.platform] ?? {
    bg: "bg-gray-500/20",
    text: "text-gray-400",
    label: competitor.platform,
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push("/competitors")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      {/* Header */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <div className="flex items-center gap-4">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-text-primary">
              {competitor.display_name ?? competitor.handle}
            </h2>
            <p className="text-text-secondary">@{competitor.handle}</p>
          </div>
          <span className={`shrink-0 text-xs px-2 py-1 rounded-full font-medium ${badge.bg} ${badge.text}`}>
            {badge.label}
          </span>
        </div>
        {competitor.niche && (
          <p className="text-text-secondary text-sm mt-2">Nicho: {competitor.niche}</p>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={postType}
          onChange={(e) => handleFilterChange(e.target.value, viralOnly)}
          className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="">Todos os tipos</option>
          <option value="post">Post</option>
          <option value="carousel">Carrossel</option>
          <option value="reel">Reels</option>
          <option value="video">Video</option>
          <option value="story">Story</option>
          <option value="article">Artigo</option>
          <option value="thread">Thread</option>
        </select>

        <button
          onClick={() => handleFilterChange(postType, !viralOnly)}
          className={`px-3 py-2 rounded-md text-sm font-medium border transition-colors ${
            viralOnly
              ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
              : "bg-zinc-800 text-text-secondary border-zinc-700 hover:border-zinc-600"
          }`}
        >
          Viral apenas
        </button>

        <span className="text-sm text-text-secondary ml-auto">
          {meta.total} posts encontrados
        </span>
      </div>

      {/* Posts Table */}
      {posts.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">
          Nenhum post encontrado.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Legenda</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Tipo</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Engajamento</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Data</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Viral</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <>
                  <tr
                    key={post.id}
                    onClick={() => setExpandedRow(expandedRow === post.id ? null : post.id)}
                    className="border-b border-border cursor-pointer hover:bg-surface-hover transition-colors"
                  >
                    <td className="px-4 py-3 text-text-primary max-w-[300px]">
                      {post.caption ? truncate(post.caption, 80) : "-"}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {postTypeLabels[post.post_type ?? ""] ?? post.post_type ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {formatEngagement(post.engagement)}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {post.posted_at ? formatDate(post.posted_at) : "-"}
                    </td>
                    <td className="px-4 py-3">
                      {post.is_viral && (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-400 font-medium">
                          Viral
                        </span>
                      )}
                    </td>
                  </tr>
                  {expandedRow === post.id && (
                    <tr key={`${post.id}-expanded`} className="border-b border-border bg-zinc-800/50">
                      <td colSpan={5} className="px-4 py-4 space-y-3">
                        {post.caption && (
                          <div>
                            <p className="text-xs font-medium text-text-secondary mb-1">Legenda completa</p>
                            <p className="text-sm text-text-primary whitespace-pre-wrap">{post.caption}</p>
                          </div>
                        )}
                        {post.analysis && (
                          <div>
                            <p className="text-xs font-medium text-text-secondary mb-1">Analise</p>
                            <p className="text-sm text-text-primary whitespace-pre-wrap">{post.analysis}</p>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">
            Pagina {meta.page} de {meta.totalPages} ({meta.total} resultados)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <span className="text-sm text-text-primary px-2">
              {page} / {meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page >= meta.totalPages}
            >
              Proximo
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
