import { NextRequest, NextResponse } from "next/server"
import { withTenantDB } from "@/lib/route-helper"
import { getAgentDetail } from "@/lib/queries/agents"

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  return withTenantDB(request, async (db) => {
    const detail = await getAgentDetail(db, params.slug)
    if (!detail) {
      throw new Error("Agent not found")
    }
    return detail
  })
}
