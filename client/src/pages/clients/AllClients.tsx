import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format, formatDistanceToNow, isAfter, isBefore } from "date-fns";
import {
  Search,
  Filter,
  Plus,
  BarChart3,
  Mail,
  MessageSquare,
  ArrowDownUp,
  UserPlus,
  User,
  ChevronUp,
  ChevronDown,
  X,
  Eye,
  Check,
  FileText,
  Pencil,
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RiArrowRightSLine } from "react-icons/ri";
import { Client } from "@shared/schema";
import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";

// Define types for team members and assignments
interface TeamMember {
  id: number;
  name: string;
  role: string;
}

interface ClientAssignments {
  [clientId: number]: TeamMember[];
}

// Client document type
interface ClientDocument {
  id: string;
  name: string;
  url: string;
}

// Extended client data
interface ClientExtendedData {
  docsUrl?: string;  // Maintaining for backward compatibility
  documents?: ClientDocument[];
  contractStart?: string;
  contractEnd?: string;
  retainerRate?: number;
  performancePercent?: number;
  performanceType?: 'rev' | 'profit';
  isActive?: boolean;
}

interface ClientsExtendedDataMap {
  [clientId: number]: ClientExtendedData;
}
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export const AllClients = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [editingDocUrl, setEditingDocUrl] = useState<number | null>(null);
  const [addingDocument, setAddingDocument] = useState<number | null>(null);
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null);
  const [documentFormData, setDocumentFormData] = useState<{name: string, url: string}>({name: '', url: ''});
  const [clientDataBackup, setClientDataBackup] = useState<{[clientId: number]: ClientExtendedData}>({});
  const [expandedClientId, setExpandedClientId] = useState<number | null>(null);
  
  // Initial client assignments state
  const [clientAssignmentsState, setClientAssignmentsState] = useState<ClientAssignments>({
    1: [
      { id: 1, name: "Alex Johnson", role: "Email Specialist" },
      { id: 2, name: "Sarah Williams", role: "Designer" }
    ],
    2: [
      { id: 3, name: "Marcus Lee", role: "Account Manager" }
    ],
    3: [
      { id: 4, name: "Taylor Swift", role: "Analyst" },
      { id: 5, name: "Jordan Peterson", role: "Designer" }
    ],
    4: []
  });
  
  // Initial extended client data
  const [clientsExtendedData, setClientsExtendedData] = useState<ClientsExtendedDataMap>({
    1: {
      docsUrl: 'https://docs.google.com/document/d/1e8XcfZSD-EarthlyGoods',
      documents: [
        { id: '1-1', name: 'Contract', url: 'https://docs.google.com/document/d/1e8XcfZSD-EarthlyGoods' },
        { id: '1-2', name: 'Onboarding', url: 'https://docs.google.com/document/d/EarthlyGoodsOnboarding' }
      ],
      contractStart: '2023-01-01',
      contractEnd: '2023-12-31',
      retainerRate: 2500,
      performancePercent: 15,
      performanceType: 'rev'
    },
    2: {
      docsUrl: 'https://docs.google.com/document/d/1e5wSistaTeas',
      documents: [
        { id: '2-1', name: 'Contract', url: 'https://docs.google.com/document/d/1e5wSistaTeas' }
      ],
      contractStart: '2023-02-15',
      contractEnd: '2024-02-14',
      retainerRate: 3200,
      performancePercent: 10,
      performanceType: 'profit'
    },
    3: {
      docsUrl: 'https://drive.google.com/MountainWellnessFiles',
      documents: [
        { id: '3-1', name: 'Contract', url: 'https://drive.google.com/MountainWellnessFiles' },
        { id: '3-2', name: 'Strategy', url: 'https://drive.google.com/MountainWellnessStrategy' }
      ],
      contractStart: '2023-03-01',
      contractEnd: '2024-03-01',
      retainerRate: 1800,
      performancePercent: 8,
      performanceType: 'rev'
    },
    4: {
      docsUrl: 'https://notion.so/FitlifeSupplementsDocs',
      documents: [
        { id: '4-1', name: 'Contract', url: 'https://notion.so/FitlifeSupplementsDocs' }
      ],
      contractStart: '2023-04-15',
      contractEnd: '2023-10-15',
      retainerRate: 4000,
      performancePercent: 12,
      performanceType: 'profit'
    }
  });
  
  // Is user admin/owner - in a real app, this would come from user context/auth
  const [isAdmin, setIsAdmin] = useState(true);
  
  // Initialize client active status based on contract end dates
  useEffect(() => {
    setClientsExtendedData(prev => {
      const updated = { ...prev };
      
      // Iterate through each client and update isActive status
      Object.keys(updated).forEach(clientIdStr => {
        const clientId = parseInt(clientIdStr);
        const client = updated[clientId];
        
        if (client && client.contractEnd) {
          updated[clientId] = {
            ...client,
            isActive: isClientActive(client.contractEnd)
          };
        }
      });
      
      return updated;
    });
  }, []);
  
  // Mock team members for assignment dropdown
  const teamMembers: TeamMember[] = [
    { id: 1, name: "Alex Johnson", role: "Email Specialist" },
    { id: 2, name: "Sarah Williams", role: "Designer" },
    { id: 3, name: "Marcus Lee", role: "Account Manager" },
    { id: 4, name: "Taylor Swift", role: "Analyst" },
    { id: 5, name: "Jordan Peterson", role: "Designer" },
  ];
  
  const handleAssignUserClick = (clientId: number) => {
    setSelectedClientId(clientId);
    setAssignDialogOpen(true);
  };
  
  const handleAssignUser = (userId: number) => {
    if (!selectedClientId) return;
    
    // Check if user is already assigned to this client
    const currentAssignments = clientAssignmentsState[selectedClientId] || [];
    const isAlreadyAssigned = currentAssignments.some((member) => member.id === userId);
    
    if (isAlreadyAssigned) {
      // In a real app, we'd show a toast notification here
      console.log(`User ${userId} is already assigned to client ${selectedClientId}`);
      return;
    }
    
    // Find the team member object
    const memberToAssign = teamMembers.find(member => member.id === userId);
    if (!memberToAssign) return;
    
    // In a real app, this would make an API call to assign the user to the client
    console.log(`Assigning user ${userId} to client ${selectedClientId}`);
    
    // Update the clientAssignments state
    setClientAssignmentsState(prev => ({
      ...prev,
      [selectedClientId]: [
        ...(prev[selectedClientId] || []),
        memberToAssign
      ]
    }));
    
    setAssignDialogOpen(false);
  };
  
  const toggleClientExpand = (clientId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (expandedClientId === clientId) {
      setExpandedClientId(null); // collapse if already expanded
    } else {
      setExpandedClientId(clientId); // expand this client
    }
  };
  
  const handleRemoveAssignment = (clientId: number, userId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // In a real app, this would make an API call to remove the assignment
    console.log(`Removing user ${userId} from client ${clientId}`);
    
    // Update the clientAssignments state
    setClientAssignmentsState(prev => {
      // If there are no assignments for this client, return unchanged
      if (!prev[clientId]) return prev;
      
      // Filter out the removed user
      return {
        ...prev,
        [clientId]: prev[clientId].filter(member => member.id !== userId)
      };
    });
  };
  
  // Functions for client extended data
  const handleUpdateClientData = (
    clientId: number, 
    field: keyof ClientExtendedData, 
    value: string | number | 'rev' | 'profit'
  ) => {
    setClientsExtendedData(prev => {
      // Create client data object if it doesn't exist
      const clientData = prev[clientId] || {};
      
      // Prepare updated data
      const updatedData = {
        ...clientData,
        [field]: value
      };
      
      // If updating contract end date, also update the active status
      if (field === 'contractEnd' && typeof value === 'string') {
        updatedData.isActive = isClientActive(value);
      }
      
      return {
        ...prev,
        [clientId]: updatedData
      };
    });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  // Check if client is active based on contract end date
  const isClientActive = (endDate?: string): boolean => {
    if (!endDate) return true; // If no end date is set, consider the client active
    
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to beginning of day for accurate comparison
      
      const contractEnd = new Date(endDate);
      contractEnd.setHours(0, 0, 0, 0);
      
      return contractEnd >= today;
    } catch (e) {
      return true; // Default to active if there's a parsing error
    }
  };
  
  // We'll use the state-based clientAssignmentsState instead of this static data
  // This line is kept for reference but won't be used
  
  // Get all clients
  const { data: clients, isLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
    retry: false,
  });
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  const handleLogout = () => {
    window.location.href = '/api/logout';
  };
  
  // Demo clients for display
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
  ] as Client[];
  
  const displayClients = clients?.length ? clients : demoClients;
  
  // Toggle for showing inactive clients
  const [showInactive, setShowInactive] = useState(false);
  
  // Filter clients based on search term and active status
  const filteredClients = displayClients.filter(client => {
    // Filter by search term
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by active status based on contract end date
    const clientData = clientsExtendedData[client.id];
    const isActive = clientData?.isActive !== false; // Default to active if not specified
    
    return matchesSearch && (showInactive || isActive);
  });
  
  const getClientInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };
  
  const getStatusBadge = (clientId: number | string) => {
    const numericId = typeof clientId === 'string' ? parseInt(clientId) : clientId;
    const clientData = clientsExtendedData[numericId];
    const isActive = clientData?.isActive !== false; // Default to active if not specified
    
    if (isActive) {
      return <Badge className="bg-green-500/20 text-green-300 hover:bg-green-500/30 border-green-800">Active</Badge>;
    } else {
      return <Badge className="bg-gray-500/20 text-gray-300 hover:bg-gray-500/30 border-gray-700">Inactive</Badge>;
    }
  };
  
  const renderSkeleton = () => {
    return Array.from({ length: 5 }).map((_, i) => (
      <li key={i} className="border-b border-gray-700 last:border-b-0">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="ml-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24 mt-1" />
              </div>
            </div>
            <div className="flex items-center">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-6 ml-2" />
            </div>
          </div>
        </div>
      </li>
    ));
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          type="agency"
          onLogout={handleLogout}
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar type="agency" onToggleSidebar={toggleSidebar} />
          
          <main className="flex-1 overflow-y-auto bg-gray-900">
            {/* Header with search and add client button */}
            <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
              <div className="container mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white">All Clients</h1>
                    <p className="text-gray-400 mt-1">Manage and track all your clients</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="search"
                        placeholder="Search clients..."
                        className="pl-8 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 w-full md:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="bg-gray-700 border-gray-600 hover:bg-gray-600">
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700 text-white">
                        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-gray-700" />
                        <DropdownMenuGroup>
                          <DropdownMenuItem className="focus:bg-gray-700">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            <span>Analytics Status</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-gray-700">
                            <Mail className="mr-2 h-4 w-4" />
                            <span>Email Status</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-gray-700">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            <span>SMS Status</span>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="bg-gray-700" />
                        <DropdownMenuItem 
                          className="focus:bg-gray-700 flex items-center justify-between"
                          onClick={() => setShowInactive(!showInactive)}
                        >
                          <div className="flex items-center">
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Show Inactive Clients</span>
                          </div>
                          <div className={`w-4 h-4 rounded-full border ${
                            showInactive 
                              ? 'bg-blue-500 border-blue-600' 
                              : 'bg-gray-700 border-gray-600'
                          }`}>
                            {showInactive && <Check className="h-3 w-3 text-white" />}
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-700" />
                        <DropdownMenuItem className="focus:bg-gray-700">
                          <ArrowDownUp className="mr-2 h-4 w-4" />
                          <span>Sort by Date Added</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Client
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Client list */}
            <div className="container mx-auto px-6 py-8">
              <Card className="bg-gray-800 shadow-xl border border-gray-700">
                <CardContent className="p-0">
                  <ul className="divide-y divide-gray-700">
                    {/* Calculate inactive clients count */}
                    {(() => {
                      // Calculate inactive clients only when needed
                      if (!showInactive) {
                        const inactiveClients = displayClients.filter(client => {
                          const clientData = clientsExtendedData[client.id];
                          return clientData?.isActive === false;
                        });
                        
                        if (inactiveClients.length > 0) {
                          return (
                            <li className="px-4 py-2 bg-blue-900/20 border border-blue-800 rounded-md mx-4 mt-2 mb-2">
                              <div className="flex items-center text-sm text-blue-200">
                                <Eye className="h-4 w-4 mr-2 text-blue-300" />
                                <span>
                                  {inactiveClients.length} inactive {inactiveClients.length === 1 ? 'client is' : 'clients are'} hidden. 
                                  <button 
                                    className="text-blue-400 hover:text-blue-300 underline ml-1"
                                    onClick={() => setShowInactive(true)}
                                  >
                                    Show all
                                  </button>
                                </span>
                              </div>
                            </li>
                          );
                        }
                      }
                      return null;
                    })()}
                    
                    {isLoading ? (
                      renderSkeleton()
                    ) : filteredClients.length > 0 ? (
                      filteredClients.map((client) => (
                        <li key={client.id} className={expandedClientId === client.id ? 'bg-gray-800' : ''}>
                          <div 
                            className="px-6 py-4 hover:bg-gray-700 cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleClientExpand(client.id, e);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-900 flex items-center justify-center shadow-inner shadow-blue-500/30">
                                  <span className="text-blue-300 font-medium">{getClientInitials(client.name)}</span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-white">{client.name}</div>
                                  <div className="text-sm text-gray-400">
                                    Added {formatDistanceToNow(new Date(client.addedAt || new Date()), { addSuffix: true })}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                {(client as any).hasEmailData && (
                                  <Badge className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-blue-800 mr-2">
                                    <Mail className="h-3 w-3 mr-1" /> Email
                                  </Badge>
                                )}
                                {(client as any).hasSmsData && (
                                  <Badge className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border-purple-800 mr-2">
                                    <MessageSquare className="h-3 w-3 mr-1" /> SMS
                                  </Badge>
                                )}
                                <div className="flex items-center">
                                  {getStatusBadge(client.id)}
                                  <Link href={`/dashboard/clients/${client.id}`} onClick={(e) => e.stopPropagation()}>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="text-gray-400 hover:text-gray-300 hover:bg-gray-600 ml-2" 
                                    >
                                      <RiArrowRightSLine className="h-5 w-5" />
                                    </Button>
                                  </Link>
                                  {expandedClientId === client.id ? (
                                    <ChevronUp className="h-5 w-5 text-gray-400" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5 text-gray-400" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Expanded content - team assignments and client details */}
                          {expandedClientId === client.id && (
                            <div className="px-6 py-3 pb-8 border-t border-gray-700 bg-gray-800/50">
                              {/* Team Assignments Section */}
                              <div className="mb-6">
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="text-sm font-medium text-white">Team Assignments</h4>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="bg-gray-700 hover:bg-gray-600 border-gray-600"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      handleAssignUserClick(client.id);
                                    }}
                                  >
                                    <UserPlus className="h-4 w-4 mr-1" />
                                    Assign
                                  </Button>
                                </div>
                                
                                {clientAssignmentsState[client.id]?.length > 0 ? (
                                  <div className="space-y-2 mt-2">
                                    {clientAssignmentsState[client.id].map((member: TeamMember) => (
                                      <div 
                                        key={member.id}
                                        className="flex items-center justify-between p-2 rounded-md bg-gray-700 hover:bg-gray-600"
                                      >
                                        <div className="flex items-center">
                                          <div className="h-8 w-8 rounded-full bg-blue-900 flex items-center justify-center">
                                            <User className="h-4 w-4 text-blue-300" />
                                          </div>
                                          <div className="ml-2">
                                            <div className="text-sm font-medium text-white">{member.name}</div>
                                            <div className="text-xs text-gray-400">{member.role}</div>
                                          </div>
                                        </div>
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          className="hover:bg-red-900/30 hover:text-red-300"
                                          onClick={(e) => handleRemoveAssignment(client.id, member.id, e)}
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-sm text-gray-400 py-2">
                                    No team members assigned to this client yet.
                                  </div>
                                )}
                              </div>
                              
                              {/* Client Information Section */}
                              <div className="border-t border-gray-700 pt-4">
                                <h4 className="text-sm font-medium text-white mb-3">Client Information</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {/* Client Documents Section */}
                                  <div className="col-span-1 md:col-span-2">
                                    <div className="flex justify-between items-center mb-2">
                                      <label className="block text-xs text-gray-400">Client Documents</label>
                                      {isAdmin && (
                                        <div className="flex items-center">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 px-2 text-xs hover:bg-blue-900/30 text-blue-400"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              // Save backup of client data before editing
                                              if (!clientDataBackup[client.id]) {
                                                setClientDataBackup(prev => ({
                                                  ...prev,
                                                  [client.id]: {...clientsExtendedData[client.id]}
                                                }));
                                              }
                                              setAddingDocument(client.id);
                                              setDocumentFormData({name: '', url: ''});
                                            }}
                                            disabled={
                                              (clientsExtendedData[client.id]?.documents?.length || 0) >= 5 ||
                                              addingDocument === client.id
                                            }
                                          >
                                            <Plus className="h-3 w-3 mr-1" />
                                            Add Document
                                          </Button>
                                          {(editingDocUrl === client.id || 
                                             editingDocumentId || 
                                             addingDocument === client.id) && (
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-7 px-2 text-xs hover:bg-red-900/30 text-red-400 ml-1"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                // Restore from backup
                                                if (clientDataBackup[client.id]) {
                                                  setClientsExtendedData(prev => ({
                                                    ...prev,
                                                    [client.id]: clientDataBackup[client.id]
                                                  }));
                                                  // Clear backup after using it
                                                  setClientDataBackup(prev => {
                                                    const newBackup = {...prev};
                                                    delete newBackup[client.id];
                                                    return newBackup;
                                                  });
                                                }
                                                setEditingDocUrl(null);
                                                setEditingDocumentId(null);
                                                setAddingDocument(null);
                                              }}
                                            >
                                              <X className="h-3 w-3 mr-1" />
                                              Cancel
                                            </Button>
                                          )}
                                        </div>
                                      )}
                                    </div>

                                    {/* Add New Document Form */}
                                    {addingDocument === client.id && (
                                      <div className="mb-3 p-3 bg-gray-800 border border-gray-700 rounded-md">
                                        <h5 className="text-sm font-medium text-white mb-2">Add New Document</h5>
                                        <div className="grid grid-cols-1 gap-2">
                                          <Input
                                            type="text"
                                            placeholder="Document Name"
                                            className="bg-gray-700 border-gray-600 text-white text-xs h-8"
                                            value={documentFormData.name}
                                            onChange={(e) => {
                                              e.stopPropagation();
                                              setDocumentFormData(prev => ({...prev, name: e.target.value}));
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                          <Input
                                            type="text"
                                            placeholder="Document URL"
                                            className="bg-gray-700 border-gray-600 text-white text-xs h-8"
                                            value={documentFormData.url}
                                            onChange={(e) => {
                                              e.stopPropagation();
                                              setDocumentFormData(prev => ({...prev, url: e.target.value}));
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                          <Button
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700 h-8 mt-1"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (documentFormData.name && documentFormData.url) {
                                                const newDoc: ClientDocument = {
                                                  id: `${client.id}-${Date.now()}`,
                                                  name: documentFormData.name,
                                                  url: documentFormData.url
                                                };
                                                
                                                setClientsExtendedData(prev => {
                                                  const currentData = prev[client.id] || {};
                                                  const currentDocs = currentData.documents || [];
                                                  
                                                  return {
                                                    ...prev,
                                                    [client.id]: {
                                                      ...currentData,
                                                      documents: [...currentDocs, newDoc]
                                                    }
                                                  };
                                                });
                                                
                                                setAddingDocument(null);
                                                setDocumentFormData({name: '', url: ''});
                                              }
                                            }}
                                            disabled={!documentFormData.name || !documentFormData.url}
                                          >
                                            <Check className="h-4 w-4 mr-1" />
                                            Save Document
                                          </Button>
                                        </div>
                                      </div>
                                    )}

                                    {/* Edit Document Form */}
                                    {editingDocumentId && (
                                      <div className="mb-3 p-3 bg-gray-800 border border-gray-700 rounded-md">
                                        <h5 className="text-sm font-medium text-white mb-2">Edit Document</h5>
                                        <div className="grid grid-cols-1 gap-2">
                                          <Input
                                            type="text"
                                            placeholder="Document Name"
                                            className="bg-gray-700 border-gray-600 text-white text-xs h-8"
                                            value={documentFormData.name}
                                            onChange={(e) => {
                                              e.stopPropagation();
                                              setDocumentFormData(prev => ({...prev, name: e.target.value}));
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                          <Input
                                            type="text"
                                            placeholder="Document URL"
                                            className="bg-gray-700 border-gray-600 text-white text-xs h-8"
                                            value={documentFormData.url}
                                            onChange={(e) => {
                                              e.stopPropagation();
                                              setDocumentFormData(prev => ({...prev, url: e.target.value}));
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                          <Button
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700 h-8 mt-1"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (documentFormData.name && documentFormData.url) {
                                                setClientsExtendedData(prev => {
                                                  const currentData = prev[client.id] || {};
                                                  const currentDocs = currentData.documents || [];
                                                  
                                                  return {
                                                    ...prev,
                                                    [client.id]: {
                                                      ...currentData,
                                                      documents: currentDocs.map(doc => 
                                                        doc.id === editingDocumentId 
                                                          ? { ...doc, name: documentFormData.name, url: documentFormData.url }
                                                          : doc
                                                      )
                                                    }
                                                  };
                                                });
                                                
                                                setEditingDocumentId(null);
                                                setDocumentFormData({name: '', url: ''});
                                              }
                                            }}
                                            disabled={!documentFormData.name || !documentFormData.url}
                                          >
                                            <Check className="h-4 w-4 mr-1" />
                                            Update Document
                                          </Button>
                                        </div>
                                      </div>
                                    )}

                                    {/* Documents List */}
                                    <div className="space-y-2 mt-1">
                                      {clientsExtendedData[client.id]?.documents && 
                                       clientsExtendedData[client.id]?.documents?.length > 0 ? (
                                        clientsExtendedData[client.id]?.documents?.map((doc) => (
                                          <div 
                                            key={doc.id}
                                            className="flex items-center justify-between bg-gray-700 hover:bg-gray-600 rounded-md px-3 py-2"
                                          >
                                            <div className="flex items-center">
                                              <FileText className="h-4 w-4 mr-2 text-blue-400" />
                                              <div>
                                                <div className="text-sm text-white">{doc.name}</div>
                                                <div className="text-xs text-gray-400 truncate max-w-[200px]">
                                                  {doc.url}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 px-2 hover:bg-blue-900/30"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  window.open(doc.url, '_blank');
                                                }}
                                              >
                                                <Eye className="h-3.5 w-3.5 text-blue-400" />
                                              </Button>
                                              
                                              {isAdmin && (
                                                <>
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 px-2 hover:bg-gray-600"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      // Save backup of client data before editing
                                                      if (!clientDataBackup[client.id]) {
                                                        setClientDataBackup(prev => ({
                                                          ...prev,
                                                          [client.id]: {...clientsExtendedData[client.id]}
                                                        }));
                                                      }
                                                      setEditingDocumentId(doc.id);
                                                      setDocumentFormData({
                                                        name: doc.name,
                                                        url: doc.url
                                                      });
                                                    }}
                                                  >
                                                    <Pencil className="h-3.5 w-3.5 text-gray-400" />
                                                  </Button>
                                                  
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 px-2 hover:bg-red-900/30"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      // Save backup of client data before deleting
                                                      if (!clientDataBackup[client.id]) {
                                                        setClientDataBackup(prev => ({
                                                          ...prev,
                                                          [client.id]: {...clientsExtendedData[client.id]}
                                                        }));
                                                      }
                                                      setClientsExtendedData(prev => {
                                                        const currentData = prev[client.id] || {};
                                                        const currentDocs = currentData.documents || [];
                                                        
                                                        return {
                                                          ...prev,
                                                          [client.id]: {
                                                            ...currentData,
                                                            documents: currentDocs.filter(d => d.id !== doc.id)
                                                          }
                                                        };
                                                      });
                                                    }}
                                                  >
                                                    <X className="h-3.5 w-3.5 text-red-400" />
                                                  </Button>
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        ))
                                      ) : (
                                        <div className="text-sm text-gray-400 py-2">
                                          No documents added for this client.
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Contract Dates - Admin only */}
                                  <div>
                                    <div className="flex justify-between items-center mb-1">
                                      <label className="block text-xs text-gray-400">Contract Period</label>
                                      {isAdmin && clientDataBackup[client.id] && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-7 px-2 text-xs hover:bg-red-900/30 text-red-400"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            // Restore from backup
                                            if (clientDataBackup[client.id]) {
                                              setClientsExtendedData(prev => ({
                                                ...prev,
                                                [client.id]: clientDataBackup[client.id]
                                              }));
                                              // Clear backup after using it
                                              setClientDataBackup(prev => {
                                                const newBackup = {...prev};
                                                delete newBackup[client.id];
                                                return newBackup;
                                              });
                                            }
                                          }}
                                        >
                                          <RotateCcw className="h-3 w-3 mr-1" />
                                          Revert Changes
                                        </Button>
                                      )}
                                    </div>
                                    {isAdmin ? (
                                      <div className="flex space-x-2">
                                        <Input
                                          type="date"
                                          className="bg-gray-700 border-gray-600 text-white text-xs h-9"
                                          value={clientsExtendedData[client.id]?.contractStart || ''}
                                          onChange={(e) => {
                                            e.stopPropagation();
                                            // Save backup if this is the first edit
                                            if (!clientDataBackup[client.id]) {
                                              setClientDataBackup(prev => ({
                                                ...prev,
                                                [client.id]: {...clientsExtendedData[client.id]}
                                              }));
                                            }
                                            handleUpdateClientData(client.id, 'contractStart', e.target.value);
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                        <span className="text-gray-400 self-center">to</span>
                                        <Input
                                          type="date"
                                          className={cn(
                                            "bg-gray-700 border-gray-600 text-white text-xs h-9",
                                            isContractExpired(clientsExtendedData[client.id]?.contractEnd) && "border-red-400"
                                          )}
                                          value={clientsExtendedData[client.id]?.contractEnd || ''}
                                          onChange={(e) => {
                                            e.stopPropagation();
                                            // Save backup if this is the first edit
                                            if (!clientDataBackup[client.id]) {
                                              setClientDataBackup(prev => ({
                                                ...prev,
                                                [client.id]: {...clientsExtendedData[client.id]}
                                              }));
                                            }
                                            handleUpdateClientData(client.id, 'contractEnd', e.target.value);
                                            
                                            // Auto update active status based on end date
                                            const newEndDate = e.target.value;
                                            const isActive = newEndDate ? !isContractExpired(newEndDate) : true;
                                            handleUpdateClientData(client.id, 'isActive', isActive);
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                      </div>
                                    ) : (
                                      <div className="text-sm text-white flex items-center">
                                        <span>
                                          {clientsExtendedData[client.id]?.contractStart 
                                            ? formatDate(clientsExtendedData[client.id]?.contractStart)
                                            : 'N/A'
                                          } to {
                                            clientsExtendedData[client.id]?.contractEnd 
                                              ? formatDate(clientsExtendedData[client.id]?.contractEnd)
                                              : 'N/A'
                                          }
                                        </span>
                                        {clientsExtendedData[client.id]?.contractEnd && 
                                          clientsExtendedData[client.id]?.isActive === false && (
                                            <span className="ml-2 text-red-400 text-xs flex items-center">
                                              <span className="inline-block h-2 w-2 rounded-full bg-red-500 mr-1"></span>
                                              Expired
                                            </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Retainer Rate */}
                                  <div>
                                    <label className="block text-xs text-gray-400 mb-1">Retainer Rate</label>
                                    <div className="flex items-center">
                                      <div className="relative">
                                        <span className="absolute left-3 top-2 text-gray-400">$</span>
                                        <Input
                                          type="number"
                                          className="bg-gray-700 border-gray-600 text-white pl-7 h-9"
                                          value={clientsExtendedData[client.id]?.retainerRate || ''}
                                          onChange={(e) => {
                                            e.stopPropagation();
                                            handleUpdateClientData(client.id, 'retainerRate', Number(e.target.value));
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                      </div>
                                      <span className="text-gray-400 ml-2">/month</span>
                                    </div>
                                  </div>
                                  
                                  {/* Performance % */}
                                  <div>
                                    <label className="block text-xs text-gray-400 mb-1">Performance %</label>
                                    <div className="flex items-center space-x-2">
                                      <div className="relative w-24">
                                        <Input
                                          type="number"
                                          className="bg-gray-700 border-gray-600 text-white pr-6 h-9"
                                          value={clientsExtendedData[client.id]?.performancePercent || ''}
                                          onChange={(e) => {
                                            e.stopPropagation();
                                            handleUpdateClientData(client.id, 'performancePercent', Number(e.target.value));
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                        <span className="absolute right-3 top-2 text-gray-400">%</span>
                                      </div>
                                      <div onClick={(e) => e.stopPropagation()}>
                                        <Select 
                                          defaultValue={clientsExtendedData[client.id]?.performanceType || 'rev'}
                                          onValueChange={(value: string) => {
                                            handleUpdateClientData(client.id, 'performanceType', value as 'rev' | 'profit');
                                          }}
                                        >
                                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white h-9 w-32">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                            <SelectItem value="rev">Revenue</SelectItem>
                                            <SelectItem value="profit">Profit</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </li>
                      ))
                    ) : (
                      <li className="px-6 py-12 text-center">
                        <p className="text-gray-400">No clients found</p>
                        <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
      
      {/* User Assignment Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="bg-gray-800 border border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Assign Team Member</DialogTitle>
            <DialogDescription className="text-gray-400">
              Select team members to assign to this client.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <div className="grid gap-4">
              {teamMembers.map(member => {
                // Check if this member is already assigned to the selected client
                const isAssigned = selectedClientId 
                  ? (clientAssignmentsState[selectedClientId] || []).some((m) => m.id === member.id)
                  : false;
                  
                return (
                  <div 
                    key={member.id}
                    className={`flex items-center justify-between p-3 rounded-md ${
                      isAssigned 
                        ? 'bg-blue-900/20 border border-blue-800' 
                        : 'bg-gray-700 hover:bg-gray-600 cursor-pointer'
                    }`}
                    onClick={() => !isAssigned && handleAssignUser(member.id)}
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-900 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-300" />
                      </div>
                      <div className="ml-3">
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-400">
                          {member.role} {isAssigned && <span className="text-blue-300">(Already Assigned)</span>}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      disabled={isAssigned}
                      className={isAssigned 
                        ? "text-blue-300 bg-blue-900/30" 
                        : "hover:bg-blue-900/30 hover:text-blue-300"}
                    >
                      {isAssigned ? <Check className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setAssignDialogOpen(false)}
              className="bg-gray-700 hover:bg-gray-600 border-gray-600"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllClients;