import { getDb } from "../db";
import { rolePermissions, userPermissions, users } from "../../drizzle/schema";
import { eq, and, or, isNull, gt } from "drizzle-orm";

export type UserRole = "super_admin" | "admin" | "conseiller" | "etudiant" | "partenaire" | "user";

/**
 * Default permissions for each role
 * These are the base permissions that can be extended with user-specific permissions
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: [
    // Full access
    "manage_users",
    "manage_roles",
    "manage_permissions",
    "view_all_students",
    "view_all_dossiers",
    "edit_all_dossiers",
    "view_audit_logs",
    "manage_admins",
    "manage_invitations",
    "verify_documents",
    "send_messages",
    "schedule_appointments",
  ],
  admin: [
    // Admin access
    "manage_users",
    "view_all_students",
    "view_all_dossiers",
    "edit_all_dossiers",
    "manage_invitations",
    "verify_documents",
    "send_messages",
    "schedule_appointments",
    "view_audit_logs",
  ],
  conseiller: [
    // Consultant access
    "view_assigned_students",
    "view_assigned_dossiers",
    "edit_assigned_dossiers",
    "send_messages",
    "schedule_appointments",
    "view_documents",
  ],
  etudiant: [
    // Student access
    "view_own_profile",
    "edit_own_profile",
    "view_own_dossiers",
    "upload_documents",
    "send_messages",
    "view_appointments",
  ],
  partenaire: [
    // Partner access
    "view_students",
    "view_dossiers",
    "send_messages",
    "view_appointments",
  ],
  user: [
    // Basic user access
    "view_own_profile",
    "edit_own_profile",
  ],
};

/**
 * Check if a user has a specific permission
 * Checks both role permissions and user-specific permissions
 */
export async function hasPermission(userId: number, permission: string): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;

    // Get user with their role
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user.length) return false;

    const userRole = user[0].role as UserRole;

    // Check role-based permissions
    const rolePerms = DEFAULT_ROLE_PERMISSIONS[userRole] || [];
    if (rolePerms.includes(permission)) return true;

    // Check user-specific permissions (not expired)
    const userPerm = await db
      .select()
      .from(userPermissions)
      .where(
        and(
          eq(userPermissions.userId, userId),
          eq(userPermissions.permission, permission),
          or(isNull(userPermissions.expiresAt), gt(userPermissions.expiresAt, new Date()))
        )
      )
      .limit(1);

    return userPerm.length > 0;
  } catch (error) {
    console.error("Error checking permission:", error);
    return false;
  }
}

/**
 * Check if a user has any of the provided permissions
 */
export async function hasAnyPermission(userId: number, permissions: string[]): Promise<boolean> {
  for (const permission of permissions) {
    if (await hasPermission(userId, permission)) {
      return true;
    }
  }
  return false;
}

/**
 * Check if a user has all of the provided permissions
 */
export async function hasAllPermissions(userId: number, permissions: string[]): Promise<boolean> {
  for (const permission of permissions) {
    if (!(await hasPermission(userId, permission))) {
      return false;
    }
  }
  return true;
}

/**
 * Grant a temporary permission to a user
 */
export async function grantPermission(
  userId: number,
  permission: string,
  grantedBy: number,
  expiresAt?: Date
): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;

    await db.insert(userPermissions).values({
      userId,
      permission,
      grantedBy,
      expiresAt,
    });

    return true;
  } catch (error) {
    console.error("Error granting permission:", error);
    return false;
  }
}

/**
 * Revoke a user permission
 */
export async function revokePermission(userId: number, permission: string): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;

    await db
      .delete(userPermissions)
      .where(and(eq(userPermissions.userId, userId), eq(userPermissions.permission, permission)));

    return true;
  } catch (error) {
    console.error("Error revoking permission:", error);
    return false;
  }
}

/**
 * Get all permissions for a user (role + custom)
 */
export async function getUserPermissions(userId: number): Promise<string[]> {
  try {
    const db = await getDb();
    if (!db) return [];

    // Get user role
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user.length) return [];

    const userRole = user[0].role as UserRole;
    const rolePerms = DEFAULT_ROLE_PERMISSIONS[userRole] || [];

    // Get active user-specific permissions
    const customPerms = await db
      .select()
      .from(userPermissions)
      .where(
        and(
          eq(userPermissions.userId, userId),
          or(isNull(userPermissions.expiresAt), gt(userPermissions.expiresAt, new Date()))
        )
      );

    const customPermStrings = customPerms.map((p) => p.permission);

    // Combine and deduplicate
    const combined = rolePerms.concat(customPermStrings);
    const unique = combined.filter((value, index, self) => self.indexOf(value) === index);
    return unique;
  } catch (error) {
    console.error("Error getting user permissions:", error);
    return [];
  }
}

/**
 * Check if user can view another user's profile
 */
export async function canViewUser(viewerId: number, targetUserId: number): Promise<boolean> {
  if (viewerId === targetUserId) return true; // Can always view own profile

  // Check if viewer has permission to view all students
  if (await hasPermission(viewerId, "view_all_students")) return true;

  // Check if viewer is assigned as consultant to target
  // (This would need a consultants/assignments table)

  return false;
}

/**
 * Check if user can edit a dossier
 */
export async function canEditDossier(userId: number, dossierId: number): Promise<boolean> {
  // Can edit if user has permission to edit all dossiers
  if (await hasPermission(userId, "edit_all_dossiers")) return true;

  // Can edit if user is assigned as consultant to the dossier's student
  // (This would need to check the assignment)

  return false;
}

/**
 * Check if user can verify documents
 */
export async function canVerifyDocuments(userId: number): Promise<boolean> {
  return await hasPermission(userId, "verify_documents");
}

/**
 * Check if user can manage users
 */
export async function canManageUsers(userId: number): Promise<boolean> {
  return await hasPermission(userId, "manage_users");
}

/**
 * Check if user can manage invitations
 */
export async function canManageInvitations(userId: number): Promise<boolean> {
  return await hasPermission(userId, "manage_invitations");
}
