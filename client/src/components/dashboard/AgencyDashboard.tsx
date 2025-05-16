import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Navbar } from "@/components/dashboard/Navbar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ClientList } from "@/components/dashboard/ClientList";
import { IntegrationCard } from "@/components/dashboard/IntegrationCard";
import { CampaignTable } from "@/components/dashboard/CampaignTable";
import { ROICalculator } from "@/components/dashboard/ROICalculator";
import { CampaignReport } from "@/components/dashboard/CampaignReport";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiUserLine, RiMoneyDollarCircleLine, RiMailSendLine, RiTeamLine } from "react-icons/ri";

// Mock data for beta testing
const mockClients = [
  { 
    id: 1, 
    organizationId: 1, 
    name: "Earthly Goods", 
    status: "active", 
    addedAt: new Date(), 
    updatedAt: new Date() 
  },
  { 
    id: 2, 
    organizationId: 1, 
    name: "Sista Teas", 
    status: "active", 
    addedAt: new Date(), 
    updatedAt: new Date() 
  },
  { 
    id: 3, 
    organizationId: 1, 
    name: "Green Valley", 
    status: "active", 
    addedAt: new Date(), 
    updatedAt: new Date() 
  },
  { 
    id: 4, 
    organizationId: 1, 
    name: "FitLife Supplements", 
    status: "active", 
    addedAt: new Date(), 
    updatedAt: new Date() 
  },
];

// Client name mapping to use in campaign table
const clientNameMap: Record<number, string> = {
  1: "Earthly Goods",
  2: "Sista Teas",
  3: "Green Valley",
  4: "FitLife Supplements"
};

// Enhanced mock campaign data based on campaign calendar
const mockCampaigns = [
  { 
    id: 1, 
    name: "Summer Sale - 15% Off", 
    status: "active", 
    startDate: new Date(2025, 5, 1), // June 1, 2025
    endDate: new Date(2025, 5, 15),  // June 15, 2025
    organizationId: 1, 
    clientId: 2,      // Sista Teas
    type: "email"
  },
  { 
    id: 2, 
    name: "New Product Launch - Tea Collection", 
    status: "scheduled", 
    startDate: new Date(2025, 5, 20), // June 20, 2025
    endDate: new Date(2025, 5, 30),   // June 30, 2025
    organizationId: 1, 
    clientId: 2,      // Sista Teas
    type: "email"
  },
  { 
    id: 3, 
    name: "Fourth of July Special", 
    status: "draft", 
    startDate: new Date(2025, 6, 1),  // July 1, 2025
    endDate: new Date(2025, 6, 7),    // July 7, 2025
    organizationId: 1, 
    clientId: 2,      // Sista Teas
    type: "sms"
  },
  { 
    id: 4, 
    name: "Summer Wellness Bundle", 
    status: "active", 
    startDate: new Date(2025, 5, 10),  // June 10, 2025
    endDate: new Date(2025, 5, 25),    // June 25, 2025
    organizationId: 1, 
    clientId: 1,      // Earthly Goods
    type: "email"
  },
  { 
    id: 5, 
    name: "Back to School Promo", 
    status: "scheduled", 
    startDate: new Date(2025, 7, 1),   // August 1, 2025
    endDate: new Date(2025, 7, 15),    // August 15, 2025
    organizationId: 1, 
    clientId: 4,      // FitLife Supplements
    type: "email"
  },
];

const mockIntegrations = [
  { 
    id: 1, 
    name: "Klaviyo", 
    status: "connected", 
    type: "email", 
    organizationId: 1, 
    updatedAt: new Date(), 
    createdAt: new Date(),
    description: "Email marketing automation platform"
  },
  { 
    id: 2, 
    name: "Shopify", 
    status: "connected", 
    type: "ecommerce", 
    organizationId: 1, 
    updatedAt: new Date(), 
    createdAt: new Date(),
    description: "E-commerce platform"
  },
  { 
    id: 3, 
    name: "Twilio", 
    status: "disconnected", 
    type: "sms", 
    organizationId: 1, 
    updatedAt: new Date(), 
    createdAt: new Date(),
    description: "SMS messaging service"
  },
  { 
    id: 4, 
    name: "Omnisend", 
    status: "pending", 
    type: "email", 
    organizationId: 1, 
    updatedAt: new Date(), 
    createdAt: new Date(),
    description: "Marketing automation platform for ecommerce"
  },
];

export const AgencyDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Map client id to name for ease of display
  const campaignsWithClientNames = mockCampaigns.map(campaign => ({
    ...campaign,
    clientName: clientNameMap[(campaign as any).clientId] || 'Unknown Client'
  }));
  const campaigns = campaignsWithClientNames;
  const integrations = mockIntegrations;
  
  const clientsLoading = false;
  const campaignsLoading = false;
  const integrationsLoading = false;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  // Client Performance Data
  const clientPerformance = [
    { name: "Sista Teas", emailsSent: 2500, opened: 1275, clicked: 625, revenue: 12450 },
    { name: "Earthly Goods", emailsSent: 1800, opened: 900, clicked: 450, revenue: 8900 },
    { name: "Green Valley", emailsSent: 1200, opened: 540, clicked: 300, revenue: 6200 },
    { name: "FitLife Supplements", emailsSent: 1550, opened: 680, clicked: 310, revenue: 7100 }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex h-screen overflow-hidden">
        <Sidebar 
          type="agency" 
          onLogout={handleLogout} 
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />
        
        <div className="flex flex-col flex-1 w-full overflow-hidden transition-all duration-300">
          <Navbar type="agency" onToggleSidebar={toggleSidebar} />
          
          <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 md:p-6 lg:p-8 w-full">
            <div className="pb-6 w-full">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-white">Agency Dashboard</h1>
                  <p className="mt-1 text-gray-400">Welcome back, here's what's happening today.</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow-lg shadow-blue-500/30">
                    + New Campaign
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6 w-full">
              <StatsCard
                title="Total Clients"
                value="4"
                change={{ value: "+1", type: "increase" }}
                icon={RiUserLine}
                iconBgColor="bg-blue-500/20"
                iconColor="text-blue-500"
              />
              <StatsCard
                title="Monthly Revenue"
                value="$34,592"
                change={{ value: "+5.2%", type: "increase" }}
                icon={RiMoneyDollarCircleLine}
                iconBgColor="bg-green-500/20"
                iconColor="text-green-500"
              />
              <StatsCard
                title="Campaigns Sent"
                value="24"
                change={{ value: "+8", type: "increase" }}
                icon={RiMailSendLine}
                iconBgColor="bg-purple-500/20"
                iconColor="text-purple-500"
              />
              <StatsCard
                title="Team Size"
                value="8"
                change={{ value: "0", type: "neutral" }}
                icon={RiTeamLine}
                iconBgColor="bg-amber-500/20"
                iconColor="text-amber-500"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 mb-6">
              <div className="col-span-2">
                <CampaignTable
                  campaigns={campaigns}
                  isLoading={campaignsLoading}
                />
              </div>
              <div>
                <ClientList
                  clients={mockClients as any}
                  isLoading={clientsLoading}
                  title="Recent Clients"
                />
              </div>
            </div>
            
            <div className="mt-4 border-t border-gray-700 pt-6">
              <h2 className="text-xl font-semibold text-white mb-4">ROI & Campaign Analytics</h2>
              <Tabs defaultValue="roi" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-700 mb-6">
                  <TabsTrigger 
                    value="roi" 
                    className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-300"
                  >
                    ROI Calculator
                  </TabsTrigger>
                  <TabsTrigger 
                    value="report" 
                    className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-300"
                  >
                    Campaign Reports
                  </TabsTrigger>
                  <TabsTrigger 
                    value="integrations" 
                    className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-300"
                  >
                    Integrations
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="roi">
                  <ROICalculator campaigns={campaigns as any} />
                </TabsContent>
                
                <TabsContent value="report">
                  <CampaignReport campaigns={campaigns as any} />
                </TabsContent>
                
                <TabsContent value="integrations">
                  <IntegrationCard
                    integrations={integrations || []}
                    isLoading={integrationsLoading}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AgencyDashboard;