import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
  throw new Error("JWT_SECRET environment variable is not defined");
}
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD environment variable is not defined");
  }

  if (password === adminPassword) {
    // Create the session
    const expires = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
    const session = await encrypt({ admin: true, expires });

    // Save the session in a cookie
    const cookieStore = await cookies();
    cookieStore.set("session", session, { expires, httpOnly: true });
    return true;
  }
  return false;
}

export async function logout() {
  // Destroy the session
  const cookieStore = await cookies();
  cookieStore.set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}
