import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { RiMenuLine, RiNotification3Line, RiDashboardLine, RiUserLine, RiFileTextLine, RiTeamLine, RiPieChartLine, RiSettingsLine, RiBookOpenLine, RiSearchLine } from "react-icons/ri";

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
        { path: `${basePath}/docs`, label: "Docs", icon: <RiFileTextLine className="mr-3 text-lg" /> },
        { path: `${basePath}/analytics`, label: "Analytics", icon: <RiPieChartLine className="mr-3 text-lg" /> },
        { path: `${basePath}/settings`, label: "Settings", icon: <RiSettingsLine className="mr-3 text-lg" /> },
        { path: `${basePath}/training`, label: "Knowledge Base", icon: <RiBookOpenLine className="mr-3 text-lg" /> },
        { path: `${basePath}/team`, label: "Team", icon: <RiTeamLine className="mr-3 text-lg" /> },
      ]
    : [
        { path: basePath, label: "Dashboard", icon: <RiDashboardLine className="mr-3 text-lg" /> },
        { path: `${basePath}/docs`, label: "Docs", icon: <RiFileTextLine className="mr-3 text-lg" /> },
        { path: `${basePath}/analytics`, label: "Analytics", icon: <RiPieChartLine className="mr-3 text-lg" /> },
        { path: `${basePath}/settings`, label: "Settings", icon: <RiSettingsLine className="mr-3 text-lg" /> },
        { path: `${basePath}/training`, label: "Knowledge Base", icon: <RiBookOpenLine className="mr-3 text-lg" /> },
        { path: `${basePath}/team`, label: "Team", icon: <RiTeamLine className="mr-3 text-lg" /> },
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
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-white bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mr-2">Dashy</h1>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-400 hover:text-white hover:bg-gray-800 ml-2"
              >
                <RiSearchLine className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-gray-800 border-gray-700">
              <div className="p-4">
                <div className="relative">
                  <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search..."
                    className="pl-9 bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center md:ml-6">
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
