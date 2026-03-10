import { query } from "@/lib/db"
import type { DashboardStats, ContentItem } from "@/lib/types"

export async function getDashboardStats(): Promise<DashboardStats> {
  const [agentStats] = await query<{
    total: string
    active: string
    idle: string
    error: string
  }>(`
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'active') as active,
      COUNT(*) FILTER (WHERE status = 'idle') as idle,
      COUNT(*) FILTER (WHERE status = 'error') as error
    FROM ct_agents
  `)

  const [contentStats] = await query<{
    this_week: string
    pending_approval: string
    scheduled: string
  }>(`
    SELECT
      COUNT(*) FILTER (WHERE scheduled_at >= date_trunc('week', CURRENT_DATE) AND scheduled_at < date_trunc('week', CURRENT_DATE) + interval '7 days') as this_week,
      COUNT(*) FILTER (WHERE approval_status = 'pending') as pending_approval,
      COUNT(*) FILTER (WHERE status = 'scheduled') as scheduled
    FROM ct_content_items
  `)

  const [pipelineTotal] = await query<{
    total_deals: string
    total_value: string
  }>(`
    SELECT
      COUNT(*) as total_deals,
      COALESCE(SUM(value), 0) as total_value
    FROM ct_deals
    WHERE status = 'open'
  `)

  const pipelineByStage = await query<{
    name: string
    count: string
    value: string
  }>(`
    SELECT
      ps.name,
      COUNT(d.id) as count,
      COALESCE(SUM(d.value), 0) as value
    FROM ct_pipeline_stages ps
    LEFT JOIN ct_deals d ON d.stage_id = ps.id AND d.status = 'open'
    GROUP BY ps.id, ps.name, ps.position
    ORDER BY ps.position
  `)

  const [emailStats] = await query<{
    total_subscribers: string
    campaigns_sent: string
  }>(`
    SELECT
      (SELECT COUNT(*) FROM ct_subscribers WHERE status = 'active') as total_subscribers,
      (SELECT COUNT(*) FROM ct_email_campaigns WHERE status = 'sent') as campaigns_sent
  `)

  const nextContent = await query<ContentItem>(`
    SELECT * FROM ct_content_items
    WHERE scheduled_at > NOW() AND status IN ('approved', 'scheduled')
    ORDER BY scheduled_at ASC
    LIMIT 1
  `)

  return {
    agents: {
      total: parseInt(agentStats?.total ?? "0"),
      active: parseInt(agentStats?.active ?? "0"),
      idle: parseInt(agentStats?.idle ?? "0"),
      error: parseInt(agentStats?.error ?? "0"),
    },
    content: {
      thisWeek: parseInt(contentStats?.this_week ?? "0"),
      pendingApproval: parseInt(contentStats?.pending_approval ?? "0"),
      scheduled: parseInt(contentStats?.scheduled ?? "0"),
    },
    pipeline: {
      totalDeals: parseInt(pipelineTotal?.total_deals ?? "0"),
      totalValue: parseFloat(pipelineTotal?.total_value ?? "0"),
      byStage: pipelineByStage.map((s) => ({
        name: s.name,
        count: parseInt(s.count),
        value: parseFloat(s.value),
      })),
    },
    email: {
      totalSubscribers: parseInt(emailStats?.total_subscribers ?? "0"),
      campaignsSent: parseInt(emailStats?.campaigns_sent ?? "0"),
    },
    nextContent: nextContent[0] ?? null,
  }
}
