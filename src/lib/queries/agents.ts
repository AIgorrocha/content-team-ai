import { query } from "@/lib/db"
import type { Agent, Task } from "@/lib/types"

export interface AgentWithTaskCount extends Agent {
  pending_tasks: number
}

export async function listAgents(): Promise<AgentWithTaskCount[]> {
  const rows = await query<AgentWithTaskCount>(`
    SELECT
      a.*,
      COALESCE((
        SELECT COUNT(*)::int FROM ct_tasks
        WHERE assigned_agent = a.slug AND status = 'pending'
      ), 0) as pending_tasks
    FROM ct_agents a
    ORDER BY
      CASE a.status
        WHEN 'active' THEN 0
        WHEN 'idle' THEN 1
        WHEN 'error' THEN 2
      END,
      a.display_name
  `)
  return rows
}

export async function getAgentBySlug(slug: string): Promise<Agent | null> {
  const rows = await query<Agent>(
    "SELECT * FROM ct_agents WHERE slug = $1",
    [slug]
  )
  return rows[0] ?? null
}

export async function getAgentTasks(slug: string, limit = 20): Promise<Task[]> {
  return query<Task>(
    `SELECT * FROM ct_tasks
     WHERE assigned_agent = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [slug, limit]
  )
}

export interface AgentDetail {
  agent: Agent
  tasks: Task[]
  pendingTasks: number
}

export async function getAgentDetail(slug: string): Promise<AgentDetail | null> {
  const agent = await getAgentBySlug(slug)
  if (!agent) return null

  const tasks = await getAgentTasks(slug)
  const [countRow] = await query<{ count: string }>(
    "SELECT COUNT(*)::text as count FROM ct_tasks WHERE assigned_agent = $1 AND status = 'pending'",
    [slug]
  )

  return {
    agent,
    tasks,
    pendingTasks: parseInt(countRow?.count ?? "0"),
  }
}
