import { getDb } from "../db";
import { auditLogs } from "../../drizzle/schema";
import { eq, and, gte, lte } from "drizzle-orm";

/**
 * Audit Logger - Tracks all critical actions for compliance and security
 */

export enum AuditAction {
  // Authentication
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  SIGNUP = "SIGNUP",
  PASSWORD_RESET = "PASSWORD_RESET",
  PASSWORD_CHANGE = "PASSWORD_CHANGE",

  // Documents
  DOCUMENT_UPLOAD = "DOCUMENT_UPLOAD",
  DOCUMENT_VERIFY = "DOCUMENT_VERIFY",
  DOCUMENT_REJECT = "DOCUMENT_REJECT",
  DOCUMENT_DELETE = "DOCUMENT_DELETE",

  // Permissions
  PERMISSION_GRANT = "PERMISSION_GRANT",
  PERMISSION_REVOKE = "PERMISSION_REVOKE",
  ROLE_CHANGE = "ROLE_CHANGE",

  // Invitations
  INVITATION_SEND = "INVITATION_SEND",
  INVITATION_ACCEPT = "INVITATION_ACCEPT",

  // Data Access
  DATA_ACCESS = "DATA_ACCESS",
  DATA_EXPORT = "DATA_EXPORT",
  DATA_DELETE = "DATA_DELETE",

  // Admin Actions
  USER_SUSPEND = "USER_SUSPEND",
  USER_ACTIVATE = "USER_ACTIVATE",
}

export interface AuditLogEntry {
  action: AuditAction;
  userId?: number;
  targetUserId?: number;
  resourceType?: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status: "success" | "failure";
  errorMessage?: string;
}

export async function logAuditAction(entry: AuditLogEntry): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;
    await db.insert(auditLogs).values({
      action: entry.action,
      userId: entry.userId,
      targetUserId: entry.targetUserId,
      resourceType: entry.resourceType,
      resourceId: entry.resourceId,
      details: entry.details ? JSON.stringify(entry.details) : null,
      ipAddress: entry.ipAddress,
      userAgent: entry.userAgent,
      status: entry.status,
      errorMessage: entry.errorMessage,
      timestamp: new Date(),
    });

    console.log(`[Audit] ${entry.action} - ${entry.status}`, {
      userId: entry.userId,
      resource: entry.resourceType,
      resourceId: entry.resourceId,
    });
  } catch (error) {
    console.error("[Audit] Failed to log action:", error);
    // Don't throw - audit logging should not break the application
  }
}

export async function getAuditLogs(
  filters?: {
    userId?: number;
    action?: AuditAction;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }
): Promise<any[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    
    const conditions: any[] = [];
    
    if (filters?.userId) {
      conditions.push(eq(auditLogs.userId, filters.userId));
    }

    if (filters?.action) {
      conditions.push(eq(auditLogs.action, filters.action));
    }

    if (filters?.startDate) {
      conditions.push(gte(auditLogs.timestamp, filters.startDate));
    }

    if (filters?.endDate) {
      conditions.push(lte(auditLogs.timestamp, filters.endDate));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const result = await db
      .select()
      .from(auditLogs)
      .where(whereClause)
      .limit(filters?.limit || 100);
    return result;
  } catch (error) {
    console.error("[Audit] Failed to retrieve logs:", error);
    return [];
  }
}
