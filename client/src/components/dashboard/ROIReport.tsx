import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Campaign } from "@shared/schema";
import { 
  RiFileChartLine, 
  RiMailLine, 
  RiMessage2Line, 
  RiBarChartBoxLine, 
  RiPieChartLine,
  RiMoneyDollarCircleLine,
  RiPrinterLine,
  RiDownload2Line
} from "react-icons/ri";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";

interface ROIReportProps {
  campaigns?: Campaign[];
  selectedClientId?: number;
}

interface ROIData {
  campaignId: number;
  campaignName: string;
  campaignType: string;
  costs: {
    design: number;
    copywriting: number;
    platformFees: number;
    agencyFees: number;
    other: number;
    total: number;
  };
  revenue: number;
  roi: {
    value: number;
    percentage: number;
    breakEven: number;
    projectedAnnual: number;
  };
  metrics: {
    recipients: number;
    opens: number;
    clicks: number;
    conversions: number;
    conversionValue: number;
    openRate: number;
    clickRate: number;
    conversionRate: number;
  };
  date: Date;
}

export const ROIReport = ({ campaigns = [], selectedClientId }: ROIReportProps) => {
  const [timeframe, setTimeframe] = useState<string>("30days");
  const [campaignFilter, setCampaignFilter] = useState<string>("all");
  const [reportData, setReportData] = useState<ROIData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Generate mock data for demonstration purposes
  useEffect(() => {
    // In a real application, this would fetch data from an API
    setIsLoading(true);
    
    setTimeout(() => {
      const data: ROIData[] = campaigns.map(campaign => {
        // Generate realistic but mock ROI data based on the campaign
        const recipients = Math.floor(Math.random() * 5000) + 1000;
        const opens = Math.floor(recipients * (Math.random() * 0.3 + 0.4)); // 40-70% open rate
        const clicks = Math.floor(opens * (Math.random() * 0.2 + 0.1)); // 10-30% click rate
        const conversions = Math.floor(clicks * (Math.random() * 0.15 + 0.05)); // 5-20% conversion rate
        const revenue = Math.floor(Math.random() * 10000) + 5000;
        
        const costs = {
          design: Math.floor(Math.random() * 300) + 200,
          copywriting: Math.floor(Math.random() * 200) + 150,
          platformFees: Math.floor(Math.random() * 150) + 100,
          agencyFees: Math.floor(Math.random() * 500) + 500,
          other: Math.floor(Math.random() * 100),
          total: 0
        };
        
        costs.total = Object.values(costs).reduce((sum, cost) => sum + (typeof cost === 'number' ? cost : 0), 0) - costs.total;
        
        const roiValue = revenue - costs.total;
        const roiPercentage = (roiValue / costs.total) * 100;
        const breakEven = costs.total / (revenue / recipients);
        const projectedAnnual = roiValue * 12;
        
        return {
          campaignId: campaign.id,
          campaignName: campaign.name,
          campaignType: campaign.type,
          costs,
          revenue,
          roi: {
            value: roiValue,
            percentage: roiPercentage,
            breakEven: Math.round(breakEven),
            projectedAnnual
          },
          metrics: {
            recipients,
            opens,
            clicks,
            conversions,
            conversionValue: revenue / conversions,
            openRate: (opens / recipients) * 100,
            clickRate: (clicks / opens) * 100,
            conversionRate: (conversions / clicks) * 100
          },
          date: new Date()
        };
      });
      
      setReportData(data);
      setIsLoading(false);
    }, 1000);
  }, [campaigns]);
  
  // Filter the data based on the selected timeframe and campaign type
  const filteredData = reportData.filter(data => {
    const campaignMatch = campaignFilter === 'all' || data.campaignType === campaignFilter;
    
    // For timeframe, in a real app we would filter based on actual dates
    // Here we're just simulating the filter
    return campaignMatch;
  });
  
  // Prepare chart data
  const costBreakdownData = [
    { name: 'Design', value: filteredData.reduce((sum, data) => sum + data.costs.design, 0) },
    { name: 'Copywriting', value: filteredData.reduce((sum, data) => sum + data.costs.copywriting, 0) },
    { name: 'Platform Fees', value: filteredData.reduce((sum, data) => sum + data.costs.platformFees, 0) },
    { name: 'Agency Fees', value: filteredData.reduce((sum, data) => sum + data.costs.agencyFees, 0) },
    { name: 'Other', value: filteredData.reduce((sum, data) => sum + data.costs.other, 0) }
  ];
  
  const roiComparisonData = filteredData.map(data => ({
    name: data.campaignName,
    roi: data.roi.percentage.toFixed(2),
    revenue: data.revenue,
    cost: data.costs.total
  }));
  
  const conversionFunnelData = [
    { name: 'Recipients', value: filteredData.reduce((sum, data) => sum + data.metrics.recipients, 0) },
    { name: 'Opens', value: filteredData.reduce((sum, data) => sum + data.metrics.opens, 0) },
    { name: 'Clicks', value: filteredData.reduce((sum, data) => sum + data.metrics.clicks, 0) },
    { name: 'Conversions', value: filteredData.reduce((sum, data) => sum + data.metrics.conversions, 0) }
  ];
  
  // Colors for the charts
  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#10b981'];
  
  // Summary data
  const totalRevenue = filteredData.reduce((sum, data) => sum + data.revenue, 0);
  const totalCost = filteredData.reduce((sum, data) => sum + data.costs.total, 0);
  const totalROI = totalRevenue - totalCost;
  const totalROIPercentage = (totalROI / totalCost) * 100;
  
  // Format number as currency
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  return (
    <Card className="bg-gray-800 shadow-xl shadow-blue-500/20 border border-gray-700">
      <CardHeader className="pb-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">ROI Report</CardTitle>
            <CardDescription className="text-gray-400">Comprehensive ROI analysis and performance reporting</CardDescription>
          </div>
          <RiFileChartLine className="h-6 w-6 text-blue-400" />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between mb-6">
          <div className="flex space-x-2 mb-4 sm:mb-0">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-36 bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="7days" className="text-white">Last 7 days</SelectItem>
                <SelectItem value="30days" className="text-white">Last 30 days</SelectItem>
                <SelectItem value="90days" className="text-white">Last 90 days</SelectItem>
                <SelectItem value="year" className="text-white">This year</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={campaignFilter} onValueChange={setCampaignFilter}>
              <SelectTrigger className="w-36 bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Campaign Type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all" className="text-white">All Campaigns</SelectItem>
                <SelectItem value="email" className="text-white">Email Campaigns</SelectItem>
                <SelectItem value="sms" className="text-white">SMS Campaigns</SelectItem>
                <SelectItem value="social" className="text-white">Social Media</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <RiPrinterLine className="mr-1 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <RiDownload2Line className="mr-1 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-80">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-gray-700 border-gray-600 shadow-inner shadow-blue-500/10">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Total Revenue</p>
                      <h3 className="text-xl font-bold text-white">
                        <span className="bg-gradient-to-br from-blue-400 via-cyan-500 to-indigo-400 bg-clip-text text-transparent">
                          {formatCurrency(totalRevenue)}
                        </span>
                      </h3>
                    </div>
                    <RiMoneyDollarCircleLine className="h-8 w-8 text-blue-400 opacity-80" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-700 border-gray-600 shadow-inner shadow-blue-500/10">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Total Costs</p>
                      <h3 className="text-xl font-bold text-white">
                        <span className="bg-gradient-to-br from-purple-400 via-pink-500 to-purple-400 bg-clip-text text-transparent">
                          {formatCurrency(totalCost)}
                        </span>
                      </h3>
                    </div>
                    <RiBarChartBoxLine className="h-8 w-8 text-purple-400 opacity-80" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-700 border-gray-600 shadow-inner shadow-blue-500/10">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">ROI</p>
                      <h3 className="text-xl font-bold text-white">
                        <span className={totalROI >= 0 ? 
                          "bg-gradient-to-br from-green-400 via-emerald-500 to-green-400 bg-clip-text text-transparent" : 
                          "bg-gradient-to-br from-red-400 via-red-500 to-red-400 bg-clip-text text-transparent"
                        }>
                          {totalROIPercentage.toFixed(2)}%
                        </span>
                      </h3>
                    </div>
                    <RiPieChartLine className="h-8 w-8 text-green-400 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-700 mb-6">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-300"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="campaigns" 
                  className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-300"
                >
                  Campaigns
                </TabsTrigger>
                <TabsTrigger 
                  value="funnel" 
                  className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-300"
                >
                  Conversion Funnel
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-gray-700 border-gray-600 shadow-inner shadow-blue-500/10">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-md text-white">Cost Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={costBreakdownData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {costBreakdownData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value) => formatCurrency(Number(value))}
                              contentStyle={{ 
                                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                borderColor: 'rgba(59, 130, 246, 0.5)',
                                color: '#e5e7eb',
                                borderRadius: '0.375rem',
                              }}
                            />
                            <Legend 
                              formatter={(value, entry) => <span style={{ color: '#9ca3af' }}>{value}</span>}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-700 border-gray-600 shadow-inner shadow-blue-500/10">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-md text-white">ROI Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="space-y-4">
                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                          <div className="flex justify-between">
                            <span className="text-gray-300">Return on Investment:</span>
                            <span className={`font-medium ${totalROI >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {totalROIPercentage.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                          <div className="flex justify-between">
                            <span className="text-gray-300">Total Net Profit:</span>
                            <span className={`font-medium ${totalROI >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {formatCurrency(totalROI)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                          <div className="flex justify-between">
                            <span className="text-gray-300">Avg Cost per Conversion:</span>
                            <span className="font-medium text-white">
                              {formatCurrency(totalCost / filteredData.reduce((sum, data) => sum + data.metrics.conversions, 0))}
                            </span>
                          </div>
                        </div>
                        
                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                          <div className="flex justify-between">
                            <span className="text-gray-300">Projected Annual:</span>
                            <span className={`font-medium ${totalROI * 12 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {formatCurrency(totalROI * 12)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="campaigns">
                <Card className="bg-gray-700 border-gray-600 shadow-inner shadow-blue-500/10">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-md text-white">Campaign ROI Comparison</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={roiComparisonData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fill: '#9ca3af' }} 
                            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                            angle={-45}
                            textAnchor="end"
                            height={70}
                          />
                          <YAxis 
                            tick={{ fill: '#9ca3af' }} 
                            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                            label={{ 
                              value: 'ROI %', 
                              angle: -90, 
                              position: 'insideLeft',
                              fill: '#9ca3af',
                              style: { textAnchor: 'middle' }
                            }} 
                          />
                          <Tooltip 
                            formatter={(value) => [`${value}%`, 'ROI']}
                            contentStyle={{ 
                              backgroundColor: 'rgba(17, 24, 39, 0.8)',
                              borderColor: 'rgba(59, 130, 246, 0.5)',
                              color: '#e5e7eb',
                              borderRadius: '0.375rem',
                            }}
                          />
                          <Legend 
                            formatter={(value) => <span style={{ color: '#9ca3af' }}>{value}</span>}
                          />
                          <Bar dataKey="roi" fill="#3b82f6" name="ROI %" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-6">
                  <Card className="bg-gray-700 border-gray-600 shadow-inner shadow-blue-500/10">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-md text-white">Campaign Revenue vs. Costs</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={roiComparisonData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis 
                              dataKey="name" 
                              tick={{ fill: '#9ca3af' }} 
                              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                              angle={-45}
                              textAnchor="end"
                              height={70}
                            />
                            <YAxis 
                              tick={{ fill: '#9ca3af' }} 
                              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                              label={{ 
                                value: 'Amount ($)', 
                                angle: -90, 
                                position: 'insideLeft',
                                fill: '#9ca3af',
                                style: { textAnchor: 'middle' }
                              }} 
                            />
                            <Tooltip 
                              formatter={(value) => [formatCurrency(Number(value)), '']}
                              contentStyle={{ 
                                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                borderColor: 'rgba(59, 130, 246, 0.5)',
                                color: '#e5e7eb',
                                borderRadius: '0.375rem',
                              }}
                            />
                            <Legend 
                              formatter={(value) => <span style={{ color: '#9ca3af' }}>{value}</span>}
                            />
                            <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                            <Bar dataKey="cost" fill="#f97316" name="Cost" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="funnel">
                <Card className="bg-gray-700 border-gray-600 shadow-inner shadow-blue-500/10">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-md text-white">Conversion Funnel</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={conversionFunnelData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis 
                            type="number"
                            tick={{ fill: '#9ca3af' }} 
                            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                          />
                          <YAxis 
                            dataKey="name"
                            type="category"
                            tick={{ fill: '#9ca3af' }} 
                            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                          />
                          <Tooltip 
                            formatter={(value) => [`${Number(value).toLocaleString()}`, '']}
                            contentStyle={{ 
                              backgroundColor: 'rgba(17, 24, 39, 0.8)',
                              borderColor: 'rgba(59, 130, 246, 0.5)',
                              color: '#e5e7eb',
                              borderRadius: '0.375rem',
                            }}
                          />
                          <Bar 
                            dataKey="value" 
                            name="Count"
                            background={{ fill: 'rgba(255,255,255,0.05)' }}
                          >
                            {conversionFunnelData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                      <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                        <div className="flex flex-col items-center">
                          <span className="text-sm text-gray-400 mb-1">Open Rate</span>
                          <span className="text-lg font-medium text-white">
                            {(conversionFunnelData[1].value / conversionFunnelData[0].value * 100).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                        <div className="flex flex-col items-center">
                          <span className="text-sm text-gray-400 mb-1">Click Rate</span>
                          <span className="text-lg font-medium text-white">
                            {(conversionFunnelData[2].value / conversionFunnelData[1].value * 100).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                        <div className="flex flex-col items-center">
                          <span className="text-sm text-gray-400 mb-1">Conversion Rate</span>
                          <span className="text-lg font-medium text-white">
                            {(conversionFunnelData[3].value / conversionFunnelData[2].value * 100).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                        <div className="flex flex-col items-center">
                          <span className="text-sm text-gray-400 mb-1">Overall</span>
                          <span className="text-lg font-medium text-white">
                            {(conversionFunnelData[3].value / conversionFunnelData[0].value * 100).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ROIReport;