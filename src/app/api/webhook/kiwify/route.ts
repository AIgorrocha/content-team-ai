import { NextRequest, NextResponse } from "next/server"
import { queryOne, query } from "@/lib/db"
import { createSubscription, updateSubscriptionFromProvider } from "@/lib/queries/billing"
import type { Tenant, PlanId } from "@/lib/types"

// Kiwify webhook signature verification
function verifyKiwifySignature(body: string, signature: string | null): boolean {
  if (!process.env.KIWIFY_WEBHOOK_SECRET || !signature) return false
  const crypto = require("crypto")
  const expected = crypto
    .createHmac("sha256", process.env.KIWIFY_WEBHOOK_SECRET)
    .update(body)
    .digest("hex")
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
}

// Map Kiwify product to plan
function mapProductToPlan(productId: string): PlanId {
  const mapping: Record<string, PlanId> = {
    [process.env.KIWIFY_PRODUCT_STARTER ?? ""]: "starter",
    [process.env.KIWIFY_PRODUCT_PRO ?? ""]: "pro",
  }
  return mapping[productId] ?? "starter"
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get("x-kiwify-signature")

    // Verify signature in production
    if (process.env.NODE_ENV === "production") {
      if (!verifyKiwifySignature(rawBody, signature)) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
    }

    const event = JSON.parse(rawBody)
    const eventType = event.event ?? event.type

    switch (eventType) {
      case "order.paid":
      case "subscription.created": {
        const email = event.customer?.email ?? event.Customer?.email
        if (!email) break

        // Find tenant by user email
        const user = await queryOne<{ id: string }>(
          "SELECT id FROM ct_users WHERE email = $1",
          [email.toLowerCase()]
        )
        if (!user) break

        const member = await queryOne<{ tenant_id: string }>(
          "SELECT tenant_id FROM ct_tenant_members WHERE user_id = $1 LIMIT 1",
          [user.id]
        )
        if (!member) break

        const planId = mapProductToPlan(event.product?.id ?? event.Product?.id ?? "")

        await createSubscription({
          tenantId: member.tenant_id,
          planId,
          billingCycle: event.plan_frequency === "yearly" ? "yearly" : "monthly",
          provider: "kiwify",
          providerSubscriptionId: event.subscription_id ?? event.order_id,
          providerCustomerId: event.customer?.id,
        })
        break
      }

      case "subscription.cancelled":
      case "subscription.expired": {
        const subId = event.subscription_id
        if (subId) {
          await updateSubscriptionFromProvider("kiwify", subId, {
            status: "cancelled",
            cancelled_at: new Date().toISOString(),
          })
        }
        break
      }

      case "subscription.renewed": {
        const subId = event.subscription_id
        if (subId) {
          const periodEnd = new Date()
          periodEnd.setMonth(periodEnd.getMonth() + 1)
          await updateSubscriptionFromProvider("kiwify", subId, {
            status: "active",
            current_period_start: new Date().toISOString(),
            current_period_end: periodEnd.toISOString(),
          })
        }
        break
      }

      case "refund.created": {
        const subId = event.subscription_id
        if (subId) {
          await updateSubscriptionFromProvider("kiwify", subId, {
            status: "cancelled",
            cancelled_at: new Date().toISOString(),
          })
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Kiwify webhook error:", error)
    return NextResponse.json({ received: true })
  }
}
