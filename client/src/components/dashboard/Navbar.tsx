import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { RiMenuLine, RiNotification3Line, RiDashboardLine, RiUserLine, RiMailLine, RiTeamLine, RiPieChartLine, RiSettingsLine, RiBookOpenLine, RiSearchLine } from "react-icons/ri";

interface NavbarProps {
  type: "agency" | "ecom";
  onToggleSidebar: () => void;
}

export const Navbar = ({ type, onToggleSidebar }: NavbarProps) => {
  const [location] = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-gray-900 border-b border-gray-700">
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden px-4 text-gray-400 hover:text-white hover:bg-gray-800" 
        onClick={onToggleSidebar}
      >
        <RiMenuLine className="h-6 w-6" />
      </Button>

      <div className="flex-1 flex justify-between px-4 md:px-0">
        <div className="flex-1 flex items-center md:ml-6">
          <div className="w-full md:max-w-md">
            <div className="relative text-gray-400 focus-within:text-blue-400">
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                <RiSearchLine />
              </div>
              <Input
                id="search"
                className="block w-full bg-gray-800 py-2 pl-10 pr-3 border border-gray-700 rounded-md leading-5 text-white placeholder-gray-500 focus:outline-none focus:bg-gray-800 focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search"
                type="search"
                name="search"
              />
            </div>
          </div>
        </div>

        <div className="ml-4 flex items-center md:ml-6">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
            <RiNotification3Line className="h-6 w-6" />
          </Button>

          <div className="ml-3 relative">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="bg-gray-800 hover:bg-gray-700">
                  <Avatar className="border-2 border-blue-500/30">
                    <AvatarImage src={user?.profileImageUrl} alt={getName()} />
                    <AvatarFallback className="bg-blue-900 text-blue-100">{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="md:hidden bg-gray-900 border-l border-gray-700">
                <div className="flex flex-col h-full">
                  <div className="py-4 border-b border-gray-700">
                    <div className="flex items-center">
                      <Avatar className="border-2 border-blue-500/30">
                        <AvatarImage src={user?.profileImageUrl} alt={getName()} />
                        <AvatarFallback className="bg-blue-900 text-blue-100">{getInitials()}</AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-white">{getName()}</p>
                        <p className="text-xs font-medium text-gray-400">
                          {isAgency ? "Agency Owner" : "Store Owner"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <nav className="flex-1 py-4 space-y-1">
                    {navItems.map((item) => (
                      <Link key={item.path} href={item.path}>
                        <div className={`flex items-center px-2 py-2 text-base font-medium rounded-md cursor-pointer ${
                          location === item.path
                            ? "bg-blue-900/50 text-blue-300"
                            : "text-gray-300 hover:bg-gray-800"
                        }`}>
                          {item.icon}
                          {item.label}
                        </div>
                      </Link>
                    ))}
                  </nav>

                  <div className="border-t border-gray-700 py-4">
                    <Button
                      variant="outline"
                      className="w-full border-blue-700 text-blue-300 hover:bg-blue-900/50"
                      onClick={() => (window.location.href = "/api/logout")}
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
