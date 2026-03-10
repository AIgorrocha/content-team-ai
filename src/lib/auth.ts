import { cookies } from "next/headers"

const COOKIE_NAME = "ct-auth-token"

export function validateToken(token: string): boolean {
  const authToken = process.env.AUTH_TOKEN
  if (!authToken) {
    throw new Error("AUTH_TOKEN environment variable not configured")
  }
  return token === authToken
}

export function getAuthToken(): string | null {
  const cookieStore = cookies()
  return cookieStore.get(COOKIE_NAME)?.value ?? null
}

export function isAuthenticated(): boolean {
  const token = getAuthToken()
  if (!token) return false
  return validateToken(token)
}

export { COOKIE_NAME }
