import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import NotFound from "@/pages/not-found";
import Login from "@/pages/auth/Login";
import Onboarding from "@/pages/auth/Onboarding";
import AgencyDashboard from "@/pages/dashboard/AgencyDashboard";
import EcomDashboard from "@/pages/dashboard/EcomDashboard";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

function Router() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  // Display loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Login} />
      
      {/* Auth required routes */}
      <Route path="/onboarding">
        {isAuthenticated ? <Onboarding /> : <Login />}
      </Route>
      <Route path="/dashboard/agency">
        {isAuthenticated ? <AgencyDashboard /> : <Login />}
      </Route>
      <Route path="/dashboard/ecom">
        {isAuthenticated ? <EcomDashboard /> : <Login />}
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
