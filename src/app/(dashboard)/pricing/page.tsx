"use client"

import { useState, useEffect } from "react"
import { PricingCard } from "@/components/billing/pricing-card"
import type { Plan, PlanId, Subscription } from "@/lib/types"

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [currentPlanId, setCurrentPlanId] = useState<PlanId | null>(null)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [loading, setLoading] = useState(true)
  const [changing, setChanging] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch("/api/billing/plans").then((r) => r.json()),
      fetch("/api/billing/subscription").then((r) => r.json()),
    ]).then(([plansRes, subRes]) => {
      setPlans(plansRes.data ?? [])
      setCurrentPlanId(subRes.data?.currentPlan ?? "free")
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
      setCurrentPlanId(planId)
    } catch {
      alert("Erro ao alterar plano")
    } finally {
      setChanging(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-10 w-64 bg-surface-hover rounded animate-pulse mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-96 bg-surface-hover rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-text-primary">Escolha seu plano</h1>
        <p className="text-text-secondary">
          Comece grátis e escale conforme sua necessidade
        </p>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
