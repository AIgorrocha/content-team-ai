import type {
  DashboardStats, Agent, Task, ContentItem, PaginatedResponse,
  Deal, Contact, DealActivity, Subscriber, EmailCampaign,
  Competitor, CompetitorPost, PipelineStage
} from "@/lib/types"
import type { AgentWithTaskCount, AgentDetail } from "@/lib/queries/agents"

async function apiCall<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }))
    throw new Error(error.error || `HTTP ${res.status}`)
  }
  return res.json()
}

export const api = {
  stats: {
    get: () => apiCall<DashboardStats>("/stats"),
  },
  agents: {
    list: () => apiCall<AgentWithTaskCount[]>("/agents"),
    get: (slug: string) => apiCall<AgentDetail>(`/agents/${slug}`),
  },
  content: {
    list: (params?: Record<string, string>) => {
      const qs = params ? `?${new URLSearchParams(params)}` : ""
      return apiCall<PaginatedResponse<ContentItem>>(`/content${qs}`)
    },
    get: (id: string) => apiCall<ContentItem>(`/content/${id}`),
    update: (id: string, data: Partial<ContentItem>) =>
      apiCall<ContentItem>(`/content/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },
  crm: {
    pipeline: () => apiCall<{ stages: Array<PipelineStage & { deals: Array<Deal & { contact_name: string | null }> }> }>("/crm/pipeline"),
    updateDeal: (id: string, data: Partial<Deal>) =>
      apiCall<Deal>(`/crm/deals/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    createDeal: (data: Partial<Deal>) =>
      apiCall<Deal>("/crm/deals", { method: "POST", body: JSON.stringify(data) }),
    contacts: (params?: Record<string, string>) => {
      const qs = params ? `?${new URLSearchParams(params)}` : ""
      return apiCall<PaginatedResponse<Contact>>(`/crm/contacts${qs}`)
    },
    contact: (id: string) => apiCall<{ contact: Contact, activities: DealActivity[] }>(`/crm/contacts/${id}`),
  },
  email: {
    subscribers: (params?: Record<string, string>) => {
      const qs = params ? `?${new URLSearchParams(params)}` : ""
      return apiCall<PaginatedResponse<Subscriber> & { stats: Record<string, number> }>(`/email/subscribers${qs}`)
    },
    campaigns: (params?: Record<string, string>) => {
      const qs = params ? `?${new URLSearchParams(params)}` : ""
      return apiCall<PaginatedResponse<EmailCampaign>>(`/email/campaigns${qs}`)
    },
    campaign: (id: string) => apiCall<EmailCampaign>(`/email/campaigns/${id}`),
  },
  competitors: {
    list: () => apiCall<Competitor[]>("/competitors"),
    get: (id: string, params?: Record<string, string>) => {
      const qs = params ? `?${new URLSearchParams(params)}` : ""
      return apiCall<{ competitor: Competitor, posts: CompetitorPost[], total: number }>(`/competitors/${id}${qs}`)
    },
  },
}
