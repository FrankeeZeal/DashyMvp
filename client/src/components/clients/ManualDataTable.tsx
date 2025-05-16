import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ManualDataTableProps {
  clientId: number;
  clientName: string;
}

// Campaign data structure for the spreadsheet
interface CampaignData {
  id?: number;
  rowId: string;
  name: string;
  type: string;
  recipients: number;
  opens: number;
  clicks: number;
  conversions: number;
  revenue: number;
  cost: number;
  sentDate: string;
  isNew?: boolean;
}

// Create an empty row template
const createEmptyRow = (): CampaignData => ({
  rowId: `new-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  name: '',
  type: 'email',
  recipients: 0,
  opens: 0,
  clicks: 0,
  conversions: 0,
  revenue: 0,
  cost: 0,
  sentDate: new Date().toISOString().split('T')[0],
  isNew: true
});

export const ManualDataTable: React.FC<ManualDataTableProps> = ({ clientId, clientName }) => {
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [activeTab, setActiveTab] = useState('email');
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch manual campaigns from API
  const { data, isLoading } = useQuery({
    queryKey: [`/api/clients/${clientId}/manual-campaigns`],
    retry: false,
    // If the API is not implemented yet, just return empty array
    enabled: false
  });
  
  // For demo, use this effect to initialize with sample data
  useEffect(() => {
    const initialData: CampaignData[] = [
      {
        rowId: '1',
        name: 'Welcome Series',
        type: 'email',
        recipients: 2500,
        opens: 1430,
        clicks: 750,
        conversions: 85,
        revenue: 4250,
        cost: 1200,
        sentDate: '2025-05-01'
      },
      {
        rowId: '2',
        name: 'Abandoned Cart Recovery',
        type: 'email',
        recipients: 1800,
        opens: 1080,
        clicks: 540,
        conversions: 65,
        revenue: 6500,
        cost: 900,
        sentDate: '2025-05-05'
      },
      {
        rowId: '3',
        name: 'Flash Sale Notification',
        type: 'sms',
        recipients: 3200,
        opens: 0, // SMS doesn't have opens
        clicks: 480,
        conversions: 120,
        revenue: 9600,
        cost: 1600,
        sentDate: '2025-05-10'
      }
    ];
    
    setCampaigns(initialData);
  }, [clientId]);
  
  // Save campaign mutation
  const saveMutation = useMutation({
    mutationFn: async (campaignData: CampaignData[]) => {
      return await apiRequest("POST", `/api/clients/${clientId}/manual-campaigns`, {
        campaigns: campaignData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/clients/${clientId}/manual-campaigns`] });
      toast({
        title: "Success",
        description: "Campaign data saved successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save campaign data",
        variant: "destructive",
      });
      console.error("Error saving campaign data:", error);
    }
  });
  
  // Add a new empty row
  const handleAddRow = () => {
    setCampaigns([...campaigns, createEmptyRow()]);
  };
  
  // Delete a row
  const handleDeleteRow = (rowId: string) => {
    setCampaigns(campaigns.filter(campaign => campaign.rowId !== rowId));
  };
  
  // Update field in a specific row
  const handleUpdateField = (rowId: string, field: keyof CampaignData, value: any) => {
    setCampaigns(campaigns.map(campaign => {
      if (campaign.rowId === rowId) {
        return { ...campaign, [field]: value };
      }
      return campaign;
    }));
  };
  
  // Handle save
  const handleSave = () => {
    // Remove temporary rowId and any UI-specific fields before saving
    const dataToBeSaved = campaigns.map(({ rowId, isNew, ...rest }) => rest);
    saveMutation.mutate(campaigns);
  };
  
  // Filter campaigns by type based on active tab
  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.type.toLowerCase() === activeTab.toLowerCase()
  );
  
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="border-b border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Manual Campaign Data</CardTitle>
            <CardDescription>
              Add and manage campaign data manually for {clientName}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddRow}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Row
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {saveMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-1" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-gray-700 px-4">
            <TabsList className="bg-transparent border-b-0">
              <TabsTrigger 
                value="email" 
                className="data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300"
              >
                Email Campaigns
              </TabsTrigger>
              <TabsTrigger 
                value="sms" 
                className="data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300"
              >
                SMS Campaigns
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="email" className="m-0">
            <div className="overflow-x-auto">
              <GoogleSheetsTable 
                campaigns={filteredCampaigns} 
                onUpdateField={handleUpdateField}
                onDeleteRow={handleDeleteRow}
                isLoading={isLoading || saveMutation.isPending}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="sms" className="m-0">
            <div className="overflow-x-auto">
              <GoogleSheetsTable 
                campaigns={filteredCampaigns} 
                onUpdateField={handleUpdateField}
                onDeleteRow={handleDeleteRow}
                isLoading={isLoading || saveMutation.isPending}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t border-gray-700 px-4 py-3 text-sm text-gray-400">
        Note: Add your campaign performance data manually. Changes are saved when you click "Save Changes".
      </CardFooter>
    </Card>
  );
};

// Google Sheets-style table component
interface GoogleSheetsTableProps {
  campaigns: CampaignData[];
  onUpdateField: (rowId: string, field: keyof CampaignData, value: any) => void;
  onDeleteRow: (rowId: string) => void;
  isLoading: boolean;
}

const GoogleSheetsTable: React.FC<GoogleSheetsTableProps> = ({
  campaigns,
  onUpdateField,
  onDeleteRow,
  isLoading
}) => {
  const columnHeaders = [
    { key: 'name', label: 'Campaign Name' },
    { key: 'sentDate', label: 'Sent Date' },
    { key: 'recipients', label: 'Recipients' },
    { key: 'opens', label: 'Opens' },
    { key: 'clicks', label: 'Clicks' },
    { key: 'conversions', label: 'Conversions' },
    { key: 'revenue', label: 'Revenue ($)' },
    { key: 'cost', label: 'Cost ($)' },
    { key: 'actions', label: 'Actions' }
  ];
  
  return (
    <div className="w-full min-w-[900px] border border-gray-700 rounded-md my-2 overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-9 bg-gray-700 text-white font-medium text-sm">
        {columnHeaders.map((header, index) => (
          <div key={header.key} className={`p-2 ${header.key === 'name' ? 'col-span-2' : ''} ${header.key === 'actions' ? 'w-24 text-center' : ''}`}>
            {header.label}
          </div>
        ))}
      </div>
      
      {/* Table rows */}
      <div className="bg-gray-800">
        {campaigns.length === 0 && !isLoading && (
          <div className="p-4 text-center text-gray-400">
            No data available. Click "Add Row" to add a new campaign.
          </div>
        )}
        
        {isLoading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-2" />
            <p className="text-gray-400">Loading data...</p>
          </div>
        ) : (
          campaigns.map((campaign, rowIndex) => (
            <div 
              key={campaign.rowId} 
              className={`grid grid-cols-9 border-t border-gray-700 hover:bg-gray-700/20 transition-colors ${
                campaign.isNew ? 'bg-blue-900/10' : ''
              }`}
            >
              {/* Campaign Name */}
              <div className="p-2 col-span-2">
                <Input 
                  value={campaign.name} 
                  onChange={(e) => onUpdateField(campaign.rowId, 'name', e.target.value)}
                  className="bg-gray-700/30 border-gray-600 h-8"
                />
              </div>
              
              {/* Sent Date */}
              <div className="p-2">
                <Input 
                  type="date"
                  value={campaign.sentDate} 
                  onChange={(e) => onUpdateField(campaign.rowId, 'sentDate', e.target.value)}
                  className="bg-gray-700/30 border-gray-600 h-8"
                />
              </div>
              
              {/* Recipients */}
              <div className="p-2">
                <Input 
                  type="number"
                  value={campaign.recipients} 
                  onChange={(e) => onUpdateField(campaign.rowId, 'recipients', parseInt(e.target.value) || 0)}
                  className="bg-gray-700/30 border-gray-600 h-8"
                />
              </div>
              
              {/* Opens */}
              <div className="p-2">
                <Input 
                  type="number"
                  value={campaign.opens} 
                  onChange={(e) => onUpdateField(campaign.rowId, 'opens', parseInt(e.target.value) || 0)}
                  className="bg-gray-700/30 border-gray-600 h-8"
                />
              </div>
              
              {/* Clicks */}
              <div className="p-2">
                <Input 
                  type="number"
                  value={campaign.clicks} 
                  onChange={(e) => onUpdateField(campaign.rowId, 'clicks', parseInt(e.target.value) || 0)}
                  className="bg-gray-700/30 border-gray-600 h-8"
                />
              </div>
              
              {/* Conversions */}
              <div className="p-2">
                <Input 
                  type="number"
                  value={campaign.conversions} 
                  onChange={(e) => onUpdateField(campaign.rowId, 'conversions', parseInt(e.target.value) || 0)}
                  className="bg-gray-700/30 border-gray-600 h-8"
                />
              </div>
              
              {/* Revenue */}
              <div className="p-2">
                <Input 
                  type="number"
                  value={campaign.revenue} 
                  onChange={(e) => onUpdateField(campaign.rowId, 'revenue', parseFloat(e.target.value) || 0)}
                  className="bg-gray-700/30 border-gray-600 h-8"
                />
              </div>
              
              {/* Cost */}
              <div className="p-2">
                <Input 
                  type="number"
                  value={campaign.cost} 
                  onChange={(e) => onUpdateField(campaign.rowId, 'cost', parseFloat(e.target.value) || 0)}
                  className="bg-gray-700/30 border-gray-600 h-8"
                />
              </div>
              
              {/* Actions */}
              <div className="p-2 text-center flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteRow(campaign.rowId)}
                  className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/30"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Optional: Spreadsheet footer with totals */}
      {campaigns.length > 0 && (
        <div className="grid grid-cols-9 bg-gray-700/50 border-t border-gray-600 font-medium text-sm">
          <div className="p-2 col-span-2">Totals</div>
          <div className="p-2">
            {campaigns.reduce((sum, campaign) => sum + campaign.recipients, 0).toLocaleString()}
          </div>
          <div className="p-2">
            {campaigns.reduce((sum, campaign) => sum + campaign.opens, 0).toLocaleString()}
          </div>
          <div className="p-2">
            {campaigns.reduce((sum, campaign) => sum + campaign.clicks, 0).toLocaleString()}
          </div>
          <div className="p-2">
            {campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0).toLocaleString()}
          </div>
          <div className="p-2">
            ${campaigns.reduce((sum, campaign) => sum + campaign.revenue, 0).toLocaleString()}
          </div>
          <div className="p-2">
            ${campaigns.reduce((sum, campaign) => sum + campaign.cost, 0).toLocaleString()}
          </div>
          <div className="p-2"></div>
        </div>
      )}
    </div>
  );
};

export default ManualDataTable;