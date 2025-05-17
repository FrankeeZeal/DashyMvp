import React, { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { format, formatDistanceToNow, isAfter, isBefore, parseISO } from "date-fns";
import { format as formatTz } from 'date-fns-tz';
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
  const [showFilters, setShowFilters] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [saveNotification, setSaveNotification] = useState<{show: boolean, timestamp: string} | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [editingDocUrl, setEditingDocUrl] = useState<number | null>(null);
  const [addingDocument, setAddingDocument] = useState<number | null>(null);
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null);
  const [documentFormData, setDocumentFormData] = useState<{name: string, url: string}>({name: '', url: ''});
  const [clientDataBackup, setClientDataBackup] = useState<{[clientId: number]: ClientExtendedData}>({});
  const [expandedClientId, setExpandedClientId] = useState<number | null>(null);
  const [clientsExtendedData, setClientsExtendedData] = useState<ClientsExtendedDataMap>({});
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [location] = useLocation();
  
  // Initial client assignments state
  const [clientAssignmentsState, setClientAssignmentsState] = useState<ClientAssignments>({
    1: [
      { id: 1, name: "John Smith", role: "Designer" },
      { id: 2, name: "Jane Doe", role: "Account Manager" }
    ],
    2: [
      { id: 2, name: "Jane Doe", role: "Account Manager" },
      { id: 3, name: "Bob Johnson", role: "Analyst" }
    ],
    3: [
      { id: 4, name: "Taylor Swift", role: "Analyst" },
      { id: 5, name: "Jordan Peterson", role: "Designer" }
    ],
    4: []
  });
  
  // Initial extended client data
  // Save data to localStorage with status indicators
  const saveToLocalStorage = useCallback((data: ClientsExtendedDataMap) => {
    setSaveStatus('saving');
    try {
      localStorage.setItem('clientsExtendedData', JSON.stringify(data));
      const now = new Date();
      const timestamp = now.toLocaleTimeString();
      setLastSaved(now);
      setSaveStatus('saved');
      
      // Show save notification
      setSaveNotification({ show: true, timestamp });
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setSaveNotification(null);
      }, 5000);
    } catch (error) {
      console.error("Error saving client data to localStorage:", error);
      setSaveStatus('unsaved');
    }
  }, []);

  // Load client data from localStorage if it exists
  const loadSavedClientData = (): ClientsExtendedDataMap => {
    try {
      const savedData = localStorage.getItem('clientsExtendedData');
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error("Error loading client data from localStorage:", error);
    }
    
    // Default data if nothing in localStorage or error occurs
    return {
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
    };
  };
  
  // Is user admin/owner - in a real app, this would come from user context/auth
  const [isAdmin, setIsAdmin] = useState(true);
  
  // Effect to initialize client data from local storage
  useEffect(() => {
    const savedData = loadSavedClientData();
    setClientsExtendedData(savedData);
  }, []);
  
  // Effect to save data when client data changes
  useEffect(() => {
    if (Object.keys(clientsExtendedData).length > 0) {
      saveToLocalStorage(clientsExtendedData);
    }
  }, [clientsExtendedData, saveToLocalStorage]);
  
  // Track location changes to save before navigating away
  useEffect(() => {
    if (Object.keys(clientsExtendedData).length > 0) {
      saveToLocalStorage(clientsExtendedData);
    }
  }, [location, clientsExtendedData, saveToLocalStorage]);
  
  // Initialize client active status based on contract end dates
  useEffect(() => {
    setClientsExtendedData(prev => {
      const updated = { ...prev };
      
      // For each client in our extended data
      Object.keys(updated).forEach(clientIdStr => {
        const clientId = parseInt(clientIdStr);
        const clientData = updated[clientId];
        
        // If client has a contract end date, determine if active
        if (clientData.contractEnd) {
          const isActive = isClientActive(clientData.contractEnd);
          updated[clientId] = {
            ...clientData,
            isActive
          };
        } else {
          // Default to active if no end date specified
          updated[clientId] = {
            ...clientData,
            isActive: true
          };
        }
      });
      
      return updated;
    });
  }, []);
  
  // Format dates for display
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
      today.setHours(0, 0, 0, 0);
      
      const contractEnd = new Date(endDate);
      contractEnd.setHours(0, 0, 0, 0);
      
      return contractEnd >= today;
    } catch (e) {
      return true; // Default to active if there's a parsing error
    }
  };
  
  // Check if contract is expired (opposite of isClientActive)
  const isContractExpired = (endDate?: string): boolean => {
    return endDate ? !isClientActive(endDate) : false;
  };

  // For handling team member selection in assignment dialog
  // Initialize assigned team members dropdown state
  const [selectedTeamMemberForAssignment, setSelectedTeamMemberForAssignment] = useState<TeamMember | null>(null);
  
  // Assign Team Member to a client
  const assignTeamMember = () => {
    if (!selectedTeamMemberForAssignment || !selectedClientId) return;
    
    // Check if this team member is already assigned to this client
    const clientTeam = clientAssignmentsState[selectedClientId] || [];
    const alreadyAssigned = clientTeam.some(
      member => member.id === selectedTeamMemberForAssignment.id
    );
    
    if (alreadyAssigned) {
      console.log("Team member already assigned to this client");
      return;
    }
    
    // Add team member to client
    setClientAssignmentsState(prev => {
      const updated = { ...prev };
      
      if (!updated[selectedClientId]) {
        updated[selectedClientId] = [];
      }
      
      updated[selectedClientId] = [
        ...updated[selectedClientId],
        selectedTeamMemberForAssignment
      ];
      
      return updated;
    });
    
    // Reset selection
    setSelectedTeamMemberForAssignment(null);
  };
  
  // Remove team member from a client
  const removeTeamMember = (clientId: number, memberId: number) => {
    setClientAssignmentsState(prev => {
      const updated = { ...prev };
      
      if (updated[clientId]) {
        updated[clientId] = updated[clientId].filter(
          member => member.id !== memberId
        );
      }
      
      return updated;
    });
  };
  
  // Available team members (in a real app, this would come from API/database)
  const teamMembers: TeamMember[] = [
    { id: 1, name: "John Smith", role: "Designer" },
    { id: 2, name: "Jane Doe", role: "Account Manager" },
    { id: 3, name: "Bob Johnson", role: "Analyst" },
    { id: 4, name: "Taylor Swift", role: "Analyst" },
    { id: 5, name: "Jordan Peterson", role: "Designer" },
    { id: 6, name: "Emily Chang", role: "Owner" },
    { id: 7, name: "Michael Brown", role: "Co-Founder" }
  ];
  
  // Get available team members (not already assigned to this client)
  const getAvailableTeamMembers = (clientId: number): TeamMember[] => {
    const assignedIds = (clientAssignmentsState[clientId] || []).map(m => m.id);
    return teamMembers.filter(member => !assignedIds.includes(member.id));
  };
  
  // Handle doc url editing
  const handleSaveDocUrl = (clientId: number, url: string) => {
    setClientsExtendedData(prev => {
      const updated = { ...prev };
      if (!updated[clientId]) {
        updated[clientId] = {};
      }
      updated[clientId] = {
        ...updated[clientId],
        docsUrl: url
      };
      return updated;
    });
    setEditingDocUrl(null);
  };
  
  // Get client documents array
  const getClientDocuments = (clientId: number): ClientDocument[] => {
    const docs = clientsExtendedData[clientId]?.documents;
    return Array.isArray(docs) ? docs : [];
  };
  
  // Add a new document to a client
  const handleAddDocument = (clientId: number) => {
    if (!documentFormData.name || !documentFormData.url) return;
    
    setClientsExtendedData(prev => {
      const updated = { ...prev };
      if (!updated[clientId]) {
        updated[clientId] = {};
      }
      
      if (!updated[clientId].documents) {
        updated[clientId].documents = [];
      }
      
      // Generate a unique ID for the document
      const newDocId = `${clientId}-${Date.now()}`;
      
      updated[clientId].documents = [
        ...(updated[clientId].documents || []),
        {
          id: newDocId,
          name: documentFormData.name,
          url: documentFormData.url
        }
      ];
      
      // Limit to max 5 documents
      if (updated[clientId].documents.length > 5) {
        updated[clientId].documents = updated[clientId].documents.slice(0, 5);
      }
      
      return updated;
    });
    
    // Reset form
    setDocumentFormData({name: '', url: ''});
    setAddingDocument(null);
  };
  
  // Update existing document
  const handleUpdateDocument = (clientId: number, docId: string) => {
    if (!documentFormData.name || !documentFormData.url) return;
    
    setClientsExtendedData(prev => {
      const updated = { ...prev };
      if (!updated[clientId] || !updated[clientId].documents) return prev;
      
      updated[clientId].documents = updated[clientId].documents.map(doc => 
        doc.id === docId 
          ? { ...doc, name: documentFormData.name, url: documentFormData.url }
          : doc
      );
      
      return updated;
    });
    
    // Reset form
    setDocumentFormData({name: '', url: ''});
    setEditingDocumentId(null);
  };
  
  // Remove a document
  const handleRemoveDocument = (clientId: number, docId: string) => {
    setClientsExtendedData(prev => {
      const updated = { ...prev };
      if (!updated[clientId] || !updated[clientId].documents) return prev;
      
      updated[clientId].documents = updated[clientId].documents.filter(
        d => d.id !== docId
      );
      
      return updated;
    });
  };
  
  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  // Handle logout
  const handleLogout = () => {
    // In a real app, would call auth service logout method
    console.log("Logging out...");
  };
  
  // Our demo clients if no API data is available
  const demoClients = [
    { id: 1, name: "Earthly Goods Co.", industry: "Health & Wellness", organizationId: 1, status: "active", hasEmailData: true, hasSmsData: true },
    { id: 2, name: "Sista Teas", industry: "Food & Beverage", organizationId: 1, status: "active", hasEmailData: true, hasSmsData: false },
    { id: 3, name: "Mountain Wellness", industry: "Health & Wellness", organizationId: 1, status: "active", hasEmailData: false, hasSmsData: true },
    { id: 4, name: "Fitlife Supplements", industry: "Health & Wellness", organizationId: 1, status: "active", hasEmailData: true, hasSmsData: true }
  ] as unknown as Client[];
  
  const { data: clients, isLoading } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
    retry: false,
  });
  
  // Either use the API clients or our demo data
  const displayClients = clients?.length ? clients : demoClients;
  
  // Toggle for showing inactive clients
  const [showInactive, setShowInactive] = useState(false);
  
  // Filter clients based on search term and active status
  const filteredClients = displayClients?.filter(client => {
    // Filter by search term
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by active status based on contract end date
    const clientData = clientsExtendedData[client.id];
    const isActive = clientData?.isActive !== false; // Default to active if not specifically set to false
    
    // Show client if either:
    // 1. We're showing all clients (including inactive) OR
    // 2. Client is active
    const matchesActiveFilter = showInactive || isActive;
    
    return matchesSearch && matchesActiveFilter;
  });
  
  // Handle opening the assign team members dialog
  const handleOpenAssignDialog = (clientId: number) => {
    setSelectedClientId(clientId);
    setAssignDialogOpen(true);
  };
  
  // Handle changes to date fields
  const handleDateChange = (clientId: number, field: 'contractStart' | 'contractEnd', value: string) => {
    // Backup current state before modifying
    if (!clientDataBackup[clientId]) {
      setClientDataBackup(prev => ({
        ...prev,
        [clientId]: clientsExtendedData[clientId] || {}
      }));
    }
    
    setClientsExtendedData(prev => {
      const updated = { ...prev };
      if (!updated[clientId]) {
        updated[clientId] = {};
      }
      
      updated[clientId] = {
        ...updated[clientId],
        [field]: value
      };
      
      // If we're updating the end date, also update the active status
      if (field === 'contractEnd') {
        updated[clientId].isActive = isClientActive(value);
      }
      
      return updated;
    });
  };
  
  // Handle changes to numeric fields
  const handleNumberChange = (
    clientId: number, 
    field: 'retainerRate' | 'performancePercent', 
    value: string
  ) => {
    // Backup current state before modifying
    if (!clientDataBackup[clientId]) {
      setClientDataBackup(prev => ({
        ...prev,
        [clientId]: clientsExtendedData[clientId] || {}
      }));
    }
    
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return;
    
    setClientsExtendedData(prev => {
      const updated = { ...prev };
      if (!updated[clientId]) {
        updated[clientId] = {};
      }
      updated[clientId] = {
        ...updated[clientId],
        [field]: numericValue
      };
      return updated;
    });
  };
  
  // Handle changes to select fields
  const handleSelectChange = (
    clientId: number, 
    field: 'performanceType', 
    value: string
  ) => {
    // Backup current state before modifying
    if (!clientDataBackup[clientId]) {
      setClientDataBackup(prev => ({
        ...prev,
        [clientId]: clientsExtendedData[clientId] || {}
      }));
    }
    
    setClientsExtendedData(prev => {
      const updated = { ...prev };
      if (!updated[clientId]) {
        updated[clientId] = {};
      }
      updated[clientId] = {
        ...updated[clientId],
        [field]: value as 'rev' | 'profit'
      };
      return updated;
    });
  };
  
  // Restore backup data for a client
  const handleUndoChanges = (clientId: number) => {
    if (clientDataBackup[clientId]) {
      setClientsExtendedData(prev => {
        const updated = { ...prev };
        updated[clientId] = clientDataBackup[clientId];
        return updated;
      });
      
      // Remove the backup after restoring
      setClientDataBackup(prev => {
        const updated = { ...prev };
        delete updated[clientId];
        return updated;
      });
    }
  };
  
  // Render skeleton loaders during data fetching
  const renderSkeleton = () => {
    return Array(4).fill(0).map((_, i) => (
      <li key={i} className="animate-pulse px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40 bg-gray-700" />
            <Skeleton className="h-4 w-24 bg-gray-700" />
          </div>
          <div className="flex items-center">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-6 ml-2" />
          </div>
        </div>
      </li>
    ));
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Save Notification Banner */}
      {saveNotification?.show && (
        <div className="fixed bottom-16 right-4 px-4 py-2 bg-blue-600 border border-blue-700 rounded-lg shadow-lg z-50 flex items-center">
          <Check className="h-4 w-4 mr-2 text-white" />
          <div>
            <span className="text-white font-medium">Changes saved</span>
            <span className="text-blue-200 text-xs ml-2">
              {saveNotification.timestamp}
            </span>
          </div>
        </div>
      )}
      
      {/* Save Status Indicator */}
      {lastSaved && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-3 z-50">
          <div className="flex items-center">
            {saveStatus === 'saving' && 
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
            }
            {saveStatus === 'saved' && <Check className="w-4 h-4 text-green-400 mr-2" />}
            {saveStatus === 'unsaved' && <X className="w-4 h-4 text-red-400 mr-2" />}
            <span className="text-sm">
              {saveStatus === 'saving' && 'Saving...'}
              {saveStatus === 'saved' && (lastSaved ? `Saved ${formatDistanceToNow(lastSaved, { addSuffix: true })}` : 'Saved')}
              {saveStatus === 'unsaved' && 'Failed to save'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-xs"
              onClick={() => {
                setClientsExtendedData({...clientDataBackup});
              }}
            >
              <RotateCcw className="w-3 h-3 mr-1" /> Undo
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-xs"
              onClick={() => saveToLocalStorage(clientsExtendedData)}
            >
              <Check className="w-3 h-3 mr-1" /> Save
            </Button>
          </div>
        </div>
      )}
        
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          type="agency"
          onLogout={handleLogout}
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar type="agency" onToggleSidebar={toggleSidebar} />
          
          <main className="flex-1 overflow-y-auto p-4 bg-gray-900">
            <div className="max-w-6xl mx-auto">
              {/* Page header */}
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">All Clients</h1>
                
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Search clients..."
                      className="pl-9 bg-gray-800 border-gray-700 h-9 focus:ring-blue-600"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-9 w-9 border border-gray-700"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Filters panel (can be expanded in the future) */}
              {showFilters && (
                <div className="mb-4 p-4 bg-gray-800 rounded-md border border-gray-700">
                  <h3 className="font-medium mb-2">Filters</h3>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox"
                        id="showInactive"
                        checked={showInactive}
                        onChange={() => setShowInactive(!showInactive)}
                        className="rounded bg-gray-700 border-gray-600 text-blue-600"
                      />
                      <label htmlFor="showInactive">Show inactive clients</label>
                    </div>
                    {/* More filters can be added here */}
                  </div>
                </div>
              )}
              
              {/* Card containing the client list */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row justify-between items-center pb-2">
                  <CardTitle className="text-xl">Clients</CardTitle>
                  
                  <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Client
                  </Button>
                </CardHeader>
                
                <CardContent className="p-0">
                  <ul className="divide-y divide-gray-700">
                    {/* Show inactive clients notice */}
                    {(() => {
                      // Calculate inactive clients only when needed
                      if (!showInactive) {
                        const inactiveClients = displayClients?.filter(client => {
                          const clientData = clientsExtendedData[client.id];
                          return clientData?.isActive === false;
                        });
                        
                        if (inactiveClients && inactiveClients.length > 0) {
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
                    ) : filteredClients && filteredClients.length > 0 ? (
                      filteredClients.map((client) => (
                        <li key={client.id} className={expandedClientId === client.id ? 'bg-gray-800' : ''}>
                          <div 
                            className="px-6 py-4 hover:bg-gray-700 cursor-pointer"
                            onClick={(e) => {
                              // Don't trigger if clicking specific elements or inputs
                              const target = e.target as HTMLElement;
                              if (
                                target.closest('.actions-container') || 
                                target.closest('button') ||
                                target.closest('a') ||
                                target.closest('input') ||
                                target.closest('select') ||
                                target.tagName === 'INPUT' ||
                                target.tagName === 'SELECT' ||
                                target.tagName === 'TEXTAREA'
                              ) {
                                return;
                              }
                              
                              if (expandedClientId === client.id) {
                                setExpandedClientId(null);
                              } else {
                                setExpandedClientId(client.id);
                                
                                // Save data when expanding client details
                                try {
                                  localStorage.setItem('clientsExtendedData', JSON.stringify(clientsExtendedData));
                                  setLastSaved(new Date());
                                  setSaveStatus('saved');
                                } catch (error) {
                                  console.error("Error saving client data:", error);
                                  setSaveStatus('unsaved');
                                }
                              }
                            }}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-medium flex items-center">
                                  {client.name} 
                                  {/* Display badge if contract expired */}
                                  {clientsExtendedData[client.id]?.isActive === false && (
                                    <Badge variant="destructive" className="ml-2 bg-red-900/60 hover:bg-red-900 text-red-200 text-xs">
                                      Inactive
                                    </Badge>
                                  )}
                                </h3>
                                <p className="text-sm text-gray-400">{client.industry}</p>
                              </div>
                              
                              <div className="flex items-center">
                                {/* Client Actions */}
                                <div className="actions-container flex items-center mr-2">
                                  <button 
                                    className="p-1.5 hover:bg-gray-600 rounded-full text-gray-400 hover:text-white client-action-button"
                                    onClick={() => window.open(`/clients/${client.id}`, '_blank')}
                                  >
                                    <BarChart3 className="h-4 w-4" />
                                  </button>
                                  <button 
                                    className="p-1.5 hover:bg-gray-600 rounded-full text-gray-400 hover:text-white ml-1 client-action-button"
                                    onClick={() => handleOpenAssignDialog(client.id)}
                                  >
                                    <UserPlus className="h-4 w-4" />
                                  </button>
                                </div>
                                
                                {expandedClientId === client.id ? (
                                  <ChevronUp className="h-5 w-5 text-gray-400" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-gray-400" />
                                )}
                              </div>
                            </div>
                            
                            {/* Expanded client details */}
                            {expandedClientId === client.id && (
                              <div className="mt-4 text-sm grid gap-5 pb-2 pt-3 border-t border-gray-700">
                                {/* Client Details Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium text-xs uppercase tracking-wider text-gray-500 mb-2">Contract Details</h4>
                                    <div className="space-y-3">
                                      {/* Contract Start Date */}
                                      <div>
                                        <label className="block text-gray-400 mb-1 text-xs">Contract Start</label>
                                        <input 
                                          type="date" 
                                          className="w-full bg-gray-700 border-gray-600 rounded-md text-sm h-9"
                                          value={clientsExtendedData[client.id]?.contractStart || ''}
                                          onChange={(e) => handleDateChange(client.id, 'contractStart', e.target.value)}
                                        />
                                      </div>
                                      
                                      {/* Contract End Date */}
                                      <div>
                                        <label className="block text-gray-400 mb-1 text-xs">
                                          Contract End
                                          {isContractExpired(clientsExtendedData[client.id]?.contractEnd) && (
                                            <span className="text-red-400 ml-1">(Expired)</span>
                                          )}
                                        </label>
                                        <input 
                                          type="date" 
                                          className="w-full bg-gray-700 border-gray-600 rounded-md text-sm h-9"
                                          value={clientsExtendedData[client.id]?.contractEnd || ''}
                                          onChange={(e) => handleDateChange(client.id, 'contractEnd', e.target.value)}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium text-xs uppercase tracking-wider text-gray-500 mb-2">Financial Details</h4>
                                    <div className="space-y-3">
                                      {/* Retainer Rate */}
                                      <div>
                                        <label className="block text-gray-400 mb-1 text-xs">Monthly Retainer</label>
                                        <div className="relative">
                                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">$</span>
                                          <input 
                                            type="number" 
                                            className="w-full bg-gray-700 border-gray-600 rounded-md text-sm h-9 pl-7"
                                            value={clientsExtendedData[client.id]?.retainerRate || ''}
                                            onChange={(e) => handleNumberChange(client.id, 'retainerRate', e.target.value)}
                                          />
                                        </div>
                                      </div>
                                      
                                      {/* Performance Fee */}
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="block text-gray-400 mb-1 text-xs">Performance Fee</label>
                                          <div className="relative">
                                            <input 
                                              type="number" 
                                              className="w-full bg-gray-700 border-gray-600 rounded-md text-sm h-9 pr-8"
                                              value={clientsExtendedData[client.id]?.performancePercent || ''}
                                              onChange={(e) => handleNumberChange(client.id, 'performancePercent', e.target.value)}
                                            />
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">%</span>
                                          </div>
                                        </div>
                                        
                                        <div>
                                          <label className="block text-gray-400 mb-1 text-xs">Based On</label>
                                          <Select
                                            value={clientsExtendedData[client.id]?.performanceType || 'rev'}
                                            onValueChange={(value) => handleSelectChange(client.id, 'performanceType', value)}
                                          >
                                            <SelectTrigger className="w-full bg-gray-700 border-gray-600 h-9">
                                              <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-800 border-gray-700">
                                              <SelectItem value="rev">Revenue</SelectItem>
                                              <SelectItem value="profit">Profit</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Team Assignment Section */}
                                <div>
                                  <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-medium text-xs uppercase tracking-wider text-gray-500">Assigned Team</h4>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-7 text-xs p-0 px-2"
                                      onClick={() => handleOpenAssignDialog(client.id)}
                                    >
                                      <UserPlus className="h-3.5 w-3.5 mr-1" /> Assign
                                    </Button>
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-2">
                                    {(clientAssignmentsState[client.id] || []).length > 0 ? (
                                      (clientAssignmentsState[client.id] || []).map(member => (
                                        <div 
                                          key={member.id} 
                                          className="bg-gray-700/50 rounded-full px-3 py-1 text-xs flex items-center"
                                        >
                                          <User className="h-3 w-3 mr-1.5 text-gray-400" />
                                          <span>{member.name}</span>
                                          <Badge 
                                            className="ml-1.5 h-4 bg-gray-600/80 hover:bg-gray-600 text-[10px] px-1.5"
                                            variant="secondary"
                                          >
                                            {member.role}
                                          </Badge>
                                          {isAdmin && (
                                            <button 
                                              className="ml-1.5 text-gray-400 hover:text-white"
                                              onClick={() => removeTeamMember(client.id, member.id)}
                                            >
                                              <X className="h-3 w-3" />
                                            </button>
                                          )}
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-gray-500 text-xs">No team members assigned</p>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Documents Section */}
                                <div>
                                  <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-medium text-xs uppercase tracking-wider text-gray-500">Client Documents</h4>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-7 text-xs p-0 px-2"
                                      onClick={() => {
                                        setAddingDocument(client.id);
                                        setDocumentFormData({name: '', url: ''});
                                      }}
                                      disabled={getClientDocuments(client.id).length >= 5}
                                    >
                                      <FileText className="h-3.5 w-3.5 mr-1" /> Add Document
                                    </Button>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    {getClientDocuments(client.id).length > 0 ? (
                                      getClientDocuments(client.id).map(doc => (
                                        <div 
                                          key={doc.id} 
                                          className="flex items-center justify-between bg-gray-700/30 rounded p-2 text-sm"
                                        >
                                          <div className="flex items-center">
                                            <FileText className="h-4 w-4 mr-2 text-gray-400" />
                                            <a 
                                              href={doc.url} 
                                              target="_blank" 
                                              rel="noopener noreferrer"
                                              className="text-blue-400 hover:text-blue-300 hover:underline mr-2"
                                            >
                                              {doc.name}
                                            </a>
                                          </div>
                                          
                                          {isAdmin && (
                                            <div className="flex space-x-1">
                                              <button 
                                                className="p-1 hover:bg-gray-600 rounded text-gray-400 hover:text-white"
                                                onClick={() => {
                                                  setEditingDocumentId(doc.id);
                                                  setDocumentFormData({
                                                    name: doc.name,
                                                    url: doc.url
                                                  });
                                                }}
                                              >
                                                <Pencil className="h-3 w-3" />
                                              </button>
                                              <button 
                                                className="p-1 hover:bg-gray-600 rounded text-gray-400 hover:text-white"
                                                onClick={() => handleRemoveDocument(client.id, doc.id)}
                                              >
                                                <X className="h-3 w-3" />
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-gray-500 text-xs">No documents added</p>
                                    )}
                                    
                                    {/* Add Document Form */}
                                    {addingDocument === client.id && (
                                      <div className="mt-2 p-3 border border-gray-700 rounded-md bg-gray-700/30">
                                        <h5 className="font-medium mb-2 text-sm">Add Document</h5>
                                        <div className="space-y-2">
                                          <div>
                                            <label className="block text-gray-400 mb-1 text-xs">Name</label>
                                            <Input 
                                              className="h-8 text-sm bg-gray-700 border-gray-600"
                                              value={documentFormData.name}
                                              onChange={(e) => setDocumentFormData({
                                                ...documentFormData,
                                                name: e.target.value
                                              })}
                                              placeholder="Document name"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-gray-400 mb-1 text-xs">URL</label>
                                            <Input 
                                              className="h-8 text-sm bg-gray-700 border-gray-600"
                                              value={documentFormData.url}
                                              onChange={(e) => setDocumentFormData({
                                                ...documentFormData,
                                                url: e.target.value
                                              })}
                                              placeholder="https://..."
                                            />
                                          </div>
                                          <div className="flex space-x-2 justify-end mt-3">
                                            <Button 
                                              variant="ghost" 
                                              size="sm" 
                                              className="h-7 text-xs"
                                              onClick={() => setAddingDocument(null)}
                                            >
                                              Cancel
                                            </Button>
                                            <Button 
                                              variant="default" 
                                              size="sm" 
                                              className="h-7 text-xs bg-blue-600 hover:bg-blue-700"
                                              onClick={() => handleAddDocument(client.id)}
                                              disabled={!documentFormData.name || !documentFormData.url}
                                            >
                                              Add
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Edit Document Form */}
                                    {editingDocumentId && getClientDocuments(client.id).some(d => d.id === editingDocumentId) && (
                                      <div className="mt-2 p-3 border border-gray-700 rounded-md bg-gray-700/30">
                                        <h5 className="font-medium mb-2 text-sm">Edit Document</h5>
                                        <div className="space-y-2">
                                          <div>
                                            <label className="block text-gray-400 mb-1 text-xs">Name</label>
                                            <Input 
                                              className="h-8 text-sm bg-gray-700 border-gray-600"
                                              value={documentFormData.name}
                                              onChange={(e) => setDocumentFormData({
                                                ...documentFormData,
                                                name: e.target.value
                                              })}
                                              placeholder="Document name"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-gray-400 mb-1 text-xs">URL</label>
                                            <Input 
                                              className="h-8 text-sm bg-gray-700 border-gray-600"
                                              value={documentFormData.url}
                                              onChange={(e) => setDocumentFormData({
                                                ...documentFormData,
                                                url: e.target.value
                                              })}
                                              placeholder="https://..."
                                            />
                                          </div>
                                          <div className="flex space-x-2 justify-end mt-3">
                                            <Button 
                                              variant="ghost" 
                                              size="sm" 
                                              className="h-7 text-xs"
                                              onClick={() => setEditingDocumentId(null)}
                                            >
                                              Cancel
                                            </Button>
                                            <Button 
                                              variant="default" 
                                              size="sm" 
                                              className="h-7 text-xs bg-blue-600 hover:bg-blue-700"
                                              onClick={() => handleUpdateDocument(client.id, editingDocumentId)}
                                              disabled={!documentFormData.name || !documentFormData.url}
                                            >
                                              Update
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Undo Button */}
                                {clientDataBackup[client.id] && (
                                  <div className="flex justify-end mb-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-xs"
                                      onClick={() => handleUndoChanges(client.id)}
                                    >
                                      <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                                      Undo Changes
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="px-6 py-8 text-center">
                        <p className="text-gray-400">No clients found</p>
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
      
      {/* Assign Team Members Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Assign Team Members</DialogTitle>
            <DialogDescription className="text-gray-400">
              Assign team members to {selectedClientId && displayClients?.find(c => c.id === selectedClientId)?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select Team Member</label>
              <Select
                value={selectedTeamMemberForAssignment ? String(selectedTeamMemberForAssignment.id) : ''}
                onValueChange={(value) => {
                  const memberId = parseInt(value);
                  const member = teamMembers.find(m => m.id === memberId);
                  if (member) {
                    setSelectedTeamMemberForAssignment(member);
                  }
                }}
              >
                <SelectTrigger className="w-full bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {selectedClientId && getAvailableTeamMembers(selectedClientId).map(member => (
                    <SelectItem key={member.id} value={String(member.id)}>
                      {member.name} - {member.role}
                    </SelectItem>
                  ))}
                  {selectedClientId && getAvailableTeamMembers(selectedClientId).length === 0 && (
                    <SelectItem value="none" disabled>
                      All team members already assigned
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="default" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={assignTeamMember}
                disabled={!selectedTeamMemberForAssignment}
              >
                Assign
              </Button>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Currently Assigned</h4>
              <div className="space-y-2">
                {selectedClientId && (clientAssignmentsState[selectedClientId] || []).map(member => {
                  // Check if the member is still in the team
                  const isValidMember = teamMembers.some(m => m.id === member.id);
                  const isAssigned = true; // They're already assigned if they're in this list
                  
                  return (
                    <div 
                      key={member.id}
                      className="flex justify-between items-center p-2 bg-gray-700/50 rounded"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mr-2">
                          <User className="h-4 w-4 text-gray-300" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{member.name}</div>
                          <div className="text-xs text-gray-400">{member.role}</div>
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => selectedClientId && removeTeamMember(selectedClientId, member.id)}
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
