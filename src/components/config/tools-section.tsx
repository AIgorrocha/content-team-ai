"use client"

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface Tool {
  name: string
  description: string
}

interface ToolsSectionProps {
  tools: Tool[]
}

export function ToolsSection({ tools }: ToolsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tools.map((tool) => (
        <Card key={tool.name}>
          <CardHeader>
            <CardTitle className="text-base font-mono">{tool.name}</CardTitle>
            <CardDescription>{tool.description}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
