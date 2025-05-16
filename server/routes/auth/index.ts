import { Router } from 'express';
import { storage } from '../../storage';

const router = Router();

// Auth routes
router.get('/user', async (req: any, res) => {
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

export default router;