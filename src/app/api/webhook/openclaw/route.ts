import { NextRequest, NextResponse } from "next/server"
import { validateApiKey } from "@/lib/api-key"
import { getTenantDB } from "@/lib/tenant-db"

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get("x-api-key")
    if (!apiKey) {
      return NextResponse.json({ error: "Missing X-API-Key" }, { status: 401 })
    }

    const result = await validateApiKey(apiKey)
    if (!result) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    const db = getTenantDB(result.databaseUrl)
    const body = await request.json()
    const { type, payload } = body

    switch (type) {
      case "task_update": {
        await db.query(
          `UPDATE ct_tasks SET status = $1, result = $2, updated_at = NOW()
           WHERE id = $3`,
          [payload.status, JSON.stringify(payload.result ?? {}), payload.task_id]
        )
        break
      }

      case "content_push": {
        await db.query(
          `INSERT INTO ct_content_items (title, content_type, status, platform, caption, hashtags, script, visual_notes, media_urls, source_agent, metadata)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [
            payload.title,
            payload.content_type ?? "post",
            payload.status ?? "draft",
            payload.platform ?? null,
            payload.caption ?? null,
            payload.hashtags ?? [],
            payload.script ?? null,
            payload.visual_notes ?? null,
            payload.media_urls ?? [],
            payload.source_agent ?? null,
            JSON.stringify(payload.metadata ?? {}),
          ]
        )
        break
      }

      case "agent_status": {
        await db.query(
          `UPDATE ct_agents SET status = $1, last_active_at = NOW()
           WHERE slug = $2`,
          [payload.status, payload.agent_slug]
        )
        break
      }

      case "task_completed": {
        if (payload.task_id) {
          await db.query(
            `UPDATE ct_tasks SET status = 'completed', result = $1, completed_at = NOW(), updated_at = NOW()
             WHERE id = $2`,
            [JSON.stringify(payload.result ?? {}), payload.task_id]
          )
        }
        if (payload.agent_slug) {
          await db.query(
            `UPDATE ct_agents SET status = 'idle', last_active_at = NOW() WHERE slug = $1`,
            [payload.agent_slug]
          )
        }
        if (payload.content) {
          await db.query(
            `INSERT INTO ct_content_items (title, content_type, status, platform, caption, hashtags, source_agent, metadata)
             VALUES ($1, $2, 'review', $3, $4, $5, $6, $7)`,
            [
              payload.content.title ?? "Conteúdo do agente",
              payload.content.content_type ?? "post",
              payload.content.platform ?? null,
              payload.content.caption ?? null,
              payload.content.hashtags ?? [],
              payload.agent_slug ?? null,
              JSON.stringify(payload.content.metadata ?? {}),
            ]
          )
        }
        break
      }

      default:
        return NextResponse.json(
          { error: `Unknown event type: ${type}` },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
