import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, clientProfiles, InsertClientProfile, serviceDossiers, InsertServiceDossier, documents, InsertDocument, contactMessages, InsertContactMessage } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getClientProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(clientProfiles).where(eq(clientProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createOrUpdateClientProfile(userId: number, data: Partial<InsertClientProfile>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(clientProfiles).where(eq(clientProfiles.userId, userId)).limit(1);
  
  if (existing.length > 0) {
    await db.update(clientProfiles).set(data).where(eq(clientProfiles.userId, userId));
    return existing[0];
  } else {
    const result = await db.insert(clientProfiles).values({ userId, ...data });
    return { ...data, userId, id: result[0]?.insertId };
  }
}

export async function getServiceDossiers(clientId: number, userId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  // Verify ownership if userId is provided
  if (userId) {
    const profile = await db.select().from(clientProfiles).where(eq(clientProfiles.id, clientId)).limit(1);
    if (!profile.length || profile[0].userId !== userId) return [];
  }
  
  return db.select().from(serviceDossiers).where(eq(serviceDossiers.clientId, clientId));
}

export async function createServiceDossier(data: InsertServiceDossier) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(serviceDossiers).values(data);
}

export async function updateServiceDossierStatus(dossierId: number, status: string, notes?: string, userId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Verify ownership if userId is provided
  if (userId) {
    const dossier = await db.select().from(serviceDossiers).where(eq(serviceDossiers.id, dossierId)).limit(1);
    if (!dossier.length) throw new Error("Dossier not found");
    
    const profile = await db.select().from(clientProfiles).where(eq(clientProfiles.id, dossier[0].clientId)).limit(1);
    if (!profile.length || profile[0].userId !== userId) throw new Error("Unauthorized");
  }
  
  await db.update(serviceDossiers).set({ status: status as any, notes }).where(eq(serviceDossiers.id, dossierId));
}

export async function getDocuments(dossierId: number, userId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  // Verify ownership if userId is provided
  if (userId) {
    const dossier = await db.select().from(serviceDossiers).where(eq(serviceDossiers.id, dossierId)).limit(1);
    if (!dossier.length) return [];
    
    const profile = await db.select().from(clientProfiles).where(eq(clientProfiles.id, dossier[0].clientId)).limit(1);
    if (!profile.length || profile[0].userId !== userId) return [];
  }
  
  return db.select().from(documents).where(eq(documents.dossierId, dossierId));
}

export async function createDocument(data: InsertDocument, userId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Verify ownership if userId is provided
  if (userId) {
    const dossier = await db.select().from(serviceDossiers).where(eq(serviceDossiers.id, data.dossierId)).limit(1);
    if (!dossier.length) throw new Error("Dossier not found");
    
    const profile = await db.select().from(clientProfiles).where(eq(clientProfiles.id, dossier[0].clientId)).limit(1);
    if (!profile.length || profile[0].userId !== userId) throw new Error("Unauthorized");
  }
  
  const result = await db.insert(documents).values(data);
  return result;
}

export async function createContactMessage(data: InsertContactMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(contactMessages).values(data);
}

export async function getContactMessages(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactMessages).orderBy((t) => t.createdAt).limit(limit);
}
