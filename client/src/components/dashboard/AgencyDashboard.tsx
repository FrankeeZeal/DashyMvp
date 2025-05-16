import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Navbar } from "@/components/dashboard/Navbar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ClientList } from "@/components/dashboard/ClientList";
import { IntegrationCard } from "@/components/dashboard/IntegrationCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiUserLine, RiMoneyDollarCircleLine, RiMailSendLine, RiTeamLine } from "react-icons/ri";

export const AgencyDashboard = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: organizations, isLoading: orgsLoading } = useQuery({
    queryKey: ["/api/organizations"],
  });

  // Use the first organization found for the agency (in a real app, we'd want to handle multiple orgs)
  const activeOrganization = organizations && organizations.length > 0 
    ? organizations.find(org => org.type === 'agency') 
    : null;

  const { data: clients, isLoading: clientsLoading } = useQuery({
    queryKey: activeOrganization ? [`/api/organizations/${activeOrganization.id}/clients`] : null,
    enabled: !!activeOrganization,
  });

  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: activeOrganization ? [`/api/organizations/${activeOrganization.id}/campaigns`] : null,
    enabled: !!activeOrganization,
  });

  const { data: integrations, isLoading: integrationsLoading } = useQuery({
    queryKey: activeOrganization ? [`/api/organizations/${activeOrganization.id}/integrations`] : null,
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
        <Sidebar type="agency" onLogout={handleLogout} />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar type="agency" onToggleSidebar={toggleSidebar} />
          
          <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 md:p-6">
            <div className="pb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Agency Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">Welcome back! Here's an overview of your agency's performance.</p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Clients"
                value={clients?.length || 0}
                change={{ value: "8%", type: "increase" }}
                icon={RiUserLine}
                iconBgColor="bg-primary-50"
                iconColor="text-primary-700"
              />
              
              <StatsCard
                title="Monthly Revenue"
                value="$48,924"
                change={{ value: "12%", type: "increase" }}
                icon={RiMoneyDollarCircleLine}
                iconBgColor="bg-green-50"
                iconColor="text-green-700"
              />
              
              <StatsCard
                title="Active Campaigns"
                value={campaigns?.filter(c => c.status === 'active').length || 0}
                change={{ value: "4%", type: "increase" }}
                icon={RiMailSendLine}
                iconBgColor="bg-blue-50"
                iconColor="text-blue-700"
              />
              
              <StatsCard
                title="Team Members"
                value="9"
                change={{ value: "2 new", type: "increase" }}
                icon={RiTeamLine}
                iconBgColor="bg-purple-50"
                iconColor="text-purple-700"
              />
            </div>
            
            {/* Main Content Grid */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Client Performance Chart */}
              <Card>
                <CardHeader className="pb-3 border-b">
                  <CardTitle>Client Performance</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-64 rounded-lg bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">Chart visualization goes here</p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Campaign Performance */}
              <Card>
                <CardHeader className="pb-3 border-b">
                  <CardTitle>Campaign Performance</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-64 rounded-lg bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">Chart visualization goes here</p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Clients */}
              <ClientList
                clients={clients || []}
                isLoading={clientsLoading}
                title="Recent Clients"
              />
              
              {/* Integration Status */}
              <IntegrationCard
                integrations={integrations || []}
                isLoading={integrationsLoading}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AgencyDashboard;
