import { NextRequest, NextResponse } from "next/server"

const COOKIE_NAME = "ct-auth-token"

export function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value
  const authToken = process.env.AUTH_TOKEN

  const isLoginPage = request.nextUrl.pathname === "/login"
  const isApiAuth = request.nextUrl.pathname === "/api/auth"
  const isApiHealth = request.nextUrl.pathname === "/api/health"
  const isApi = request.nextUrl.pathname.startsWith("/api/")

  // Allow login page, auth endpoint, and health check
  if (isLoginPage || isApiAuth || isApiHealth) {
    return NextResponse.next()
  }

  // Check auth
  if (!token || token !== authToken) {
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
