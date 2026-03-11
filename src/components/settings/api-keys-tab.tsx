"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface ApiKeyEntry {
  service: string
  maskedKey: string
  connected: boolean
}

const apiKeys: ApiKeyEntry[] = [
  { service: "OpenAI", maskedKey: "sk-...xxxx", connected: true },
  { service: "Instagram Graph", maskedKey: "IGQ...xxxx", connected: false },
  { service: "YouTube Data", maskedKey: "AIza...xxxx", connected: false },
  { service: "n8n Webhook", maskedKey: "wh-...xxxx", connected: false },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={handleCopy}
      className="px-3 py-1 text-xs rounded-md border border-border text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
    >
      {copied ? "Copiado!" : "Copiar"}
    </button>
  )
}

export function ApiKeysTab() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-text-secondary font-medium">
              Serviço
            </th>
            <th className="text-left py-3 px-4 text-text-secondary font-medium">
              Chave
            </th>
            <th className="text-left py-3 px-4 text-text-secondary font-medium">
              Status
            </th>
            <th className="text-right py-3 px-4 text-text-secondary font-medium">
              Ação
            </th>
          </tr>
        </thead>
        <tbody>
          {apiKeys.map((entry) => (
            <tr
              key={entry.service}
              className="border-b border-border/50 hover:bg-surface-hover/50"
            >
              <td className="py-3 px-4 text-text-primary font-medium">
                {entry.service}
              </td>
              <td className="py-3 px-4">
                <code className="text-text-secondary bg-surface-hover px-2 py-0.5 rounded text-xs">
                  {entry.maskedKey}
                </code>
              </td>
              <td className="py-3 px-4">
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    entry.connected
                      ? "bg-green-500/20 text-green-400"
                      : "bg-gray-500/20 text-gray-400"
                  )}
                >
                  {entry.connected ? "Ativa" : "Inativa"}
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                <CopyButton text={entry.maskedKey} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-text-secondary mt-4">
        As chaves de API são exibidas de forma mascarada por segurança. Para
        atualizar uma chave, entre em contato com o administrador.
      </p>
    </div>
  )
}
