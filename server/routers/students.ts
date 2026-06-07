import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { students, users, messages, tasks, appointments } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { sendDossierUpdateEmail } from "../_core/emailService";

export const studentsRouter = router({
  // Get all students (admin/manager only)
  list: protectedProcedure
    .input(z.object({ 
      page: z.number().default(1),
      limit: z.number().default(10),
      status: z.string().optional(),
      consultantId: z.number().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      // Only admin, manager, and consultants can view students
      if (!["super_admin", "admin", "conseiller"].includes(ctx.user.role)) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      let query: any = db.select().from(students);

      // Consultants can only see their assigned students
      if (ctx.user.role === "conseiller") {
        query = query.where(eq(students.assignedConsultantId, ctx.user.id));
      } else if (input?.consultantId) {
        query = query.where(eq(students.assignedConsultantId, input.consultantId));
      }

      if (input?.status) {
        query = query.where(eq(students.status, input.status as any));
      }

      const result = await query.limit(input?.limit || 10).offset(((input?.page || 1) - 1) * (input?.limit || 10));
      return result;
    }),

  // Get student by ID
  getById: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input: studentId }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const student = await db.select().from(students).where(eq(students.id, studentId)).limit(1);
      if (!student.length) throw new TRPCError({ code: "NOT_FOUND" });

      // Check access: own profile, admin, or assigned consultant
      if (ctx.user.role === "etudiant" && student[0].userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      if (ctx.user.role === "conseiller" && student[0].assignedConsultantId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return student[0];
    }),

  // Create student (admin only)
  create: protectedProcedure
    .input(z.object({
      userId: z.number(),
      phone: z.string().optional(),
      dateOfBirth: z.string().optional(),
      countryTarget: z.string(),
      studyLevel: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "super_admin" && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const result = await db.insert(students).values({
        userId: input.userId,
        phone: input.phone,
        dateOfBirth: input.dateOfBirth,
        countryTarget: input.countryTarget,
        studyLevel: input.studyLevel,
        status: "prospect",
      });

      return result;
    }),

  // Update student
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      status: z.string().optional(),
      assignedConsultantId: z.number().optional(),
      progressPercentage: z.number().optional(),
      countryTarget: z.string().optional(),
      studyLevel: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!["super_admin", "admin"].includes(ctx.user.role)) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const result = await db
        .update(students)
        .set({
          status: input.status as any,
          assignedConsultantId: input.assignedConsultantId,
          progressPercentage: input.progressPercentage,
          countryTarget: input.countryTarget,
          studyLevel: input.studyLevel,
        })
        .where(eq(students.id, input.id));

      return result;
    }),

  // Get student messages
  getMessages: protectedProcedure
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

      const result = await db.select().from(messages).where(eq(messages.studentId, studentId)).limit(1000);
      return result;
    }),

  // Get student tasks
  getTasks: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input: studentId }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const result = await db.select().from(tasks).where(eq(tasks.studentId, studentId)).limit(1000);
      return result;
    }),

  // Create task
  createTask: protectedProcedure
    .input(z.object({
      studentId: z.number(),
      title: z.string(),
      description: z.string().optional(),
      dueDate: z.date().optional(),
      priority: z.enum(["low", "medium", "high"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!["super_admin", "admin", "conseiller"].includes(ctx.user.role)) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const result = await db.insert(tasks).values({
        studentId: input.studentId,
        title: input.title,
        description: input.description,
        dueDate: input.dueDate,
        priority: input.priority || "medium",
      });

      return result;
    }),

  // Update task status
  updateTaskStatus: protectedProcedure
    .input(z.object({
      taskId: z.number(),
      status: z.enum(["todo", "in_progress", "done"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const result = await db
        .update(tasks)
        .set({ status: input.status })
        .where(eq(tasks.id, input.taskId));

      return result;
    }),
});
