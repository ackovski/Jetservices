import { z } from "zod";
import { randomBytes } from "crypto";
import { publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { users, passwordResets } from "../../drizzle/schema";
import { eq, and, gt, isNull } from "drizzle-orm";
import { hashPassword } from "../_core/password";
import { notifyOwner } from "../_core/notification";

function generateToken(): string {
  return randomBytes(32).toString('hex');
}

const requestPasswordResetSchema = z.object({
  email: z.string().email("Email invalide"),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token requis"),
  newPassword: z.string().min(6, "Le mot de passe doit avoir au moins 6 caractères"),
  confirmPassword: z.string().min(6, "La confirmation doit avoir au moins 6 caractères"),
});

export const passwordResetRouter = router({
  /**
   * Request a password reset
   * Sends an email with a reset link to the user
   */
  requestReset: publicProcedure
    .input(requestPasswordResetSchema)
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        // Find user by email
        const userResult = await db
          .select()
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1);

        const user = userResult[0];

        // Always return success to prevent email enumeration
        if (!user) {
          return {
            success: true,
            message: "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.",
          };
        }

        // Generate reset token
        const token = generateToken();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Store reset token in database
        await db.insert(passwordResets).values({
          userId: user.id,
          email: user.email!,
          token,
          expiresAt,
        });

        // Send email notification to owner (in production, send to user)
        await notifyOwner({
          title: "Demande de réinitialisation de mot de passe",
          content: `L'utilisateur ${user.email} a demandé une réinitialisation de mot de passe.\n\nLien de réinitialisation: /reset-password/${token}`,
        });

        return {
          success: true,
          message: "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.",
        };
      } catch (error) {
        console.error("Password reset request error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de la demande de réinitialisation",
        });
      }
    }),

  /**
   * Verify password reset token
   * Check if token is valid and not expired
   */
  verifyToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        const resetRecord = await db
          .select()
          .from(passwordResets)
          .where(
            and(
              eq(passwordResets.token, input.token),
              gt(passwordResets.expiresAt, new Date()),
              isNull(passwordResets.usedAt)
            )
          )
          .limit(1);

        if (resetRecord.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Lien de réinitialisation invalide ou expiré",
          });
        }

        return {
          valid: true,
          email: resetRecord[0].email,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Token verification error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de la vérification du token",
        });
      }
    }),

  /**
   * Reset password with valid token
   */
  resetPassword: publicProcedure
    .input(resetPasswordSchema)
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      // Validate passwords match
      if (input.newPassword !== input.confirmPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Les mots de passe ne correspondent pas",
        });
      }

      try {
        // Find valid reset token
        const resetRecord = await db
          .select()
          .from(passwordResets)
          .where(
            and(
              eq(passwordResets.token, input.token),
              gt(passwordResets.expiresAt, new Date()),
              isNull(passwordResets.usedAt)
            )
          )
          .limit(1);

        if (resetRecord.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Lien de réinitialisation invalide ou expiré",
          });
        }

        const resetData = resetRecord[0];

        // Hash new password
        const hashedPassword = await hashPassword(input.newPassword);

        // Update user password
        await db
          .update(users)
          .set({
            password: hashedPassword,
            updatedAt: new Date(),
          })
          .where(eq(users.id, resetData.userId));

        // Mark token as used
        await db
          .update(passwordResets)
          .set({ usedAt: new Date() })
          .where(eq(passwordResets.id, resetData.id));

        return {
          success: true,
          message: "Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.",
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Password reset error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de la réinitialisation du mot de passe",
        });
      }
    }),
});
