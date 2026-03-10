"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ContentPaginationProps {
  page: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
}

export function ContentPagination({ page, totalPages, total, onPageChange }: ContentPaginationProps) {
  if (totalPages <= 1) {
    return (
      <div className="text-sm text-text-secondary">
        Mostrando {total} de {total} resultados
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-text-secondary">
        Mostrando página {page} de {totalPages} ({total} resultados)
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        <span className="text-sm text-text-primary px-2">
          {page} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Próximo
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
