"use client"

import { cn } from "@/lib/utils"

interface ColorSwatchProps {
  label: string
  value: string
  onChange: (value: string) => void
  className?: string
}

export function ColorSwatch({ label, value, onChange, className }: ColorSwatchProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <label className="relative cursor-pointer">
        <div
          className="w-10 h-10 rounded-full border border-border shadow-sm"
          style={{ backgroundColor: value }}
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </label>
      <div className="flex flex-col">
        <span className="text-xs text-text-secondary">{label}</span>
        <span className="text-sm text-text-primary font-mono uppercase">{value}</span>
      </div>
    </div>
  )
}
