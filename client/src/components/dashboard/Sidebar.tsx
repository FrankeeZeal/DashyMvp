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
  RiDashboardLine,
  RiUserLine,
  RiFileTextLine,
  RiTeamLine,
  RiPieChartLine,
  RiSettingsLine,
  RiBookOpenLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiSearchLine,
  RiMenuLine,
  RiMenuFoldLine
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
  const navItems = isAgency
    ? [
        { path: basePath, label: "Dashboard", icon: <RiDashboardLine className={collapsed ? "text-lg" : "mr-3 text-lg"} /> },
        { path: `${basePath}/clients`, label: "Clients", icon: <RiUserLine className={collapsed ? "text-lg" : "mr-3 text-lg"} /> },
        { path: `${basePath}/analytics`, label: "Analytics", icon: <RiPieChartLine className={collapsed ? "text-lg" : "mr-3 text-lg"} /> },
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
                    {collapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={item.path}>
                            <div
                              className={cn(
                                "group flex items-center justify-center p-2 text-sm font-medium rounded-md cursor-pointer",
                                location === item.path
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
                    ) : (
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
