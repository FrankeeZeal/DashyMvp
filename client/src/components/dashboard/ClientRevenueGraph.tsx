import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { format, addDays, subDays, subMonths, startOfQuarter, endOfQuarter } from "date-fns";

// Types
interface Client {
  id: number;
  name: string;
  revenue: number;
  emailRevenue: number;
  smsRevenue: number;
  flowsRevenue: number;
}

interface ClientRevenueGraphProps {
  clients?: Client[];
  isLoading?: boolean;
}

// Custom dot with glow effect
const CustomizedDot = (props: any) => {
  const { cx, cy, stroke, dataKey } = props;
  
  return (
    <g>
      <circle cx={cx} cy={cy} r={4} fill={stroke} />
      <circle 
        cx={cx} 
        cy={cy} 
        r={8} 
        fill="none" 
        stroke={stroke} 
        strokeWidth={1}
        strokeOpacity={0.4} 
      />
      <circle 
        cx={cx} 
        cy={cy} 
        r={12} 
        fill="none" 
        stroke={stroke} 
        strokeWidth={1} 
        strokeOpacity={0.2} 
      />
    </g>
  );
};

// Custom formatter for Y-axis ticks to show currency
const formatYAxis = (value: number) => {
  return `$${value}k`;
};

// Custom formatter for tooltip values
const formatTooltipValue = (value: number) => {
  return [`$${value.toFixed(1)}k`, 'Revenue'];
};

export const ClientRevenueGraph = ({ clients = [], isLoading = false }: ClientRevenueGraphProps) => {
  // State for filters
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("30days");
  
  // Generate dates for the x-axis based on selected time period
  const dates = useMemo(() => {
    const today = new Date();
    let dateRange: Date[] = [];
    
    switch (timeFilter) {
      case "yesterday":
        // Just show yesterday and today
        dateRange = [subDays(today, 1), today];
        break;
        
      case "30days":
        // Show 5 points over 30 days
        dateRange = [
          subDays(today, 30),
          subDays(today, 22),
          subDays(today, 15),
          subDays(today, 7),
          today
        ];
        break;
        
      case "60days":
        // Show 6 points over 60 days
        dateRange = [
          subDays(today, 60),
          subDays(today, 48),
          subDays(today, 36),
          subDays(today, 24),
          subDays(today, 12),
          today
        ];
        break;
        
      case "quarter":
        // Show the current quarter with monthly points
        const quarterStart = startOfQuarter(today);
        const quarterEnd = endOfQuarter(today);
        
        // Calculate number of months in the quarter
        const monthsInQuarter = Math.round((quarterEnd.getTime() - quarterStart.getTime()) / (30 * 24 * 60 * 60 * 1000));
        
        dateRange = Array.from({ length: monthsInQuarter + 1 }, (_, i) => {
          return addDays(quarterStart, i * 30);
        });
        break;
        
      case "custom":
        // Custom range (last 45 days with weekly points)
        dateRange = [
          subDays(today, 45),
          subDays(today, 36),
          subDays(today, 27),
          subDays(today, 18),
          subDays(today, 9),
          today
        ];
        break;
    }
    
    return dateRange;
  }, [timeFilter]);
  
  // Mock data if no clients provided
  const mockClients: Client[] = [
    { id: 1, name: "Sista Teas", revenue: 12.5, emailRevenue: 7.2, smsRevenue: 5.3, flowsRevenue: 8.1 },
    { id: 2, name: "Earthly Goods", revenue: 8.9, emailRevenue: 5.1, smsRevenue: 3.8, flowsRevenue: 6.2 },
    { id: 3, name: "Green Valley", revenue: 15.3, emailRevenue: 9.8, smsRevenue: 5.5, flowsRevenue: 11.2 },
    { id: 4, name: "FitLife Supplements", revenue: 6.7, emailRevenue: 3.2, smsRevenue: 3.5, flowsRevenue: 4.5 },
  ];
  
  // Use provided clients or mock data
  const clientData = clients.length > 0 ? clients : mockClients;
  
  // Process data based on filters - now with dates on x-axis
  const getFilteredData = useMemo(() => {
    // Create a data point for each date in our range
    return dates.map(date => {
      const formattedDate = format(date, "MMM d");
      
      // Calculate progress factor (0 to 1) to simulate growth over time
      // Earlier dates will have lower values
      const totalDaysInRange = (dates[dates.length - 1].getTime() - dates[0].getTime()) / (24 * 60 * 60 * 1000);
      const daysFromStart = (date.getTime() - dates[0].getTime()) / (24 * 60 * 60 * 1000);
      const progressFactor = totalDaysInRange > 0 ? daysFromStart / totalDaysInRange : 0;
      
      // Create revenue data for each client at this date point
      const dataPoint: Record<string, any> = { date: formattedDate };
      
      clientData.forEach(client => {
        let baseRevenue = 0;
        
        // Apply channel filter
        if (channelFilter === "email") {
          baseRevenue = client.emailRevenue;
        } else if (channelFilter === "sms") {
          baseRevenue = client.smsRevenue;
        } else if (channelFilter === "flows") {
          baseRevenue = client.flowsRevenue;
        } else {
          baseRevenue = client.revenue;
        }
        
        // Apply time-based growth factor (more recent dates have higher revenue)
        // Also add some randomness for more realistic data
        const randomFactor = 0.8 + Math.random() * 0.4; // Random value between 0.8 and 1.2
        const timeBasedRevenue = baseRevenue * (0.7 + (progressFactor * 0.6)) * randomFactor;
        
        // Store client's revenue for this date point
        dataPoint[`client${client.id}`] = parseFloat(timeBasedRevenue.toFixed(1));
        
        // Store client name for reference
        dataPoint[`clientName${client.id}`] = client.name;
      });
      
      return dataPoint;
    });
  }, [dates, clientData, channelFilter, timeFilter]);
  
  // Color scheme for client data points
  const clientColors = [
    "#3b82f6", // blue-500
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
    "#f97316", // orange-500
    "#10b981", // emerald-500
    "#06b6d4", // cyan-500
  ];
  
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between px-6 pb-0">
        <CardTitle className="text-lg font-semibold text-white">Client Revenue Analytics</CardTitle>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          {/* Channel Filter */}
          <ToggleGroup 
            type="single" 
            value={channelFilter}
            onValueChange={(value) => value && setChannelFilter(value)}
            className="bg-gray-800 border border-gray-700 p-1 rounded-lg"
          >
            <ToggleGroupItem 
              value="all" 
              className={cn(
                "text-xs h-7 px-2 rounded data-[state=on]:bg-blue-900/50 data-[state=on]:text-blue-200",
                channelFilter === "all" ? "bg-blue-900/50 text-blue-200" : "text-gray-400"
              )}
            >
              All
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="email" 
              className={cn(
                "text-xs h-7 px-2 rounded data-[state=on]:bg-blue-900/50 data-[state=on]:text-blue-200",
                channelFilter === "email" ? "bg-blue-900/50 text-blue-200" : "text-gray-400"
              )}
            >
              Email
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="sms" 
              className={cn(
                "text-xs h-7 px-2 rounded data-[state=on]:bg-blue-900/50 data-[state=on]:text-blue-200",
                channelFilter === "sms" ? "bg-blue-900/50 text-blue-200" : "text-gray-400"
              )}
            >
              SMS
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="flows" 
              className={cn(
                "text-xs h-7 px-2 rounded data-[state=on]:bg-blue-900/50 data-[state=on]:text-blue-200",
                channelFilter === "flows" ? "bg-blue-900/50 text-blue-200" : "text-gray-400"
              )}
            >
              Flows
            </ToggleGroupItem>
          </ToggleGroup>
          
          {/* Time Filter */}
          <ToggleGroup 
            type="single" 
            value={timeFilter}
            onValueChange={(value) => value && setTimeFilter(value)}
            className="bg-gray-800 border border-gray-700 p-1 rounded-lg"
          >
            <ToggleGroupItem 
              value="yesterday" 
              className={cn(
                "text-xs h-7 px-2 rounded data-[state=on]:bg-blue-900/50 data-[state=on]:text-blue-200",
                timeFilter === "yesterday" ? "bg-blue-900/50 text-blue-200" : "text-gray-400"
              )}
            >
              Yesterday
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="30days" 
              className={cn(
                "text-xs h-7 px-2 rounded data-[state=on]:bg-blue-900/50 data-[state=on]:text-blue-200",
                timeFilter === "30days" ? "bg-blue-900/50 text-blue-200" : "text-gray-400"
              )}
            >
              30 Days
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="60days" 
              className={cn(
                "text-xs h-7 px-2 rounded data-[state=on]:bg-blue-900/50 data-[state=on]:text-blue-200",
                timeFilter === "60days" ? "bg-blue-900/50 text-blue-200" : "text-gray-400"
              )}
            >
              60 Days
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="quarter" 
              className={cn(
                "text-xs h-7 px-2 rounded data-[state=on]:bg-blue-900/50 data-[state=on]:text-blue-200",
                timeFilter === "quarter" ? "bg-blue-900/50 text-blue-200" : "text-gray-400"
              )}
            >
              Quarter
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="custom" 
              className={cn(
                "text-xs h-7 px-2 rounded data-[state=on]:bg-blue-900/50 data-[state=on]:text-blue-200",
                timeFilter === "custom" ? "bg-blue-900/50 text-blue-200" : "text-gray-400"
              )}
            >
              Custom
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={getFilteredData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  {clientData.map((client, index) => (
                    <filter key={`glow-${client.id}`} id={`glow-${client.id}`} x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  ))}
                  
                  {clientData.map((client, index) => (
                    <linearGradient key={`gradient-${client.id}`} id={`gradient-${client.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={clientColors[index % clientColors.length]} stopOpacity={0.8} />
                      <stop offset="100%" stopColor={clientColors[index % clientColors.length]} stopOpacity={0.2} />
                    </linearGradient>
                  ))}
                </defs>
                
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#9ca3af' }} 
                  axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                />
                <YAxis 
                  tick={{ fill: '#9ca3af' }} 
                  axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                  tickFormatter={formatYAxis}
                  label={{ 
                    value: 'Revenue (in $1,000s)', 
                    angle: -90, 
                    position: 'insideLeft',
                    fill: '#9ca3af',
                    style: { textAnchor: 'middle' }
                  }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(17, 24, 39, 0.8)',
                    borderColor: 'rgba(59, 130, 246, 0.5)',
                    color: '#e5e7eb',
                    borderRadius: '0.375rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  }}
                  labelStyle={{ color: '#e5e7eb', fontWeight: 'bold', marginBottom: '0.5rem' }}
                  itemStyle={{ color: '#e5e7eb' }}
                  formatter={formatTooltipValue}
                />
                <Legend 
                  formatter={(value, entry) => {
                    // Extract client name from the value
                    const clientId = value.replace('client', '');
                    const clientName = clientData.find(c => c.id.toString() === clientId)?.name;
                    return <span style={{ color: '#9ca3af' }}>{clientName || value}</span>;
                  }}
                />
                
                {/* Generate a line for each client */}
                {clientData.map((client, index) => (
                  <Line
                    key={client.id}
                    type="monotone"
                    dataKey={`client${client.id}`}
                    name={`client${client.id}`}
                    stroke={clientColors[index % clientColors.length]}
                    strokeWidth={2}
                    dot={<CustomizedDot />}
                    activeDot={{ 
                      r: 8, 
                      fill: clientColors[index % clientColors.length],
                      filter: `url(#glow-${client.id})` 
                    }}
                    isAnimationActive={true}
                    animationDuration={1000}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientRevenueGraph;