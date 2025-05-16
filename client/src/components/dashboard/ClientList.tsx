import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { type Client } from "@shared/schema";
import { RiArrowRightSLine } from "react-icons/ri";
import { formatDistanceToNow } from "date-fns";

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Active
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            {status}
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3 border-b border-gray-200 flex justify-between items-center">
        <CardTitle>{title}</CardTitle>
        <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
          View all
        </a>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-gray-200">
          {isLoading
            ? renderSkeleton()
            : displayClients.map((client) => (
                <li key={client.id}>
                  <a href="#" className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 font-medium">{getClientInitials(client.name)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{client.name}</div>
                            <div className="text-sm text-gray-500">
                              Added {formatDistanceToNow(new Date(client.addedAt), { addSuffix: true })}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {getStatusBadge(client.status)}
                          <RiArrowRightSLine className="ml-2 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </a>
                </li>
              ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ClientList;
