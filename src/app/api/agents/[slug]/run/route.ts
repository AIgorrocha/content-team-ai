import { NextRequest } from "next/server"
import { withTenantDB } from "@/lib/route-helper"
import { openclawChatCompletion } from "@/lib/integrations/openclaw-client"
import { getBrandProfile } from "@/lib/queries/brand-profile"
import { z } from "zod"

const runSchema = z.object({
  prompt: z.string().min(1),
  context: z.record(z.unknown()).optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  return withTenantDB(request, async (db) => {
    const body = await request.json()
    const { prompt, context } = runSchema.parse(body)

    const profile = await getBrandProfile(db)
    const brandSnippet = profile
      ? `Brand voice: ${profile.brand_voice?.tone ?? "neutral"}. Audience: ${profile.audience?.description ?? "general"}.`
      : ""

    const systemMessage = [
      `You are the ${params.slug} agent.`,
      brandSnippet,
      context ? `Additional context: ${JSON.stringify(context)}` : "",
    ]
      .filter(Boolean)
      .join("\n")

    // Create task record
    const [task] = await db.query<{ id: string }>(
      `INSERT INTO ct_tasks (title, description, assigned_agent, status, priority)
       VALUES ($1, $2, $3, 'in_progress', 1)
       RETURNING id`,
      [prompt.slice(0, 100), prompt, params.slug]
    )

    try {
      const response = await openclawChatCompletion(db, {
        agentId: params.slug,
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt },
        ],
      })

      const resultContent = response.choices[0]?.message?.content ?? ""

      await db.query(
        `UPDATE ct_tasks SET status = 'completed', result = $1, completed_at = NOW(), updated_at = NOW()
         WHERE id = $2`,
        [JSON.stringify({ content: resultContent }), task.id]
      )

      await db.query(
        `UPDATE ct_agents SET status = 'active', last_active_at = NOW() WHERE slug = $1`,
        [params.slug]
      )

      return { data: { taskId: task.id, result: resultContent } }
    } catch (error) {
      await db.query(
        `UPDATE ct_tasks SET status = 'failed', result = $1, updated_at = NOW() WHERE id = $2`,
        [JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), task.id]
      )
      throw error
    }
  })
}
