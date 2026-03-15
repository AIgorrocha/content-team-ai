"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface DesignSystem {
  colors: { name: string; value: string }[]
  fonts: string[]
  carousel: { width: number; height: number; style: string }
}

interface DesignSectionProps {
  designSystem: DesignSystem
}

export function DesignSection({ designSystem }: DesignSectionProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {designSystem.colors.map((color) => (
              <div key={color.value} className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg border border-border shrink-0"
                  style={{ backgroundColor: color.value }}
                />
                <div>
                  <p className="text-sm text-text-primary">{color.name}</p>
                  <p className="text-xs text-text-secondary font-mono">{color.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fontes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {designSystem.fonts.map((font) => (
              <div key={font} className="text-sm text-text-primary">
                <span className="font-mono text-text-secondary">{font}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Carrossel Instagram</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border">
                <td className="py-2 text-text-secondary">Dimensoes</td>
                <td className="py-2 text-text-primary">
                  {designSystem.carousel.width} x {designSystem.carousel.height}px
                </td>
              </tr>
              <tr>
                <td className="py-2 text-text-secondary">Estilo</td>
                <td className="py-2 text-text-primary">{designSystem.carousel.style}</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
