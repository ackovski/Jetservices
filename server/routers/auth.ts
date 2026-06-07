import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { students, users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "../_core/cookies";
import { hashPassword } from "../_core/password";
import { sdk } from "../_core/sdk";
import { sendSignupConfirmationEmail } from "../_core/emailService";

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

const signupSchema = z.object({
  name: z.string().min(2, "Le nom doit avoir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit avoir au moins 6 caractères"),
  phone: z.string().min(10, "Le téléphone doit avoir au moins 10 chiffres"),
  countryTarget: z.enum(["france", "canada", "maroc", "tunisie"]),
  studyLevel: z.enum(["bac", "licence", "master", "doctorat"]),
});

const setSessionCookie = async (ctx: any, userOpenId: string) => {
  const sessionToken = await sdk.createSessionToken(userOpenId, {
    expiresInMs: ONE_YEAR_MS,
  });
  const cookieOptions = getSessionCookieOptions(ctx.req);
  ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
};

export const authRouter = router({
  me: publicProcedure.query(opts => opts.ctx.user),
  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return { success: true };
  }),
  signup: publicProcedure
    .input(signupSchema)
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        // Vérifier si un utilisateur avec cet email existe déjà
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1);

        if (existingUser.length > 0) {
          throw new Error("Un compte avec cet email existe déjà");
        }

        // Hash password
        const hashedPassword = await hashPassword(input.password);

        // Générer un openId unique
        const openId = `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Créer un nouvel utilisateur avec le rôle "etudiant"
        const userResult = await db.insert(users).values({
          openId: openId,
          name: input.name,
          email: input.email,
          password: hashedPassword,
          loginMethod: "email",
          role: "etudiant",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date(),
        });

        // Récupérer l'ID du nouvel utilisateur
        const newUser = await db
          .select()
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1);

        if (!newUser || newUser.length === 0) {
          throw new Error("Erreur lors de la création du compte");
        }

        const userId = newUser[0].id;

        // Créer le profil étudiant
        await db.insert(students).values({
          userId: userId,
          phone: input.phone,
          countryTarget: input.countryTarget,
          studyLevel: input.studyLevel,
          status: "inscrit",
          progressPercentage: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Créer une session authentifiée (comme dans login)
        await setSessionCookie(ctx, openId);

        // Send signup confirmation email
        try {
          await sendSignupConfirmationEmail(input.email, input.name);
        } catch (emailError) {
          console.error("Failed to send signup email:", emailError);
          // Don't fail the signup if email fails
        }

        return {
          success: true,
          message: "Inscription réussie ! Redirection vers votre tableau de bord...",
          userId: userId,
        };
      } catch (error) {
        console.error("Signup error:", error);
        throw error;
      }
    }),

  // Vérifier si un email est déjà utilisé
  checkEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      return { exists: existing.length > 0 };
    }),
});
