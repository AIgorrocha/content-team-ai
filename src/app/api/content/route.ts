import { NextRequest, NextResponse } from "next/server"
import { listContent } from "@/lib/queries/content"
import type { ContentStatus, ContentType, Platform } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams

    const page = Math.max(1, parseInt(params.get("page") ?? "1"))
    const limit = Math.min(100, Math.max(1, parseInt(params.get("limit") ?? "20")))

    const { data, total } = await listContent({
      status: (params.get("status") as ContentStatus) || undefined,
      platform: (params.get("platform") as Platform) || undefined,
      content_type: (params.get("type") as ContentType) || undefined,
      search: params.get("search") || undefined,
      from: params.get("from") || undefined,
      to: params.get("to") || undefined,
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
