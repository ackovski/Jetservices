import { getDb } from "../db";
import { users, identityDocuments, auditLogs, passwordResets } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * GDPR Compliance - Data rights and privacy
 */

/**
 * Export user data in GDPR-compliant format
 */
export async function exportUserData(userId: number): Promise<any> {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Get user profile
    const user = await db.select().from(users).where(eq(users.id, userId));

    if (!user || user.length === 0) {
      throw new Error("User not found");
    }

    // Get user documents
    const docs = await db
      .select()
      .from(identityDocuments)
      .where(eq(identityDocuments.userId, userId));

    // Get user audit logs
    const logs = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.userId, userId));

    return {
      exportDate: new Date().toISOString(),
      user: {
        id: user[0].id,
        email: user[0].email,
        name: user[0].name,
        role: user[0].role,
        createdAt: user[0].createdAt,
        updatedAt: user[0].updatedAt,
      },
      documents: docs.map((doc: any) => ({
        id: doc.id,
        type: doc.documentType,
        status: doc.verificationStatus,
        uploadedAt: doc.uploadedAt,
        verifiedAt: doc.verifiedAt,
      })),
      auditLogs: logs.map((log: any) => ({
        action: log.action,
        timestamp: log.timestamp,
        status: log.status,
        ipAddress: log.ipAddress,
      })),
    };
  } catch (error) {
    console.error("[GDPR] Error exporting user data:", error);
    throw error;
  }
}

/**
 * Delete user account and all associated data (right to be forgotten)
 */
export async function deleteUserAccount(userId: number): Promise<void> {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Delete identity documents
    await db.delete(identityDocuments).where(eq(identityDocuments.userId, userId));

    // Delete password reset tokens
    await db.delete(passwordResets).where(eq(passwordResets.userId, userId));

    // Anonymize user data instead of deleting (better for audit trail)
    await db
      .update(users)
      .set({
        email: `deleted-${userId}@deleted.local`,
        name: "Deleted User",
        password: null,
        openId: `deleted-${userId}`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    console.log(`[GDPR] User ${userId} account deleted (anonymized)`);
  } catch (error) {
    console.error("[GDPR] Error deleting user account:", error);
    throw error;
  }
}

/**
 * Anonymize user data for privacy
 */
export async function anonymizeUser(userId: number): Promise<void> {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    await db
      .update(users)
      .set({
        name: "Anonymous User",
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    console.log(`[GDPR] User ${userId} anonymized`);
  } catch (error) {
    console.error("[GDPR] Error anonymizing user:", error);
    throw error;
  }
}

/**
 * Get user consent status
 */
export interface ConsentStatus {
  marketing: boolean;
  analytics: boolean;
  thirdParty: boolean;
  lastUpdated: Date;
}

// In production, store this in a separate table
const consentStore: Map<number, ConsentStatus> = new Map();

export function getConsent(userId: number): ConsentStatus {
  return (
    consentStore.get(userId) || {
      marketing: false,
      analytics: false,
      thirdParty: false,
      lastUpdated: new Date(),
    }
  );
}

export function updateConsent(userId: number, consent: ConsentStatus): void {
  consentStore.set(userId, {
    ...consent,
    lastUpdated: new Date(),
  });
  console.log(`[GDPR] Consent updated for user ${userId}`);
}
