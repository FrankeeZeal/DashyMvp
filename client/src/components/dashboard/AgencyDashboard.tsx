import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { RiUserLine, RiMoneyDollarCircleLine, RiMailSendLine, RiTeamLine, RiAddLine } from "react-icons/ri";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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

// Define the dashboard widget types
type WidgetType = 'stats' | 'campaigns' | 'clients' | 'roi-analytics';

interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
}

interface DashboardBucket {
  id: string;
  title: string;
  widgets: DashboardWidget[];
}

export const AgencyDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  // Define widget sizes
  interface WidgetSize {
    width: 'full' | 'half';
    height: 'auto';
  }
  
  // Extend DashboardWidget with size
  interface EnhancedWidget extends DashboardWidget {
    size: WidgetSize;
  }
  
  // Enhance bucket definition
  interface EnhancedBucket extends Omit<DashboardBucket, 'widgets'> {
    widgets: EnhancedWidget[];
    columns: 1 | 2;
  }

  // Initial dashboard layout with buckets and sizing
  const [dashboardBuckets, setDashboardBuckets] = useState<EnhancedBucket[]>([
    {
      id: 'main-bucket',
      title: 'Main Dashboard',
      columns: 2,
      widgets: [
        { 
          id: 'stats-widget', 
          type: 'stats', 
          title: 'Key Stats',
          size: { width: 'full', height: 'auto' } 
        },
        { 
          id: 'campaigns-widget', 
          type: 'campaigns', 
          title: 'Campaigns',
          size: { width: 'half', height: 'auto' } 
        },
        { 
          id: 'clients-widget', 
          type: 'clients', 
          title: 'Clients',
          size: { width: 'half', height: 'auto' } 
        }
      ]
    },
    {
      id: 'analytics-bucket',
      title: 'Analytics',
      columns: 1,
      widgets: [
        { 
          id: 'roi-widget', 
          type: 'roi-analytics', 
          title: 'ROI & Analytics',
          size: { width: 'full', height: 'auto' } 
        }
      ]
    }
  ]);
  
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
  
  // Handle drag end event for rearranging widgets
  const handleDragEnd = (result: any) => {
    const { source, destination } = result;
    
    // Dropped outside the list
    if (!destination) {
      return;
    }
    
    // Moving within the same bucket
    if (source.droppableId === destination.droppableId) {
      const bucketIndex = dashboardBuckets.findIndex(bucket => bucket.id === source.droppableId);
      if (bucketIndex === -1) return;
      
      const newBucket = {...dashboardBuckets[bucketIndex]};
      const widgets = Array.from(newBucket.widgets);
      const [removed] = widgets.splice(source.index, 1);
      
      // If moving to beginning of row and it's a 2-column layout, 
      // make the widget full-width if it's at position 0
      if (destination.index === 0 && newBucket.columns === 2) {
        // Widget at position 0 could be full-width
        if (removed.size.width === 'half') {
          // Check if there's a need to adjust other widgets
          if (widgets.length > 0 && widgets[0].size.width === 'half') {
            // If the next widget is half-width, make it full-width to avoid layout issues
            widgets[0].size.width = 'full';
          }
        }
      }
      
      widgets.splice(destination.index, 0, removed);
      
      const newBuckets = [...dashboardBuckets];
      newBuckets[bucketIndex] = {...newBucket, widgets};
      
      setDashboardBuckets(newBuckets);
    } else {
      // Moving from one bucket to another
      const sourceBucketIndex = dashboardBuckets.findIndex(bucket => bucket.id === source.droppableId);
      const destBucketIndex = dashboardBuckets.findIndex(bucket => bucket.id === destination.droppableId);
      
      if (sourceBucketIndex === -1 || destBucketIndex === -1) return;
      
      const newBuckets = [...dashboardBuckets];
      const sourceWidgets = Array.from(newBuckets[sourceBucketIndex].widgets);
      const destWidgets = Array.from(newBuckets[destBucketIndex].widgets);
      
      const [removed] = sourceWidgets.splice(source.index, 1);
      
      // When moving between buckets, adjust the widget width based on destination bucket column layout
      const destBucket = newBuckets[destBucketIndex];
      
      // If moving to a single-column bucket, automatically make it full-width
      if (destBucket.columns === 1) {
        removed.size.width = 'full';
      }
      
      // If moving to beginning of a 2-column layout, consider making it full-width
      if (destination.index === 0 && destBucket.columns === 2) {
        // Optional: could make first item full-width by default
        // removed.size.width = 'full';
      }
      
      destWidgets.splice(destination.index, 0, removed);
      
      newBuckets[sourceBucketIndex] = {
        ...newBuckets[sourceBucketIndex],
        widgets: sourceWidgets
      };
      
      newBuckets[destBucketIndex] = {
        ...newBuckets[destBucketIndex],
        widgets: destWidgets
      };
      
      setDashboardBuckets(newBuckets);
    }
  };

  // Client Performance Data
  const clientPerformance = [
    { name: "Sista Teas", emailsSent: 2500, opened: 1275, clicked: 625, revenue: 12450 },
    { name: "Earthly Goods", emailsSent: 1800, opened: 900, clicked: 450, revenue: 8900 },
    { name: "Green Valley", emailsSent: 1200, opened: 540, clicked: 300, revenue: 6200 },
    { name: "FitLife Supplements", emailsSent: 1550, opened: 680, clicked: 310, revenue: 7100 }
  ];

  // Render widget based on type
  const renderWidget = (widget: DashboardWidget) => {
    switch (widget.type) {
      case 'stats':
        return (
          <div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
          </div>
        );
      case 'campaigns':
        return (
          <CampaignTable
            campaigns={campaigns}
            isLoading={campaignsLoading}
          />
        );
      case 'clients':
        return (
          <ClientList
            clients={mockClients as any}
            isLoading={clientsLoading}
            title="Recent Clients"
          />
        );
      case 'roi-analytics':
        return (
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
        );
      default:
        return null;
    }
  };

  // Custom drag handle component with 6 dots
  const DragHandle = ({ showInEditMode = false }: { showInEditMode?: boolean }) => {
    // If this handle should only be visible in edit mode and we're not in edit mode, return null
    if (showInEditMode && !editMode) {
      return null;
    }
    
    return (
      <div className={`drag-handle cursor-move flex items-center justify-center rounded-md 
        ${showInEditMode ? 'bg-blue-900/30 border-blue-700/50' : 'bg-gray-800 border-gray-700'} 
        h-6 w-6 border mr-2 transition-all duration-200
        ${showInEditMode ? 'opacity-100' : editMode ? 'opacity-0' : 'opacity-100'}`}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 4H5V6H7V4Z" fill={showInEditMode ? "#60A5FA" : "#9CA3AF"} />
          <path d="M7 8H5V10H7V8Z" fill={showInEditMode ? "#60A5FA" : "#9CA3AF"} />
          <path d="M7 12H5V14H7V12Z" fill={showInEditMode ? "#60A5FA" : "#9CA3AF"} />
          <path d="M13 4H11V6H13V4Z" fill={showInEditMode ? "#60A5FA" : "#9CA3AF"} />
          <path d="M13 8H11V10H13V8Z" fill={showInEditMode ? "#60A5FA" : "#9CA3AF"} />
          <path d="M13 12H11V14H13V12Z" fill={showInEditMode ? "#60A5FA" : "#9CA3AF"} />
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex h-screen overflow-hidden">
        <Sidebar 
          type="agency" 
          onLogout={handleLogout} 
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />
        
        <div className="flex flex-col flex-1 w-full">
          <Navbar type="agency" onToggleSidebar={toggleSidebar} />
          
          <main className="flex-1 relative overflow-y-auto overflow-x-hidden bg-gray-900">
            <div className="px-6 py-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-white">Agency Dashboard</h1>
                  <p className="mt-1 text-gray-400">Welcome back, here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  {/* Edit Mode Toggle */}
                  <div className="relative">
                    <Button 
                      variant="ghost"
                      className={`flex items-center gap-2 px-3 py-2 rounded-md ${editMode ? 'bg-blue-900/30 text-blue-300' : 'text-gray-300 hover:bg-gray-800'}`}
                      onClick={() => setEditMode(!editMode)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                      <span>{editMode ? 'Exit Edit Mode' : 'Edit Dashboard'}</span>
                    </Button>
                  </div>
                  
                  {/* Add Campaign Button */}
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white h-10 w-10 rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center p-0"
                    aria-label="Add new campaign"
                  >
                    <RiAddLine className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
            
            <DragDropContext onDragEnd={handleDragEnd}>
              {dashboardBuckets.map((bucket) => (
                <div key={bucket.id} className="px-6 mb-8">
                  <h2 className="text-xl font-semibold text-white mb-4">{bucket.title}</h2>
                  
                  <Droppable droppableId={bucket.id} direction="horizontal">
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`grid gap-6 ${bucket.columns === 2 ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'} ${
                          snapshot.isDraggingOver ? 'bg-blue-900/10 rounded-lg p-4 border-2 border-dashed border-blue-500/30' : ''
                        }`}
                      >
                        {bucket.widgets.map((widget, index) => (
                          <Draggable key={widget.id} draggableId={widget.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`bg-gray-800 rounded-lg shadow-xl shadow-blue-900/10 border overflow-hidden transition-all duration-200
                                  ${widget.size.width === 'full' ? 'col-span-full' : ''}
                                  ${snapshot.isDragging ? 'border-blue-400 ring-2 ring-blue-400/30 scale-[1.02] rotate-1 z-50' : 'border-gray-700'}
                                  ${editMode && !snapshot.isDragging ? 'widget-edit-mode' : ''}`}
                              >
                                <div className="flex items-center px-6 py-4 border-b border-gray-700 bg-gray-800 relative">
                                  {/* Regular drag handle (hidden in edit mode) */}
                                  {!editMode && (
                                    <div {...provided.dragHandleProps} className="mr-3">
                                      <DragHandle />
                                    </div>
                                  )}
                                  
                                  {/* Edit mode drag handle - centered inside widget */}
                                  {editMode && (
                                    <div 
                                      {...provided.dragHandleProps} 
                                      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 edit-mode-drag-handle"
                                    >
                                      <div className="flex items-center justify-center w-6 h-6">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M8 5H6V7H8V5Z" fill="#60A5FA" />
                                          <path d="M8 11H6V13H8V11Z" fill="#60A5FA" />
                                          <path d="M8 17H6V19H8V17Z" fill="#60A5FA" />
                                          <path d="M18 5H16V7H18V5Z" fill="#60A5FA" />
                                          <path d="M18 11H16V13H18V11Z" fill="#60A5FA" />
                                          <path d="M18 17H16V19H18V17Z" fill="#60A5FA" />
                                        </svg>
                                      </div>
                                    </div>
                                  )}
                                  
                                  <h3 className="text-lg font-medium text-white flex-1">
                                    {widget.title}
                                  </h3>
                                  <div className="flex space-x-2">
                                    <button 
                                      className="p-1 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white"
                                      title="Toggle size"
                                      onClick={() => {
                                        const newBuckets = [...dashboardBuckets];
                                        const bucketIndex = newBuckets.findIndex(b => b.id === bucket.id);
                                        const widgetIndex = newBuckets[bucketIndex].widgets.findIndex(w => w.id === widget.id);
                                        
                                        if (widgetIndex !== -1) {
                                          const newWidth = newBuckets[bucketIndex].widgets[widgetIndex].size.width === 'full' ? 'half' : 'full';
                                          newBuckets[bucketIndex].widgets[widgetIndex].size.width = newWidth;
                                          setDashboardBuckets(newBuckets);
                                        }
                                      }}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="4" y="4" width="16" height="16" rx="2" />
                                        <rect x="9" y="9" width="6" height="6" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                                <div className="p-6 overflow-auto" style={{ 
                                  maxHeight: widget.size.width === 'full' ? 'calc(100vh - 200px)' : 'calc(100vh - 250px)',
                                  minHeight: '200px'
                                }}>
                                  {renderWidget(widget)}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </DragDropContext>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AgencyDashboard;