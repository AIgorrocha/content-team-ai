import { NextResponse } from "next/server"
import { listPipelineWithDeals } from "@/lib/queries/crm"

export async function GET() {
  try {
    const pipeline = await listPipelineWithDeals()
    return NextResponse.json({ data: pipeline })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
