import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Campaign } from "@shared/schema";
import { 
  RiFileChartLine, 
  RiMailLine, 
  RiMessage2Line, 
  RiArrowUpLine, 
  RiArrowDownLine, 
  RiExternalLinkLine,
  RiCalendarLine,
  RiTeamLine,
  RiMoneyDollarCircleLine
} from "react-icons/ri";

interface CampaignReportProps {
  campaigns?: Campaign[];
}

export const CampaignReport = ({ campaigns = [] }: CampaignReportProps) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("thisMonth");
  const [selectedCampaignType, setSelectedCampaignType] = useState<string>("all");
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);

  // Filter campaigns based on type
  const filteredCampaigns = campaigns.filter(campaign => 
    selectedCampaignType === "all" || campaign.type === selectedCampaignType
  );

  // Generate performance metrics
  const generateMetrics = (campaignId: number) => {
    // In a real app, we would fetch these from an API
    // For the demo, we'll generate some realistic mock data
    const baseSent = Math.floor(Math.random() * 5000) + 1000;
    const baseOpen = baseSent * (Math.random() * 0.3 + 0.4); // 40-70% open rate
    const baseClick = baseOpen * (Math.random() * 0.2 + 0.15); // 15-35% click rate
    const baseConversion = baseClick * (Math.random() * 0.15 + 0.05); // 5-20% conversion rate
    const baseRevenue = baseConversion * (Math.random() * 50 + 50); // $50-$100 per conversion
    
    // Calculate % change from previous period
    const openRatePrevious = Math.random() * 0.3 + 0.3; // 30-60% previous open rate
    const openRateChange = ((baseOpen / baseSent) - openRatePrevious) / openRatePrevious * 100;
    
    const clickRatePrevious = Math.random() * 0.15 + 0.1; // 10-25% previous click rate
    const clickRateChange = ((baseClick / baseOpen) - clickRatePrevious) / clickRatePrevious * 100;
    
    const conversionRatePrevious = Math.random() * 0.1 + 0.05; // 5-15% previous conversion rate
    const conversionRateChange = ((baseConversion / baseClick) - conversionRatePrevious) / conversionRatePrevious * 100;
    
    return {
      sent: Math.round(baseSent),
      opens: Math.round(baseOpen),
      clicks: Math.round(baseClick),
      conversions: Math.round(baseConversion),
      revenue: Math.round(baseRevenue),
      openRate: (baseOpen / baseSent) * 100,
      clickRate: (baseClick / baseOpen) * 100,
      conversionRate: (baseConversion / baseClick) * 100,
      openRateChange: openRateChange,
      clickRateChange: clickRateChange,
      conversionRateChange: conversionRateChange,
      revenueChange: Math.random() > 0.7 ? -1 * (Math.random() * 10 + 5) : (Math.random() * 15 + 5) // -15% to +20%
    };
  };

  // Cost data
  const generateCostData = () => {
    return {
      design: Math.floor(Math.random() * 300) + 200,
      copywriting: Math.floor(Math.random() * 200) + 150,
      platformFees: Math.floor(Math.random() * 150) + 100,
      agencyFees: Math.floor(Math.random() * 500) + 500,
      other: Math.floor(Math.random() * 100),
      total: 0
    };
  };

  const costs = generateCostData();
  costs.total = Object.values(costs).reduce((sum, cost) => 
    typeof cost === 'number' && !isNaN(cost) ? sum + cost : sum, 0
  );

  // Generate metrics for selected campaign or use default
  const metrics = selectedCampaignId 
    ? generateMetrics(selectedCampaignId) 
    : {
        sent: 0,
        opens: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0,
        openRate: 0,
        clickRate: 0,
        conversionRate: 0,
        openRateChange: 0,
        clickRateChange: 0,
        conversionRateChange: 0,
        revenueChange: 0
      };

  // Render change indicator
  const renderChangeIndicator = (value: number) => {
    if (value > 0) {
      return (
        <span className="inline-flex items-center text-green-400">
          <RiArrowUpLine className="mr-1" />
          {value.toFixed(1)}%
        </span>
      );
    } else if (value < 0) {
      return (
        <span className="inline-flex items-center text-red-400">
          <RiArrowDownLine className="mr-1" />
          {Math.abs(value).toFixed(1)}%
        </span>
      );
    }
    return <span className="text-gray-400">0%</span>;
  };

  // Calculate ROI
  const roi = metrics.revenue - costs.total;
  const roiPercentage = costs.total > 0 ? (roi / costs.total) * 100 : 0;
  
  return (
    <Card className="bg-gray-800 shadow-xl shadow-blue-500/20 border border-gray-700">
      <CardHeader className="pb-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Campaign Performance Report</CardTitle>
            <CardDescription className="text-gray-400">Track, analyze and report on campaign performance</CardDescription>
          </div>
          <RiFileChartLine className="h-6 w-6 text-blue-400" />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <Label className="text-gray-300">Timeframe</Label>
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="today" className="text-white">Today</SelectItem>
                <SelectItem value="thisWeek" className="text-white">This Week</SelectItem>
                <SelectItem value="thisMonth" className="text-white">This Month</SelectItem>
                <SelectItem value="lastMonth" className="text-white">Last Month</SelectItem>
                <SelectItem value="lastQuarter" className="text-white">Last Quarter</SelectItem>
                <SelectItem value="thisYear" className="text-white">This Year</SelectItem>
                <SelectItem value="custom" className="text-white">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-300">Campaign Type</Label>
            <Select value={selectedCampaignType} onValueChange={setSelectedCampaignType}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select campaign type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all" className="text-white">All Campaigns</SelectItem>
                <SelectItem value="email" className="text-white">Email Campaigns</SelectItem>
                <SelectItem value="sms" className="text-white">SMS Campaigns</SelectItem>
                <SelectItem value="social" className="text-white">Social Media</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mb-6">
          <Label className="text-gray-300 mb-2 block">Select Campaign</Label>
          <Select onValueChange={(value) => setSelectedCampaignId(parseInt(value))} value={selectedCampaignId?.toString() || ""}>
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
        
        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-700">
            <TabsTrigger
              value="metrics"
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-300"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger
              value="roi"
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-300"
            >
              ROI Analysis
            </TabsTrigger>
            <TabsTrigger
              value="comparison"
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-300"
            >
              Benchmarks
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="metrics" className="pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-700 p-3 rounded-lg border border-gray-600 shadow-inner shadow-blue-500/10">
                <div className="text-gray-400 text-sm mb-1">Emails Sent</div>
                <div className="text-lg font-semibold text-white">{metrics.sent.toLocaleString()}</div>
              </div>
              
              <div className="bg-gray-700 p-3 rounded-lg border border-gray-600 shadow-inner shadow-blue-500/10">
                <div className="text-gray-400 text-sm mb-1">Opens</div>
                <div className="flex items-end">
                  <div className="text-lg font-semibold text-white">{metrics.opens.toLocaleString()}</div>
                  <div className="text-xs ml-2 mb-0.5">({metrics.openRate.toFixed(1)}%)</div>
                </div>
                <div className="text-xs">{renderChangeIndicator(metrics.openRateChange)}</div>
              </div>
              
              <div className="bg-gray-700 p-3 rounded-lg border border-gray-600 shadow-inner shadow-blue-500/10">
                <div className="text-gray-400 text-sm mb-1">Clicks</div>
                <div className="flex items-end">
                  <div className="text-lg font-semibold text-white">{metrics.clicks.toLocaleString()}</div>
                  <div className="text-xs ml-2 mb-0.5">({metrics.clickRate.toFixed(1)}%)</div>
                </div>
                <div className="text-xs">{renderChangeIndicator(metrics.clickRateChange)}</div>
              </div>
              
              <div className="bg-gray-700 p-3 rounded-lg border border-gray-600 shadow-inner shadow-blue-500/10">
                <div className="text-gray-400 text-sm mb-1">Conversions</div>
                <div className="flex items-end">
                  <div className="text-lg font-semibold text-white">{metrics.conversions.toLocaleString()}</div>
                  <div className="text-xs ml-2 mb-0.5">({metrics.conversionRate.toFixed(1)}%)</div>
                </div>
                <div className="text-xs">{renderChangeIndicator(metrics.conversionRateChange)}</div>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-300">Open Rate ({metrics.openRate.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full shadow-sm shadow-blue-500/50" style={{ 
                    width: `${Math.min(metrics.openRate, 100)}%` 
                  }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-300">Click-to-Open Rate ({metrics.clickRate.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2.5">
                  <div className="bg-blue-400 h-2.5 rounded-full shadow-sm shadow-blue-400/50" style={{ 
                    width: `${Math.min(metrics.clickRate, 100)}%` 
                  }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-300">Conversion Rate ({metrics.conversionRate.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full shadow-sm shadow-green-500/50" style={{ 
                    width: `${Math.min(metrics.conversionRate, 100)}%` 
                  }}></div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600 shadow-inner shadow-blue-500/10">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Performance by Device</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-400">Mobile</span>
                      <span className="text-xs text-gray-400">68%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-400">Desktop</span>
                      <span className="text-xs text-gray-400">24%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '24%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-400">Tablet</span>
                      <span className="text-xs text-gray-400">8%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '8%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600 shadow-inner shadow-blue-500/10">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Performance by Time</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-400">Morning (6am-12pm)</span>
                      <span className="text-xs text-gray-400">42%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-400">Afternoon (12pm-5pm)</span>
                      <span className="text-xs text-gray-400">35%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-400">Evening (5pm-11pm)</span>
                      <span className="text-xs text-gray-400">23%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '23%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="roi" className="pt-4">
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600 shadow-inner shadow-blue-500/10">
                <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                  <RiMoneyDollarCircleLine className="mr-2 text-blue-400" />
                  ROI Summary
                </h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Revenue</h4>
                    <div className="text-3xl font-bold text-white mb-1">${metrics.revenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-400 flex items-center">
                      vs previous period {renderChangeIndicator(metrics.revenueChange)}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-3">ROI</h4>
                    <div className={`text-3xl font-bold mb-1 ${roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {roiPercentage.toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-400">
                      ${roi.toLocaleString()} net return
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 border-t border-gray-600 pt-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Cost Breakdown</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-400">Design</span>
                        <span className="text-sm text-white">${costs.design}</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-1.5">
                        <div className="bg-blue-400 h-1.5 rounded-full" style={{ 
                          width: `${(costs.design / costs.total) * 100}%` 
                        }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-400">Copywriting</span>
                        <span className="text-sm text-white">${costs.copywriting}</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-1.5">
                        <div className="bg-blue-400 h-1.5 rounded-full" style={{ 
                          width: `${(costs.copywriting / costs.total) * 100}%` 
                        }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-400">Platform Fees</span>
                        <span className="text-sm text-white">${costs.platformFees}</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-1.5">
                        <div className="bg-blue-400 h-1.5 rounded-full" style={{ 
                          width: `${(costs.platformFees / costs.total) * 100}%` 
                        }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-400">Agency Fees</span>
                        <span className="text-sm text-white">${costs.agencyFees}</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-1.5">
                        <div className="bg-blue-400 h-1.5 rounded-full" style={{ 
                          width: `${(costs.agencyFees / costs.total) * 100}%` 
                        }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-400">Other</span>
                        <span className="text-sm text-white">${costs.other}</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-1.5">
                        <div className="bg-blue-400 h-1.5 rounded-full" style={{ 
                          width: `${(costs.other / costs.total) * 100}%` 
                        }}></div>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-600">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-300">Total Costs</span>
                        <span className="text-sm font-medium text-white">${costs.total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600 shadow-inner shadow-blue-500/10">
                <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                  <RiCalendarLine className="mr-2 text-blue-400" />
                  Key Performance Indicators
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-300">Cost per Recipient</div>
                    <div className="font-medium text-white">${(costs.total / metrics.sent).toFixed(2)}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-gray-300">Cost per Open</div>
                    <div className="font-medium text-white">${(costs.total / metrics.opens).toFixed(2)}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-gray-300">Cost per Click</div>
                    <div className="font-medium text-white">${(costs.total / metrics.clicks).toFixed(2)}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-gray-300">Cost per Conversion</div>
                    <div className="font-medium text-white">${(costs.total / metrics.conversions).toFixed(2)}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-gray-300">Revenue per Recipient</div>
                    <div className="font-medium text-white">${(metrics.revenue / metrics.sent).toFixed(2)}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-gray-300">Revenue per Conversion</div>
                    <div className="font-medium text-white">${(metrics.revenue / metrics.conversions).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="comparison" className="pt-4">
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600 shadow-inner shadow-blue-500/10 mb-6">
              <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                <RiTeamLine className="mr-2 text-blue-400" />
                Industry Benchmarks
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">Open Rate</span>
                    <div className="flex space-x-4">
                      <span className="text-sm text-white">Your: {metrics.openRate.toFixed(1)}%</span>
                      <span className="text-sm text-gray-400">Industry: 21.5%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(metrics.openRate, 100)}%` }}></div>
                    <div className="relative">
                      <div 
                        className="absolute top-0 w-0.5 h-3 bg-white" 
                        style={{ left: '21.5%', marginTop: '-3px' }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">Click Rate</span>
                    <div className="flex space-x-4">
                      <span className="text-sm text-white">Your: {metrics.clickRate.toFixed(1)}%</span>
                      <span className="text-sm text-gray-400">Industry: 7.8%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(metrics.clickRate, 100)}%` }}></div>
                    <div className="relative">
                      <div 
                        className="absolute top-0 w-0.5 h-3 bg-white" 
                        style={{ left: '7.8%', marginTop: '-3px' }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">Conversion Rate</span>
                    <div className="flex space-x-4">
                      <span className="text-sm text-white">Your: {metrics.conversionRate.toFixed(1)}%</span>
                      <span className="text-sm text-gray-400">Industry: 2.3%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(metrics.conversionRate, 100)}%` }}></div>
                    <div className="relative">
                      <div 
                        className="absolute top-0 w-0.5 h-3 bg-white" 
                        style={{ left: '2.3%', marginTop: '-3px' }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">ROI</span>
                    <div className="flex space-x-4">
                      <span className="text-sm text-white">Your: {roiPercentage.toFixed(1)}%</span>
                      <span className="text-sm text-gray-400">Industry: 122%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(roiPercentage, 300) / 3}%` }}></div>
                    <div className="relative">
                      <div 
                        className="absolute top-0 w-0.5 h-3 bg-white" 
                        style={{ left: '40.67%', marginTop: '-3px' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600 shadow-inner shadow-blue-500/10">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Campaign Comparisons</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white">This Campaign</span>
                    <Badge variant="outline" className="bg-blue-900 text-blue-300 border-blue-700">
                      {metrics.conversions} conversions
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Previous Campaign</span>
                    <Badge variant="outline" className="bg-gray-900 text-gray-300 border-gray-700">
                      {Math.round(metrics.conversions * 0.85)} conversions
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Average (Last 5)</span>
                    <Badge variant="outline" className="bg-gray-900 text-gray-300 border-gray-700">
                      {Math.round(metrics.conversions * 0.9)} conversions
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600 shadow-inner shadow-blue-500/10">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Recommendations</h3>
                
                <div className="space-y-3">
                  <div className="text-sm text-gray-300">
                    {metrics.openRate < 25 ? (
                      <div className="flex items-start">
                        <RiArrowUpLine className="text-blue-400 mt-0.5 mr-1 flex-shrink-0" />
                        <span>Improve subject lines to increase open rates</span>
                      </div>
                    ) : (
                      <div className="flex items-start">
                        <RiExternalLinkLine className="text-green-400 mt-0.5 mr-1 flex-shrink-0" />
                        <span>Good open rate, consider A/B testing to further improve</span>
                      </div>
                    )}
                  </div>
                  
                  {metrics.clickRate < 10 ? (
                    <div className="flex items-start text-sm text-gray-300">
                      <RiArrowUpLine className="text-blue-400 mt-0.5 mr-1 flex-shrink-0" />
                      <span>Improve call-to-action clarity to boost click rates</span>
                    </div>
                  ) : (
                    <div className="flex items-start text-sm text-gray-300">
                      <RiExternalLinkLine className="text-green-400 mt-0.5 mr-1 flex-shrink-0" />
                      <span>Strong click rate, focus on maintaining engagement</span>
                    </div>
                  )}
                  
                  {roiPercentage < 100 ? (
                    <div className="flex items-start text-sm text-gray-300">
                      <RiArrowUpLine className="text-blue-400 mt-0.5 mr-1 flex-shrink-0" />
                      <span>Consider reducing platform costs to improve ROI</span>
                    </div>
                  ) : (
                    <div className="flex items-start text-sm text-gray-300">
                      <RiExternalLinkLine className="text-green-400 mt-0.5 mr-1 flex-shrink-0" />
                      <span>Excellent ROI, consider scaling this campaign</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            Save Report
          </Button>
          <Button className="border-blue-700 bg-blue-900 text-blue-100 hover:bg-blue-800 shadow-md shadow-blue-500/20">
            Export PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignReport;