"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Agent {
  filename: string
  name: string
  description: string
  tools: string[]
  model: string
  content: string
}

interface AgentsSectionProps {
  agents: Agent[]
}

export function AgentsSection({ agents }: AgentsSectionProps) {
  const [expanded, setExpanded] = useState<string | null>(null)

  function toggle(filename: string) {
    setExpanded((prev) => (prev === filename ? null : filename))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {agents.map((agent) => (
        <Card
          key={agent.filename}
          className="cursor-pointer hover:border-accent/40 transition-colors"
          onClick={() => toggle(agent.filename)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{agent.name}</CardTitle>
              <Badge variant="secondary">{agent.model}</Badge>
            </div>
            <CardDescription>{agent.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {agent.tools.map((tool) => (
                <Badge key={tool} variant="outline" className="text-xs">
                  {tool}
                </Badge>
              ))}
            </div>
            {expanded === agent.filename && (
              <pre className="text-xs text-text-secondary font-mono whitespace-pre-wrap break-words max-h-[400px] overflow-y-auto bg-background p-3 rounded-lg border border-border mt-2">
                {agent.content}
              </pre>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
