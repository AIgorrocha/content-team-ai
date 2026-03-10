import { NextRequest, NextResponse } from "next/server"

const COOKIE_NAME = "ct-auth-token"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    const authToken = process.env.AUTH_TOKEN

    if (!authToken) {
      return NextResponse.json(
        { error: "Server not configured" },
        { status: 500 }
      )
    }

    if (token !== authToken) {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 401 }
      )
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    return response
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    )
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete(COOKIE_NAME)
  return response
}
