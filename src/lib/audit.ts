import { prisma } from "@/lib/db";

interface AuditLogInput {
  userId?: string | null;
  userName?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: string | null;
  ipAddress?: string | null;
}

/**
 * Create an audit log entry.
 * Fire-and-forget — does not throw.
 */
export async function logAudit(input: AuditLogInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: input.userId ?? null,
        userName: input.userName ?? null,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId ?? null,
        details: input.details ?? null,
        ipAddress: input.ipAddress ?? null,
      },
    });
  } catch (error) {
    console.error("[AuditLog] Failed to write audit log:", error);
  }
}
