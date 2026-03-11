import { NextRequest } from "next/server"
import { withTenantDB } from "@/lib/route-helper"
import { getDashboardStats } from "@/lib/queries/stats"

export async function GET(request: NextRequest) {
  return withTenantDB(request, (db) => getDashboardStats(db))
}
