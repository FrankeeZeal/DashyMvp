import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import NotFound from "@/pages/not-found";
import Login from "@/pages/auth/Login";
import Onboarding from "@/pages/auth/Onboarding";
import AgencyDashboard from "@/pages/dashboard/AgencyDashboard";
import EcomDashboard from "@/pages/dashboard/EcomDashboard";

// Create a new query client for beta testing
const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Switch>
            {/* For beta testing - direct routing */}
            <Route path="/" component={Login} />
            <Route path="/onboarding" component={Onboarding} />
            <Route path="/dashboard/agency" component={AgencyDashboard} />
            <Route path="/dashboard/ecom" component={EcomDashboard} />
            
            {/* Fallback to 404 */}
            <Route component={NotFound} />
          </Switch>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
