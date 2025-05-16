import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ROIReport } from '@/components/dashboard/ROIReport';
import { CampaignReport } from '@/components/dashboard/CampaignReport';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Navbar } from '@/components/dashboard/Navbar';
import { useState } from 'react';

export const ReportsPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ['/api/campaigns'],
    retry: false,
  });
  
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
                    campaigns={campaigns as any}
                  />
                </div>
                
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-white mb-4">Campaign Reports</h3>
                  <CampaignReport 
                    campaigns={campaigns as any}
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