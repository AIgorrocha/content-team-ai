import { formatCurrency } from "@/lib/utils"

interface PipelineSummaryProps {
  byStage: Array<{ name: string; count: number; value: number }>
  totalDeals: number
  totalValue: number
}

const stageColors: Record<string, string> = {
  Lead: "bg-gray-500",
  Qualified: "bg-blue-500",
  Proposal: "bg-yellow-500",
  Negotiation: "bg-purple-500",
  Won: "bg-success",
  Lost: "bg-error",
}

export function PipelineSummary({ byStage, totalDeals, totalValue }: PipelineSummaryProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-secondary">{totalDeals} deals</span>
        <span className="font-medium text-text-primary">{formatCurrency(totalValue)}</span>
      </div>
      <div className="space-y-2">
        {byStage.map((stage) => (
          <div key={stage.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${stageColors[stage.name] ?? "bg-gray-500"}`} />
              <span className="text-text-secondary">{stage.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-text-secondary">{stage.count}</span>
              <span className="text-text-primary w-24 text-right">
                {formatCurrency(stage.value)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
