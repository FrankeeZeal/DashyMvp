import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  agencyOnboardingSchema, 
  ecomOnboardingSchema,
  insertOrganizationSchema, 
  insertOrganizationUserSchema,
  insertCampaignSchema,
  insertClientSchema,
  insertIntegrationSchema
} from "@shared/schema";

// Simple middleware for MVP to handle auth
const isAuthenticated = (req: Request, res: any, next: any) => {
  // For MVP, we're allowing all requests through
  // In production, this would validate the session
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // For MVP testing, return a mock user
      const mockUser = {
        id: "123456",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        profileImageUrl: null,
        role: "owner",
        onboardingComplete: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      res.json(mockUser);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Organization routes
  app.post('/api/organizations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const organizationData = insertOrganizationSchema.parse(req.body);
      
      const organization = await storage.createOrganization(organizationData);
      
      // Add user as organization owner
      await storage.addUserToOrganization({
        organizationId: organization.id,
        userId,
        role: organizationData.type === 'agency' ? 'owner' : 'owner'
      });

      res.status(201).json(organization);
    } catch (error) {
      console.error("Error creating organization:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create organization" });
    }
  });

  app.get('/api/organizations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const organizations = await storage.getUserOrganizations(userId);
      res.json(organizations);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      res.status(500).json({ message: "Failed to fetch organizations" });
    }
  });

  app.get('/api/organizations/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const organization = await storage.getOrganization(parseInt(id));
      
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }
      
      res.json(organization);
    } catch (error) {
      console.error("Error fetching organization:", error);
      res.status(500).json({ message: "Failed to fetch organization" });
    }
  });

  // Complete onboarding routes
  app.post('/api/onboarding/agency', isAuthenticated, async (req: any, res) => {
    try {
      // For MVP, use a fixed userId since we're not using full auth
      const userId = "123456"; // Fixed userId for testing
      const data = agencyOnboardingSchema.parse(req.body);
      
      // Create organization
      const organization = await storage.createOrganization({
        name: data.name,
        type: 'agency',
        age: data.age,
        teamSize: data.teamSize,
        trackingMethod: data.trackingMethod
      });
      
      // Add user to organization
      await storage.addUserToOrganization({
        organizationId: organization.id,
        userId,
        role: 'owner'
      });
      
      // Mark onboarding as complete
      await storage.updateUser(userId, { onboardingComplete: true });
      
      res.status(201).json({ success: true, organization });
    } catch (error) {
      console.error("Error completing agency onboarding:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to complete onboarding" });
    }
  });
  
  app.post('/api/onboarding/ecom', isAuthenticated, async (req: any, res) => {
    try {
      // For MVP, use a fixed userId since we're not using full auth
      const userId = "123456"; // Fixed userId for testing
      const data = ecomOnboardingSchema.parse(req.body);
      
      // Create organization
      const organization = await storage.createOrganization({
        name: data.name,
        type: 'ecom',
        url: data.url,
        age: data.age,
        revenue: data.revenue,
        trackingMethod: data.trackingMethod,
        teamSize: data.teamSize,
        retentionTeam: data.retentionTeam
      });
      
      // Add user to organization
      await storage.addUserToOrganization({
        organizationId: organization.id,
        userId,
        role: 'owner'
      });
      
      // Mark onboarding as complete
      await storage.updateUser(userId, { onboardingComplete: true });
      
      res.status(201).json({ success: true, organization });
    } catch (error) {
      console.error("Error completing ecom onboarding:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to complete onboarding" });
    }
  });

  // Campaign routes
  app.post('/api/campaigns', isAuthenticated, async (req: any, res) => {
    try {
      const campaignData = insertCampaignSchema.parse(req.body);
      const campaign = await storage.createCampaign(campaignData);
      res.status(201).json(campaign);
    } catch (error) {
      console.error("Error creating campaign:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create campaign" });
    }
  });

  app.get('/api/organizations/:id/campaigns', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const campaigns = await storage.getOrganizationCampaigns(parseInt(id));
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  // Client routes (for agencies)
  app.post('/api/clients', isAuthenticated, async (req: any, res) => {
    try {
      const clientData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(clientData);
      res.status(201).json(client);
    } catch (error) {
      console.error("Error creating client:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create client" });
    }
  });

  app.get('/api/organizations/:id/clients', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const clients = await storage.getOrganizationClients(parseInt(id));
      res.json(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  // Integration routes
  app.post('/api/integrations', isAuthenticated, async (req: any, res) => {
    try {
      const integrationData = insertIntegrationSchema.parse(req.body);
      const integration = await storage.createIntegration(integrationData);
      res.status(201).json(integration);
    } catch (error) {
      console.error("Error creating integration:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create integration" });
    }
  });

  app.get('/api/organizations/:id/integrations', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const integrations = await storage.getOrganizationIntegrations(parseInt(id));
      res.json(integrations);
    } catch (error) {
      console.error("Error fetching integrations:", error);
      res.status(500).json({ message: "Failed to fetch integrations" });
    }
  });

  // User management routes
  app.post('/api/organizations/:id/users', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      
      // For MVP, use fixed userId
      const userId = "123456"; 
      
      const userData = insertOrganizationUserSchema.parse({
        ...req.body,
        organizationId: parseInt(id),
        userId: req.body.userId || userId
      });
      
      const result = await storage.addUserToOrganization(userData);
      res.status(201).json(result);
    } catch (error) {
      console.error("Error adding user to organization:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add user to organization" });
    }
  });

  app.get('/api/organizations/:id/users', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      // For MVP testing
      const users = await storage.getOrganizationUsers(parseInt(id));
      res.json(users);
    } catch (error) {
      console.error("Error fetching organization users:", error);
      res.status(500).json({ message: "Failed to fetch organization users" });
    }
  });
  
  // Add team members route (for onboarding)
  app.post('/api/team-members', isAuthenticated, async (req: any, res) => {
    try {
      const { organizationId, members } = req.body;
      
      // Fixed userId for MVP
      const userId = "123456";
      
      // Validate organization exists
      const organization = await storage.getOrganization(organizationId);
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }
      
      const results = [];
      
      // Add each team member
      for (const member of members) {
        // Create team membership
        const result = await storage.addUserToOrganization({
          organizationId,
          userId: member.userId || `member-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Generate a temp userId
          role: member.role
        });
        
        results.push(result);
      }
      
      res.status(201).json({ success: true, results });
    } catch (error) {
      console.error("Error adding team members:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add team members" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
