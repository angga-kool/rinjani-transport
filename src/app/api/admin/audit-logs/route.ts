import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const entity = searchParams.get("entity");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (entity) where.entity = entity;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return NextResponse.json({
      logs: logs.map((l) => ({
        id: l.id,
        userId: l.userId,
        userName: l.userName,
        action: l.action,
        entity: l.entity,
        entityId: l.entityId,
        details: l.details,
        ipAddress: l.ipAddress,
        createdAt: l.createdAt.toISOString(),
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[API GET /admin/audit-logs]", error);
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
  }
}
