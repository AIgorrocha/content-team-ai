"use client"

import { useState, useEffect } from "react"
import { PricingCard } from "./pricing-card"
import { UsageBar } from "./usage-bar"
import type { Plan, PlanId, Subscription, Usage } from "@/lib/types"

interface LimitInfo {
  allowed: boolean
  current: number
  limit: number
}

export function BillingTab() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [subscription, setSubscription] = useState<(Subscription & { plan?: Plan }) | null>(null)
  const [usage, setUsage] = useState<Usage | null>(null)
  const [limits, setLimits] = useState<Record<string, LimitInfo> | null>(null)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [loading, setLoading] = useState(true)
  const [changing, setChanging] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch("/api/billing/plans").then((r) => r.json()),
      fetch("/api/billing/subscription").then((r) => r.json()),
      fetch("/api/billing/usage").then((r) => r.json()),
    ]).then(([plansRes, subRes, usageRes]) => {
      setPlans(plansRes.data ?? [])
      setSubscription(subRes.data?.subscription ?? null)
      setUsage(usageRes.data?.usage ?? null)
      setLimits(usageRes.data?.limits ?? null)
      if (subRes.data?.subscription?.billing_cycle) {
        setBillingCycle(subRes.data.subscription.billing_cycle)
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  async function handleSelectPlan(planId: PlanId) {
    setChanging(true)
    try {
      const res = await fetch("/api/billing/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, billingCycle }),
      })
      if (!res.ok) {
        const err = await res.json()
        alert(err.error || "Erro ao alterar plano")
        return
      }
      // Reload data
      const subRes = await fetch("/api/billing/subscription").then((r) => r.json())
      setSubscription(subRes.data?.subscription ?? null)
    } catch {
      alert("Erro ao alterar plano")
    } finally {
      setChanging(false)
    }
  }

  async function handleCancel() {
    if (!confirm("Tem certeza que deseja cancelar seu plano? Você voltará para o plano Grátis.")) return
    setChanging(true)
    try {
      await fetch("/api/billing/subscription", { method: "DELETE" })
      const subRes = await fetch("/api/billing/subscription").then((r) => r.json())
      setSubscription(subRes.data?.subscription ?? null)
    } catch {
      alert("Erro ao cancelar")
    } finally {
      setChanging(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-surface-hover rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 bg-surface-hover rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const currentPlanId = (subscription?.plan_id ?? "free") as PlanId

  return (
    <div className="space-y-8">
      {/* Current plan info */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Plano atual: {subscription?.plan_id
                ? plans.find((p) => p.id === subscription.plan_id)?.name ?? subscription.plan_id
                : "Grátis"}
            </h3>
            {subscription?.current_period_end && (
              <p className="mt-1 text-sm text-text-secondary">
                {subscription.status === "cancelled"
                  ? "Cancelado - acesso até "
                  : "Próxima cobrança: "}
                {new Date(subscription.current_period_end).toLocaleDateString("pt-BR")}
              </p>
            )}
          </div>
          {subscription && subscription.plan_id !== "free" && subscription.status === "active" && (
            <button
              onClick={handleCancel}
              disabled={changing}
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Cancelar plano
            </button>
          )}
        </div>
      </div>

      {/* Usage */}
      {limits && (
        <div className="rounded-xl border border-border bg-surface p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">Uso deste mês</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UsageBar label="Agentes" current={limits.agents?.current ?? 0} limit={limits.agents?.limit ?? 3} />
            <UsageBar label="Tarefas" current={limits.tasks?.current ?? 0} limit={limits.tasks?.limit ?? 50} />
            <UsageBar label="Conteúdos" current={limits.content?.current ?? 0} limit={limits.content?.limit ?? 20} />
            <UsageBar label="Emails" current={limits.emails?.current ?? 0} limit={limits.emails?.limit ?? 100} />
            <UsageBar label="Armazenamento" current={limits.storage?.current ?? 0} limit={limits.storage?.limit ?? 500} unit=" MB" />
          </div>
        </div>
      )}

      {/* Billing cycle toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className={billingCycle === "monthly" ? "text-text-primary font-medium text-sm" : "text-text-secondary text-sm"}>
          Mensal
        </span>
        <button
          onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
          className="relative w-12 h-6 rounded-full bg-surface-hover transition-colors"
        >
          <div
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-accent transition-transform ${
              billingCycle === "yearly" ? "translate-x-6" : "translate-x-0.5"
            }`}
          />
        </button>
        <span className={billingCycle === "yearly" ? "text-text-primary font-medium text-sm" : "text-text-secondary text-sm"}>
          Anual <span className="text-green-400 text-xs">(economize ~17%)</span>
        </span>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            currentPlanId={currentPlanId}
            billingCycle={billingCycle}
            onSelect={handleSelectPlan}
            loading={changing}
          />
        ))}
      </div>
    </div>
  )
}
