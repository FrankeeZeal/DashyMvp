import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  boolean,
  serial,
  primaryKey,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user"),
  onboardingComplete: boolean("onboarding_complete").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Organizations table
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // "agency" or "ecom"
  url: varchar("url"),
  age: varchar("age"),
  revenue: varchar("revenue"),
  trackingMethod: varchar("tracking_method"),
  teamSize: varchar("team_size"),
  retentionTeam: varchar("retention_team"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Organization user relationships
export const organizationUsers = pgTable("organization_users", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull(),
  userId: varchar("user_id").notNull(),
  role: varchar("role").notNull(), // "owner", "designer", "analyst", "account_owner", "email_specialist", "cmo"
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    organizationUserUnique: primaryKey(table.organizationId, table.userId),
  };
});

// Campaigns table
export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull(),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // "email", "sms", "loyalty"
  status: varchar("status").notNull(), // "draft", "scheduled", "active", "completed"
  sentCount: integer("sent_count").default(0),
  openCount: integer("open_count").default(0),
  clickCount: integer("click_count").default(0),
  revenue: integer("revenue").default(0), // stored in cents
  sentDate: timestamp("sent_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Clients table (for agencies)
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull(),
  name: varchar("name").notNull(),
  status: varchar("status").default("active"),
  hasEmailData: boolean("has_email_data").default(false),
  hasSmsData: boolean("has_sms_data").default(false),
  addedAt: timestamp("added_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Integrations table
export const integrations = pgTable("integrations", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull(),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // "email", "sms", "ecommerce", "analytics"
  status: varchar("status").default("pending"), // "connected", "pending", "failed"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true, 
});

export const insertOrganizationSchema = createInsertSchema(organizations).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true, 
});

export const insertOrganizationUserSchema = createInsertSchema(organizationUsers).omit({ 
  id: true,
  createdAt: true,
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true, 
});

export const insertClientSchema = createInsertSchema(clients).omit({ 
  id: true,
  addedAt: true,
  updatedAt: true, 
});

export const insertIntegrationSchema = createInsertSchema(integrations).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true, 
});

// Types for database operations
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = typeof organizations.$inferInsert;
export type OrganizationUser = typeof organizationUsers.$inferSelect;
export type InsertOrganizationUser = typeof organizationUsers.$inferInsert;
export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = typeof campaigns.$inferInsert;
export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;
export type Integration = typeof integrations.$inferSelect;
export type InsertIntegration = typeof integrations.$inferInsert;

// Extended schemas for forms
export const agencyOnboardingSchema = z.object({
  name: z.string().min(1, "Agency name is required"),
  age: z.string().min(1, "Please select an option"),
  clientCount: z.string().min(1, "Please select an option"),
  trackingMethod: z.string().min(1, "Please select an option"),
  teamSize: z.string().min(1, "Please select an option"),
  addTeamNow: z.string().min(1, "Please select an option"),
  teamMembers: z.array(z.object({
    email: z.string().email("Please enter a valid email address"),
    role: z.string().min(1, "Please select a role")
  })).optional(),
});

export const ecomOnboardingSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  url: z.string().url("Please enter a valid URL").or(z.string().min(0)),
  age: z.string().min(1, "Please select an option"),
  revenue: z.string().min(1, "Please select an option"),
  trackingMethod: z.string().min(1, "Please select an option"),
  retentionTeam: z.string().min(1, "Please select an option"),
  teamSize: z.string().min(1, "Please select an option"),
  addTeamNow: z.string().min(1, "Please select an option"),
});
