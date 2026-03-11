import { NextRequest, NextResponse } from "next/server"
import { updateDeal } from "@/lib/queries/crm"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const deal = await updateDeal(id, {
      stage_id: body.stage_id,
      status: body.status,
      notes: body.notes,
    })

    if (!deal) {
      return NextResponse.json(
        { error: "Deal not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: deal })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
