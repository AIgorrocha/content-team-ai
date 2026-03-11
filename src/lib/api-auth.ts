import { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth"
import { validateApiKey } from "@/lib/api-key"
import { queryOne } from "@/lib/db"
import type { Tenant } from "@/lib/types"

export interface RequestTenant {
  tenantId: string
  databaseUrl: string
  userId: string | null
}

export async function getRequestTenant(
  request: NextRequest
): Promise<RequestTenant | null> {
  // 1. Check X-API-Key header (for OpenClaw / external)
  const apiKeyHeader = request.headers.get("x-api-key")
  if (apiKeyHeader) {
    const result = await validateApiKey(apiKeyHeader)
    if (!result) return null
    return {
      tenantId: result.tenantId,
      databaseUrl: result.databaseUrl,
      userId: null,
    }
  }

  // 2. Check session cookie (for browser)
  const sessionCookie = request.cookies.get("ct-session")?.value
  if (sessionCookie) {
    const session = verifyToken(sessionCookie)
    if (!session) return null

    const tenant = await queryOne<Tenant>(
      "SELECT * FROM ct_tenants WHERE id = $1",
      [session.tenantId]
    )
    if (!tenant) return null

    return {
      tenantId: tenant.id,
      databaseUrl: tenant.database_url,
      userId: session.userId,
    }
  }

  return null
}
