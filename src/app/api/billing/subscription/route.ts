import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { queryOne } from "@/lib/db"
import type { Tenant } from "@/lib/types"
import {
  getSubscriptionWithPlan,
  createSubscription,
  cancelSubscription,
  getUsage,
} from "@/lib/queries/billing"

async function getTenantFromRequest(request: NextRequest) {
  const sessionCookie = request.cookies.get("ct-session")?.value
  if (!sessionCookie) return null
  const session = verifyToken(sessionCookie)
  if (!session) return null
  const tenant = await queryOne<Tenant>(
    "SELECT * FROM ct_tenants WHERE id = $1",
    [session.tenantId]
  )
  return tenant ? { ...session, tenant } : null
}

export async function GET(request: NextRequest) {
  try {
    const ctx = await getTenantFromRequest(request)
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const subscription = await getSubscriptionWithPlan(ctx.tenantId)
    const usage = await getUsage(ctx.tenantId)

    return NextResponse.json({
      data: {
        subscription,
        usage,
        currentPlan: subscription?.plan_id ?? "free",
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch subscription" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const ctx = await getTenantFromRequest(request)
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (ctx.role !== "owner" && ctx.role !== "admin") {
      return NextResponse.json(
        { error: "Apenas owners e admins podem alterar o plano" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { planId, billingCycle = "monthly" } = body

    if (!planId) {
      return NextResponse.json({ error: "planId é obrigatório" }, { status: 400 })
    }

    const subscription = await createSubscription({
      tenantId: ctx.tenantId,
      planId,
      billingCycle,
      provider: "manual",
    })

    return NextResponse.json({ data: subscription })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create subscription" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const ctx = await getTenantFromRequest(request)
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (ctx.role !== "owner") {
      return NextResponse.json(
        { error: "Apenas o owner pode cancelar o plano" },
        { status: 403 }
      )
    }

    const result = await cancelSubscription(ctx.tenantId)
    if (!result) {
      return NextResponse.json({ error: "Nenhuma assinatura encontrada" }, { status: 404 })
    }

    return NextResponse.json({ data: result })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to cancel subscription" },
      { status: 500 }
    )
  }
}
