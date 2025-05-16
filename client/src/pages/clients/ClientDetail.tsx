import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Navbar } from '@/components/dashboard/Navbar';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CampaignTable } from '@/components/dashboard/CampaignTable';
import { ManualDataTable } from '@/components/clients/ManualDataTable';
import { ClientIntegrations } from '@/components/clients/ClientIntegrations';
import { ClientAnalytics } from '@/components/clients/ClientAnalytics';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Loader2, Mail, MessageSquare, BarChart3, Database, Zap, Users } from "lucide-react";

// Define client data interface
interface ClientData {
  id: number;
  organizationId: number;
  name: string;
  status: string;
  hasEmailData?: boolean;
  hasSmsData?: boolean;
  addedAt?: Date;
}

// Define campaign data interface
interface CampaignData {
  id: number;
  clientId: number;
  name: string;
  type: string;
  recipients: number;
  opens: number;
  clicks: number;
  conversions: number;
  revenue: number;
  cost: number;
  sentDate: Date;
}

export const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dataSourceType, setDataSourceType] = useState<string>("both");
  const [displayMode, setDisplayMode] = useState<string>("analytics");
  
  // Get client details
  const { data: client, isLoading: clientLoading } = useQuery<ClientData>({
    queryKey: [`/api/clients/${id}`],
    retry: false,
  });
  
  // Fetch campaigns for this client
  const { data: campaigns, isLoading: campaignsLoading } = useQuery<CampaignData[]>({
    queryKey: [`/api/clients/${id}/campaigns`],
    retry: false,
  });
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  const handleLogout = () => {
    window.location.href = '/api/logout';
  };
  
  // Define client data based on data from backend or demo data
  // We track client IDs internally for API calls, but these are not displayed to users
  const demoClients = [
    { 
      id: 1, 
      organizationId: 1, 
      name: "Earthly Goods", 
      status: "active", 
      hasEmailData: true, 
      hasSmsData: false,
      addedAt: new Date(2023, 0, 12)
    },
    { 
      id: 2, 
      organizationId: 1, 
      name: "Sista Teas", 
      status: "active", 
      hasEmailData: true, 
      hasSmsData: true,
      addedAt: new Date(2023, 0, 8)
    },
    { 
      id: 3, 
      organizationId: 1, 
      name: "Mountain Wellness", 
      status: "active",
      hasEmailData: false, 
      hasSmsData: true,
      addedAt: new Date(2023, 0, 3)
    },
    { 
      id: 4, 
      organizationId: 1, 
      name: "Fitlife Supplements", 
      status: "active",
      hasEmailData: true, 
      hasSmsData: true,
      addedAt: new Date(2023, 1, 15)
    }
  ];
  
  // Try to get client by ID from demo data
  const clientIdNum = parseInt(id as string, 10);
  const demoClient = demoClients.find(c => c.id === clientIdNum);
  
  // Use API data if available, otherwise fallback to demo data
  const clientData: ClientData = client || demoClient || {
    id: clientIdNum,
    organizationId: 1,
    name: `Client ${id}`,
    status: 'active',
    hasEmailData: true,
    hasSmsData: true,
    addedAt: new Date()
  };
  
  const hasData = clientData ? (clientData.hasEmailData || clientData.hasSmsData) : false;
  
  // Filter campaigns based on data source type
  const filteredCampaigns = campaigns && Array.isArray(campaigns) 
    ? campaigns.filter(campaign => {
        if (dataSourceType === "both") return true;
        return campaign.type?.toLowerCase() === dataSourceType.toLowerCase();
      }) 
    : [];
  
  // Display loading state while fetching client data
  if (clientLoading) {
    return (
      <div className="flex h-screen bg-gray-900">
        <Sidebar 
          type="agency"
          onLogout={handleLogout}
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar type="agency" onToggleSidebar={toggleSidebar} />
          
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-300">Loading client data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar 
        type="agency"
        onLogout={handleLogout}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar type="agency" onToggleSidebar={toggleSidebar} />
        
        <div className="flex-1 overflow-auto">
          <main className="flex-1 h-screen overflow-auto bg-gray-900 text-white">
            {/* Client Header */}
            <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
              <div className="container mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white">{clientData.name}</h1>
                  </div>
                  <div className="mt-3 md:mt-0">
                    <Link href="/dashboard/clients/all">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Users className="h-4 w-4 mr-2" />
                        Manage Clients
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Client Content */}
            <div className="container mx-auto px-6 py-8">
              {/* Data source toggle - Shown only if client has data */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Data Source</p>
                  <ToggleGroup 
                    type="single" 
                    value={dataSourceType}
                    onValueChange={(value) => value && setDataSourceType(value)}
                    variant="outline"
                    className="bg-gray-800 border border-gray-700 rounded-md"
                  >
                    <ToggleGroupItem value="both" className="data-[state=on]:bg-blue-900/50 data-[state=on]:text-blue-300 data-[state=on]:border-blue-500/30">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Both
                    </ToggleGroupItem>
                    <ToggleGroupItem value="email" className="data-[state=on]:bg-blue-900/50 data-[state=on]:text-blue-300 data-[state=on]:border-blue-500/30">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </ToggleGroupItem>
                    <ToggleGroupItem value="sms" className="data-[state=on]:bg-blue-900/50 data-[state=on]:text-blue-300 data-[state=on]:border-blue-500/30">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      SMS
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-2">Display Mode</p>
                  <ToggleGroup 
                    type="single" 
                    value={displayMode}
                    onValueChange={(value) => value && setDisplayMode(value)}
                    variant="outline"
                    className="bg-gray-800 border border-gray-700 rounded-md"
                  >
                    <ToggleGroupItem value="analytics" className="data-[state=on]:bg-blue-900/50 data-[state=on]:text-blue-300 data-[state=on]:border-blue-500/30">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </ToggleGroupItem>
                    <ToggleGroupItem value="integrations" className="data-[state=on]:bg-blue-900/50 data-[state=on]:text-blue-300 data-[state=on]:border-blue-500/30">
                      <Zap className="h-4 w-4 mr-2" />
                      Integrations
                    </ToggleGroupItem>
                    <ToggleGroupItem value="manual" className="data-[state=on]:bg-blue-900/50 data-[state=on]:text-blue-300 data-[state=on]:border-blue-500/30">
                      <Database className="h-4 w-4 mr-2" />
                      Manual
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
              
              {/* Display appropriate content based on selected view */}
              <div className="mt-6">
                {displayMode === "analytics" && (
                  hasData ? (
                    <ClientAnalytics clientId={clientData.id} dataSourceType={dataSourceType} />
                  ) : (
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-10 text-center">
                      <p className="text-xl text-gray-400">No data available for this client</p>
                      <p className="text-gray-500 mt-2">Connect an integration or add manual data to get started</p>
                    </div>
                  )
                )}
                
                {displayMode === "integrations" && (
                  <ClientIntegrations clientId={clientData.id} />
                )}
                
                {displayMode === "manual" && (
                  <ManualDataTable clientId={clientData.id} clientName={clientData.name} />
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;