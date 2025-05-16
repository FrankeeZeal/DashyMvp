import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format, formatDistanceToNow } from "date-fns";
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
  Check
} from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export const AllClients = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
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
  
  // Filter clients based on search term
  const filteredClients = displayClients.filter(
    client => client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getClientInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-300 hover:bg-green-500/30 border-green-800">Active</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 border-yellow-800">Pending</Badge>;
      case "inactive":
        return <Badge className="bg-gray-500/20 text-gray-300 hover:bg-gray-500/30 border-gray-700">Inactive</Badge>;
      default:
        return null;
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
                                  {getStatusBadge(client.status || 'active')}
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
                          
                          {/* Expanded content - team assignments */}
                          {expandedClientId === client.id && (
                            <div className="px-6 py-3 pb-4 border-t border-gray-700 bg-gray-800/50">
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