"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

type Step = "workspace" | "apikey" | "done"

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("workspace")
  const [workspaceName, setWorkspaceName] = useState("")
  const [databaseUrl, setDatabaseUrl] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  async function handleCreateWorkspace(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspace_name: workspaceName,
          database_url: databaseUrl,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        // Generate API key automatically
        const keyRes = await fetch("/api/auth/api-keys", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ label: "OpenClaw" }),
        })

        const keyData = await keyRes.json()
        if (keyRes.ok) {
          setApiKey(keyData.raw_key)
        }

        setStep("apikey")
      } else {
        setError(data.error || "Erro ao criar workspace")
      }
    } catch {
      setError("Erro de conexão")
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (step === "apikey") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Sua API Key</CardTitle>
            <CardDescription>
              Copie esta chave e cole no seu OpenClaw. Ela só será mostrada uma vez!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg font-mono text-sm break-all">
              {apiKey}
            </div>
            <Button onClick={handleCopy} className="w-full" variant="outline">
              {copied ? "Copiado!" : "Copiar API Key"}
            </Button>

            <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
              <p className="font-medium">Como usar no OpenClaw:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Abra as configurações do OpenClaw</li>
                <li>Vá em &quot;Integrações&quot; ou &quot;API Keys&quot;</li>
                <li>Cole a chave acima no campo &quot;Content Team AI&quot;</li>
                <li>Salve e pronto!</li>
              </ol>
            </div>

            <Button
              onClick={() => {
                router.push("/")
                router.refresh()
              }}
              className="w-full"
            >
              Ir para o Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Configurar Workspace</CardTitle>
          <CardDescription>
            Conecte seu banco de dados Supabase para começar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateWorkspace} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome do Workspace</label>
              <Input
                type="text"
                placeholder="Ex: Minha Empresa"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">URL do Banco de Dados</label>
              <Input
                type="text"
                placeholder="postgresql://postgres:senha@host:5432/postgres"
                value={databaseUrl}
                onChange={(e) => setDatabaseUrl(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Encontre no Supabase: Settings → Database → Connection string (URI)
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Conectando..." : "Conectar e Criar Workspace"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
