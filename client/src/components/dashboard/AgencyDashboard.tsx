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
    createdAt: new Date() 
  },
  { 
    id: 2, 
    name: "Twilio", 
    status: "pending", 
    type: "sms", 
    organizationId: 1, 
    updatedAt: new Date(), 
    createdAt: new Date() 
  },
  { 
    id: 3, 
    name: "Omnisend", 
    status: "connected", 
    type: "email", 
    organizationId: 1, 
    updatedAt: new Date(), 
    createdAt: new Date() 
  },
];

export const AgencyDashboard = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Using data for development
  const clients = mockClients;
  // Add client names to campaign data
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
        
        <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-0'}`}>
          <Navbar type="agency" onToggleSidebar={toggleSidebar} />
          
          <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 md:p-6">
            <div className="pb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-white">Agency Dashboard</h1>
                  <p className="mt-1 text-sm text-gray-400">Welcome back! Here's an overview of your agency's performance.</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="inline-flex rounded-md shadow">
                    <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Export Reports
                    </button>
                  </div>
                </div>
              </div>
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
            <div className="mt-6 grid grid-cols-1 gap-6">
              {/* Campaign Table */}
              <div className="overflow-hidden shadow-xl shadow-blue-500/20 rounded-lg border border-gray-800">
                <CampaignTable
                  campaigns={campaigns as any}
                  isLoading={campaignsLoading}
                />
              </div>
            
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Client Performance Chart */}
                <Card className="bg-gray-800 shadow-xl shadow-blue-500/20 border border-gray-700">
                  <CardHeader className="pb-3 border-b border-gray-700">
                    <CardTitle className="text-white">Client Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-700">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Client</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Emails Sent</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Open Rate</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Click Rate</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Revenue</th>
                          </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                          {clientPerformance.map((client, index) => (
                            <tr key={index} className="hover:bg-gray-700">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{client.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{client.emailsSent.toLocaleString()}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                <div className="flex items-center">
                                  <span className="mr-2">{Math.round((client.opened / client.emailsSent) * 100)}%</span>
                                  <div className="w-16 bg-gray-600 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full shadow-sm shadow-blue-500/50" style={{ width: `${(client.opened / client.emailsSent) * 100}%` }}></div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                <div className="flex items-center">
                                  <span className="mr-2">{Math.round((client.clicked / client.emailsSent) * 100)}%</span>
                                  <div className="w-16 bg-gray-600 rounded-full h-2">
                                    <div className="bg-blue-400 h-2 rounded-full shadow-sm shadow-blue-400/50" style={{ width: `${(client.clicked / client.emailsSent) * 100}%` }}></div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${client.revenue.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Recent Clients */}
                <ClientList
                  clients={clients || []}
                  isLoading={clientsLoading}
                  title="Recent Clients"
                />
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
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AgencyDashboard;
