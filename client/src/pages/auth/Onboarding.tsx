import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import OrganizationTypeSelection from "@/components/auth/OrganizationTypeSelection";
import AgencyOnboarding from "@/components/auth/AgencyOnboarding";
import EcomOnboarding from "@/components/auth/EcomOnboarding";
import { Loader2 } from "lucide-react";

export default function Onboarding() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [, params] = useRoute("/onboarding");
  const { toast } = useToast();
  const [step, setStep] = useState<"type-selection" | "agency-form" | "ecom-form">("type-selection");

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      navigate("/");
      return;
    }

    // Check if the user has already completed onboarding
    if (user?.onboardingComplete) {
      // In a real app, we would get the user's organizations and redirect to the right dashboard
      navigate("/dashboard/agency");
      return;
    }

    // Check for URL params to determine step
    const searchParams = new URLSearchParams(window.location.search);
    const type = searchParams.get("type");
    
    if (type === "agency") {
      setStep("agency-form");
    } else if (type === "ecom") {
      setStep("ecom-form");
    } else {
      setStep("type-selection");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      {step === "type-selection" && <OrganizationTypeSelection />}
      {step === "agency-form" && <AgencyOnboarding />}
      {step === "ecom-form" && <EcomOnboarding />}
    </>
  );
}
