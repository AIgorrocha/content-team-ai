import { NextRequest } from "next/server"
import { withTenantDB } from "@/lib/route-helper"
import { provisionAllAgents } from "@/lib/integrations/agent-provisioner"
import { getBrandProfile } from "@/lib/queries/brand-profile"

export async function POST(request: NextRequest) {
  return withTenantDB(request, async (db) => {
    const profile = await getBrandProfile(db)
    const brandContext = profile
      ? JSON.stringify({
          voice: profile.brand_voice,
          visual: profile.visual_identity,
          strategy: profile.content_strategy,
          audience: profile.audience,
        })
      : "No brand profile configured yet."

    const results = await provisionAllAgents(db, brandContext)

    const successful = results.filter((r) => r.success).length
    const failed = results.filter((r) => !r.success).length

    return {
      data: {
        results,
        summary: { total: results.length, successful, failed },
      },
    }
  })
}
