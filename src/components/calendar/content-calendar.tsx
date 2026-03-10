"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ContentItem, Platform } from "@/lib/types"

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
]

const DAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
const DAY_NAMES_SHORT = ["D", "S", "T", "Q", "Q", "S", "S"]

const PLATFORM_COLORS: Record<Platform, string> = {
  instagram: "bg-[#E1306C]",
  youtube: "bg-[#FF0000]",
  linkedin: "bg-[#0A66C2]",
  x: "bg-white",
  email: "bg-[#F59E0B]",
  tiktok: "bg-[#00F2EA]",
}

interface ContentCalendarProps {
  contentItems: ContentItem[]
  currentMonth: Date
  onMonthChange: (date: Date) => void
  onItemClick: (id: string) => void
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

export function ContentCalendar({
  contentItems,
  currentMonth,
  onMonthChange,
  onItemClick,
}: ContentCalendarProps) {
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const today = new Date()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfWeek(year, month)

  const prevMonthDays = getDaysInMonth(year, month - 1)
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7

  const handlePrev = () => {
    onMonthChange(new Date(year, month - 1, 1))
  }

  const handleNext = () => {
    onMonthChange(new Date(year, month + 1, 1))
  }

  const handleToday = () => {
    onMonthChange(new Date(today.getFullYear(), today.getMonth(), 1))
  }

  const itemsByDay = new Map<string, ContentItem[]>()
  for (const item of contentItems) {
    if (!item.scheduled_at) continue
    const d = new Date(item.scheduled_at)
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    const existing = itemsByDay.get(key) ?? []
    itemsByDay.set(key, [...existing, item])
  }

  const cells: Array<{ day: number; isCurrentMonth: boolean; date: Date }> = []

  for (let i = 0; i < firstDay; i++) {
    const day = prevMonthDays - firstDay + 1 + i
    cells.push({ day, isCurrentMonth: false, date: new Date(year, month - 1, day) })
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, isCurrentMonth: true, date: new Date(year, month, d) })
  }

  const remaining = totalCells - cells.length
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, isCurrentMonth: false, date: new Date(year, month + 1, d) })
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text-primary">
          {MONTH_NAMES[month]} {year}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleToday}>
            Hoje
          </Button>
          <Button variant="ghost" size="icon" onClick={handlePrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 border border-border rounded-lg overflow-hidden">
        {DAY_NAMES.map((name, i) => (
          <div
            key={name + i}
            className="bg-surface px-2 py-2 text-center text-xs font-medium text-text-secondary border-b border-border"
          >
            <span className="hidden sm:inline">{name}</span>
            <span className="sm:hidden">{DAY_NAMES_SHORT[i]}</span>
          </div>
        ))}

        {cells.map((cell, i) => {
          const isToday = isSameDay(cell.date, today)
          const key = `${cell.date.getFullYear()}-${cell.date.getMonth()}-${cell.date.getDate()}`
          const dayItems = itemsByDay.get(key) ?? []

          return (
            <div
              key={i}
              className={cn(
                "min-h-[80px] sm:min-h-[100px] p-1 border-b border-r border-border",
                !cell.isCurrentMonth && "bg-transparent",
                cell.isCurrentMonth && "bg-surface/50",
                isToday && "ring-1 ring-inset ring-accent"
              )}
            >
              <span
                className={cn(
                  "text-xs font-medium inline-block mb-1",
                  cell.isCurrentMonth
                    ? "text-text-primary"
                    : "text-text-secondary/50",
                  isToday &&
                    "bg-accent text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]"
                )}
              >
                {cell.day}
              </span>
              <div className="space-y-0.5">
                {dayItems.slice(0, 3).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onItemClick(item.id)}
                    className="w-full flex items-center gap-1 px-1 py-0.5 rounded hover:bg-surface-hover transition-colors text-left group"
                  >
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full shrink-0",
                        item.platform
                          ? PLATFORM_COLORS[item.platform]
                          : "bg-text-secondary"
                      )}
                    />
                    <span className="text-[10px] sm:text-xs text-text-primary truncate group-hover:text-accent transition-colors">
                      {item.title}
                    </span>
                  </button>
                ))}
                {dayItems.length > 3 && (
                  <span className="text-[10px] text-text-secondary px-1">
                    +{dayItems.length - 3} mais
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
