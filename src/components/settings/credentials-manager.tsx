"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Shield, Plus, Trash2, CheckCircle, XCircle, Loader2, Eye, EyeOff } from "lucide-react"

interface ServiceInfo {
  service: string
  keys: string[]
}

const serviceLabels: Record<string, { name: string; description: string; fields: Array<{ key: string; label: string; placeholder: string }> }> = {
  openclaw: {
    name: "OpenClaw",
    description: "Gateway de agentes IA",
    fields: [
      { key: "gateway_url", label: "URL do Gateway", placeholder: "http://100.74.74.90:18789" },
      { key: "gateway_token", label: "Token do Gateway", placeholder: "oc_..." },
    ],
  },
  openai: {
    name: "OpenAI",
    description: "Geração de texto e análise",
    fields: [
      { key: "api_key", label: "API Key", placeholder: "sk-..." },
    ],
  },
  mailjet: {
    name: "Mailjet",
    description: "Envio de emails (6k grátis/mês)",
    fields: [
      { key: "api_key", label: "API Key", placeholder: "" },
      { key: "secret_key", label: "Secret Key", placeholder: "" },
    ],
  },
  rapidapi: {
    name: "RapidAPI",
    description: "Scraping de redes sociais",
    fields: [
      { key: "api_key", label: "API Key", placeholder: "" },
    ],
  },
}

export function CredentialsManager() {
  const [services, setServices] = useState<ServiceInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [editingService, setEditingService] = useState<string | null>(null)
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<{ service: string; ok: boolean; message: string } | null>(null)
  const [showValues, setShowValues] = useState<Record<string, boolean>>({})

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch("/api/credentials")
      const json = await res.json()
      setServices(json.data ?? [])
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchServices() }, [fetchServices])

  const isConfigured = (serviceId: string) =>
    services.some((s) => s.service === serviceId)

  async function handleSave(serviceId: string) {
    setSaving(true)
    try {
      const info = serviceLabels[serviceId]
      for (const field of info.fields) {
        const value = formValues[field.key]
        if (!value) continue
        await fetch("/api/credentials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ service: serviceId, key: field.key, value }),
        })
      }
      setEditingService(null)
      setFormValues({})
      await fetchServices()
    } catch {
      // handle error
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(serviceId: string) {
    if (!confirm(`Remover todas as credenciais de ${serviceLabels[serviceId]?.name}?`)) return
    await fetch(`/api/credentials/${serviceId}`, { method: "DELETE" })
    await fetchServices()
  }

  async function handleTest(serviceId: string) {
    setTesting(serviceId)
    setTestResult(null)
    try {
      const res = await fetch("/api/credentials/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: serviceId }),
      })
      const json = await res.json()
      setTestResult({ service: serviceId, ...json.data })
    } catch {
      setTestResult({ service: serviceId, ok: false, message: "Erro ao testar" })
    } finally {
      setTesting(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse"><CardContent className="p-6 h-24" /></Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-6 h-6 text-accent" />
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Cofre de Credenciais</h2>
          <p className="text-sm text-text-secondary">
            Suas chaves ficam encriptadas no seu próprio banco de dados
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {Object.entries(serviceLabels).map(([serviceId, info]) => {
          const configured = isConfigured(serviceId)
          const isEditing = editingService === serviceId

          return (
            <Card key={serviceId} className={configured ? "border-green-500/30" : ""}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-text-primary">{info.name}</p>
                      {configured && <Badge variant="success">Configurado</Badge>}
                    </div>
                    <p className="text-sm text-text-secondary mt-1">{info.description}</p>
                  </div>
                  <div className="flex gap-2">
                    {configured && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTest(serviceId)}
                          disabled={testing === serviceId}
                        >
                          {testing === serviceId ? <Loader2 className="w-4 h-4 animate-spin" /> : "Testar"}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(serviceId)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant={isEditing ? "secondary" : "default"}
                      onClick={() => {
                        setEditingService(isEditing ? null : serviceId)
                        setFormValues({})
                      }}
                    >
                      {isEditing ? "Cancelar" : configured ? "Atualizar" : <><Plus className="w-4 h-4 mr-1" /> Configurar</>}
                    </Button>
                  </div>
                </div>

                {testResult?.service === serviceId && (
                  <div className={`flex items-center gap-2 p-3 rounded-lg mb-3 ${testResult.ok ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                    {testResult.ok ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    <span className="text-sm">{testResult.message}</span>
                  </div>
                )}

                {isEditing && (
                  <div className="space-y-3 mt-3 pt-3 border-t border-border">
                    {info.fields.map((field) => (
                      <div key={field.key}>
                        <label className="text-sm text-text-secondary mb-1 block">{field.label}</label>
                        <div className="relative">
                          <Input
                            type={showValues[field.key] ? "text" : "password"}
                            placeholder={field.placeholder}
                            value={formValues[field.key] ?? ""}
                            onChange={(e) => setFormValues({ ...formValues, [field.key]: e.target.value })}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                            onClick={() => setShowValues({ ...showValues, [field.key]: !showValues[field.key] })}
                          >
                            {showValues[field.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    ))}
                    <Button
                      onClick={() => handleSave(serviceId)}
                      disabled={saving}
                      className="w-full"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Salvar Credenciais
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
