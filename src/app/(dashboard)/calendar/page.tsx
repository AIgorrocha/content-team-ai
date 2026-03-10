"use client"

import { useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { usePolling } from "@/hooks/use-polling"
import { ContentCalendar } from "@/components/calendar/content-calendar"
import type { ContentItem, PaginatedResponse } from "@/lib/types"

function formatDateParam(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export default function CalendarPage() {
  const router = useRouter()
  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  )

  const from = useMemo(() => {
    return formatDateParam(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1))
  }, [currentMonth])

  const to = useMemo(() => {
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    return formatDateParam(lastDay)
  }, [currentMonth])

  const fetcher = useCallback(async (): Promise<ContentItem[]> => {
    const res = await fetch(`/api/content?from=${from}&to=${to}&limit=200`)
    if (!res.ok) {
      throw new Error("Falha ao carregar conteudos")
    }
    const json: PaginatedResponse<ContentItem> = await res.json()
    return json.data
  }, [from, to])

  const { data, loading } = usePolling<ContentItem[]>({
    fetcher,
    interval: 60000,
  })

  const handleItemClick = useCallback(
    (id: string) => {
      router.push(`/content/${id}`)
    },
    [router]
  )

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Calendario</h1>

      {loading && !data ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="h-7 w-48 bg-surface rounded animate-pulse" />
            <div className="flex gap-2">
              <div className="h-8 w-16 bg-surface rounded animate-pulse" />
              <div className="h-9 w-9 bg-surface rounded animate-pulse" />
              <div className="h-9 w-9 bg-surface rounded animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="bg-surface min-h-[100px] animate-pulse" />
            ))}
          </div>
        </div>
      ) : (
        <ContentCalendar
          contentItems={data ?? []}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
          onItemClick={handleItemClick}
        />
      )}
    </div>
  )
}
