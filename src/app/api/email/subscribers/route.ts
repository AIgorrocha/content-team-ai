import { NextRequest, NextResponse } from "next/server"
import { listSubscribers, getSubscriberStats } from "@/lib/queries/email"
import type { SubscriberStatus } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams

    const page = Math.max(1, parseInt(params.get("page") ?? "1"))
    const limit = Math.min(100, Math.max(1, parseInt(params.get("limit") ?? "20")))

    const [{ data, total }, stats] = await Promise.all([
      listSubscribers({
        search: params.get("search") || undefined,
        status: (params.get("status") as SubscriberStatus) || undefined,
        page,
        limit,
      }),
      getSubscriberStats(),
    ])

    return NextResponse.json({
      data,
      stats,
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
