import { NextRequest, NextResponse } from "next/server"
import { listContacts } from "@/lib/queries/contacts"

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams

    const page = Math.max(1, parseInt(params.get("page") ?? "1"))
    const limit = Math.min(100, Math.max(1, parseInt(params.get("limit") ?? "20")))

    const { data, total } = await listContacts({
      search: params.get("search") || undefined,
      source: params.get("source") || undefined,
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
