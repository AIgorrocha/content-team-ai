import { NextRequest, NextResponse } from "next/server"
import { getInfluencer } from "@/lib/queries/influencers"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await getInfluencer(id)

    if (!result) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 })
    }

    return NextResponse.json({
      data: result.influencer,
      collaborations: result.collaborations,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
