import {
  users,
  organizations,
  organizationUsers,
  campaigns,
  clients,
  integrations,
  type User,
  type UpsertUser,
  type Organization,
  type InsertOrganization,
  type OrganizationUser,
  type InsertOrganizationUser,
  type Campaign,
  type InsertCampaign,
  type Client,
  type InsertClient,
  type Integration,
  type InsertIntegration
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<UpsertUser>): Promise<User>;
  
  // Organization operations
  createOrganization(organization: InsertOrganization): Promise<Organization>;
  getOrganization(id: number): Promise<Organization | undefined>;
  getUserOrganizations(userId: string): Promise<Organization[]>;
  
  // Organization User operations
  addUserToOrganization(data: InsertOrganizationUser): Promise<OrganizationUser>;
  getOrganizationUsers(organizationId: number): Promise<User[]>;
  
  // Campaign operations
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  getOrganizationCampaigns(organizationId: number): Promise<Campaign[]>;
  
  // Client operations (for agencies)
  createClient(client: InsertClient): Promise<Client>;
  getOrganizationClients(organizationId: number): Promise<Client[]>;
  
  // Integration operations
  createIntegration(integration: InsertIntegration): Promise<Integration>;
  getOrganizationIntegrations(organizationId: number): Promise<Integration[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<UpsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Organization operations
  async createOrganization(organizationData: InsertOrganization): Promise<Organization> {
    const [organization] = await db
      .insert(organizations)
      .values(organizationData)
      .returning();
    return organization;
  }

  async getOrganization(id: number): Promise<Organization | undefined> {
    const [organization] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, id));
    return organization;
  }

  async getUserOrganizations(userId: string): Promise<Organization[]> {
    const userOrgs = await db
      .select({
        organization: organizations
      })
      .from(organizationUsers)
      .innerJoin(organizations, eq(organizationUsers.organizationId, organizations.id))
      .where(eq(organizationUsers.userId, userId));
    
    return userOrgs.map(result => result.organization);
  }

  // Organization User operations
  async addUserToOrganization(data: InsertOrganizationUser): Promise<OrganizationUser> {
    const [orgUser] = await db
      .insert(organizationUsers)
      .values(data)
      .returning();
    return orgUser;
  }

  async getOrganizationUsers(organizationId: number): Promise<User[]> {
    const orgUsers = await db
      .select({
        user: users
      })
      .from(organizationUsers)
      .innerJoin(users, eq(organizationUsers.userId, users.id))
      .where(eq(organizationUsers.organizationId, organizationId));
    
    return orgUsers.map(result => result.user);
  }

  // Campaign operations
  async createCampaign(campaignData: InsertCampaign): Promise<Campaign> {
    const [campaign] = await db
      .insert(campaigns)
      .values(campaignData)
      .returning();
    return campaign;
  }

  async getOrganizationCampaigns(organizationId: number): Promise<Campaign[]> {
    return await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.organizationId, organizationId));
  }

  // Client operations (for agencies)
  async createClient(clientData: InsertClient): Promise<Client> {
    const [client] = await db
      .insert(clients)
      .values(clientData)
      .returning();
    return client;
  }

  async getOrganizationClients(organizationId: number): Promise<Client[]> {
    return await db
      .select()
      .from(clients)
      .where(eq(clients.organizationId, organizationId));
  }

  // Integration operations
  async createIntegration(integrationData: InsertIntegration): Promise<Integration> {
    const [integration] = await db
      .insert(integrations)
      .values(integrationData)
      .returning();
    return integration;
  }

  async getOrganizationIntegrations(organizationId: number): Promise<Integration[]> {
    return await db
      .select()
      .from(integrations)
      .where(eq(integrations.organizationId, organizationId));
  }
}

export const storage = new DatabaseStorage();
