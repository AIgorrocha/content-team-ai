import type { TenantDB } from "@/lib/tenant-db"
import { getServiceCredentials } from "@/lib/queries/credentials"

interface OpenClawConfig {
  gatewayUrl: string
  gatewayToken: string | null
}

async function getOpenClawConfig(db: TenantDB): Promise<OpenClawConfig> {
  const creds = await getServiceCredentials(db, "openclaw")
  const gatewayUrl = creds.gateway_url
  if (!gatewayUrl) throw new Error("OpenClaw não configurado")

  return {
    gatewayUrl: gatewayUrl.replace(/\/$/, ""),
    gatewayToken: creds.gateway_token || null,
  }
}

function buildHeaders(token: string | null): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (token) headers["Authorization"] = `Bearer ${token}`
  return headers
}

export async function openclawHealth(db: TenantDB): Promise<boolean> {
  try {
    const config = await getOpenClawConfig(db)
    const res = await fetch(`${config.gatewayUrl}/healthz`, {
      headers: buildHeaders(config.gatewayToken),
      signal: AbortSignal.timeout(5000),
    })
    return res.ok
  } catch {
    return false
  }
}

export interface ChatCompletionRequest {
  agentId: string
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>
  temperature?: number
  maxTokens?: number
}

export interface ChatCompletionResponse {
  id: string
  choices: Array<{
    message: { role: string; content: string }
    finish_reason: string
  }>
}

export async function openclawChatCompletion(
  db: TenantDB,
  request: ChatCompletionRequest
): Promise<ChatCompletionResponse> {
  const config = await getOpenClawConfig(db)
  const headers = buildHeaders(config.gatewayToken)
  headers["x-openclaw-agent-id"] = request.agentId

  const res = await fetch(`${config.gatewayUrl}/v1/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      messages: request.messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens ?? 4096,
    }),
    signal: AbortSignal.timeout(60000),
  })

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error")
    throw new Error(`OpenClaw error ${res.status}: ${errorText}`)
  }

  return res.json()
}

export async function openclawListSessions(db: TenantDB): Promise<Array<{ id: string; agent: string; status: string }>> {
  const config = await getOpenClawConfig(db)
  const res = await fetch(`${config.gatewayUrl}/api/sessions`, {
    headers: buildHeaders(config.gatewayToken),
    signal: AbortSignal.timeout(10000),
  })

  if (!res.ok) return []
  return res.json()
}

export async function openclawCreateWorkspace(
  db: TenantDB,
  agentSlug: string,
  agentsMd: string,
  soulMd: string
): Promise<{ sessionId: string; workspace: string }> {
  const config = await getOpenClawConfig(db)

  const res = await fetch(`${config.gatewayUrl}/api/workspaces`, {
    method: "POST",
    headers: buildHeaders(config.gatewayToken),
    body: JSON.stringify({
      agent_id: agentSlug,
      files: {
        "AGENTS.md": agentsMd,
        "SOUL.md": soulMd,
      },
    }),
    signal: AbortSignal.timeout(30000),
  })

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error")
    throw new Error(`Failed to create workspace for ${agentSlug}: ${errorText}`)
  }

  return res.json()
}
