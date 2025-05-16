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
  
  // Get a specific client by ID
  app.get('/api/clients/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      
      // For MVP demo data - consistent with the client list
      const demoClients = [
        { 
          id: 1, 
          organizationId: 1, 
          name: "Earthly Goods", 
          status: "active", 
          hasEmailData: true, 
          hasSmsData: false,
          addedAt: new Date(2023, 0, 12)
        },
        { 
          id: 2, 
          organizationId: 1, 
          name: "Sista Teas", 
          status: "active", 
          hasEmailData: true, 
          hasSmsData: true,
          addedAt: new Date(2023, 0, 8)
        },
        { 
          id: 3, 
          organizationId: 1, 
          name: "Mountain Wellness", 
          status: "active",
          hasEmailData: false, 
          hasSmsData: true,
          addedAt: new Date(2023, 0, 3)
        }
      ];
      
      const client = demoClients.find(c => c.id === parseInt(id));
      
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      
      res.json(client);
    } catch (error) {
      console.error("Error fetching client:", error);
      res.status(500).json({ message: "Failed to fetch client" });
    }
  });
  
  // Get campaigns for a specific client
  app.get('/api/clients/:id/campaigns', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const clientId = parseInt(id, 10);
      
      // Demo campaigns data
      const demoCampaigns = [
        {
          id: 1,
          clientId: 1,
          name: "Spring Sale Newsletter",
          type: "email",
          recipients: 4500,
          opens: 1800,
          clicks: 720,
          conversions: 124,
          revenue: 11340,
          cost: 2500,
          sentDate: new Date(2023, 2, 15) // March 15, 2023
        },
        {
          id: 2,
          clientId: 1,
          name: "New Product Announcement",
          type: "email",
          recipients: 5000,
          opens: 2200,
          clicks: 950,
          conversions: 187,
          revenue: 14025,
          cost: 3000,
          sentDate: new Date(2023, 3, 1) // April 1, 2023
        },
        {
          id: 3,
          clientId: 2,
          name: "Summer Collection Launch",
          type: "email",
          recipients: 8200,
          opens: 4100,
          clicks: 1640,
          conversions: 328,
          revenue: 29520,
          cost: 4500,
          sentDate: new Date(2023, 4, 10) // May 10, 2023
        },
        {
          id: 4,
          clientId: 2,
          name: "Flash Sale Alert",
          type: "sms",
          recipients: 3200,
          opens: 2800,
          clicks: 1120,
          conversions: 224,
          revenue: 13440,
          cost: 2000,
          sentDate: new Date(2023, 4, 20) // May 20, 2023
        },
        {
          id: 5,
          clientId: 3,
          name: "Weekly Wellness Tips",
          type: "sms",
          recipients: 2500,
          opens: 2000,
          clicks: 800,
          conversions: 150,
          revenue: 7500,
          cost: 1500,
          sentDate: new Date(2023, 5, 5) // June 5, 2023
        }
      ];
      
      // Filter campaigns by client ID
      const clientCampaigns = demoCampaigns.filter(campaign => campaign.clientId === clientId);
      
      res.json(clientCampaigns);
    } catch (error) {
      console.error("Error fetching client campaigns:", error);
      res.status(500).json({ message: "Failed to fetch client campaigns" });
    }
  });
  
  // Get integrations for a specific client
  app.get('/api/clients/:id/integrations', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const clientId = parseInt(id, 10);
      
      // Demo integrations data - initially empty for the MVP
      // This allows the frontend to manage and display integration states
      const clientIntegrations = [];
      
      res.json(clientIntegrations);
    } catch (error) {
      console.error("Error fetching client integrations:", error);
      res.status(500).json({ message: "Failed to fetch client integrations" });
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
