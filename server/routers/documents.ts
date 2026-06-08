import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDocuments, createDocument, getClientProfile } from "../db";
import { storagePut } from "../storage";
import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { serviceDossiers } from "../../drizzle/schema";

export const documentsRouter = router({
  list: protectedProcedure
    .input(z.object({
      dossierId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      return getDocuments(input.dossierId, ctx.user.id);
    }),

  upload: protectedProcedure
    .input(z.object({
      dossierId: z.number(),
      fileName: z.string().min(1),
      fileData: z.string(), // Base64 encoded file data
      fileType: z.string().optional(),
      fileSize: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Verify ownership
        const db = drizzle(process.env.DATABASE_URL!);
        const dossierResult = await db
          .select()
          .from(serviceDossiers)
          .where(eq(serviceDossiers.id, input.dossierId))
          .limit(1);
        
        const dossier = dossierResult;

        if (!dossier || dossier.length === 0) {
          throw new Error("Dossier not found");
        }

        const profile = await getClientProfile(ctx.user.id);
        if (!profile || profile.id !== dossier[0]!.clientId) {
          throw new Error("Unauthorized");
        }

        // Convert base64 to buffer
        const buffer = Buffer.from(input.fileData, "base64");

        // Upload to S3
        const fileKey = `documents/${ctx.user.id}/${input.dossierId}/${Date.now()}-${input.fileName}`;
        const { url } = await storagePut(fileKey, buffer, input.fileType || "application/octet-stream");

        // Save document metadata
        await createDocument(
          {
            dossierId: input.dossierId,
            fileName: input.fileName,
            fileKey,
            fileUrl: url,
            fileType: input.fileType,
            fileSize: input.fileSize,
            uploadedBy: ctx.user.id,
          },
          ctx.user.id
        );

        return {
          success: true,
          fileKey,
          fileUrl: url,
        };
      } catch (error) {
        console.error("Document upload error:", error);
        throw new Error("Failed to upload document");
      }
    }),
});

// Identity Documents Management
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { identityDocuments } from "../../drizzle/schema";
import { canVerifyDocuments } from "../_core/permissions";

// Export identity document procedures
export const identityDocumentsRouter = router({
  uploadIdentity: protectedProcedure
    .input(
      z.object({
        documentType: z.enum(["passport", "national_id", "driver_license", "birth_certificate", "residence_permit"]),
        fileName: z.string().min(1).max(255),
        fileData: z.string(),
        mimeType: z.string().optional(),
        expiresAt: z.date().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const fileSizeInBytes = Buffer.byteLength(input.fileData, "base64");
        if (fileSizeInBytes > 10 * 1024 * 1024) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "File size must be less than 10MB",
          });
        }

        const fileKey = `documents/${ctx.user!.id}/${input.documentType}/${Date.now()}-${input.fileName}`;
        const { url } = await storagePut(fileKey, Buffer.from(input.fileData, "base64"), input.mimeType);

        const doc = await db
          .insert(identityDocuments)
          .values({
            userId: ctx.user!.id,
            documentType: input.documentType,
            fileName: input.fileName,
            fileKey,
            fileUrl: url,
            mimeType: input.mimeType,
            fileSize: fileSizeInBytes,
            expiresAt: input.expiresAt,
            status: "pending",
          })
          .$returningId();

        return {
          id: doc[0].id,
          status: "pending",
          message: "Document uploaded successfully",
        };
      } catch (error) {
        console.error("Error uploading identity document:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  getMyIdentityDocuments: protectedProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const docs = await db
        .select()
        .from(identityDocuments)
        .where(eq(identityDocuments.userId, ctx.user!.id))
        .orderBy(identityDocuments.uploadedAt);

      return docs;
    } catch (error) {
      console.error("Error fetching identity documents:", error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }),

  getPendingIdentityDocuments: protectedProcedure.query(async ({ ctx }) => {
    try {
      const canVerify = await canVerifyDocuments(ctx.user!.id);
      if (!canVerify) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const { users } = require("../../drizzle/schema");
      const { leftJoin } = require("drizzle-orm");

      const docs = await db
        .select({
          id: identityDocuments.id,
          userId: identityDocuments.userId,
          documentType: identityDocuments.documentType,
          fileName: identityDocuments.fileName,
          fileKey: identityDocuments.fileKey,
          fileUrl: identityDocuments.fileUrl,
          mimeType: identityDocuments.mimeType,
          fileSize: identityDocuments.fileSize,
          status: identityDocuments.status,
          uploadedAt: identityDocuments.uploadedAt,
          expiresAt: identityDocuments.expiresAt,
          verificationNotes: identityDocuments.verificationNotes,
          verifiedBy: identityDocuments.verifiedBy,
          verifiedAt: identityDocuments.verifiedAt,
          createdAt: identityDocuments.createdAt,
          updatedAt: identityDocuments.updatedAt,
          userEmail: users.email,
          userName: users.name,
        })
        .from(identityDocuments)
        .leftJoin(users, eq(identityDocuments.userId, users.id))
        .where(eq(identityDocuments.status, "pending"))
        .orderBy(identityDocuments.uploadedAt);

      return docs;
    } catch (error) {
      console.error("Error fetching pending identity documents:", error);
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }),

  verifyIdentityDocument: protectedProcedure
    .input(
      z.object({
        documentId: z.number(),
        status: z.enum(["verified", "rejected"]),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const canVerify = await canVerifyDocuments(ctx.user!.id);
        if (!canVerify) {
          throw new TRPCError({ code: "FORBIDDEN", message: "You don't have permission to verify documents" });
        }

        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        await db
          .update(identityDocuments)
          .set({
            status: input.status,
            verificationNotes: input.notes,
            verifiedBy: ctx.user!.id,
            verifiedAt: new Date(),
          })
          .where(eq(identityDocuments.id, input.documentId));

        return { success: true, message: `Document ${input.status} successfully` };
      } catch (error) {
        console.error("Error verifying identity document:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
});
