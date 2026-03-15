"use client"

import { useState, useEffect, useCallback } from "react"
import { SystemPromptSection } from "@/components/config/system-prompt-section"
import { AgentsSection } from "@/components/config/agents-section"
import { ToolsSection } from "@/components/config/tools-section"
import { ReferencesSection } from "@/components/config/references-section"
import { BotConfigSection } from "@/components/config/bot-config-section"
import { DesignSection } from "@/components/config/design-section"
import { cn } from "@/lib/utils"

type Tab = "soul" | "agents" | "tools" | "references" | "config" | "design"

const TABS: { key: Tab; label: string }[] = [
  { key: "soul", label: "Soul" },
  { key: "agents", label: "Agentes" },
  { key: "tools", label: "Tools" },
  { key: "references", label: "Referencias" },
  { key: "config", label: "Config" },
  { key: "design", label: "Design" },
]

interface ConfigData {
  systemPrompt: string
  agents: Array<{
    filename: string
    name: string
    description: string
    tools: string[]
    model: string
    content: string
  }>
  tools: Array<{ name: string; description: string }>
  botConfig: {
    model: string
    maxHistory: number
    ttl: string
    envVars: Array<{ name: string; present: boolean }>
  }
  references: Array<{ filename: string; title: string; content: string }>
  designSystem: {
    colors: Array<{ name: string; value: string }>
    fonts: string[]
    carousel: { width: number; height: number; style: string }
  }
}

export default function ConfigPage() {
  const [activeTab, setActiveTab] = useState<Tab>("soul")
  const [data, setData] = useState<ConfigData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/config")
      if (!res.ok) throw new Error("Failed to fetch config")
      const json = await res.json()
      setData(json)
    } catch {
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-surface-hover rounded animate-pulse" />
        <div className="h-10 w-full bg-surface-hover rounded animate-pulse" />
        <div className="h-64 w-full bg-surface-hover rounded animate-pulse" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-text-secondary">Erro ao carregar configuracoes do sistema.</div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Sistema</h1>

      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2",
              activeTab === tab.key
                ? "border-accent text-accent"
                : "border-transparent text-text-secondary hover:text-text-primary"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="pt-2">
        {activeTab === "soul" && <SystemPromptSection systemPrompt={data.systemPrompt} />}
        {activeTab === "agents" && <AgentsSection agents={data.agents} />}
        {activeTab === "tools" && <ToolsSection tools={data.tools} />}
        {activeTab === "references" && <ReferencesSection references={data.references} />}
        {activeTab === "config" && <BotConfigSection botConfig={data.botConfig} />}
        {activeTab === "design" && <DesignSection designSystem={data.designSystem} />}
      </div>
    </div>
  )
}
