import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  RiDashboardLine,
  RiUserLine,
  RiMailLine,
  RiTeamLine,
  RiPieChartLine,
  RiSettingsLine,
  RiBookOpenLine
} from "react-icons/ri";

interface SidebarProps {
  type: "agency" | "ecom";
  onLogout: () => void;
}

export const Sidebar = ({ type, onLogout }: SidebarProps) => {
  const [location] = useLocation();
  const { user } = useAuth();
  
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

  const navItems = isAgency
    ? [
        { path: basePath, label: "Dashboard", icon: <RiDashboardLine className="mr-3 text-lg" /> },
        { path: `${basePath}/clients`, label: "Clients", icon: <RiUserLine className="mr-3 text-lg" /> },
        { path: `${basePath}/campaigns`, label: "Campaigns", icon: <RiMailLine className="mr-3 text-lg" /> },
        { path: `${basePath}/team`, label: "Team", icon: <RiTeamLine className="mr-3 text-lg" /> },
        { path: `${basePath}/analytics`, label: "Analytics", icon: <RiPieChartLine className="mr-3 text-lg" /> },
        { path: `${basePath}/settings`, label: "Settings", icon: <RiSettingsLine className="mr-3 text-lg" /> },
      ]
    : [
        { path: basePath, label: "Dashboard", icon: <RiDashboardLine className="mr-3 text-lg" /> },
        { path: `${basePath}/campaigns`, label: "Campaigns", icon: <RiMailLine className="mr-3 text-lg" /> },
        { path: `${basePath}/analytics`, label: "Analytics", icon: <RiPieChartLine className="mr-3 text-lg" /> },
        { path: `${basePath}/team`, label: "Team", icon: <RiTeamLine className="mr-3 text-lg" /> },
        { path: `${basePath}/training`, label: "Training", icon: <RiBookOpenLine className="mr-3 text-lg" /> },
        { path: `${basePath}/settings`, label: "Settings", icon: <RiSettingsLine className="mr-3 text-lg" /> },
      ];

  return (
    <aside className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 bg-gray-900 border-r border-gray-700">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-white bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Dashy</h1>
          </div>
          <div className="mt-5 flex-1 flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navItems.map((item) => (
                <div key={item.path} className="w-full">
                  <Link href={item.path}>
                    <div
                      className={cn(
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer",
                        location === item.path
                          ? "bg-primary-50 text-primary-700"
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </div>
                  </Link>
                </div>
              ))}
            </nav>
          </div>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
          <div className="flex-shrink-0 group block w-full">
            <div className="flex items-center">
              <div>
                <Avatar className="border-2 border-blue-500/30">
                  {user?.profileImageUrl ? (
                    <AvatarImage src={user.profileImageUrl} alt={getName()} />
                  ) : (
                    <AvatarFallback className="bg-blue-900 text-blue-100">{getInitials()}</AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-white group-hover:text-blue-300">
                  {getName()}
                </p>
                <p className="text-xs font-medium text-gray-400 group-hover:text-gray-300">
                  {isAgency ? "Agency Owner" : "Store Owner"}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout} className="text-gray-400 hover:text-white hover:bg-gray-800">
                <RiSettingsLine className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
