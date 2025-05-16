import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Navbar } from "@/components/dashboard/Navbar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CampaignTable } from "@/components/dashboard/CampaignTable";
import { TrainingCard } from "@/components/dashboard/TrainingCard";
import { RiMoneyDollarCircleLine, RiMailLine, RiMessage2Line, RiPercentLine } from "react-icons/ri";

export const EcomDashboard = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: organizations, isLoading: orgsLoading } = useQuery({
    queryKey: ["/api/organizations"],
  });

  // Use the first organization found for the ecom store (in a real app, we'd want to handle multiple orgs)
  const activeOrganization = organizations && organizations.length > 0 
    ? organizations.find(org => org.type === 'ecom') 
    : null;

  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: activeOrganization ? [`/api/organizations/${activeOrganization.id}/campaigns`] : null,
    enabled: !!activeOrganization,
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <Sidebar type="ecom" onLogout={handleLogout} />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar type="ecom" onToggleSidebar={toggleSidebar} />
          
          <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 md:p-6">
            <div className="pb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Ecommerce Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">Welcome back! Here's an overview of your store's performance.</p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Revenue (This Month)"
                value="$24,568"
                change={{ value: "14%", type: "increase" }}
                icon={RiMoneyDollarCircleLine}
                iconBgColor="bg-green-50"
                iconColor="text-green-700"
              />
              
              <StatsCard
                title="Email Subscribers"
                value="12,489"
                change={{ value: "2.3%", type: "increase" }}
                icon={RiMailLine}
                iconBgColor="bg-blue-50"
                iconColor="text-blue-700"
              />
              
              <StatsCard
                title="SMS Subscribers"
                value="5,872"
                change={{ value: "3.1%", type: "increase" }}
                icon={RiMessage2Line}
                iconBgColor="bg-purple-50"
                iconColor="text-purple-700"
              />
              
              <StatsCard
                title="Conversion Rate"
                value="3.2%"
                change={{ value: "0.4%", type: "increase" }}
                icon={RiPercentLine}
                iconBgColor="bg-yellow-50"
                iconColor="text-yellow-700"
              />
            </div>
            
            {/* Campaign Performance */}
            <div className="mt-6">
              <CampaignTable
                campaigns={campaigns || []}
                isLoading={campaignsLoading}
              />
            </div>
            
            {/* Training Resources */}
            <div className="mt-6">
              <TrainingCard />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default EcomDashboard;
