import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_EMAIL = "anida.store.mid@gmail.com";
const ADMIN_EMAIL_2 = "anidabyad@gmail.com";
const ADMIN_PASSWORD = "Hermanos_2001";
const SESSION_COOKIE = "anida_admin_session";
const SESSION_VALUE = "authenticated_admin_2025";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const cleanEmail = (email || "").trim().toLowerCase();
    const isValidEmail =
      cleanEmail === ADMIN_EMAIL.toLowerCase() ||
      cleanEmail === ADMIN_EMAIL_2.toLowerCase();
    const isValidPassword = password === ADMIN_PASSWORD;

    if (!isValidEmail || !isValidPassword) {
      return NextResponse.json(
        { success: false, error: "Correo o contraseña incorrectos." },
        { status: 401 }
      );
    }

    // Setear cookie httpOnly segura — no accesible desde JavaScript del cliente
    const cookieStore = cookies();
    cookieStore.set(SESSION_COOKIE, SESSION_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e?.message || "Error interno" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE);
  return NextResponse.json({ success: true });
}
