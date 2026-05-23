import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Client profile table for JET Services
 * Stores additional information about students using the platform
 */
export const clientProfiles = mysqlTable("clientProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  firstName: varchar("firstName", { length: 100 }),
  lastName: varchar("lastName", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  dateOfBirth: varchar("dateOfBirth", { length: 10 }), // YYYY-MM-DD format
  nationality: varchar("nationality", { length: 100 }),
  targetCountry: varchar("targetCountry", { length: 100 }), // France, Canada, Maroc, Tunisie
  targetField: varchar("targetField", { length: 255 }), // Field of study
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientProfile = typeof clientProfiles.$inferSelect;
export type InsertClientProfile = typeof clientProfiles.$inferInsert;

/**
 * Service files/dossiers table
 * Tracks the status of each service for a client
 */
export const serviceDossiers = mysqlTable("serviceDossiers", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  serviceType: mysqlEnum("serviceType", [
    "orientation",
    "campus_france",
    "visa",
    "logement",
    "accueil_aeroport",
    "job_etudiant",
  ]).notNull(),
  status: mysqlEnum("status", [
    "not_started",
    "in_progress",
    "pending_review",
    "completed",
    "rejected",
  ]).default("not_started").notNull(),
  notes: text("notes"), // Internal notes or client-facing updates
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ServiceDossier = typeof serviceDossiers.$inferSelect;
export type InsertServiceDossier = typeof serviceDossiers.$inferInsert;

/**
 * Documents table
 * Stores references to uploaded documents (actual files stored in S3)
 */
export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  dossierId: int("dossierId").notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileKey: varchar("fileKey", { length: 255 }).notNull(), // S3 storage key
  fileUrl: text("fileUrl"), // Presigned URL or public URL
  fileType: varchar("fileType", { length: 50 }), // MIME type
  fileSize: int("fileSize"), // Size in bytes
  uploadedBy: int("uploadedBy"), // User ID who uploaded
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

/**
 * Contact messages table
 * Stores messages from the contact form
 */
export const contactMessages = mysqlTable("contactMessages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "read", "responded"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = typeof contactMessages.$inferInsert;