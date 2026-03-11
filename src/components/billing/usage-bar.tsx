"use client"

import { cn } from "@/lib/utils"

interface UsageBarProps {
  label: string
  current: number
  limit: number
  unit?: string
}

export function UsageBar({ label, current, limit, unit = "" }: UsageBarProps) {
  const isUnlimited = limit === -1
  const percentage = isUnlimited ? 0 : Math.min((current / limit) * 100, 100)
  const isNearLimit = percentage >= 80
  const isOverLimit = percentage >= 100

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-secondary">{label}</span>
        <span className={cn(
          "font-medium",
          isOverLimit ? "text-red-400" : isNearLimit ? "text-yellow-400" : "text-text-primary"
        )}>
          {isUnlimited ? (
            <>{current.toLocaleString("pt-BR")}{unit} / Ilimitado</>
          ) : (
            <>{current.toLocaleString("pt-BR")}{unit} / {limit.toLocaleString("pt-BR")}{unit}</>
          )}
        </span>
      </div>
      {!isUnlimited && (
        <div className="h-2 rounded-full bg-surface-hover overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              isOverLimit ? "bg-red-500" : isNearLimit ? "bg-yellow-500" : "bg-accent"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  )
}
