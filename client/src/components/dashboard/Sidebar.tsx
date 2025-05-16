import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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

  // Using RiFileTextLine for "Docs" instead of "Campaigns"
  const navItems = isAgency
    ? [
        { path: basePath, label: "Dashboard", icon: <RiDashboardLine className={collapsed ? "text-lg" : "mr-3 text-lg"} /> },
        { path: `${basePath}/clients`, label: "Clients", icon: <RiUserLine className={collapsed ? "text-lg" : "mr-3 text-lg"} /> },
        { path: `${basePath}/docs`, label: "Docs", icon: <RiFileTextLine className={collapsed ? "text-lg" : "mr-3 text-lg"} /> },
        { path: `${basePath}/analytics`, label: "Analytics", icon: <RiPieChartLine className={collapsed ? "text-lg" : "mr-3 text-lg"} /> },
        { path: `${basePath}/settings`, label: "Settings", icon: <RiSettingsLine className={collapsed ? "text-lg" : "mr-3 text-lg"} /> },
        { path: `${basePath}/training`, label: "Knowledge Base", icon: <RiBookOpenLine className={collapsed ? "text-lg" : "mr-3 text-lg"} /> },
        { path: `${basePath}/team`, label: "Team", icon: <RiTeamLine className={collapsed ? "text-lg" : "mr-3 text-lg"} /> },
      ]
    : [
        { path: basePath, label: "Dashboard", icon: <RiDashboardLine className={collapsed ? "text-lg" : "mr-3 text-lg"} /> },
        { path: `${basePath}/docs`, label: "Docs", icon: <RiFileTextLine className={collapsed ? "text-lg" : "mr-3 text-lg"} /> },
        { path: `${basePath}/analytics`, label: "Analytics", icon: <RiPieChartLine className={collapsed ? "text-lg" : "mr-3 text-lg"} /> },
        { path: `${basePath}/settings`, label: "Settings", icon: <RiSettingsLine className={collapsed ? "text-lg" : "mr-3 text-lg"} /> },
        { path: `${basePath}/training`, label: "Knowledge Base", icon: <RiBookOpenLine className={collapsed ? "text-lg" : "mr-3 text-lg"} /> },
        { path: `${basePath}/team`, label: "Team", icon: <RiTeamLine className={collapsed ? "text-lg" : "mr-3 text-lg"} /> },
      ];

  return (
    <aside className="hidden md:flex md:flex-shrink-0">
      <div 
        className={cn(
          "flex flex-col bg-gray-900 border-r border-gray-700 transition-all duration-300",
          collapsed ? "w-16" : "w-64"
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
              {/* Search button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <RiSearchLine className="h-5 w-5" />
              </Button>
              
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
        <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
          <div className="flex-shrink-0 group block w-full">
            <div className={cn(
              "flex items-center",
              collapsed && "justify-center"
            )}>
              <div>
                <Avatar className="border-2 border-blue-500/30">
                  {user?.profileImageUrl ? (
                    <AvatarImage src={user.profileImageUrl} alt={getName()} />
                  ) : (
                    <AvatarFallback className="bg-blue-900 text-blue-100">{getInitials()}</AvatarFallback>
                  )}
                </Avatar>
              </div>
              {!collapsed && (
                <>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-white group-hover:text-blue-300">
                      {getName()}
                    </p>
                    <p className="text-xs font-medium text-gray-400 group-hover:text-gray-300">
                      {isAgency ? "Agency Owner" : "Store Owner"}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onLogout} 
                    className="text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <RiSettingsLine className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
