import { NextResponse } from "next/server"
import { listCompetitors } from "@/lib/queries/competitors"

export async function GET() {
  try {
    const competitors = await listCompetitors()
    return NextResponse.json(competitors)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
