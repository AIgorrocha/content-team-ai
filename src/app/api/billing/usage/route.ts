import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { queryOne } from "@/lib/db"
import type { Tenant } from "@/lib/types"
import { getUsage, checkLimit } from "@/lib/queries/billing"

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("ct-session")?.value
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const session = verifyToken(sessionCookie)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenant = await queryOne<Tenant>(
      "SELECT * FROM ct_tenants WHERE id = $1",
      [session.tenantId]
    )
    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    const usage = await getUsage(session.tenantId)
    const [agents, tasks, content, emails, storage] = await Promise.all([
      checkLimit(session.tenantId, "agents"),
      checkLimit(session.tenantId, "tasks_per_month"),
      checkLimit(session.tenantId, "content_per_month"),
      checkLimit(session.tenantId, "emails_per_month"),
      checkLimit(session.tenantId, "storage_mb"),
    ])

    return NextResponse.json({
      data: {
        usage,
        limits: { agents, tasks, content, emails, storage },
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch usage" },
      { status: 500 }
    )
  }
}
