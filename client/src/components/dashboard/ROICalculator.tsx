import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Campaign } from "@shared/schema";
import { RiCalculatorLine, RiMailLine, RiMessage2Line, RiCalendarLine } from "react-icons/ri";

interface ROICalculatorProps {
  campaigns?: Campaign[];
  selectedClientId?: number;
}

export const ROICalculator = ({ campaigns = [], selectedClientId }: ROICalculatorProps) => {
  const [campaignType, setCampaignType] = useState<string>("email");
  const [calculationMethod, setCalculationMethod] = useState<string>("revenue");
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);
  
  // Campaign cost breakdown
  const [costs, setCosts] = useState({
    design: 0,
    copywriting: 0,
    platformFees: 0,
    agencyFees: 0,
    other: 0
  });

  // Revenue tracking
  const [revenue, setRevenue] = useState(0);
  
  // Performance metrics
  const [metrics, setMetrics] = useState({
    recipients: 0,
    opens: 0,
    clicks: 0,
    conversions: 0,
    conversionValue: 0
  });

  // Calculated ROI
  const [roi, setRoi] = useState({
    value: 0,
    percentage: 0,
    breakEven: 0,
    projectedAnnual: 0
  });

  // Filter campaigns based on selected client and type
  const filteredCampaigns = campaigns.filter(campaign => 
    (!selectedClientId || (campaign as any).clientId === selectedClientId) &&
    (campaign.type === campaignType)
  );

  // Calculate total costs
  const totalCosts = Object.values(costs).reduce((sum, cost) => sum + (isNaN(cost) ? 0 : Number(cost)), 0);

  // Calculate ROI
  useEffect(() => {
    if (totalCosts === 0) {
      setRoi({
        value: 0,
        percentage: 0,
        breakEven: 0,
        projectedAnnual: 0
      });
      return;
    }

    // Calculate ROI
    const roiValue = revenue - totalCosts;
    const roiPercentage = (roiValue / totalCosts) * 100;
    
    // Calculate break-even point
    const breakEven = totalCosts / (revenue / metrics.recipients);
    
    // Calculate projected annual ROI (assuming monthly campaigns)
    const projectedAnnual = roiValue * 12;

    setRoi({
      value: roiValue,
      percentage: roiPercentage,
      breakEven: Math.round(breakEven),
      projectedAnnual: projectedAnnual
    });
  }, [totalCosts, revenue, metrics.recipients]);

  // Update costs handler
  const handleCostChange = (key: keyof typeof costs, value: string) => {
    setCosts(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
  };

  // Load campaign data when a campaign is selected
  const handleCampaignSelect = (campaignId: string) => {
    const id = parseInt(campaignId);
    setSelectedCampaignId(id);
    
    // Find the selected campaign
    const campaign = campaigns.find(c => c.id === id);
    
    if (campaign) {
      // In a real application, we would load the actual campaign data
      // For the demo, we'll use some realistic mock data
      setCampaignType(campaign.type);
      
      // Set mock metrics based on campaign data
      const mockRevenue = Math.floor(Math.random() * 10000) + 5000;
      setRevenue(mockRevenue);
      
      const recipients = Math.floor(Math.random() * 5000) + 1000;
      const opens = Math.floor(recipients * (Math.random() * 0.3 + 0.4)); // 40-70% open rate
      const clicks = Math.floor(opens * (Math.random() * 0.2 + 0.1)); // 10-30% click rate
      const conversions = Math.floor(clicks * (Math.random() * 0.15 + 0.05)); // 5-20% conversion rate
      
      setMetrics({
        recipients,
        opens,
        clicks,
        conversions,
        conversionValue: mockRevenue / conversions
      });
      
      // Set mock costs
      setCosts({
        design: Math.floor(Math.random() * 300) + 200,
        copywriting: Math.floor(Math.random() * 200) + 150,
        platformFees: Math.floor(Math.random() * 150) + 100,
        agencyFees: Math.floor(Math.random() * 500) + 500,
        other: Math.floor(Math.random() * 100)
      });
    }
  };

  return (
    <Card className="bg-gray-800 shadow-xl shadow-blue-500/20 border border-gray-700">
      <CardHeader className="pb-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">ROI Calculator</CardTitle>
            <CardDescription className="text-gray-400">Track campaign performance and calculate ROI</CardDescription>
          </div>
          <RiCalculatorLine className="h-6 w-6 text-blue-400" />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-700">
            <TabsTrigger 
              value="calculator"
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-300"
            >
              Calculator
            </TabsTrigger>
            <TabsTrigger 
              value="report"
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-300"
            >
              Report
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator" className="pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Campaign Type</Label>
                <Select value={campaignType} onValueChange={setCampaignType}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select campaign type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="email" className="text-white">Email Campaign</SelectItem>
                    <SelectItem value="sms" className="text-white">SMS Campaign</SelectItem>
                    <SelectItem value="social" className="text-white">Social Media</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-300">Select Campaign</Label>
                <Select onValueChange={handleCampaignSelect} value={selectedCampaignId?.toString() || ""}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select a campaign" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {filteredCampaigns.length > 0 ? (
                      filteredCampaigns.map((campaign) => (
                        <SelectItem
                          key={campaign.id}
                          value={campaign.id.toString()}
                          className="text-white"
                        >
                          {campaign.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled className="text-gray-400">
                        No campaigns available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                <h3 className="text-lg font-medium text-white mb-3">Campaign Costs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Design Cost ($)</Label>
                    <Input
                      type="number"
                      value={costs.design}
                      onChange={(e) => handleCostChange('design', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Copywriting ($)</Label>
                    <Input
                      type="number"
                      value={costs.copywriting}
                      onChange={(e) => handleCostChange('copywriting', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Platform Fees ($)</Label>
                    <Input
                      type="number"
                      value={costs.platformFees}
                      onChange={(e) => handleCostChange('platformFees', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Agency Fees ($)</Label>
                    <Input
                      type="number"
                      value={costs.agencyFees}
                      onChange={(e) => handleCostChange('agencyFees', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Other Costs ($)</Label>
                    <Input
                      type="number"
                      value={costs.other}
                      onChange={(e) => handleCostChange('other', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                <h3 className="text-lg font-medium text-white mb-3">Revenue Tracking</h3>
                <div className="space-y-2">
                  <Label className="text-gray-300">Total Revenue ($)</Label>
                  <Input
                    type="number"
                    value={revenue}
                    onChange={(e) => setRevenue(parseFloat(e.target.value) || 0)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
              
              <Button
                className="mt-4 w-full border-blue-700 bg-blue-900 text-blue-100 hover:bg-blue-800 shadow-md shadow-blue-500/20"
              >
                Calculate ROI
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="report" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600 shadow-inner shadow-blue-500/10">
                <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                  <RiCalculatorLine className="mr-2 text-blue-400" />
                  ROI Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Costs:</span>
                    <span className="text-white font-medium">${totalCosts.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Revenue:</span>
                    <span className="text-white font-medium">${revenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Net ROI:</span>
                    <span className={`font-medium ${roi.value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${roi.value.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">ROI Percentage:</span>
                    <span className={`font-medium ${roi.percentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {roi.percentage.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600 shadow-inner shadow-blue-500/10">
                <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                  <RiCalendarLine className="mr-2 text-blue-400" />
                  Projections
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Break-even Point:</span>
                    <span className="text-white font-medium">{roi.breakEven} recipients</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Monthly ROI:</span>
                    <span className={`font-medium ${roi.value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${roi.value.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Projected Annual:</span>
                    <span className={`font-medium ${roi.projectedAnnual >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${roi.projectedAnnual.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 bg-gray-700 p-4 rounded-lg border border-gray-600 shadow-inner shadow-blue-500/10">
              <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                {campaignType === 'email' ? (
                  <RiMailLine className="mr-2 text-blue-400" />
                ) : (
                  <RiMessage2Line className="mr-2 text-blue-400" />
                )}
                Campaign Performance
              </h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">Recipients: {metrics.recipients}</span>
                    <span className="text-sm text-gray-300">100%</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">Opens: {metrics.opens}</span>
                    <span className="text-sm text-gray-300">
                      {metrics.recipients ? ((metrics.opens / metrics.recipients) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{ 
                      width: metrics.recipients ? `${(metrics.opens / metrics.recipients) * 100}%` : '0%'
                    }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">Clicks: {metrics.clicks}</span>
                    <span className="text-sm text-gray-300">
                      {metrics.recipients ? ((metrics.clicks / metrics.recipients) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div className="bg-blue-300 h-2 rounded-full" style={{ 
                      width: metrics.recipients ? `${(metrics.clicks / metrics.recipients) * 100}%` : '0%'
                    }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">Conversions: {metrics.conversions}</span>
                    <span className="text-sm text-gray-300">
                      {metrics.recipients ? ((metrics.conversions / metrics.recipients) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full shadow-sm shadow-green-400/50" style={{ 
                      width: metrics.recipients ? `${(metrics.conversions / metrics.recipients) * 100}%` : '0%'
                    }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-600">
                <div className="flex justify-between">
                  <span className="text-gray-300">Average Conversion Value:</span>
                  <span className="text-white font-medium">
                    ${metrics.conversionValue ? metrics.conversionValue.toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-300">Cost per Conversion:</span>
                  <span className="text-white font-medium">
                    ${metrics.conversions ? (totalCosts / metrics.conversions).toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>
            </div>
            
            <Button
              className="mt-4 w-full border-blue-700 bg-blue-900 text-blue-100 hover:bg-blue-800 shadow-md shadow-blue-500/20"
            >
              Export Report
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ROICalculator;