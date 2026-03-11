import { NextRequest } from "next/server"
import { withTenantDB } from "@/lib/route-helper"
import type { Task } from "@/lib/types"

export async function GET(request: NextRequest) {
  return withTenantDB(request, async (db) => {
    const tasks = await db.query<Task & { agent_name: string | null }>(
      `SELECT t.*, a.display_name as agent_name
       FROM ct_tasks t
       LEFT JOIN ct_agents a ON a.slug = t.assigned_agent
       ORDER BY t.updated_at DESC
       LIMIT 50`
    )
    return { data: tasks }
  })
}
