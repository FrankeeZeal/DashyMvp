import { Router } from 'express';
import { storage } from '../../storage';
import { z } from 'zod';
import { insertOrganizationSchema } from '@shared/schema';
import { isAuthenticated } from '../../middleware/auth';

const router = Router();

// Get all organizations for a user
router.get('/', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub || "123456"; // Fallback for MVP
    const organizations = await storage.getUserOrganizations(userId);
    res.json(organizations);
  } catch (error) {
    console.error("Error fetching organizations:", error);
    res.status(500).json({ message: "Failed to fetch organizations" });
  }
});

// Get a specific organization
router.get('/:id', isAuthenticated, async (req: any, res) => {
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

// Create a new organization
router.post('/', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub || "123456"; // Fallback for MVP
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

// Get organization campaigns
router.get('/:id/campaigns', isAuthenticated, async (req: any, res) => {
  try {
    const { id } = req.params;
    const campaigns = await storage.getOrganizationCampaigns(parseInt(id));
    res.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ message: "Failed to fetch campaigns" });
  }
});

// Get organization clients
router.get('/:id/clients', isAuthenticated, async (req: any, res) => {
  try {
    const { id } = req.params;
    const clients = await storage.getOrganizationClients(parseInt(id));
    res.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ message: "Failed to fetch clients" });
  }
});

// Get organization integrations
router.get('/:id/integrations', isAuthenticated, async (req: any, res) => {
  try {
    const { id } = req.params;
    const integrations = await storage.getOrganizationIntegrations(parseInt(id));
    res.json(integrations);
  } catch (error) {
    console.error("Error fetching integrations:", error);
    res.status(500).json({ message: "Failed to fetch integrations" });
  }
});

export default router;