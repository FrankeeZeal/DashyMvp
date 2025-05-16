import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  RiDashboardLine,
  RiUserLine,
  RiFileTextLine,
  RiTeamLine,
  RiPieChartLine,
  RiSettingsLine,
  RiBookOpenLine,
  RiArrowLeftSLine,
  RiSearchLine,
  RiMenuLine,
  RiMenuFoldLine,
  RiArrowDownSLine,
  RiAddLine,
  RiMore2Fill
} from "react-icons/ri";

interface SidebarProps {
  type: "agency" | "ecom";
  onLogout: () => void;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
}

export const Sidebar = ({ type, onLogout, isCollapsed = false, setIsCollapsed }: SidebarProps) => {
  const [location] = useLocation();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const [clientsOpen, setClientsOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  
  // Mock clients data - in production would come from API
  const mockClients = [
    { id: 1, name: "Earthly Goods", status: "Active" },
    { id: 2, name: "Sista Teas", status: "Active" },
    { id: 3, name: "Green Valley", status: "Active" },
    { id: 4, name: "FitLife Supplements", status: "Active" },
    { id: 5, name: "Blue Mountain Coffee", status: "Active" }
  ];
  
  // Sync with parent state if provided
  useEffect(() => {
    setCollapsed(isCollapsed);
  }, [isCollapsed]);
  
  const toggleCollapse = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    if (setIsCollapsed) {
      setIsCollapsed(newCollapsed);
    }
  };
  
  const getInitials = () => {
    if (!user) return "U";
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    }
    return user.email ? user.email[0].toUpperCase() : "U";
  };
  
  const getName = () => {
    if (!user) return "User";
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.email || "User";
  };

  const isAgency = type === "agency";
  const basePath = isAgency ? "/dashboard/agency" : "/dashboard/ecom";

  // Updated navigation items based on new structure
  const getClientItems = () => {
    // Return only 4 clients and then show View All button
    const displayClients = mockClients.slice(0, 4);
    return displayClients.map(client => ({
      path: `${basePath}/clients/${client.id}`,
      label: client.name,
      icon: <div className="w-2 h-2 rounded-full bg-green-500 mr-2 ml-6"></div>,
      isSubItem: true
    }));
  };
  
  const getAnalyticsItems = () => {
    return [
      {
        path: `${basePath}/analytics/predictive`,
        label: "Predictive Analytics",
        icon: <div className="w-2 h-2 rounded-full bg-purple-500 mr-2 ml-6"></div>,
        isSubItem: true
      },
      {
        path: `${basePath}/analytics/roi`,
        label: "ROI Calculator",
        icon: <div className="w-2 h-2 rounded-full bg-purple-500 mr-2 ml-6"></div>,
        isSubItem: true
      },
      {
        path: `${basePath}/analytics/reports`,
        label: "Reports",
        icon: <div className="w-2 h-2 rounded-full bg-purple-500 mr-2 ml-6"></div>,
        isSubItem: true
      }
    ];
  };

  const navItems = isAgency
    ? [
        { path: basePath, label: "Dashboard", icon: <RiDashboardLine className={collapsed ? "text-lg" : "mr-3 text-lg"} /> },
        // Special clients menu with dropdown
        { 
          path: `${basePath}/clients`, 
          label: "Clients", 
          icon: <RiUserLine className={collapsed ? "text-lg" : "mr-3 text-lg"} />,
          isDropdown: true,
          isOpen: clientsOpen,
          onToggle: () => setClientsOpen(!clientsOpen),
          subItems: getClientItems(),
          viewAllPath: `${basePath}/clients`,
          addNewPath: `${basePath}/clients/new`,
        },
        { 
          path: `${basePath}/analytics`, 
          label: "Analytics", 
          icon: <RiPieChartLine className={collapsed ? "text-lg" : "mr-3 text-lg"} />,
          isDropdown: true,
          isOpen: analyticsOpen,
          onToggle: () => setAnalyticsOpen(!analyticsOpen),
          subItems: getAnalyticsItems(),
        },
        { path: `${basePath}/agents`, label: "Agents", icon: <RiMenuLine className={collapsed ? "text-lg" : "mr-3 text-lg"} /> },
        { path: `${basePath}/docs`, label: "Docs", icon: <RiFileTextLine className={collapsed ? "text-lg" : "mr-3 text-lg"} /> },
        { path: `${basePath}/team`, label: "Team", icon: <RiTeamLine className={collapsed ? "text-lg" : "mr-3 text-lg"} /> },
      ]
    : [
        { path: basePath, label: "Dashboard", icon: <RiDashboardLine className={collapsed ? "text-lg" : "mr-3 text-lg"} /> },
        { path: `${basePath}/analytics`, label: "Analytics", icon: <RiPieChartLine className={collapsed ? "text-lg" : "mr-3 text-lg"} /> },
        { path: `${basePath}/agents`, label: "Agents", icon: <RiMenuLine className={collapsed ? "text-lg" : "mr-3 text-lg"} /> },
        { path: `${basePath}/docs`, label: "Docs", icon: <RiFileTextLine className={collapsed ? "text-lg" : "mr-3 text-lg"} /> },
        { path: `${basePath}/team`, label: "Team", icon: <RiTeamLine className={collapsed ? "text-lg" : "mr-3 text-lg"} /> },
      ];

  return (
    <aside className="hidden md:flex md:flex-shrink-0 h-screen">
      <div 
        className={cn(
          "flex flex-col bg-gray-900 border-r border-gray-700 transition-all duration-300 h-full",
          collapsed ? "w-16" : "w-64 xl:w-72"
        )}
      >
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto relative">
          <div className={cn(
            "flex items-center flex-shrink-0",
            collapsed ? "justify-center px-2" : "px-4"
          )}>
            {!collapsed && (
              <h1 className="text-xl font-bold text-white bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Dashy</h1>
            )}
            
            {/* Buttons container for search and collapse */}
            <div className="flex items-center gap-1 ml-auto">
              {/* Search button - only show when not collapsed */}
              {!collapsed && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <RiSearchLine className="h-5 w-5" />
                </Button>
              )}
              
              {/* Collapse button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleCollapse}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                {collapsed ? <RiMenuLine className="h-5 w-5" /> : <RiMenuFoldLine className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          <div className="mt-5 flex-1 flex flex-col">
            <nav className={cn(
              "flex-1 space-y-1",
              collapsed ? "px-1" : "px-2"
            )}>
              <TooltipProvider>
                {navItems.map((item) => (
                  <div key={item.path} className="w-full">
                    {item.isDropdown && !collapsed ? (
                      <Collapsible open={item.isOpen} onOpenChange={item.onToggle} className="w-full">
                        <CollapsibleTrigger asChild>
                          <div
                            className={cn(
                              "group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md cursor-pointer",
                              location.startsWith(item.path)
                                ? "bg-blue-900/50 text-blue-300 shadow-sm shadow-blue-500/20"
                                : "text-gray-300 hover:bg-gray-800 hover:text-white"
                            )}
                          >
                            <div className="flex items-center">
                              {item.icon}
                              {item.label}
                            </div>
                            <div className="transition-transform duration-200" style={{ transform: item.isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                              <RiArrowDownSLine className="h-4 w-4" />
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
                          <div className="pt-1 pb-2">
                            {item.subItems.map((subItem) => (
                              <Link href={subItem.path} key={subItem.path}>
                                <div className={cn(
                                  "flex items-center px-2 py-1.5 text-sm font-medium rounded-md cursor-pointer my-0.5",
                                  location === subItem.path
                                    ? "bg-blue-900/30 text-blue-300"
                                    : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
                                )}>
                                  {subItem.icon}
                                  <span className="truncate max-w-[140px]">{subItem.label}</span>
                                </div>
                              </Link>
                            ))}
                            {/* Only show View All for Clients dropdown */}
                            {item.path.includes('/clients') && (
                              <Link href={`${basePath}/clients/all`}>
                                <div className={cn(
                                  "flex items-center px-2 py-1.5 text-sm font-medium rounded-md cursor-pointer my-0.5",
                                  location === `${basePath}/clients/all`
                                    ? "bg-blue-900/30 text-blue-300"
                                    : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
                                )}>
                                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2 ml-6"></div>
                                  <span className="truncate max-w-[140px]">View All</span>
                                </div>
                              </Link>
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ) : collapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={item.path}>
                            <div
                              className={cn(
                                "group flex items-center justify-center p-2 text-sm font-medium rounded-md cursor-pointer",
                                location === item.path || (item.isDropdown && location.startsWith(item.path))
                                  ? "bg-blue-900/50 text-blue-300 shadow-sm shadow-blue-500/20"
                                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
                              )}
                            >
                              {item.icon}
                            </div>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    ) : !item.isDropdown && (
                      <Link href={item.path}>
                        <div
                          className={cn(
                            "group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer",
                            location === item.path
                              ? "bg-blue-900/50 text-blue-300 shadow-sm shadow-blue-500/20"
                              : "text-gray-300 hover:bg-gray-800 hover:text-white"
                          )}
                        >
                          {item.icon}
                          {item.label}
                        </div>
                      </Link>
                    )}
                  </div>
                ))}
              </TooltipProvider>
            </nav>
          </div>
        </div>
        {/* Footer section here if needed */}
      </div>
    </aside>
  );
};

export default Sidebar;
