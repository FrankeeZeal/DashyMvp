import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  SiMailchimp, 
  SiShopify, 
  SiZapier,
  SiMongodb // Will use this for Omnisend as there's no direct icon
} from 'react-icons/si';
import { 
  FaShoppingBag, 
  FaStar, 
  FaMobile, 
  FaCommentDots, 
  FaCogs, 
  FaEnvelope 
} from 'react-icons/fa';
import klaviyoLogo from '@/assets/klaviyo-logo.png';
import { Loader2, PlusCircle } from 'lucide-react';

interface ClientIntegrationsProps {
  clientId: number;
}

type IntegrationType = 'email' | 'sms' | 'ecommerce' | 'reviews' | 'abandoned-cart' | 'automation' | 'other';

interface Integration {
  id: number;
  name: string;
  type: IntegrationType;
  icon: React.ReactNode;
  isConnected: boolean;
  lastSynced?: Date;
  comingSoon?: boolean;
}

export const ClientIntegrations: React.FC<ClientIntegrationsProps> = ({ clientId }) => {
  // Fetch integrations for this client from the API
  const { data: apiIntegrations, isLoading } = useQuery<Integration[]>({
    queryKey: [`/api/clients/${clientId}/integrations`],
    retry: false,
  });
  
  // Integrations list
  const availableIntegrations: Integration[] = [
    { id: 1, name: 'Klaviyo', type: 'email', icon: <img src={klaviyoLogo} alt="Klaviyo" className="w-8 h-8" />, isConnected: false },
    { id: 2, name: 'Omnisend', type: 'email', icon: <SiMongodb className="w-6 h-6 text-[#28724F]" />, isConnected: false },
    { id: 3, name: 'Mailchimp', type: 'email', icon: <SiMailchimp className="w-6 h-6 text-[#FFE01B]" />, isConnected: false },
    { id: 4, name: 'Shopify', type: 'ecommerce', icon: <SiShopify className="w-6 h-6 text-[#95BF47]" />, isConnected: false, comingSoon: true },
    { id: 5, name: 'Yotpo', type: 'reviews', icon: <FaStar className="w-6 h-6 text-[#f3a846]" />, isConnected: false },
    { id: 6, name: 'Postscript', type: 'sms', icon: <FaCommentDots className="w-6 h-6 text-[#8C52FF]" />, isConnected: false },
    { id: 7, name: 'Recart', type: 'abandoned-cart', icon: <FaShoppingBag className="w-6 h-6 text-[#FF6B6B]" />, isConnected: false },
    { id: 8, name: 'Attentive', type: 'sms', icon: <FaMobile className="w-6 h-6 text-[#F26D21]" />, isConnected: false },
    { id: 9, name: 'Zapier', type: 'automation', icon: <SiZapier className="w-6 h-6 text-[#FF4A00]" />, isConnected: false },
    { id: 10, name: 'Make', type: 'automation', icon: <FaCogs className="w-6 h-6 text-[#4353FF]" />, isConnected: false }
  ];
  
  // Use the available integrations since we don't have any connected integrations yet
  const integrations = Array.isArray(apiIntegrations) && apiIntegrations.length > 0 
    ? apiIntegrations 
    : availableIntegrations;
  
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
          {Array.isArray(integrations) && integrations.map((integration: Integration) => (
            <Card key={integration.id} className={`bg-gray-800 border-gray-700 ${integration.isConnected ? 'border-l-4 border-l-green-500' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center">
                    <span className="mr-2">{integration.icon}</span>
                    {integration.name}
                    {integration.comingSoon && (
                      <span className="ml-2 text-xs px-1.5 py-0.5 bg-blue-900/40 text-blue-300 rounded-md">
                        Coming Soon
                      </span>
                    )}
                  </CardTitle>
                  <span 
                    className={`px-2 py-1 text-xs rounded-full ${
                      integration.isConnected 
                        ? 'bg-green-900/40 text-green-400'
                        : integration.comingSoon
                          ? 'bg-blue-900/40 text-blue-300'
                          : 'bg-amber-900/40 text-amber-400'
                    }`}
                  >
                    {integration.isConnected 
                      ? 'Connected' 
                      : integration.comingSoon
                        ? 'Coming Soon'
                        : 'Not Connected'
                    }
                  </span>
                </div>
                <CardDescription>
                  {integration.type === 'sms' 
                    ? 'SMS Integrations' 
                    : integration.type.charAt(0).toUpperCase() + integration.type.slice(1)
                  }
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
                <Button 
                  variant="outline" 
                  className="w-full"
                  disabled={integration.comingSoon}
                >
                  {integration.isConnected 
                    ? 'Sync Data Now' 
                    : integration.comingSoon
                      ? 'Coming Soon'
                      : 'Connect'
                  }
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