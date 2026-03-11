"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Loader2, CheckCircle, XCircle } from "lucide-react"

interface RunAgentDialogProps {
  slug: string
  onClose: () => void
}

export function RunAgentDialog({ slug, onClose }: RunAgentDialogProps) {
  const [prompt, setPrompt] = useState("")
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<{ success: boolean; content?: string; error?: string } | null>(null)

  async function handleRun() {
    if (!prompt.trim()) return
    setRunning(true)
    setResult(null)
    try {
      const res = await fetch(`/api/agents/${slug}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })
      const json = await res.json()
      if (res.ok) {
        setResult({ success: true, content: json.data?.result })
      } else {
        setResult({ success: false, error: json.error ?? "Erro desconhecido" })
      }
    } catch (error) {
      setResult({ success: false, error: error instanceof Error ? error.message : "Erro" })
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-surface border border-border rounded-xl w-full max-w-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Executar: {slug}</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X size={20} />
          </button>
        </div>

        <div>
          <label className="text-sm text-text-secondary mb-2 block">
            O que você quer que o agente faça?
          </label>
          <textarea
            className="w-full min-h-[120px] p-3 rounded-lg bg-background border border-border text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Ex: Crie um post sobre produtividade para Instagram..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={running}
          />
        </div>

        <Button
          onClick={handleRun}
          disabled={!prompt.trim() || running}
          className="w-full"
        >
          {running ? (
            <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Agente trabalhando...</>
          ) : (
            "Enviar Tarefa"
          )}
        </Button>

        {result && (
          <div className={`p-4 rounded-lg ${result.success ? "bg-green-500/10" : "bg-red-500/10"}`}>
            <div className="flex items-center gap-2 mb-2">
              {result.success ? (
                <><CheckCircle className="w-4 h-4 text-green-400" /><span className="text-sm font-medium text-green-400">Concluído!</span></>
              ) : (
                <><XCircle className="w-4 h-4 text-red-400" /><span className="text-sm font-medium text-red-400">Erro</span></>
              )}
            </div>
            <div className="text-sm text-text-primary whitespace-pre-wrap max-h-60 overflow-y-auto">
              {result.content ?? result.error}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
