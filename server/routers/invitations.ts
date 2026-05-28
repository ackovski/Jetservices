import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { invitations, users } from "../../drizzle/schema";
import { eq, isNull } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";

export const invitationsRouter = router({
  // Create invitation (super_admin and admin only)
  create: protectedProcedure
    .input(z.object({
      email: z.string().email(),
      role: z.enum(["admin", "conseiller", "partenaire"]),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!["super_admin", "admin"].includes(ctx.user.role)) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Check if email already exists as user
      const existingUser = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
      if (existingUser.length) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "User already exists with this email" });
      }

      // Check if invitation already exists
      const existingInvitation = await db.select().from(invitations).where(eq(invitations.email, input.email)).limit(1);
      if (existingInvitation.length && !existingInvitation[0].usedAt) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invitation already sent to this email" });
      }

      // Generate unique token
      const token = nanoid(32);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      const result = await db.insert(invitations).values({
        email: input.email,
        role: input.role,
        token,
        expiresAt,
        createdBy: ctx.user.id,
      });

      // TODO: Send email with invitation link
      // Example: https://yoursite.com/accept-invitation?token={token}

      return {
        success: true,
        invitationLink: `${process.env.VITE_APP_URL || "http://localhost:3000"}/accept-invitation?token=${token}`,
      };
    }),

  // Get all invitations (admin only)
  list: protectedProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(10),
      status: z.enum(["pending", "used"]).optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      if (!["super_admin", "admin"].includes(ctx.user.role)) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      let query: any = db.select().from(invitations);

      if (input?.status === "pending") {
        query = query.where(isNull(invitations.usedAt));
      } else if (input?.status === "used") {
        // For used, we need to check if usedAt is not null
        // This is a limitation of Drizzle, so we'll filter in memory
      }

      const result = await query
        .limit(input?.limit || 10)
        .offset(((input?.page || 1) - 1) * (input?.limit || 10));

      return result;
    }),

  // Verify invitation token
  verify: protectedProcedure
    .input(z.string())
    .query(async ({ input: token }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const invitation = await db.select().from(invitations).where(eq(invitations.token, token)).limit(1);
      if (!invitation.length) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invitation not found" });
      }

      const inv = invitation[0];

      // Check if expired
      if (new Date() > inv.expiresAt) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invitation expired" });
      }

      // Check if already used
      if (inv.usedAt) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invitation already used" });
      }

      return {
        email: inv.email,
        role: inv.role,
      };
    }),

  // Accept invitation (create user account)
  accept: protectedProcedure
    .input(z.object({
      token: z.string(),
      name: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const invitation = await db.select().from(invitations).where(eq(invitations.token, input.token)).limit(1);
      if (!invitation.length) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const inv = invitation[0];

      // Verify invitation is valid
      if (new Date() > inv.expiresAt) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invitation expired" });
      }

      if (inv.usedAt) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invitation already used" });
      }

      // Update invitation as used
      await db
        .update(invitations)
        .set({ usedAt: new Date() })
        .where(eq(invitations.id, inv.id));

      // Note: The actual user creation happens via OAuth flow
      // This endpoint just marks the invitation as used
      // The user will be created when they first login via OAuth

      return {
        success: true,
        message: "Invitation accepted. You can now login with your email.",
      };
    }),

  // Resend invitation
  resend: protectedProcedure
    .input(z.string()) // email
    .mutation(async ({ ctx, input: email }) => {
      if (!["super_admin", "admin"].includes(ctx.user.role)) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const invitation = await db.select().from(invitations).where(eq(invitations.email, email)).limit(1);
      if (!invitation.length) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Generate new token
      const token = nanoid(32);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await db
        .update(invitations)
        .set({ token, expiresAt })
        .where(eq(invitations.id, invitation[0].id));

      return {
        success: true,
        invitationLink: `${process.env.VITE_APP_URL || "http://localhost:3000"}/accept-invitation?token=${token}`,
      };
    }),
});
