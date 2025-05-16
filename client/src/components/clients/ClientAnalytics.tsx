import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CampaignTable } from '@/components/dashboard/CampaignTable';
import { ROIReport } from '@/components/dashboard/ROIReport';
import { CampaignReport } from '@/components/dashboard/CampaignReport';
import { Loader2 } from 'lucide-react';

interface ClientAnalyticsProps {
  clientId: number;
  dataSourceType: string;
}

export const ClientAnalytics: React.FC<ClientAnalyticsProps> = ({
  clientId,
  dataSourceType
}) => {
  // Fetch campaigns for this client
  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: [`/api/clients/${clientId}/campaigns`],
    retry: false,
  });
  
  // Filter campaigns based on data source type
  const filteredCampaigns = campaigns ? campaigns.filter((campaign: any) => {
    if (dataSourceType === "both") return true;
    return campaign.type.toLowerCase() === dataSourceType.toLowerCase();
  }) : [];
  
  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>View all campaigns and their performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          {campaignsLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : filteredCampaigns && filteredCampaigns.length > 0 ? (
            <CampaignTable campaigns={filteredCampaigns} isLoading={false} />
          ) : (
            <div className="text-center p-6 text-gray-400">
              <p>No campaigns found for selected data source</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Campaign Reports</CardTitle>
          <CardDescription>Detailed analytics and performance reports</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="roi">
            <TabsList className="bg-gray-700">
              <TabsTrigger value="roi" className="data-[state=active]:bg-blue-900">ROI Reports</TabsTrigger>
              <TabsTrigger value="performance" className="data-[state=active]:bg-blue-900">Performance Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="roi" className="mt-4">
              <ROIReport campaigns={filteredCampaigns} selectedClientId={clientId} />
            </TabsContent>
            
            <TabsContent value="performance" className="mt-4">
              <CampaignReport campaigns={filteredCampaigns} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientAnalytics;