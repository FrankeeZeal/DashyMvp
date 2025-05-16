import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import OrganizationTypeSelection from "@/components/auth/OrganizationTypeSelection";
import AgencyOnboarding from "@/components/auth/AgencyOnboarding";
import EcomOnboarding from "@/components/auth/EcomOnboarding";

export default function Onboarding() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<string>("type-selection");
  
  // Check URL parameters whenever the page loads or URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const type = searchParams.get("type");
    
    if (type === "agency") {
      setStep("agency-form");
    } else if (type === "ecom") {
      setStep("ecom-form");
    } else {
      setStep("type-selection");
    }
  }, [window.location.search]);

  console.log("Current step:", step); // For debugging
  
  // Render the appropriate component based on the current step
  return (
    <>
      {step === "type-selection" && <OrganizationTypeSelection />}
      {step === "agency-form" && <AgencyOnboarding />}
      {step === "ecom-form" && <EcomOnboarding />}
    </>
  );
}
