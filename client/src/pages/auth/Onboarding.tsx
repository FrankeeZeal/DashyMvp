import { useState } from "react";
import { useLocation } from "wouter";
import OrganizationTypeSelection from "@/components/auth/OrganizationTypeSelection";
import AgencyOnboarding from "@/components/auth/AgencyOnboarding";
import EcomOnboarding from "@/components/auth/EcomOnboarding";

export default function Onboarding() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<string>(() => {
    // Check URL params to determine step on initial load
    const searchParams = new URLSearchParams(window.location.search);
    const type = searchParams.get("type");
    
    if (type === "agency") return "agency-form";
    if (type === "ecom") return "ecom-form";
    return "type-selection";
  });

  // Simplified for beta testing
  return (
    <>
      {step === "type-selection" && <OrganizationTypeSelection />}
      {step === "agency-form" && <AgencyOnboarding />}
      {step === "ecom-form" && <EcomOnboarding />}
    </>
  );
}
