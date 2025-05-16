import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { type Client } from "@shared/schema";
import { RiArrowRightSLine } from "react-icons/ri";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";

interface ClientListProps {
  clients: Client[];
  isLoading: boolean;
  title?: string;
}

export const ClientList = ({ clients, isLoading, title = "Recent Clients" }: ClientListProps) => {
  const renderSkeleton = () => {
    return Array.from({ length: 3 }).map((_, i) => (
      <li key={i} className="border-b border-gray-200 last:border-b-0">
        <div className="px-4 py-4 sm:px-6">
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

  // Default clients for empty state
  const defaultClients = [
    {
      id: 1,
      organizationId: 1,
      name: "Sunrise Clothing Co.",
      status: "active",
      addedAt: new Date(2023, 0, 12),
    },
    {
      id: 2,
      organizationId: 1,
      name: "Mountain Wellness",
      status: "active",
      addedAt: new Date(2023, 0, 8),
    },
    {
      id: 3,
      organizationId: 1,
      name: "The Pet Shop",
      status: "pending",
      addedAt: new Date(2023, 0, 3),
    },
  ] as Client[];

  const displayClients = clients.length > 0 ? clients : defaultClients;

  const getClientInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-900 text-green-300 border-green-700 shadow-sm shadow-green-500/30">
            Active
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-900 text-yellow-300 border-yellow-700 shadow-sm shadow-yellow-500/30">
            Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-900 text-gray-300 border-gray-700">
            {status || "Unknown"}
          </Badge>
        );
    }
  };

  return (
    <Card className="bg-gray-800 shadow-xl shadow-blue-500/20 border border-gray-700">
      <CardHeader className="pb-3 border-b border-gray-700 flex justify-between items-center">
        <CardTitle className="text-white">{title}</CardTitle>
        <a href="#" className="text-sm font-medium text-blue-400 hover:text-blue-300">
          View all
        </a>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-gray-700">
          {isLoading
            ? renderSkeleton()
            : displayClients.map((client) => (
                <li key={client.id}>
                  <Link href={`/dashboard/agency/clients/${client.id}`} className="block hover:bg-gray-700">
                    <div className="px-4 py-4 sm:px-6">
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
                        <div className="flex items-center">
                          {getStatusBadge(client.status)}
                          <RiArrowRightSLine className="ml-2 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ClientList;
