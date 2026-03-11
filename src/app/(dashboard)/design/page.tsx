"use client"

import { useCallback, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import type { DesignSystem } from "@/lib/types"
import { ColorSwatch } from "@/components/design/color-swatch"
import { FontInput } from "@/components/design/font-input"
import { CarouselPreview } from "@/components/design/carousel-preview"
import { BrandPreview } from "@/components/design/brand-preview"

const COLOR_LABELS: Record<string, string> = {
  bg: "Fundo",
  surface: "Superficie",
  text: "Texto Principal",
  textSecondary: "Texto Secundario",
  accent: "Destaque 1",
  accent2: "Destaque 2",
  success: "Sucesso",
  error: "Erro",
}

const FONT_LABELS: Record<string, string> = {
  primary: "Fonte Principal",
  secondary: "Fonte Secundaria",
  mono: "Fonte Monospacada",
}

export default function DesignPage() {
  const [ds, setDs] = useState<DesignSystem | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/design-system")
      .then((r) => r.json())
      .then((res) => setDs(res.data))
      .catch(() => setToast("Erro ao carregar design system"))
      .finally(() => setLoading(false))
  }, [])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }, [])

  const handleSave = async () => {
    if (!ds) return
    setSaving(true)
    try {
      const res = await fetch("/api/design-system", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fonts: ds.fonts,
          colors: ds.colors,
          carousel_style: ds.carousel_style,
          brand_voice: ds.brand_voice,
        }),
      })
      const json = await res.json()
      if (json.error) {
        showToast("Erro ao salvar")
      } else {
        setDs(json.data)
        showToast("Salvo com sucesso!")
      }
    } catch {
      showToast("Erro ao salvar")
    } finally {
      setSaving(false)
    }
  }

  const updateColor = (key: string, value: string) => {
    if (!ds) return
    setDs({ ...ds, colors: { ...ds.colors, [key]: value } })
  }

  const updateFont = (key: string, value: string) => {
    if (!ds) return
    setDs({ ...ds, fonts: { ...ds.fonts, [key]: value } })
  }

  const updateCarousel = (key: string, value: string | number) => {
    if (!ds) return
    setDs({ ...ds, carousel_style: { ...ds.carousel_style, [key]: value } })
  }

  const updateBrandVoice = (value: string) => {
    if (!ds) return
    setDs({ ...ds, brand_voice: value })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!ds) {
    return (
      <div className="text-text-secondary text-center py-16">
        Nenhum design system encontrado. Crie um registro na tabela ct_design_system.
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg bg-surface border border-border text-text-primary text-sm shadow-lg animate-in fade-in slide-in-from-top-2">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Design System</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className={cn(
            "px-5 py-2 rounded-lg text-sm font-medium transition-colors",
            "bg-accent text-white hover:bg-accent/90",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Editor */}
        <div className="space-y-8">
          {/* Colors */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-4">Cores</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(Object.keys(ds.colors) as Array<keyof typeof ds.colors>).map((key) => (
                <ColorSwatch
                  key={key}
                  label={COLOR_LABELS[key] ?? key}
                  value={ds.colors[key]}
                  onChange={(v) => updateColor(key, v)}
                />
              ))}
            </div>
          </section>

          {/* Fonts */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-4">Fontes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(Object.keys(ds.fonts) as Array<keyof typeof ds.fonts>).map((key) => (
                <FontInput
                  key={key}
                  label={FONT_LABELS[key] ?? key}
                  value={ds.fonts[key]}
                  onChange={(v) => updateFont(key, v)}
                />
              ))}
            </div>
          </section>

          {/* Carousel */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-4">Carousel</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-secondary">Largura (px)</label>
                <input
                  type="number"
                  value={ds.carousel_style.slideWidth}
                  onChange={(e) => updateCarousel("slideWidth", Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-secondary">Altura (px)</label>
                <input
                  type="number"
                  value={ds.carousel_style.slideHeight}
                  onChange={(e) => updateCarousel("slideHeight", Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-secondary">Max Slides</label>
                <input
                  type="number"
                  value={ds.carousel_style.maxSlides}
                  onChange={(e) => updateCarousel("maxSlides", Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-secondary">Estilo</label>
                <input
                  type="text"
                  value={ds.carousel_style.style}
                  onChange={(e) => updateCarousel("style", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-secondary">Cor de Fundo</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={ds.carousel_style.bgColor}
                    onChange={(e) => updateCarousel("bgColor", e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0"
                  />
                  <span className="text-xs text-text-secondary font-mono">{ds.carousel_style.bgColor}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-secondary">Cor do Texto</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={ds.carousel_style.textColor}
                    onChange={(e) => updateCarousel("textColor", e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0"
                  />
                  <span className="text-xs text-text-secondary font-mono">{ds.carousel_style.textColor}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-secondary">Fonte do Carousel</label>
                <input
                  type="text"
                  value={ds.carousel_style.font}
                  onChange={(e) => updateCarousel("font", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-secondary">Posicao Foto Perfil</label>
                <input
                  type="text"
                  value={ds.carousel_style.profilePhotoPosition}
                  onChange={(e) => updateCarousel("profilePhotoPosition", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
            </div>
          </section>

          {/* Brand Voice */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-4">Brand Voice</h2>
            <textarea
              value={ds.brand_voice ?? ""}
              onChange={(e) => updateBrandVoice(e.target.value)}
              rows={5}
              placeholder="Descreva o tom de voz da marca..."
              className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text-primary text-sm
                placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-y"
            />
          </section>
        </div>

        {/* Right: Previews */}
        <div className="space-y-8">
          <BrandPreview fonts={ds.fonts} colors={ds.colors} />
          <CarouselPreview carousel={ds.carousel_style} />
        </div>
      </div>
    </div>
  )
}
