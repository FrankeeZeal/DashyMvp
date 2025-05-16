import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Login from "@/pages/auth/Login";
import Onboarding from "@/pages/auth/Onboarding";
import AgencyDashboard from "@/pages/dashboard/AgencyDashboard";
import EcomDashboard from "@/pages/dashboard/EcomDashboard";
import ReportsPage from "@/pages/analytics/Reports";
import { ClientDetail } from "@/pages/clients/ClientDetail";
import { AllClients } from "@/pages/clients/AllClients";
import { useEffect } from "react";

// Create a new query client for beta testing
const queryClient = new QueryClient();

function App() {
  // Apply dark mode by default
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-900 text-gray-100">
          <Toaster />
          <div className="w-full">
            <Switch>
              {/* For beta testing - direct routing */}
              <Route path="/" component={Login} />
              <Route path="/onboarding" component={Onboarding} />
              <Route path="/dashboard/agency" component={AgencyDashboard} />
              <Route path="/dashboard/ecom" component={EcomDashboard} />
              <Route path="/dashboard/agency/analytics/reports" component={ReportsPage} />
              <Route path="/dashboard/ecom/analytics/reports" component={ReportsPage} />
              <Route path="/dashboard/clients/all" component={AllClients} />
              <Route path="/dashboard/agency/clients/:id" component={ClientDetail} />
              
              {/* Fallback to 404 */}
              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
