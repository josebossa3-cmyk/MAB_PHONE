import { NextResponse } from "next/server"
import { findUser, buildSessionCookie } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Correo y contraseña son requeridos" },
        { status: 400 }
      )
    }

    const user = findUser(email, password)
    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      )
    }

    const response = NextResponse.json({ user })
    response.headers.set("Set-Cookie", buildSessionCookie(user))
    return response
  } catch {
    return NextResponse.json(
      { error: "Error del servidor" },
      { status: 500 }
    )
  }
}
