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
