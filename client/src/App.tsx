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
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

// Create a new query client for beta testing
const queryClient = new QueryClient();

function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Effect to handle theme changes
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    setTheme(savedTheme);
  }, []);

  // Toggle between light and dark theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  if (!mounted) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full border-0 bg-white/90 dark:bg-slate-800/90 w-10 h-10 shadow-md transition-transform hover:scale-110"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        <Moon className="h-5 w-5 text-blue-500" />
      )}
    </Button>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 ease-in-out">
            <div className="fixed top-4 right-4 z-50">
              <ThemeToggle />
            </div>
            <Toaster />
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <Switch>
                {/* For beta testing - direct routing */}
                <Route path="/" component={Login} />
                <Route path="/onboarding" component={Onboarding} />
                <Route path="/dashboard/agency" component={AgencyDashboard} />
                <Route path="/dashboard/ecom" component={EcomDashboard} />
                
                {/* Fallback to 404 */}
                <Route component={NotFound} />
              </Switch>
            </div>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
