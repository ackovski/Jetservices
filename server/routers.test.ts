import { describe, expect, it } from "vitest";
import { z } from "zod";

describe("JET Services - Input Validation", () => {
  describe("Contact Form Validation", () => {
    const contactSchema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      message: z.string().min(1),
    });

    it("accepts valid contact data", () => {
      const data = {
        name: "Test User",
        email: "test@example.com",
        phone: "+33612345678",
        message: "I am interested in your services",
      };

      const result = contactSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("rejects invalid email", () => {
      const data = {
        name: "Test User",
        email: "invalid-email",
        message: "Test message",
      };

      const result = contactSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("rejects empty name", () => {
      const data = {
        name: "",
        email: "test@example.com",
        message: "Test message",
      };

      const result = contactSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("rejects empty message", () => {
      const data = {
        name: "Test User",
        email: "test@example.com",
        message: "",
      };

      const result = contactSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("accepts data without phone", () => {
      const data = {
        name: "Test User",
        email: "test@example.com",
        message: "Test message",
      };

      const result = contactSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("Client Profile Validation", () => {
    const profileSchema = z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
      dateOfBirth: z.string().optional(),
      nationality: z.string().optional(),
      targetCountry: z.string().optional(),
      targetField: z.string().optional(),
    });

    it("accepts valid profile data", () => {
      const data = {
        firstName: "Jean",
        lastName: "Dupont",
        phone: "+33612345678",
        targetCountry: "France",
        targetField: "Informatique",
      };

      const result = profileSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("allows partial updates", () => {
      const data = {
        firstName: "Marie",
      };

      const result = profileSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("allows empty object", () => {
      const data = {};

      const result = profileSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("Dossier Status Validation", () => {
    const statusSchema = z.object({
      dossierId: z.number(),
      status: z.enum(["not_started", "in_progress", "pending_review", "completed", "rejected"]),
      notes: z.string().optional(),
    });

    it("accepts valid status update", () => {
      const data = {
        dossierId: 1,
        status: "in_progress" as const,
        notes: "Processing application",
      };

      const result = statusSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("rejects invalid status", () => {
      const data = {
        dossierId: 1,
        status: "invalid_status",
      };

      const result = statusSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("accepts all valid statuses", () => {
      const statuses = ["not_started", "in_progress", "pending_review", "completed", "rejected"];

      statuses.forEach((status) => {
        const data = {
          dossierId: 1,
          status: status as any,
        };

        const result = statusSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });
  });

  describe("Document Upload Validation", () => {
    const documentSchema = z.object({
      dossierId: z.number(),
      fileName: z.string(),
      fileKey: z.string(),
      fileUrl: z.string(),
      fileType: z.string().optional(),
      fileSize: z.number().optional(),
    });

    it("accepts valid document data", () => {
      const data = {
        dossierId: 1,
        fileName: "document.pdf",
        fileKey: "docs/1/document.pdf",
        fileUrl: "https://example.com/document.pdf",
        fileType: "application/pdf",
        fileSize: 1024000,
      };

      const result = documentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("requires dossierId", () => {
      const data = {
        fileName: "document.pdf",
        fileKey: "docs/1/document.pdf",
        fileUrl: "https://example.com/document.pdf",
      };

      const result = documentSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("requires fileName", () => {
      const data = {
        dossierId: 1,
        fileKey: "docs/1/document.pdf",
        fileUrl: "https://example.com/document.pdf",
      };

      const result = documentSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("allows optional fileType and fileSize", () => {
      const data = {
        dossierId: 1,
        fileName: "document.pdf",
        fileKey: "docs/1/document.pdf",
        fileUrl: "https://example.com/document.pdf",
      };

      const result = documentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});
