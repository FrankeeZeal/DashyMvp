import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

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

// Custom curve that adds a slight curve to the lines
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

export const ClientRevenueGraph = ({ clients = [], isLoading = false }: ClientRevenueGraphProps) => {
  // State for filters
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("30days");
  
  // Mock data if no clients provided
  const mockClients: Client[] = [
    { id: 1, name: "Sista Teas", revenue: 12.5, emailRevenue: 7.2, smsRevenue: 5.3, flowsRevenue: 8.1 },
    { id: 2, name: "Bark Box", revenue: 8.9, emailRevenue: 5.1, smsRevenue: 3.8, flowsRevenue: 6.2 },
    { id: 3, name: "Fuzzy Kittens", revenue: 15.3, emailRevenue: 9.8, smsRevenue: 5.5, flowsRevenue: 11.2 },
    { id: 4, name: "Cozy Home", revenue: 6.7, emailRevenue: 3.2, smsRevenue: 3.5, flowsRevenue: 4.5 },
    { id: 5, name: "Planet Fitness", revenue: 18.1, emailRevenue: 10.3, smsRevenue: 7.8, flowsRevenue: 12.6 },
    { id: 6, name: "Sweet Treats", revenue: 9.4, emailRevenue: 5.6, smsRevenue: 3.8, flowsRevenue: 7.2 },
  ];
  
  // Use provided clients or mock data
  const data = clients.length > 0 ? clients : mockClients;
  
  // Process data based on filters
  const getFilteredData = () => {
    return data.map(client => {
      let filteredRevenue = 0;
      
      // Filter by channel (email, sms, all)
      if (channelFilter === "email") {
        filteredRevenue = client.emailRevenue;
      } else if (channelFilter === "sms") {
        filteredRevenue = client.smsRevenue;
      } else if (channelFilter === "flows") {
        filteredRevenue = client.flowsRevenue;
      } else {
        filteredRevenue = client.revenue;
      }
      
      // Apply time filter (this would use real date filtering in a real app)
      // For this example, we'll just adjust the revenue based on the time filter to simulate difference
      let timeMultiplier = 1;
      switch (timeFilter) {
        case "yesterday":
          timeMultiplier = 0.03;
          break;
        case "30days":
          timeMultiplier = 1;
          break;
        case "60days":
          timeMultiplier = 1.8;
          break;
        case "quarter":
          timeMultiplier = 3;
          break;
        case "custom":
          timeMultiplier = 2;
          break;
      }
      
      return {
        name: client.name,
        revenue: filteredRevenue * timeMultiplier,
        id: client.id
      };
    });
  };
  
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
        <CardTitle className="text-lg font-semibold text-white">Client Revenue</CardTitle>
        <div className="flex space-x-2">
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
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={getFilteredData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  {data.map((client, index) => (
                    <filter key={`glow-${client.id}`} id={`glow-${client.id}`} x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  ))}
                  
                  {data.map((client, index) => (
                    <linearGradient key={`gradient-${client.id}`} id={`gradient-${client.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={clientColors[index % clientColors.length]} stopOpacity={0.8} />
                      <stop offset="100%" stopColor={clientColors[index % clientColors.length]} stopOpacity={0.2} />
                    </linearGradient>
                  ))}
                </defs>
                
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#9ca3af' }} 
                  axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                />
                <YAxis 
                  tick={{ fill: '#9ca3af' }} 
                  axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
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
                  formatter={(value: any) => [`$${value}k`, 'Revenue']}
                />
                <Legend 
                  formatter={(value, entry) => <span style={{ color: '#9ca3af' }}>{value}</span>}
                />
                
                {/* Generate a line for each client */}
                {data.map((client, index) => (
                  <Line
                    key={client.id}
                    type="monotone"
                    dataKey="revenue"
                    name={client.name}
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