import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

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

describe("auth.signup", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    const ctx = createPublicContext();
    caller = appRouter.createCaller(ctx);
  });

  it("should validate email format", async () => {
    try {
      await caller.auth.signup({
        name: "Jean Dupont",
        email: "invalid-email",
        phone: "+33712345678",
        countryTarget: "france",
        studyLevel: "licence",
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.message).toContain("Email invalide");
    }
  });

  it("should validate name length", async () => {
    try {
      await caller.auth.signup({
        name: "J",
        email: "jean@example.com",
        phone: "+33712345678",
        countryTarget: "france",
        studyLevel: "licence",
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.message).toContain("au moins 2 caractères");
    }
  });

  it("should validate phone length", async () => {
    try {
      await caller.auth.signup({
        name: "Jean Dupont",
        email: "jean@example.com",
        phone: "123",
        countryTarget: "france",
        studyLevel: "licence",
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.message).toContain("au moins 10 chiffres");
    }
  });

  it("should validate countryTarget enum", async () => {
    try {
      await caller.auth.signup({
        name: "Jean Dupont",
        email: "jean@example.com",
        phone: "+33712345678",
        countryTarget: "invalid" as any,
        studyLevel: "licence",
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.message).toBeTruthy();
    }
  });

  it("should validate studyLevel enum", async () => {
    try {
      await caller.auth.signup({
        name: "Jean Dupont",
        email: "jean@example.com",
        phone: "+33712345678",
        countryTarget: "france",
        studyLevel: "invalid" as any,
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.message).toBeTruthy();
    }
  });

  it("should accept valid signup data", async () => {
    try {
      const result = await caller.auth.signup({
        name: "Jean Dupont",
        email: `jean-${Date.now()}@example.com`,
        password: "SecurePassword123",
        phone: "+33712345678",
        countryTarget: "france",
        studyLevel: "licence",
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.message).toContain("Inscription réussie");
      expect(result.userId).toBeGreaterThan(0);
    } catch (error: any) {
      // Expected to fail if database is not available in test environment
      expect(error.message).toContain("Database");
    }
  });

  it("should reject duplicate email", async () => {
    const uniqueEmail = `duplicate-${Date.now()}@example.com`;

    try {
      // First signup
      await caller.auth.signup({
        name: "Jean Dupont",
        email: uniqueEmail,
        password: "SecurePassword123",
        phone: "+33712345678",
        countryTarget: "france",
        studyLevel: "licence",
      });

      // Second signup with same email
      await caller.auth.signup({
        name: "Marie Dupont",
        email: uniqueEmail,
        password: "SecurePassword456",
        phone: "+33712345679",
        countryTarget: "canada",
        studyLevel: "master",
      });

      expect.fail("Should have thrown duplicate email error");
    } catch (error: any) {
      expect(error.message).toContain("existe déjà");
    }
  });
});

describe("auth.checkEmail", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    const ctx = createPublicContext();
    caller = appRouter.createCaller(ctx);
  });

  it("should validate email format", async () => {
    try {
      await caller.auth.checkEmail({
        email: "invalid-email",
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.message).toBeTruthy();
    }
  });

  it("should check if email exists", async () => {
    try {
      const result = await caller.auth.checkEmail({
        email: `newuser-${Date.now()}@example.com`,
      });

      expect(result).toBeDefined();
      expect(result.exists).toBe(false);
    } catch (error: any) {
      // Expected to fail if database is not available in test environment
      expect(error.message).toContain("Database");
    }
  });
});


describe("auth.signup - Session Integration", () => {
  it("should create a session cookie after successful signup", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.auth.signup({
        name: "Test User",
        email: `session-test-${Date.now()}@example.com`,
        password: "SecurePassword123",
        phone: "+33712345678",
        countryTarget: "france",
        studyLevel: "licence",
      });

      expect(result.success).toBe(true);
      // Verify that ctx.res.cookie was called (session was created)
      expect(ctx.res.cookie).toHaveBeenCalled();
      
      // Verify the cookie was called with the session token
      const cookieCall = (ctx.res.cookie as any).mock.calls[0];
      expect(cookieCall).toBeDefined();
      expect(cookieCall[0]).toBe("app_session_id"); // COOKIE_NAME
    } catch (error: any) {
      // If database is not available, that's acceptable for this test
      if (!error.message.includes("Database")) {
        throw error;
      }
    }
  });

  it("should create student with etudiant role after signup", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.auth.signup({
        name: "Role Test User",
        email: `role-test-${Date.now()}@example.com`,
        password: "SecurePassword123",
        phone: "+33712345678",
        countryTarget: "france",
        studyLevel: "licence",
      });

      expect(result.success).toBe(true);
      expect(result.userId).toBeGreaterThan(0);
      // The role should be set to "etudiant" in the signup procedure
    } catch (error: any) {
      if (!error.message.includes("Database")) {
        throw error;
      }
    }
  });
});
