import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { EcomDashboard as EcomDashboardComponent } from "@/components/dashboard/EcomDashboard";
import { Loader2 } from "lucide-react";

export default function EcomDashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
      return;
    }

    // This would typically check if the user belongs to an ecom store
    // For now, we'll just let them through
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // The useEffect will redirect
  }

  return <EcomDashboardComponent />;
}
