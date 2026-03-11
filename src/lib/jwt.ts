import jwt from "jsonwebtoken"

export interface SessionPayload {
  userId: string
  tenantId: string
  role: string
}

const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production"
const JWT_EXPIRES_IN = "30d"

export function signToken(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload
  } catch {
    return null
  }
}
