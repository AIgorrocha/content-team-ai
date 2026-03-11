"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDateTime } from "@/lib/utils"
import type { Contact, DealActivity, ActivityType } from "@/lib/types"

interface ContactDetailProps {
  contactId: string
}

const activityIcons: Record<ActivityType, string> = {
  call: "phone",
  email: "mail",
  meeting: "handshake",
  note: "file-text",
  task: "check-square",
  dm: "message-circle",
}

const activityEmojis: Record<ActivityType, string> = {
  call: "\uD83D\uDCDE",
  email: "\u2709\uFE0F",
  meeting: "\uD83E\uDD1D",
  note: "\uD83D\uDCDD",
  task: "\u2705",
  dm: "\uD83D\uDCAC",
}

const activityLabels: Record<ActivityType, string> = {
  call: "Ligacao",
  email: "Email",
  meeting: "Reuniao",
  note: "Nota",
  task: "Tarefa",
  dm: "Mensagem Direta",
}

interface ContactData {
  contact: Contact
  activities: DealActivity[]
}

export function ContactDetail({ contactId }: ContactDetailProps) {
  const router = useRouter()
  const [data, setData] = useState<ContactData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContact = useCallback(async () => {
    try {
      const res = await fetch(`/api/crm/contacts/${contactId}`)
      if (!res.ok) {
        if (res.status === 404) {
          setError("Contato nao encontrado.")
          return
        }
        throw new Error("Erro ao carregar contato")
      }
      const result = await res.json()
      setData(result)
    } catch {
      setError("Erro ao carregar contato.")
    } finally {
      setLoading(false)
    }
  }, [contactId])

  useEffect(() => {
    fetchContact()
  }, [fetchContact])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 rounded bg-surface animate-pulse" />
        <div className="h-64 rounded bg-surface animate-pulse" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.push("/crm/contacts")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <p className="text-text-secondary">{error ?? "Contato nao encontrado."}</p>
      </div>
    )
  }

  const { contact, activities } = data

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push("/crm/contacts")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{contact.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <InfoItem label="Email" value={contact.email ?? "-"} />
            <InfoItem label="Telefone" value={contact.phone ?? "-"} />
            <InfoItem label="Empresa" value={contact.company ?? "-"} />
            <InfoItem label="Origem" value={contact.source ?? "-"} />
            <InfoItem label="Instagram" value={contact.instagram ?? "-"} />
            <InfoItem label="LinkedIn" value={contact.linkedin ?? "-"} />
            <InfoItem label="Criado em" value={formatDateTime(contact.created_at)} />
            <InfoItem label="Atualizado em" value={formatDateTime(contact.updated_at)} />
          </div>

          {contact.tags.length > 0 && (
            <div className="mt-4">
              <span className="text-text-secondary text-sm">Tags</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {contact.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {contact.notes && (
            <div className="mt-4">
              <span className="text-text-secondary text-sm">Notas</span>
              <p className="text-text-primary mt-1 whitespace-pre-wrap">{contact.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Atividades</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <p className="text-text-secondary text-sm">Nenhuma atividade registrada.</p>
          ) : (
            <div className="border-l-2 border-zinc-700 ml-4 space-y-6">
              {activities.map((activity) => (
                <div key={activity.id} className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-zinc-700 flex items-center justify-center">
                    <span className="text-[10px]">
                      {activity.activity_type ? activityEmojis[activity.activity_type] : "\uD83D\uDD18"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-secondary mb-1">
                    <span className="font-medium text-text-primary">
                      {activity.activity_type ? activityLabels[activity.activity_type] : "Atividade"}
                    </span>
                    <span>{formatDateTime(activity.performed_at)}</span>
                    {activity.performed_by && (
                      <span>por {activity.performed_by}</span>
                    )}
                  </div>
                  {activity.description && (
                    <p className="text-sm text-text-secondary">{activity.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
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
