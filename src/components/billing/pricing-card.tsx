"use client"

import { cn } from "@/lib/utils"
import type { Plan, PlanId } from "@/lib/types"
import { Check } from "lucide-react"

interface PricingCardProps {
  plan: Plan
  currentPlanId: PlanId | null
  billingCycle: "monthly" | "yearly"
  onSelect: (planId: PlanId) => void
  loading?: boolean
}

export function PricingCard({ plan, currentPlanId, billingCycle, onSelect, loading }: PricingCardProps) {
  const isCurrent = currentPlanId === plan.id
  const isPopular = plan.id === "pro"
  const price = billingCycle === "monthly" ? plan.price_monthly : plan.price_yearly
  const monthlyPrice = billingCycle === "yearly" ? Math.round(price / 12) : price
  const isEnterprise = plan.id === "enterprise"

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl border p-6 transition-all",
        isPopular
          ? "border-accent bg-accent/5 shadow-lg shadow-accent/10"
          : "border-border bg-surface",
        isCurrent && "ring-2 ring-accent"
      )}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-xs font-semibold text-white">
          Popular
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-text-primary">{plan.name}</h3>
        <p className="mt-1 text-sm text-text-secondary">{plan.description}</p>
      </div>

      <div className="mb-6">
        {isEnterprise ? (
          <div className="text-2xl font-bold text-text-primary">Sob consulta</div>
        ) : price === 0 ? (
          <div className="text-2xl font-bold text-text-primary">Grátis</div>
        ) : (
          <div>
            <span className="text-3xl font-bold text-text-primary">
              R$ {(monthlyPrice / 100).toFixed(0)}
            </span>
            <span className="text-sm text-text-secondary">/mês</span>
            {billingCycle === "yearly" && (
              <p className="mt-1 text-xs text-green-400">
                Economia de {Math.round((1 - price / (plan.price_monthly * 12)) * 100)}% no anual
              </p>
            )}
          </div>
        )}
      </div>

      <ul className="mb-6 flex-1 space-y-2">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-text-secondary">
            <Check size={16} className="mt-0.5 shrink-0 text-green-400" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {isEnterprise ? (
        <a
          href="mailto:contato@ianapratica.com"
          className="w-full rounded-lg border border-accent px-4 py-2.5 text-center text-sm font-medium text-accent hover:bg-accent/10 transition-colors"
        >
          Falar com vendas
        </a>
      ) : isCurrent ? (
        <button
          disabled
          className="w-full rounded-lg bg-surface-hover px-4 py-2.5 text-sm font-medium text-text-secondary cursor-default"
        >
          Plano atual
        </button>
      ) : (
        <button
          onClick={() => onSelect(plan.id)}
          disabled={loading}
          className={cn(
            "w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50",
            isPopular
              ? "bg-accent text-white hover:bg-accent/90"
              : "border border-border text-text-primary hover:bg-surface-hover"
          )}
        >
          {loading ? "Processando..." : price === 0 ? "Começar grátis" : "Assinar"}
        </button>
      )}
    </div>
  )
}
