import { NextRequest, NextResponse } from "next/server"
import { getCompetitorWithPosts } from "@/lib/queries/competitors"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const url = new URL(request.url)

    const post_type = url.searchParams.get("post_type") ?? undefined
    const viralParam = url.searchParams.get("viral")
    const is_viral = viralParam === "true" ? true : viralParam === "false" ? false : undefined
    const page = parseInt(url.searchParams.get("page") ?? "1")
    const limit = parseInt(url.searchParams.get("limit") ?? "20")

    const result = await getCompetitorWithPosts(id, { post_type, is_viral, page, limit })

    if (!result) {
      return NextResponse.json({ error: "Competitor not found" }, { status: 404 })
    }

    return NextResponse.json({
      data: result.posts,
      competitor: result.competitor,
      meta: {
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit),
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
