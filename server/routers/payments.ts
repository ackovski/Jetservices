import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { payments, students } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const paymentsRouter = router({
  // Get payments for a student
  getByStudent: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input: studentId }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Verify access
      const student = await db.select().from(students).where(eq(students.id, studentId)).limit(1);
      if (!student.length) throw new TRPCError({ code: "NOT_FOUND" });

      if (ctx.user.role === "etudiant" && student[0].userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const result = await db.select().from(payments).where(eq(payments.studentId, studentId)).limit(1000);
      return result;
    }),

  // Get all payments (admin only)
  list: protectedProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(10),
      status: z.string().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      if (!["super_admin", "admin"].includes(ctx.user.role)) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      let query: any = db.select().from(payments);

      if (input?.status) {
        query = query.where(eq(payments.status, input.status as any));
      }

      const result = await query
        .limit(input?.limit || 10)
        .offset(((input?.page || 1) - 1) * (input?.limit || 10));

      return result;
    }),

  // Create payment intent (for Stripe)
  createPaymentIntent: protectedProcedure
    .input(z.object({
      studentId: z.number(),
      amount: z.number(), // in cents
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Verify access
      const student = await db.select().from(students).where(eq(students.id, input.studentId)).limit(1);
      if (!student.length) throw new TRPCError({ code: "NOT_FOUND" });

      if (ctx.user.role === "etudiant" && student[0].userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      // Create payment record
      const result = await db.insert(payments).values({
        studentId: input.studentId,
        amount: input.amount,
        status: "pending",
        paymentMethod: "stripe",
        description: input.description,
      });

      return result;
    }),

  // Update payment status
  updateStatus: protectedProcedure
    .input(z.object({
      paymentId: z.number(),
      status: z.enum(["pending", "paid", "failed", "refunded"]),
      stripePaymentIntentId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!["super_admin", "admin"].includes(ctx.user.role)) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const result = await db
        .update(payments)
        .set({
          status: input.status,
          stripePaymentIntentId: input.stripePaymentIntentId,
        })
        .where(eq(payments.id, input.paymentId));

      return result;
    }),

  // Get payment by ID
  getById: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input: paymentId }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const payment = await db.select().from(payments).where(eq(payments.id, paymentId)).limit(1);
      if (!payment.length) throw new TRPCError({ code: "NOT_FOUND" });

      // Verify access
      const student = await db.select().from(students).where(eq(students.id, payment[0].studentId)).limit(1);
      if (ctx.user.role === "etudiant" && student[0].userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return payment[0];
    }),
});
