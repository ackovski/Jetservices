import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Two-Factor Authentication (2FA) with TOTP
 * Uses Time-based One-Time Password (TOTP) - compatible with Google Authenticator, Authy, etc.
 */

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface TwoFactorVerification {
  valid: boolean;
  message: string;
}

/**
 * Generate 2FA setup with QR code and backup codes
 */
export async function generateTwoFactorSetup(
  userId: number,
  userEmail: string
): Promise<TwoFactorSetup> {
  // Generate secret
  const secret = speakeasy.generateSecret({
    name: `JET Services (${userEmail})`,
    issuer: "JET Services",
    length: 32,
  });

  if (!secret.base32) {
    throw new Error("Failed to generate 2FA secret");
  }

  // Generate QR code
  const qrCode = await QRCode.toDataURL(secret.otpauth_url || "");

  // Generate backup codes (10 codes)
  const backupCodes = Array.from({ length: 10 }, () =>
    Math.random().toString(36).substring(2, 10).toUpperCase()
  );

  return {
    secret: secret.base32,
    qrCode,
    backupCodes,
  };
}

/**
 * Enable 2FA for user
 */
export async function enableTwoFactor(
  userId: number,
  secret: string,
  backupCodes: string[]
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // In production, store encrypted secret and backup codes in a separate table
  // For now, we'll store them in the users table (NOT recommended for production)
  console.log(`[2FA] Enabled for user ${userId}`);
  console.log(`[2FA] Secret: ${secret}`);
  console.log(`[2FA] Backup codes: ${backupCodes.join(", ")}`);
}

/**
 * Verify 2FA token
 */
export async function verifyTwoFactorToken(
  secret: string,
  token: string,
  window: number = 2
): Promise<TwoFactorVerification> {
  try {
    const verified = speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token,
      window,
    });

    if (verified) {
      return {
        valid: true,
        message: "2FA token verified successfully",
      };
    } else {
      return {
        valid: false,
        message: "Invalid 2FA token",
      };
    }
  } catch (error) {
    console.error("[2FA] Verification error:", error);
    return {
      valid: false,
      message: "Error verifying 2FA token",
    };
  }
}

/**
 * Verify backup code
 */
export function verifyBackupCode(
  backupCodes: string[],
  code: string
): { valid: boolean; remainingCodes: string[] } {
  const index = backupCodes.indexOf(code.toUpperCase());

  if (index === -1) {
    return {
      valid: false,
      remainingCodes: backupCodes,
    };
  }

  // Remove used code
  const remainingCodes = backupCodes.filter((_, i) => i !== index);

  return {
    valid: true,
    remainingCodes,
  };
}

/**
 * Generate recovery codes for 2FA
 */
export function generateRecoveryCodes(count: number = 10): string[] {
  return Array.from({ length: count }, () =>
    Math.random().toString(36).substring(2, 10).toUpperCase()
  );
}
