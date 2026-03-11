import { NextRequest, NextResponse } from "next/server"

const COOKIE_NAME = "ct-auth-token"

const PUBLIC_PATHS = ["/login", "/api/auth", "/api/health"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isApi = pathname.startsWith("/api/")

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  const token = request.cookies.get(COOKIE_NAME)?.value

  const validTokens = ["authenticated", "admin:authenticated", "admin%3Aauthenticated"]
  if (!token || !validTokens.includes(token)) {
    if (isApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
