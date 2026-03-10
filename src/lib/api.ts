import type { DashboardStats, Agent, Task, ContentItem, PaginatedResponse } from "@/lib/types"
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
}
