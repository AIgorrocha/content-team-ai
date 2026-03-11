"use client"

import { cn } from "@/lib/utils"
import type { DesignSystem } from "@/lib/types"

interface CarouselPreviewProps {
  carousel: DesignSystem["carousel_style"]
  className?: string
}

export function CarouselPreview({ carousel, className }: CarouselPreviewProps) {
  const aspectLabel = `${carousel.slideWidth} x ${carousel.slideHeight}`

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <h3 className="text-sm font-semibold text-text-primary">Preview do Carousel</h3>
      <div
        className="relative rounded-lg border border-border overflow-hidden flex items-center justify-center"
        style={{
          backgroundColor: carousel.bgColor,
          aspectRatio: `${carousel.slideWidth} / ${carousel.slideHeight}`,
          maxHeight: 280,
        }}
      >
        <div className="text-center px-6" style={{ color: carousel.textColor, fontFamily: carousel.font }}>
          <p className="text-lg font-bold mb-1">Titulo do Slide</p>
          <p className="text-sm opacity-80">Texto de exemplo para o carousel</p>
        </div>
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5"
        >
          {Array.from({ length: Math.min(carousel.maxSlides, 8) }).map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: carousel.textColor,
                opacity: i === 0 ? 1 : 0.4,
              }}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary">
        <span>Dimensoes: {aspectLabel}</span>
        <span>Max slides: {carousel.maxSlides}</span>
        <span>Estilo: {carousel.style}</span>
        <span>Foto perfil: {carousel.profilePhotoPosition}</span>
      </div>
    </div>
  )
}
