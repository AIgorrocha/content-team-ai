"use client"

import { cn } from "@/lib/utils"
import type { DesignSystem } from "@/lib/types"

interface BrandPreviewProps {
  fonts: DesignSystem["fonts"]
  colors: DesignSystem["colors"]
  className?: string
}

export function BrandPreview({ fonts, colors, className }: BrandPreviewProps) {
  const colorEntries = Object.entries(colors) as Array<[string, string]>

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <h3 className="text-sm font-semibold text-text-primary">Preview da Marca</h3>

      {/* Heading sample */}
      <div
        className="rounded-lg border border-border p-5"
        style={{ backgroundColor: colors.bg }}
      >
        <h2
          className="text-xl font-bold mb-2"
          style={{ fontFamily: fonts.primary, color: colors.text }}
        >
          Titulo Principal da Marca
        </h2>
        <p
          className="text-sm leading-relaxed mb-4"
          style={{ fontFamily: fonts.secondary, color: colors.textSecondary }}
        >
          Este e um texto de exemplo que mostra como o corpo do conteudo vai
          aparecer com a fonte secundaria selecionada. A legibilidade e a
          harmonia visual sao fundamentais.
        </p>
        <code
          className="text-xs px-2 py-1 rounded"
          style={{
            fontFamily: fonts.mono,
            color: colors.text,
            backgroundColor: colors.surface,
          }}
        >
          font-mono: {fonts.mono}
        </code>
      </div>

      {/* Color palette */}
      <div>
        <span className="text-xs text-text-secondary mb-2 block">Paleta de Cores</span>
        <div className="flex flex-wrap gap-3">
          {colorEntries.map(([name, hex]) => (
            <div key={name} className="flex flex-col items-center gap-1">
              <div
                className="w-9 h-9 rounded-full border border-border shadow-sm"
                style={{ backgroundColor: hex }}
              />
              <span className="text-[10px] text-text-secondary">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Button sample */}
      <div>
        <span className="text-xs text-text-secondary mb-2 block">Botao de exemplo</span>
        <button
          className="px-5 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
          style={{
            backgroundColor: colors.accent,
            color: colors.bg,
            fontFamily: fonts.primary,
          }}
        >
          Chamar para Acao
        </button>
      </div>
    </div>
  )
}
