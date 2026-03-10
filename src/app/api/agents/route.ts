import { NextResponse } from "next/server"
import { listAgents } from "@/lib/queries/agents"

export async function GET() {
  try {
    const agents = await listAgents()
    return NextResponse.json(agents)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
