import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  // Mock admin authentication - will use NextAuth + Prisma in production
  if (email === "admin@rinjanitransport.com" && password === "admin123") {
    return NextResponse.json({
      success: true,
      user: {
        id: "admin-1",
        name: "Admin",
        email: "admin@rinjanitransport.com",
        role: "admin",
      },
      token: "mock-jwt-token-admin",
    });
  }

  return NextResponse.json(
    { error: "Invalid email or password" },
    { status: 401 }
  );
}
