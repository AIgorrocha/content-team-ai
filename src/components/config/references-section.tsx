"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronRight } from "lucide-react"

interface Reference {
  filename: string
  title: string
  content: string
}

interface ReferencesSectionProps {
  references: Reference[]
}

export function ReferencesSection({ references }: ReferencesSectionProps) {
  const [expanded, setExpanded] = useState<string | null>(null)

  function toggle(filename: string) {
    setExpanded((prev) => (prev === filename ? null : filename))
  }

  return (
    <div className="space-y-3">
      {references.map((ref) => (
        <Card
          key={ref.filename}
          className="cursor-pointer hover:border-accent/40 transition-colors"
          onClick={() => toggle(ref.filename)}
        >
          <CardHeader className="py-4">
            <div className="flex items-center gap-2">
              {expanded === ref.filename ? (
                <ChevronDown size={16} className="text-text-secondary shrink-0" />
              ) : (
                <ChevronRight size={16} className="text-text-secondary shrink-0" />
              )}
              <CardTitle className="text-sm">{ref.title}</CardTitle>
              <span className="text-xs text-text-secondary ml-auto">{ref.filename}</span>
            </div>
          </CardHeader>
          {expanded === ref.filename && (
            <CardContent>
              <pre className="text-xs text-text-secondary font-mono whitespace-pre-wrap break-words max-h-[400px] overflow-y-auto bg-background p-3 rounded-lg border border-border">
                {ref.content}
              </pre>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
