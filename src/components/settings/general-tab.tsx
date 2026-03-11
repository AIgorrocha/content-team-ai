"use client"

import type { Settings } from "@/lib/queries/settings"

interface GeneralTabProps {
  settings: Settings
  onChange: (updated: Partial<Settings>) => void
}

const timezones = [
  { value: "America/Sao_Paulo", label: "São Paulo (GMT-3)" },
  { value: "America/New_York", label: "New York (GMT-5)" },
  { value: "America/Chicago", label: "Chicago (GMT-6)" },
  { value: "America/Los_Angeles", label: "Los Angeles (GMT-8)" },
  { value: "Europe/London", label: "London (GMT+0)" },
  { value: "Europe/Lisbon", label: "Lisboa (GMT+0)" },
  { value: "Europe/Madrid", label: "Madrid (GMT+1)" },
  { value: "Asia/Tokyo", label: "Tokyo (GMT+9)" },
]

const languages = [
  { value: "pt-BR", label: "Português (Brasil)" },
  { value: "en-US", label: "English (US)" },
  { value: "es", label: "Español" },
]

const platforms = [
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "tiktok", label: "TikTok" },
  { value: "twitter", label: "Twitter / X" },
]

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-text-primary">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export function GeneralTab({ settings, onChange }: GeneralTabProps) {
  return (
    <div className="space-y-6 max-w-lg">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-text-primary">
          Nome da Plataforma
        </label>
        <input
          type="text"
          value={settings.platform_name}
          onChange={(e) => onChange({ platform_name: e.target.value })}
          className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          placeholder="Content Team AI"
        />
      </div>

      <SelectField
        label="Fuso Horário"
        value={settings.timezone}
        options={timezones}
        onChange={(timezone) => onChange({ timezone })}
      />

      <SelectField
        label="Idioma"
        value={settings.language}
        options={languages}
        onChange={(language) => onChange({ language })}
      />

      <SelectField
        label="Plataforma Padrão"
        value={settings.default_platform}
        options={platforms}
        onChange={(default_platform) => onChange({ default_platform })}
      />
    </div>
  )
}
