import { NextRequest, NextResponse } from "next/server"
import { getAgentDetail } from "@/lib/queries/agents"

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const detail = await getAgentDetail(params.slug)
    if (!detail) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      )
    }
    return NextResponse.json(detail)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
