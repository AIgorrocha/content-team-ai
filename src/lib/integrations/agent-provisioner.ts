import { readFileSync, readdirSync } from "fs"
import { join } from "path"
import { parse } from "yaml"
import type { TenantDB } from "@/lib/tenant-db"
import { openclawCreateWorkspace } from "./openclaw-client"

interface AgentYaml {
  agent: {
    metadata: { id: string; name: string; title: string; icon: string }
    persona: { role: string; identity: string; communication_style: string; principles: string[] }
    capabilities: string[]
    configuration: { model: string; temperature: number; max_tokens: number }
  }
}

function loadAgentYamls(): AgentYaml[] {
  const agentsDir = join(process.cwd(), "agents")
  const files = readdirSync(agentsDir).filter((f) => f.endsWith(".agent.yaml"))

  return files.map((file) => {
    const content = readFileSync(join(agentsDir, file), "utf-8")
    return parse(content) as AgentYaml
  })
}

function buildAgentsMd(yaml: AgentYaml, brandContext: string): string {
  const { metadata, persona, capabilities } = yaml.agent
  return `# ${metadata.name} (${metadata.title})
${metadata.icon} Agent

## Role
${persona.role}

## Identity
${persona.identity}

## Communication Style
${persona.communication_style}

## Principles
${persona.principles.map((p) => `- ${p}`).join("\n")}

## Capabilities
${capabilities.map((c) => `- ${c}`).join("\n")}

## Brand Context
${brandContext}
`
}

function buildSoulMd(yaml: AgentYaml): string {
  const { metadata, persona } = yaml.agent
  return `# Soul of ${metadata.name}

You are ${metadata.name}, ${persona.role}.

${persona.identity}

Your communication style: ${persona.communication_style}

Always follow these principles:
${persona.principles.map((p) => `- ${p}`).join("\n")}
`
}

export interface ProvisionResult {
  slug: string
  name: string
  success: boolean
  sessionId?: string
  workspace?: string
  error?: string
}

export async function provisionAllAgents(
  db: TenantDB,
  brandContext: string
): Promise<ProvisionResult[]> {
  const yamls = loadAgentYamls()
  const results: ProvisionResult[] = []

  for (const yaml of yamls) {
    const slug = yaml.agent.metadata.id.replace("agents/", "")
    const name = yaml.agent.metadata.name

    try {
      const agentsMd = buildAgentsMd(yaml, brandContext)
      const soulMd = buildSoulMd(yaml)

      const { sessionId, workspace } = await openclawCreateWorkspace(db, slug, agentsMd, soulMd)

      await db.query(
        `INSERT INTO ct_agent_openclaw (agent_slug, openclaw_session_id, openclaw_workspace, provisioned_at, status)
         VALUES ($1, $2, $3, NOW(), 'active')
         ON CONFLICT (agent_slug)
         DO UPDATE SET openclaw_session_id = $2, openclaw_workspace = $3, provisioned_at = NOW(), status = 'active', updated_at = NOW()`,
        [slug, sessionId, workspace]
      )

      await db.query(
        `UPDATE ct_agents SET status = 'active', last_active_at = NOW() WHERE slug = $1`,
        [slug]
      )

      results.push({ slug, name, success: true, sessionId, workspace })
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error"

      await db.query(
        `INSERT INTO ct_agent_openclaw (agent_slug, status, error_message)
         VALUES ($1, 'error', $2)
         ON CONFLICT (agent_slug)
         DO UPDATE SET status = 'error', error_message = $2, updated_at = NOW()`,
        [slug, errorMsg]
      )

      results.push({ slug, name, success: false, error: errorMsg })
    }
  }

  return results
}
