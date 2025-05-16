import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import AuthContainer from "@/components/auth/AuthContainer";

export default function Login() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.onboardingComplete) {
        // Redirect to the dashboard based on organization type
        // For simplicity, we're assuming the first organization in the list
        // In a real app, you'd want to store the active organization in state
        navigate("/onboarding");
      } else {
        // User needs to complete onboarding
        navigate("/onboarding");
      }
    }
  }, [isAuthenticated, user, navigate]);

  return <AuthContainer />;
}
