import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

const PUBLIC_PATHS = ["/login", "/signup", "/onboarding", "/api/auth", "/api/health", "/api/webhook", "/api/billing/plans"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isApi = pathname.startsWith("/api/")

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // API routes: accept session cookie OR X-API-Key
  if (isApi) {
    const apiKey = request.headers.get("x-api-key")
    if (apiKey) {
      // API key validation happens in route handler (needs DB)
      return NextResponse.next()
    }
  }

  // Check session cookie
  const sessionToken = request.cookies.get("ct-session")?.value
  if (!sessionToken) {
    if (isApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const session = verifyToken(sessionToken)
  if (!session) {
    if (isApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.delete("ct-session")
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
