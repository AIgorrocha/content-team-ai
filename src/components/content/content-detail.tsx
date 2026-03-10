"use client"

import type { ContentItem, ContentStatus, Platform } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate, formatDateTime } from "@/lib/utils"
import { ExternalLink } from "lucide-react"

interface ContentDetailProps {
  content: ContentItem
  onApprove: () => void
  onReject: (notes: string) => void
  loading?: boolean
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

export function ContentDetail({ content }: ContentDetailProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <CardTitle className="text-xl">{content.title}</CardTitle>
            <Badge variant={statusVariant[content.status]}>
              {statusLabels[content.status]}
            </Badge>
            <Badge className="border-0" style={{ backgroundColor: "#4A90D920", color: "#4A90D9" }}>
              {typeLabels[content.content_type] ?? content.content_type}
            </Badge>
            {content.platform && (
              <Badge
                className="border-0"
                style={{
                  backgroundColor: `${platformColors[content.platform]}20`,
                  color: platformColors[content.platform],
                }}
              >
                {platformLabels[content.platform]}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <InfoItem label="Agendado" value={content.scheduled_at ? formatDateTime(content.scheduled_at) : "-"} />
            <InfoItem label="Publicado" value={content.published_at ? formatDateTime(content.published_at) : "-"} />
            <InfoItem label="Agente" value={content.source_agent ?? "-"} />
            <InfoItem label="Criado em" value={formatDateTime(content.created_at)} />
            <InfoItem label="Atualizado em" value={formatDateTime(content.updated_at)} />
          </div>
        </CardContent>
      </Card>

      {content.caption && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Legenda</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary whitespace-pre-wrap">{content.caption}</p>
          </CardContent>
        </Card>
      )}

      {content.hashtags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hashtags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {content.hashtags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {content.script && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Roteiro</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-background rounded-md p-4 text-sm text-text-secondary overflow-x-auto whitespace-pre-wrap">
              <code>{content.script}</code>
            </pre>
          </CardContent>
        </Card>
      )}

      {content.visual_notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notas Visuais</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary whitespace-pre-wrap">{content.visual_notes}</p>
          </CardContent>
        </Card>
      )}

      {content.media_urls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mídias</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {content.media_urls.map((url, i) => (
                <li key={i}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline inline-flex items-center gap-1 text-sm"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {content.engagement && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Engajamento</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-background rounded-md p-4 text-sm text-text-secondary overflow-x-auto">
              <code>{JSON.stringify(content.engagement, null, 2)}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-text-secondary">{label}</span>
      <p className="text-text-primary font-medium">{value}</p>
    </div>
  )
}
