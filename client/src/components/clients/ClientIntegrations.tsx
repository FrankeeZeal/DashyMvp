import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SiMailchimp, SiKlarna, SiHubspot, SiShopify, SiTwilio, SiSpringsecurity } from 'react-icons/si';
import { Loader2, PlusCircle } from 'lucide-react';

interface ClientIntegrationsProps {
  clientId: number;
}

type IntegrationType = 'email' | 'sms' | 'ecommerce';

interface Integration {
  id: number;
  name: string;
  type: IntegrationType;
  icon: React.ReactNode;
  isConnected: boolean;
  lastSynced?: Date;
}

export const ClientIntegrations: React.FC<ClientIntegrationsProps> = ({ clientId }) => {
  // Fetch integrations for this client from the API
  const { data: apiIntegrations, isLoading } = useQuery({
    queryKey: [`/api/clients/${clientId}/integrations`],
    retry: false,
  });
  
  // Mock integrations for demo purposes
  const availableIntegrations: Integration[] = [
    { id: 1, name: 'Mailchimp', type: 'email', icon: <SiMailchimp className="w-6 h-6 text-[#FFE01B]" />, isConnected: false },
    { id: 2, name: 'Klaviyo', type: 'email', icon: <SiKlarna className="w-6 h-6 text-[#4CC7F2]" />, isConnected: false },
    { id: 3, name: 'HubSpot', type: 'email', icon: <SiHubspot className="w-6 h-6 text-[#FF7A59]" />, isConnected: false },
    { id: 4, name: 'Twilio', type: 'sms', icon: <SiTwilio className="w-6 h-6 text-[#F22F46]" />, isConnected: false },
    { id: 5, name: 'SMS Service', type: 'sms', icon: <SiSpringsecurity className="w-6 h-6 text-[#3A76F0]" />, isConnected: false },
    { id: 6, name: 'Shopify', type: 'ecommerce', icon: <SiShopify className="w-6 h-6 text-[#95BF47]" />, isConnected: false }
  ];
  
  // Combine API data with available integrations for demo UI
  const integrations = apiIntegrations || availableIntegrations;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Integrations</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Integration
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Integration</DialogTitle>
              <DialogDescription>
                Connect an integration to import campaign data automatically.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              {availableIntegrations.map((integration) => (
                <Card key={integration.id} className="bg-gray-700 border-gray-600 hover:bg-gray-600 cursor-pointer">
                  <CardContent className="p-4 flex items-center">
                    <div className="mr-3">{integration.icon}</div>
                    <div>
                      <h3 className="font-semibold">{integration.name}</h3>
                      <p className="text-xs text-gray-400">{integration.type.charAt(0).toUpperCase() + integration.type.slice(1)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {integrations.map((integration: Integration) => (
            <Card key={integration.id} className={`bg-gray-800 border-gray-700 ${integration.isConnected ? 'border-l-4 border-l-green-500' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center">
                    <span className="mr-2">{integration.icon}</span>
                    {integration.name}
                  </CardTitle>
                  <span 
                    className={`px-2 py-1 text-xs rounded-full ${
                      integration.isConnected 
                        ? 'bg-green-900/40 text-green-400'
                        : 'bg-amber-900/40 text-amber-400'
                    }`}
                  >
                    {integration.isConnected ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
                <CardDescription>
                  {integration.type.charAt(0).toUpperCase() + integration.type.slice(1)} Integration
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {integration.isConnected && integration.lastSynced && (
                  <p className="text-xs text-gray-400">
                    Last synced: {integration.lastSynced.toLocaleDateString()}
                  </p>
                )}
              </CardContent>
              <CardFooter className="border-t border-gray-700 pt-4">
                <Button variant="outline" className="w-full">
                  {integration.isConnected ? 'Sync Data Now' : 'Connect'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientIntegrations;