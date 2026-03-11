import { NextRequest, NextResponse } from "next/server"
import { getRequestTenant, type RequestTenant } from "@/lib/api-auth"
import { getTenantDB, type TenantDB } from "@/lib/tenant-db"

export async function withTenantDB<T>(
  request: NextRequest,
  handler: (db: TenantDB, tenant: RequestTenant) => Promise<T>
): Promise<NextResponse> {
  try {
    const tenant = await getRequestTenant(request)
    if (!tenant) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = getTenantDB(tenant.databaseUrl)
    const result = await handler(db, tenant)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
