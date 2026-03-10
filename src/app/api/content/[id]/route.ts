import { NextRequest, NextResponse } from "next/server"
import { getContentById, updateContent } from "@/lib/queries/content"
import type { ApprovalStatus, ContentStatus } from "@/lib/types"

const VALID_APPROVAL_STATUSES: ApprovalStatus[] = ["pending", "approved", "rejected"]
const VALID_CONTENT_STATUSES: ContentStatus[] = ["idea", "draft", "review", "approved", "scheduled", "published", "rejected"]

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const item = await getContentById(id)

    if (!item) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()

    const updateData: Record<string, unknown> = {}

    if (body.approval_status !== undefined) {
      if (!VALID_APPROVAL_STATUSES.includes(body.approval_status)) {
        return NextResponse.json(
          { error: `Invalid approval_status. Must be one of: ${VALID_APPROVAL_STATUSES.join(", ")}` },
          { status: 400 }
        )
      }
      updateData.approval_status = body.approval_status
    }

    if (body.status !== undefined) {
      if (!VALID_CONTENT_STATUSES.includes(body.status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${VALID_CONTENT_STATUSES.join(", ")}` },
          { status: 400 }
        )
      }
      updateData.status = body.status
    }

    if (body.approval_notes !== undefined) {
      updateData.approval_notes = body.approval_notes
    }

    if (body.scheduled_at !== undefined) {
      updateData.scheduled_at = body.scheduled_at
    }

    const updated = await updateContent(id, updateData)

    if (!updated) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
