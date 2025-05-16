// For beta testing, we'll use a simpler approach without React Query
// This will make the app work more smoothly for testing

// Test user for the beta version
const testUser = {
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

export function useAuth() {
  return {
    user: testUser,
    isLoading: false,
    isAuthenticated: true // Always authenticated for beta testing
  };
}
