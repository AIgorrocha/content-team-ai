import { NextRequest } from "next/server"
import { withTenantDB } from "@/lib/route-helper"

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  return withTenantDB(request, async (db) => {
    const agent = await db.queryOne<{
      slug: string
      status: string
      last_active_at: string | null
    }>(
      `SELECT slug, status, last_active_at FROM ct_agents WHERE slug = $1`,
      [params.slug]
    )

    if (!agent) throw new Error("Agent not found")

    const openclaw = await db.queryOne<{
      openclaw_session_id: string | null
      status: string
      provisioned_at: string | null
      error_message: string | null
    }>(
      `SELECT openclaw_session_id, status, provisioned_at, error_message FROM ct_agent_openclaw WHERE agent_slug = $1`,
      [params.slug]
    )

    const [taskStats] = await db.query<{ pending: string; in_progress: string; completed: string }>(
      `SELECT
        COUNT(*) FILTER (WHERE status = 'pending')::text as pending,
        COUNT(*) FILTER (WHERE status = 'in_progress')::text as in_progress,
        COUNT(*) FILTER (WHERE status = 'completed')::text as completed
       FROM ct_tasks WHERE assigned_agent = $1`,
      [params.slug]
    )

    return {
      data: {
        ...agent,
        openclaw: openclaw ?? null,
        tasks: {
          pending: parseInt(taskStats?.pending ?? "0"),
          inProgress: parseInt(taskStats?.in_progress ?? "0"),
          completed: parseInt(taskStats?.completed ?? "0"),
        },
      },
    }
  })
}
