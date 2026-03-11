import { NextRequest, NextResponse } from "next/server"
import { createDeal } from "@/lib/queries/crm"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.title || typeof body.title !== "string" || body.title.trim() === "") {
      return NextResponse.json(
        { error: "Field 'title' is required" },
        { status: 400 }
      )
    }

    if (!body.stage_id || typeof body.stage_id !== "string") {
      return NextResponse.json(
        { error: "Field 'stage_id' is required" },
        { status: 400 }
      )
    }

    const deal = await createDeal({
      title: body.title.trim(),
      contact_id: body.contact_id || undefined,
      stage_id: body.stage_id,
      value: body.value != null ? Number(body.value) : undefined,
      expected_close_at: body.expected_close_at || undefined,
    })

    return NextResponse.json({ data: deal }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
