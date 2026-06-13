import { NextRequest } from "next/server";

// Simple auth check helper - will be replaced with NextAuth in production
export function isAuthenticated(request: NextRequest): boolean {
  // Check for session cookie or auth header
  const authHeader = request.headers.get("authorization");
  const sessionCookie = request.cookies.get("next-auth.session-token");

  return !!(authHeader || sessionCookie);
}

export function isAdmin(request: NextRequest): boolean {
  // In production, decode JWT/session to check role
  return isAuthenticated(request);
}

export function isOperator(request: NextRequest): boolean {
  // In production, decode JWT/session to check role  
  return isAuthenticated(request);
}

// Password hashing helper
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}
