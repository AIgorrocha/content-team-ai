"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ContentDetail } from "@/components/content/content-detail"
import { ApprovalActions } from "@/components/content/approval-actions"
import type { ContentItem } from "@/lib/types"

export default function ContentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [content, setContent] = useState<ContentItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch(`/api/content/${id}`)
      if (!res.ok) throw new Error("Erro ao carregar conteúdo")
      const data = await res.json()
      setContent(data.data ?? data)
    } catch {
      setMessage({ type: "error", text: "Erro ao carregar conteúdo." })
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  async function handleApprove() {
    setActionLoading(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/content/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approval_status: "approved", status: "approved" }),
      })
      if (!res.ok) throw new Error("Erro ao aprovar")
      setMessage({ type: "success", text: "Conteúdo aprovado com sucesso!" })
      await fetchContent()
    } catch {
      setMessage({ type: "error", text: "Erro ao aprovar conteúdo." })
    } finally {
      setActionLoading(false)
    }
  }

  async function handleReject(notes: string) {
    setActionLoading(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/content/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approval_status: "rejected", status: "rejected", approval_notes: notes }),
      })
      if (!res.ok) throw new Error("Erro ao rejeitar")
      setMessage({ type: "success", text: "Conteúdo rejeitado." })
      await fetchContent()
    } catch {
      setMessage({ type: "error", text: "Erro ao rejeitar conteúdo." })
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 rounded bg-surface animate-pulse" />
        <div className="h-64 rounded bg-surface animate-pulse" />
      </div>
    )
  }

  if (!content) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.push("/content")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <p className="text-text-secondary">Conteúdo não encontrado.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push("/content")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      {message && (
        <div
          className={`rounded-md px-4 py-3 text-sm ${
            message.type === "success"
              ? "bg-success/10 text-success border border-success/20"
              : "bg-error/10 text-error border border-error/20"
          }`}
        >
          {message.text}
        </div>
      )}

      <ApprovalActions
        approvalStatus={content.approval_status}
        approvalNotes={content.approval_notes}
        onApprove={handleApprove}
        onReject={handleReject}
        loading={actionLoading}
      />

      <ContentDetail
        content={content}
        onApprove={handleApprove}
        onReject={handleReject}
        loading={actionLoading}
      />
    </div>
  )
}
