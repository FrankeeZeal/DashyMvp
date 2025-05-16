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
import { ClientRevenueGraph } from "@/components/dashboard/ClientRevenueGraph";
import { ROIReport } from "@/components/dashboard/ROIReport";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RiUserLine, RiMoneyDollarCircleLine, RiMailSendLine, RiTeamLine, RiAddLine, RiCheckLine, RiFileTextLine, RiLineChartLine, RiDashboardLine, RiPieChartLine, RiMenuLine } from "react-icons/ri";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Function to make widget draggable only in edit mode
const getDragHandleProps = (editMode: boolean, provided: any) => {
  return editMode ? provided.dragHandleProps : {};
};

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
];

// Mock integration data
const mockIntegrations = [
  { 
    id: 1, 
    organizationId: 1, 
    name: "Klaviyo", 
    type: "email", 
    status: "connected", 
    lastSyncAt: new Date(), 
    createdAt: new Date() 
  },
  { 
    id: 2, 
    organizationId: 1, 
    name: "Attentive", 
    type: "sms", 
    status: "connected", 
    lastSyncAt: new Date(), 
    createdAt: new Date() 
  },
  { 
    id: 3, 
    organizationId: 1, 
    name: "Shopify", 
    type: "ecommerce", 
    status: "connected", 
    lastSyncAt: new Date(), 
    createdAt: new Date() 
  }
];

// Widget type definition
type WidgetType = 'stats' | 'campaigns' | 'clients' | 'roi-analytics' | 'reports';

// Dashboard widget interface
interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
}

// Dashboard bucket interface
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
      widgets.splice(destination.index, 0, removed);
      
      const newBuckets = [...dashboardBuckets];
      newBuckets[bucketIndex].widgets = widgets;
      
      setDashboardBuckets(newBuckets);
    } 
    // Moving between buckets
    else {
      const sourceBucketIndex = dashboardBuckets.findIndex(bucket => bucket.id === source.droppableId);
      const destBucketIndex = dashboardBuckets.findIndex(bucket => bucket.id === destination.droppableId);
      
      if (sourceBucketIndex === -1 || destBucketIndex === -1) return;
      
      const newBuckets = [...dashboardBuckets];
      const sourceWidgets = Array.from(newBuckets[sourceBucketIndex].widgets);
      const destWidgets = Array.from(newBuckets[destBucketIndex].widgets);
      
      const [removed] = sourceWidgets.splice(source.index, 1);
      destWidgets.splice(destination.index, 0, removed);
      
      newBuckets[sourceBucketIndex].widgets = sourceWidgets;
      newBuckets[destBucketIndex].widgets = destWidgets;
      
      setDashboardBuckets(newBuckets);
    }
  };
  
  // Render appropriate widget based on type
  const renderWidget = (widget: DashboardWidget) => {
    switch (widget.type) {
      case 'stats':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title="Active Clients"
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
        );
      case 'campaigns':
        return (
          <CampaignTable
            campaigns={campaigns as any}
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
      case 'reports':
        return (
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
        );
      case 'roi-analytics':
        return (
          <Tabs defaultValue="roi" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-700 mb-6">
              <TabsTrigger 
                value="roi" 
                className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-300"
              >
                ROI Calculator
              </TabsTrigger>
              <TabsTrigger 
                value="integrations" 
                className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-300"
              >
                Integrations
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="roi" className="mt-0">
              <ROICalculator 
                campaigns={campaigns as any}
              />
            </TabsContent>
            
            <TabsContent value="integrations" className="mt-0">
              <IntegrationCard 
                integrations={integrations} 
                isLoading={integrationsLoading}
              />
            </TabsContent>
          </Tabs>
        );
      default:
        return <div>Widget not found</div>;
    }
  };

  // Revenue graph data
  const clientData = [
    { id: 1, name: "Earthly Goods", revenue: 8.9, emailRevenue: 5.1, smsRevenue: 3.8, flowsRevenue: 6.2 },
    { id: 2, name: "Sista Teas", revenue: 12.5, emailRevenue: 7.2, smsRevenue: 5.3, flowsRevenue: 8.1 },
    { id: 3, name: "Green Valley", revenue: 6.7, emailRevenue: 3.2, smsRevenue: 3.5, flowsRevenue: 4.5 },
    { id: 4, name: "FitLife Supplements", revenue: 9.4, emailRevenue: 5.6, smsRevenue: 3.8, flowsRevenue: 7.2 }
  ];

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
            {/* Dashboard Header */}
            <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
              <div className="container mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white">Agency Dashboard</h1>
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
                    
                    {/* Add Campaign Button with Dialog */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="bg-blue-600 hover:bg-blue-700 text-white h-10 w-10 rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center p-0"
                          aria-label="Add new campaign"
                        >
                          <RiAddLine className="h-5 w-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-2xl w-[95vw] bg-gray-900 border-gray-800 text-white shadow-xl shadow-blue-900/20">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-semibold text-center">Choose a Dashboard template</DialogTitle>
                          <DialogDescription className="text-gray-400 text-center mt-2">
                            Get started with a Dashboard template or create a custom Dashboard to fit your exact needs.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                          {/* Starter Template - Selected */}
                          <div className="relative border border-green-500 rounded-lg bg-gray-800 p-6 group hover:bg-gray-800/80 transition-all duration-200 shadow-lg shadow-green-900/10 template-card flex">
                            <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 shadow-md shadow-green-900/30">
                              <RiCheckLine className="h-4 w-4 text-white" />
                            </div>
                            <div className="mr-4 bg-green-600/20 rounded-md w-12 h-12 flex items-center justify-center">
                              <RiMailSendLine className="h-6 w-6 text-green-500" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-md font-medium text-white">Starter</h3>
                              <p className="text-sm text-gray-400 mt-1">Basic campaign setup with essential features</p>
                            </div>
                          </div>
                          
                          {/* Client Portal */}
                          <div className="border border-gray-700 rounded-lg bg-gray-800 p-6 group hover:bg-gray-800/80 transition-all duration-200 hover:border-blue-600/50 shadow-lg shadow-blue-900/10 template-card flex">
                            <div className="mr-4 bg-blue-600/20 rounded-md w-12 h-12 flex items-center justify-center">
                              <RiUserLine className="h-6 w-6 text-blue-500" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-md font-medium text-white">Client Portal</h3>
                              <p className="text-sm text-gray-400 mt-1">Collaborate with clients on tasks and projects</p>
                            </div>
                          </div>
                          
                          {/* Campaign Management */}
                          <div className="border border-gray-700 rounded-lg bg-gray-800 p-6 group hover:bg-gray-800/80 transition-all duration-200 hover:border-blue-600/50 shadow-lg shadow-blue-900/10 template-card flex">
                            <div className="mr-4 bg-purple-600/20 rounded-md w-12 h-12 flex items-center justify-center">
                              <RiMailSendLine className="h-6 w-6 text-purple-500" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-md font-medium text-white">Campaign Management</h3>
                              <p className="text-sm text-gray-400 mt-1">Plan and track detailed campaign performance</p>
                            </div>
                          </div>
                          
                          {/* Reports */}
                          <div className="border border-gray-700 rounded-lg bg-gray-800 p-6 group hover:bg-gray-800/80 transition-all duration-200 hover:border-blue-600/50 shadow-lg shadow-blue-900/10 template-card flex">
                            <div className="mr-4 bg-indigo-600/20 rounded-md w-12 h-12 flex items-center justify-center">
                              <RiFileTextLine className="h-6 w-6 text-indigo-500" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-md font-medium text-white">Reports Dashboard</h3>
                              <p className="text-sm text-gray-400 mt-1">Analyze ROI and campaign performance metrics</p>
                            </div>
                          </div>
                          
                          {/* Client ROI */}
                          <div className="border border-gray-700 rounded-lg bg-gray-800 p-6 group hover:bg-gray-800/80 transition-all duration-200 hover:border-blue-600/50 shadow-lg shadow-blue-900/10 template-card flex">
                            <div className="mr-4 bg-amber-600/20 rounded-md w-12 h-12 flex items-center justify-center">
                              <RiMoneyDollarCircleLine className="h-6 w-6 text-amber-500" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-md font-medium text-white">Client ROI</h3>
                              <p className="text-sm text-gray-400 mt-1">Track and analyze return on investment metrics</p>
                            </div>
                          </div>
                          
                          {/* More Coming Soon box */}
                          <div className="border border-gray-700 border-dashed rounded-lg bg-gradient-to-br from-gray-800 via-gray-800/80 to-blue-900/20 p-6 group hover:border-blue-500/30 shadow-lg shadow-blue-900/10 template-card flex relative overflow-hidden animated-gradient">
                            <div className="absolute -right-12 -top-12 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
                            <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
                            
                            <div className="mr-4 bg-blue-500/10 rounded-md w-12 h-12 flex items-center justify-center">
                              <svg className="h-6 w-6 text-blue-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2v20"></path>
                                <path d="M6 16l6 6 6-6"></path>
                                <path d="M6 8l6-6 6 6"></path>
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between w-full">
                                <h3 className="text-md font-medium text-white">More Templates</h3>
                                <div className="bg-gradient-to-r from-blue-600/20 to-blue-800/20 border border-blue-700/30 px-2.5 py-0.5 rounded-md shadow-sm">
                                  <span className="text-xs font-medium text-blue-300 coming-soon-badge">Coming Soon</span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-400 mt-1">Exciting new templates are on the way!</p>
                            </div>
                          </div>
                          
                          {/* Start from Scratch with Upgrade Button */}
                          <div className="border border-gray-700 rounded-lg bg-gray-800 p-6 group hover:bg-gray-800/80 transition-all duration-200 hover:border-blue-600/50 col-span-1 md:col-span-2 shadow-lg shadow-blue-900/10 template-card">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="bg-gray-700 rounded-md w-12 h-12 flex items-center justify-center mr-4">
                                  <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                  </svg>
                                </div>
                                <div>
                                  <h3 className="text-md font-medium text-white">Start from Scratch</h3>
                                  <p className="text-sm text-gray-400">Build a custom dashboard with advanced features</p>
                                </div>
                              </div>
                              <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm px-4 py-2 rounded-md shadow-lg shadow-blue-900/30">
                                Upgrade
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Client Revenue Graph - FIXED position outside the dashboard layout */}
            <div id="revenue-graph-fixed" className="px-6 mb-8 mt-4">
              <ClientRevenueGraph 
                clients={clientData}
                isLoading={false}
              />
            </div>
            
            {/* Draggable Dashboard Content */}
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
                          <Draggable key={widget.id} draggableId={widget.id} index={index} isDragDisabled={!editMode}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`bg-gray-800 rounded-lg shadow-xl shadow-blue-900/10 border overflow-hidden transition-all duration-200
                                  ${widget.size.width === 'full' ? 'col-span-full' : ''}
                                  ${snapshot.isDragging ? 'border-blue-400 ring-2 ring-blue-400/30 scale-[1.02] rotate-1 z-50' : 'border-gray-700'}
                                  ${editMode && !snapshot.isDragging ? 'widget-edit-mode' : ''}`}
                              >
                                <div 
                                  {...provided.dragHandleProps}
                                  className="flex items-center px-6 py-4 border-b border-gray-700 bg-gray-800 relative cursor-default"
                                >
                                  {/* Edit mode drag handle - centered inside widget */}
                                  {editMode && (
                                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 edit-mode-drag-handle">
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