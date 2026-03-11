"use client"

import { cn } from "@/lib/utils"

interface FontInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  className?: string
}

export function FontInput({ label, value, onChange, className }: FontInputProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-xs text-text-secondary">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ex: Inter, sans-serif"
        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text-primary text-sm
          placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent/50"
      />
    </div>
  )
}
