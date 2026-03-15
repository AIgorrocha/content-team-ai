"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface SystemPromptSectionProps {
  systemPrompt: string
}

export function SystemPromptSection({ systemPrompt }: SystemPromptSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Prompt (bot/system-prompt.mjs)</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="text-sm text-text-secondary font-mono whitespace-pre-wrap break-words max-h-[600px] overflow-y-auto bg-background p-4 rounded-lg border border-border">
          {systemPrompt}
        </pre>
      </CardContent>
    </Card>
  )
}
