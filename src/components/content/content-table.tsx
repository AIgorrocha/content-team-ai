"use client"

import type { ContentItem, ContentStatus, Platform } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

interface ContentTableProps {
  items: ContentItem[]
  onRowClick: (id: string) => void
}

const platformColors: Record<Platform, string> = {
  instagram: "#E1306C",
  youtube: "#FF0000",
  linkedin: "#0A66C2",
  x: "#1DA1F2",
  email: "#10B981",
  tiktok: "#00F2EA",
}

const platformLabels: Record<Platform, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  x: "X",
  email: "Email",
  tiktok: "TikTok",
}

const statusVariant: Record<ContentStatus, "default" | "secondary" | "success" | "error" | "warning" | "outline"> = {
  idea: "secondary",
  draft: "outline",
  review: "warning",
  approved: "success",
  scheduled: "default",
  published: "success",
  rejected: "error",
}

const statusLabels: Record<ContentStatus, string> = {
  idea: "Ideia",
  draft: "Rascunho",
  review: "Revisão",
  approved: "Aprovado",
  scheduled: "Agendado",
  published: "Publicado",
  rejected: "Rejeitado",
}

const typeLabels: Record<string, string> = {
  post: "Post",
  carousel: "Carrossel",
  reel: "Reels",
  video: "Vídeo",
  story: "Story",
  article: "Artigo",
  email: "Email",
  thread: "Thread",
}

export function ContentTable({ items, onRowClick }: ContentTableProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-text-secondary">
        Nenhum conteúdo encontrado.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface">
            <th className="text-left px-4 py-3 font-medium text-text-secondary">Título</th>
            <th className="text-left px-4 py-3 font-medium text-text-secondary">Tipo</th>
            <th className="text-left px-4 py-3 font-medium text-text-secondary">Plataforma</th>
            <th className="text-left px-4 py-3 font-medium text-text-secondary">Status</th>
            <th className="text-left px-4 py-3 font-medium text-text-secondary">Agendado</th>
            <th className="text-left px-4 py-3 font-medium text-text-secondary">Agente</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              onClick={() => onRowClick(item.id)}
              className="border-b border-border cursor-pointer hover:bg-surface-hover transition-colors"
            >
              <td className="px-4 py-3 text-text-primary font-medium max-w-[300px] truncate">
                {item.title}
              </td>
              <td className="px-4 py-3 text-text-secondary">
                {typeLabels[item.content_type] ?? item.content_type}
              </td>
              <td className="px-4 py-3">
                {item.platform ? (
                  <Badge
                    className="border-0"
                    style={{
                      backgroundColor: `${platformColors[item.platform]}20`,
                      color: platformColors[item.platform],
                    }}
                  >
                    {platformLabels[item.platform]}
                  </Badge>
                ) : (
                  <span className="text-text-secondary">-</span>
                )}
              </td>
              <td className="px-4 py-3">
                <Badge variant={statusVariant[item.status]}>
                  {statusLabels[item.status]}
                </Badge>
              </td>
              <td className="px-4 py-3 text-text-secondary">
                {item.scheduled_at ? formatDate(item.scheduled_at) : "-"}
              </td>
              <td className="px-4 py-3 text-text-secondary">
                {item.source_agent ?? "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
