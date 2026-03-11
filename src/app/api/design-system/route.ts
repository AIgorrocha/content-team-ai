import { NextResponse } from "next/server"
import { getDesignSystem, updateDesignSystem } from "@/lib/queries/design-system"

export async function GET() {
  try {
    const ds = await getDesignSystem()
    return NextResponse.json({ data: ds })
  } catch (error) {
    console.error("GET /api/design-system failed:", error)
    return NextResponse.json(
      { error: "Failed to fetch design system" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const updated = await updateDesignSystem(body)
    return NextResponse.json({ data: updated })
  } catch (error) {
    console.error("PATCH /api/design-system failed:", error)
    return NextResponse.json(
      { error: "Failed to update design system" },
      { status: 500 }
    )
  }
}
