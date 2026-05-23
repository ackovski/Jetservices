import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getClientProfile, getServiceDossiers, updateServiceDossierStatus, getDocuments, createDocument, createContactMessage, createOrUpdateClientProfile } from "./db";
import { z } from "zod";
// Note: Full S3 integration available in server/routers/documents.ts

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Client profile routes
  clientProfile: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      const profile = await getClientProfile(ctx.user.id);
      return profile || null;
    }),
    updateProfile: protectedProcedure.input(z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
      dateOfBirth: z.string().optional(),
      nationality: z.string().optional(),
      targetCountry: z.string().optional(),
      targetField: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      await createOrUpdateClientProfile(ctx.user.id, input);
      return { success: true };
    }),
  }),

  // Service dossiers routes
  dossiers: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const profile = await getClientProfile(ctx.user.id);
      if (!profile) return [];
      return getServiceDossiers(profile.id, ctx.user.id);
    }),
    updateStatus: protectedProcedure.input(z.object({
      dossierId: z.number(),
      status: z.enum(["not_started", "in_progress", "pending_review", "completed", "rejected"]),
      notes: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      await updateServiceDossierStatus(input.dossierId, input.status, input.notes, ctx.user.id);
      return { success: true };
    }),
  }),

  // Documents routes - simplified for now, full implementation in routers/documents.ts
  documents: router({
    list: protectedProcedure.input(z.object({
      dossierId: z.number(),
    })).query(async ({ ctx, input }) => {
      return getDocuments(input.dossierId, ctx.user.id);
    }),
    upload: protectedProcedure.input(z.object({
      dossierId: z.number(),
      fileName: z.string(),
      fileKey: z.string(),
      fileUrl: z.string(),
      fileType: z.string().optional(),
      fileSize: z.number().optional(),
    })).mutation(async ({ ctx, input }) => {
      await createDocument({
        ...input,
        uploadedBy: ctx.user.id,
      }, ctx.user.id);
      return { success: true };
    }),
  }),

  // Contact form routes
  contact: router({
    submit: publicProcedure.input(z.object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      message: z.string().min(1),
    })).mutation(async ({ input }) => {
      await createContactMessage(input);
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
