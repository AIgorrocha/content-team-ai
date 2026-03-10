"use client"

import { useState } from "react"
import type { ApprovalStatus } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Check, X } from "lucide-react"

interface ApprovalActionsProps {
  approvalStatus: ApprovalStatus
  approvalNotes: string | null
  onApprove: () => void
  onReject: (notes: string) => void
  loading?: boolean
}

export function ApprovalActions({
  approvalStatus,
  approvalNotes,
  onApprove,
  onReject,
  loading = false,
}: ApprovalActionsProps) {
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectNotes, setRejectNotes] = useState("")

  if (approvalStatus === "approved") {
    return (
      <Card>
        <CardContent className="pt-6">
          <Badge variant="success" className="text-sm px-4 py-1">Aprovado</Badge>
        </CardContent>
      </Card>
    )
  }

  if (approvalStatus === "rejected") {
    return (
      <Card>
        <CardContent className="pt-6 space-y-2">
          <Badge variant="error" className="text-sm px-4 py-1">Rejeitado</Badge>
          {approvalNotes && (
            <p className="text-sm text-text-secondary mt-2">{approvalNotes}</p>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex gap-3">
          <Button
            onClick={onApprove}
            disabled={loading}
            className="bg-success hover:bg-success/90 text-white"
          >
            <Check className="h-4 w-4 mr-2" />
            Aprovar
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowRejectForm(true)}
            disabled={loading || showRejectForm}
          >
            <X className="h-4 w-4 mr-2" />
            Rejeitar
          </Button>
        </div>
        {showRejectForm && (
          <div className="space-y-3">
            <textarea
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              placeholder="Motivo da rejeição..."
              className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent min-h-[80px] resize-y"
            />
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onReject(rejectNotes)
                  setShowRejectForm(false)
                }}
                disabled={loading || !rejectNotes.trim()}
              >
                Confirmar Rejeição
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowRejectForm(false)
                  setRejectNotes("")
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
