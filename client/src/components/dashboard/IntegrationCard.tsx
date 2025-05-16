import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { type Integration } from "@shared/schema";
import { RiAddLine, RiMailLine, RiMessage2Line, RiShoppingCartLine, RiBarChartBoxLine } from "react-icons/ri";

interface IntegrationCardProps {
  integrations: Integration[];
  isLoading: boolean;
}

export const IntegrationCard = ({ integrations, isLoading }: IntegrationCardProps) => {
  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case "email":
        return <RiMailLine className="text-blue-400 text-xl" />;
      case "sms":
        return <RiMessage2Line className="text-purple-400 text-xl" />;
      case "ecommerce":
        return <RiShoppingCartLine className="text-indigo-400 text-xl" />;
      case "analytics":
        return <RiBarChartBoxLine className="text-blue-400 text-xl" />;
      default:
        return <RiMailLine className="text-gray-400 text-xl" />;
    }
  };

  const getIntegrationStatus = (status: string) => {
    if (!status) return null;
    
    switch (status) {
      case "connected":
        return (
          <Badge variant="outline" className="bg-green-900 text-green-300 border-green-700 shadow-sm shadow-green-500/30">
            Connected
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-900 text-yellow-300 border-yellow-700 shadow-sm shadow-yellow-500/30">
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-900 text-red-300 border-red-700 shadow-sm shadow-red-500/30">
            Failed
          </Badge>
        );
      default:
        return (
          <Button size="sm" variant="outline" className="border-blue-700 text-blue-300 hover:bg-blue-900 shadow-sm shadow-blue-500/20">
            Connect
          </Button>
        );
    }
  };

  // Default integrations for empty state
  const defaultIntegrations = [
    {
      id: 1,
      name: "Klaviyo",
      type: "email",
      status: "connected",
      description: "Email marketing platform",
    },
    {
      id: 2,
      name: "Twilio",
      type: "sms",
      status: "connected",
      description: "SMS messaging service",
    },
    {
      id: 3,
      name: "Shopify",
      type: "ecommerce",
      status: "pending",
      description: "E-commerce platform",
    },
    {
      id: 4,
      name: "Google Analytics",
      type: "analytics",
      status: "pending",
      description: "Web analytics service",
    },
  ] as Integration[];

  const displayIntegrations = integrations.length > 0 ? integrations : defaultIntegrations;

  const renderSkeleton = () => {
    return Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="ml-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24 mt-1" />
          </div>
        </div>
        <Skeleton className="h-8 w-24" />
      </div>
    ));
  };

  return (
    <Card className="bg-gray-800 shadow-xl shadow-blue-500/20 border border-gray-700">
      <CardHeader className="pb-3 border-b border-gray-700">
        <CardTitle className="text-white">Integration Status</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {isLoading
            ? renderSkeleton()
            : displayIntegrations.map((integration) => (
                <div key={integration.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-900 shadow-inner shadow-blue-500/30 flex items-center justify-center">
                      {getIntegrationIcon(integration.type)}
                    </div>
                    <div className="ml-4">
                      <h4 className="text-base font-medium text-white">{integration.name}</h4>
                      <p className="text-sm text-gray-400">{(integration as any).description || 'Integration service'}</p>
                    </div>
                  </div>
                  {getIntegrationStatus(integration.status)}
                </div>
              ))}
        </div>

        <div className="mt-6">
          <Button variant="outline" className="w-full border-blue-700 text-blue-300 hover:bg-blue-900 shadow-md shadow-blue-500/20">
            <RiAddLine className="mr-2" />
            Add New Integration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationCard;
