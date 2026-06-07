import { describe, it, expect, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { getDb } from "./db";
import { invitations, users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Mock context for public procedures
function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
      cookie: vi.fn(),
    } as TrpcContext["res"],
  };
}

// Mock context for admin procedures
function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      openId: "admin-openid",
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
      cookie: vi.fn(),
    } as TrpcContext["res"],
  };
}

describe("invitations", () => {
  let db: Awaited<ReturnType<typeof getDb>>;

  beforeEach(async () => {
    db = await getDb();
    if (!db) throw new Error("Database connection failed");

    // Clean up test data
    await db.delete(invitations).where(eq(invitations.email, "test@example.com"));
    await db.delete(invitations).where(eq(invitations.email, "admin-test@example.com"));
    await db.delete(users).where(eq(users.email, "test@example.com"));
    await db.delete(users).where(eq(users.email, "admin-test@example.com"));
  });

  describe("verify", () => {
    it("should verify a valid invitation token", async () => {
      // Create an invitation
      const token = "test-token-12345";
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await db.insert(invitations).values({
        email: "test@example.com",
        role: "conseiller",
        token,
        expiresAt,
        createdBy: 1,
      });

      // Verify the token
      const publicCaller = appRouter.createCaller(createPublicContext());
      const result = await publicCaller.invitations.verify(token);

      expect(result).toEqual({
        email: "test@example.com",
        role: "conseiller",
      });
    });

    it("should reject an expired invitation", async () => {
      // Create an expired invitation
      const token = "expired-token";
      const expiresAt = new Date(Date.now() - 1000); // 1 second ago

      await db.insert(invitations).values({
        email: "test@example.com",
        role: "admin",
        token,
        expiresAt,
        createdBy: 1,
      });

      // Try to verify
      const publicCaller = appRouter.createCaller(createPublicContext());
      try {
        await publicCaller.invitations.verify(token);
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.message).toContain("expired");
      }
    });

    it("should reject a non-existent token", async () => {
      const publicCaller = appRouter.createCaller(createPublicContext());
      try {
        await publicCaller.invitations.verify("non-existent-token");
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("NOT_FOUND");
      }
    });

    it("should reject an already used invitation", async () => {
      // Create a used invitation
      const token = "used-token";
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await db.insert(invitations).values({
        email: "test@example.com",
        role: "partenaire",
        token,
        expiresAt,
        createdBy: 1,
        usedAt: new Date(),
      });

      // Try to verify
      const publicCaller = appRouter.createCaller(createPublicContext());
      try {
        await publicCaller.invitations.verify(token);
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.message).toContain("already used");
      }
    });
  });

  describe("accept", () => {
    it("should create a user account with the correct role", async () => {
      // Create an invitation
      const token = "accept-test-token";
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await db.insert(invitations).values({
        email: "test@example.com",
        role: "conseiller",
        token,
        expiresAt,
        createdBy: 1,
      });

      // Accept the invitation
      const publicCaller = appRouter.createCaller(createPublicContext());
      const result = await publicCaller.invitations.accept({
        token,
        name: "Test User",
        password: "password123",
      });

      expect(result.success).toBe(true);
      expect(result.email).toBe("test@example.com");
      expect(result.role).toBe("conseiller");

      // Verify the user was created with the correct role
      const createdUser = await db
        .select()
        .from(users)
        .where(eq(users.email, "test@example.com"))
        .limit(1);

      expect(createdUser).toHaveLength(1);
      expect(createdUser[0].role).toBe("conseiller");
      expect(createdUser[0].name).toBe("Test User");
    });

    it("should create admin user from invitation", async () => {
      const token = "admin-invite-token";
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await db.insert(invitations).values({
        email: "admin-test@example.com",
        role: "admin",
        token,
        expiresAt,
        createdBy: 1,
      });

      const publicCaller = appRouter.createCaller(createPublicContext());
      const result = await publicCaller.invitations.accept({
        token,
        name: "Admin Test",
        password: "password123",
      });

      expect(result.role).toBe("admin");

      const createdUser = await db
        .select()
        .from(users)
        .where(eq(users.email, "admin-test@example.com"))
        .limit(1);

      expect(createdUser[0].role).toBe("admin");
    });

    it("should mark invitation as used after accepting", async () => {
      const token = "mark-used-token";
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await db.insert(invitations).values({
        email: "test@example.com",
        role: "partenaire",
        token,
        expiresAt,
        createdBy: 1,
      });

      const publicCaller = appRouter.createCaller(createPublicContext());
      await publicCaller.invitations.accept({
        token,
        name: "Test User",
        password: "password123",
      });

      // Check that invitation is marked as used
      const updatedInv = await db
        .select()
        .from(invitations)
        .where(eq(invitations.token, token))
        .limit(1);

      expect(updatedInv[0].usedAt).not.toBeNull();
    });

    it("should reject accepting an already used invitation", async () => {
      const token = "already-used-token";
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await db.insert(invitations).values({
        email: "test@example.com",
        role: "conseiller",
        token,
        expiresAt,
        createdBy: 1,
        usedAt: new Date(),
      });

      const publicCaller = appRouter.createCaller(createPublicContext());
      try {
        await publicCaller.invitations.accept({
          token,
          name: "Test User",
          password: "password123",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.message).toContain("already used");
      }
    });

    it("should reject accepting an expired invitation", async () => {
      const token = "expired-accept-token";
      const expiresAt = new Date(Date.now() - 1000);

      await db.insert(invitations).values({
        email: "test@example.com",
        role: "admin",
        token,
        expiresAt,
        createdBy: 1,
      });

      const publicCaller = appRouter.createCaller(createPublicContext());
      try {
        await publicCaller.invitations.accept({
          token,
          name: "Test User",
          password: "password123",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.message).toContain("expired");
      }
    });

    it("should reject if user already exists", async () => {
      // Create an existing user
      await db.insert(users).values({
        openId: "existing-user",
        email: "test@example.com",
        name: "Existing User",
        role: "etudiant",
      });

      const token = "duplicate-email-token";
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await db.insert(invitations).values({
        email: "test@example.com",
        role: "admin",
        token,
        expiresAt,
        createdBy: 1,
      });

      const publicCaller = appRouter.createCaller(createPublicContext());
      try {
        await publicCaller.invitations.accept({
          token,
          name: "Test User",
          password: "password123",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.message).toContain("already exists");
      }
    });
  });
});
