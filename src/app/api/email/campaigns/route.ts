import { NextRequest, NextResponse } from "next/server"
import { listCampaigns } from "@/lib/queries/email"
import type { CampaignStatus } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams

    const page = Math.max(1, parseInt(params.get("page") ?? "1"))
    const limit = Math.min(100, Math.max(1, parseInt(params.get("limit") ?? "20")))

    const { data, total } = await listCampaigns({
      status: (params.get("status") as CampaignStatus) || undefined,
      page,
      limit,
    })

    return NextResponse.json({
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
