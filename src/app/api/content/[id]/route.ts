import { NextRequest, NextResponse } from "next/server"
import { withTenantDB } from "@/lib/route-helper"
import { getContentById, updateContent } from "@/lib/queries/content"
import type { ApprovalStatus, ContentStatus } from "@/lib/types"

const VALID_APPROVAL_STATUSES: ApprovalStatus[] = ["pending", "approved", "rejected"]
const VALID_CONTENT_STATUSES: ContentStatus[] = ["idea", "draft", "review", "approved", "scheduled", "published", "rejected"]

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  return withTenantDB(request, async (db) => {
    const { id } = await params
    const item = await getContentById(db, id)
    if (!item) throw new Error("Content not found")
    return item
  })
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const body = await request.json()

  if (body.approval_status !== undefined && !VALID_APPROVAL_STATUSES.includes(body.approval_status)) {
    return NextResponse.json(
      { error: `Invalid approval_status. Must be one of: ${VALID_APPROVAL_STATUSES.join(", ")}` },
      { status: 400 }
    )
  }

  if (body.status !== undefined && !VALID_CONTENT_STATUSES.includes(body.status)) {
    return NextResponse.json(
      { error: `Invalid status. Must be one of: ${VALID_CONTENT_STATUSES.join(", ")}` },
      { status: 400 }
    )
  }

  return withTenantDB(request, async (db) => {
    const updateData: Record<string, unknown> = {}
    if (body.approval_status !== undefined) updateData.approval_status = body.approval_status
    if (body.status !== undefined) updateData.status = body.status
    if (body.approval_notes !== undefined) updateData.approval_notes = body.approval_notes
    if (body.scheduled_at !== undefined) updateData.scheduled_at = body.scheduled_at

    const updated = await updateContent(db, id, updateData)
    if (!updated) throw new Error("Content not found")
    return updated
  })
}
