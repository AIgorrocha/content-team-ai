import { NextRequest } from "next/server"

export interface RequestTenant {
  tenantId: string
  databaseUrl: string
  userId: string | null
}

const SIMPLE_AUTH_COOKIE = "ct-auth-token"
const SIMPLE_AUTH_VALUES = ["authenticated", "admin:authenticated", "admin%3Aauthenticated"]

export async function getRequestTenant(
  request: NextRequest
): Promise<RequestTenant | null> {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) return null

  // Simple admin cookie auth (Replit setup)
  const simpleCookie = request.cookies.get(SIMPLE_AUTH_COOKIE)?.value
  if (simpleCookie && SIMPLE_AUTH_VALUES.includes(simpleCookie)) {
    return {
      tenantId: "admin",
      databaseUrl,
      userId: "admin",
    }
  }

  // X-API-Key header fallback
  const apiKey = request.headers.get("x-api-key")
  if (apiKey === process.env.ADMIN_API_KEY && process.env.ADMIN_API_KEY) {
    return {
      tenantId: "admin",
      databaseUrl,
      userId: null,
    }
  }

  return null
}
