"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, Zap, ArrowRight, Bot } from "lucide-react"

type SetupStep = "url" | "token" | "test" | "provision" | "done"

export function OpenClawSetup() {
  const [step, setStep] = useState<SetupStep>("url")
  const [gatewayUrl, setGatewayUrl] = useState("")
  const [gatewayToken, setGatewayToken] = useState("")
  const [testing, setTesting] = useState(false)
  const [testOk, setTestOk] = useState(false)
  const [testMessage, setTestMessage] = useState("")
  const [provisioning, setProvisioning] = useState(false)
  const [provisionResult, setProvisionResult] = useState<{
    summary: { total: number; successful: number; failed: number }
    results: Array<{ slug: string; name: string; success: boolean; error?: string }>
  } | null>(null)

  async function saveCredentials() {
    await fetch("/api/credentials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service: "openclaw", key: "gateway_url", value: gatewayUrl }),
    })
    if (gatewayToken) {
      await fetch("/api/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "openclaw", key: "gateway_token", value: gatewayToken }),
      })
    }
  }

  async function handleTest() {
    setTesting(true)
    setTestMessage("")
    try {
      await saveCredentials()
      const res = await fetch("/api/credentials/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "openclaw" }),
      })
      const json = await res.json()
      setTestOk(json.data.ok)
      setTestMessage(json.data.message)
      if (json.data.ok) setStep("provision")
    } catch {
      setTestOk(false)
      setTestMessage("Erro ao testar conexão")
    } finally {
      setTesting(false)
    }
  }

  async function handleProvision() {
    setProvisioning(true)
    try {
      const res = await fetch("/api/agents/provision", { method: "POST" })
      const json = await res.json()
      setProvisionResult(json.data)
      setStep("done")
    } catch {
      setTestMessage("Erro ao provisionar agentes")
    } finally {
      setProvisioning(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Zap className="w-6 h-6 text-accent" />
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Conectar OpenClaw</h2>
          <p className="text-sm text-text-secondary">
            Configure o gateway para ativar seus 12 agentes de IA
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 text-sm">
        {(["url", "token", "test", "provision", "done"] as SetupStep[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            {i > 0 && <ArrowRight className="w-3 h-3 text-text-secondary" />}
            <Badge variant={step === s ? "default" : s < step ? "success" : "secondary"}>
              {i + 1}. {s === "url" ? "URL" : s === "token" ? "Token" : s === "test" ? "Testar" : s === "provision" ? "Agentes" : "Pronto"}
            </Badge>
          </div>
        ))}
      </div>

      {/* Step 1: URL */}
      {(step === "url" || step === "token" || step === "test") && (
        <Card>
          <CardContent className="p-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">
                URL do OpenClaw Gateway
              </label>
              <Input
                placeholder="http://100.74.74.90:18789"
                value={gatewayUrl}
                onChange={(e) => setGatewayUrl(e.target.value)}
              />
              <p className="text-xs text-text-secondary mt-1">
                O endereço onde seu OpenClaw está rodando
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">
                Token do Gateway (opcional)
              </label>
              <Input
                type="password"
                placeholder="oc_..."
                value={gatewayToken}
                onChange={(e) => setGatewayToken(e.target.value)}
              />
              <p className="text-xs text-text-secondary mt-1">
                Se o gateway exigir autenticação, cole o token aqui
              </p>
            </div>

            <Button
              onClick={handleTest}
              disabled={!gatewayUrl || testing}
              className="w-full"
            >
              {testing ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Testando conexão...</>
              ) : (
                "Testar Conexão"
              )}
            </Button>

            {testMessage && (
              <div className={`flex items-center gap-2 p-3 rounded-lg ${testOk ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                {testOk ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span className="text-sm">{testMessage}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Provision */}
      {step === "provision" && (
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Bot className="w-8 h-8 text-accent" />
              <div>
                <p className="font-medium text-text-primary">Conexão OK! Vamos ativar seus agentes?</p>
                <p className="text-sm text-text-secondary">
                  Isso vai configurar 12 agentes especializados no seu OpenClaw
                </p>
              </div>
            </div>

            <Button
              onClick={handleProvision}
              disabled={provisioning}
              className="w-full"
              size="lg"
            >
              {provisioning ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Provisionando agentes...</>
              ) : (
                "Ativar 12 Agentes"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Done */}
      {step === "done" && provisionResult && (
        <Card className="border-green-500/30">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <p className="font-medium text-text-primary">OpenClaw configurado!</p>
                <p className="text-sm text-text-secondary">
                  {provisionResult.summary.successful} agentes ativos, {provisionResult.summary.failed} com erro
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {provisionResult.results.map((r) => (
                <div key={r.slug} className="flex items-center justify-between py-1.5 px-3 rounded bg-surface-hover">
                  <span className="text-sm text-text-primary">{r.name}</span>
                  {r.success ? (
                    <Badge variant="success">Ativo</Badge>
                  ) : (
                    <Badge variant="error" title={r.error}> Erro</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
