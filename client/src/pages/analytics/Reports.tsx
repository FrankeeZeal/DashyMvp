import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ROIReport } from '@/components/dashboard/ROIReport';
import { CampaignReport } from '@/components/dashboard/CampaignReport';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Navbar } from '@/components/dashboard/Navbar';
import { useState } from 'react';

export const ReportsPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Use mock campaign data for the beta version since we don't have a real API endpoint yet
  const mockCampaigns = [
    {
      id: 1,
      name: "Summer Email Series",
      type: "Email",
      status: "Active",
      campaignType: "Email",
      clientId: 1,
      clientName: "Earthly Goods",
      recipients: 5000,
      opens: 2150,
      clicks: 850,
      conversions: 125,
      revenue: 12500,
      cost: 1850,
      roi: 675.7,
      date: new Date("2025-05-12"),
      organizationId: 1
    },
    {
      id: 2,
      name: "Spring Launch",
      type: "SMS",
      status: "Completed",
      campaignType: "SMS",
      clientId: 2,
      clientName: "Sista Teas",
      recipients: 3200,
      opens: 0, // SMS doesn't have opens
      clicks: 640,
      conversions: 96,
      revenue: 9600,
      cost: 1450,
      roi: 662.1,
      date: new Date("2025-04-03"),
      organizationId: 1
    },
    {
      id: 3,
      name: "Loyalty Program",
      type: "Email",
      status: "Draft",
      campaignType: "Email",
      clientId: 3,
      clientName: "Green Valley",
      recipients: 0,
      opens: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      cost: 750,
      roi: 0,
      date: new Date("2025-05-20"),
      organizationId: 1
    }
  ];
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

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
            <div className="container mx-auto px-6 py-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Reports</h1>
                <p className="text-gray-400">View and analyze all your campaign performance and ROI metrics</p>
              </div>
              
              <div className="grid grid-cols-1 gap-8">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-white mb-4">ROI Reports</h3>
                  <ROIReport 
                    campaigns={mockCampaigns}
                  />
                </div>
                
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-white mb-4">Campaign Reports</h3>
                  <CampaignReport 
                    campaigns={mockCampaigns}
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;