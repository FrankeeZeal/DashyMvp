import React from 'react';
import { ClientRevenueGraph } from './ClientRevenueGraph';

// Sample client data for the revenue graph
const clientData = [
  { id: 1, name: "Earthly Goods", revenue: 8.9, emailRevenue: 5.1, smsRevenue: 3.8, flowsRevenue: 6.2 },
  { id: 2, name: "Sista Teas", revenue: 12.5, emailRevenue: 7.2, smsRevenue: 5.3, flowsRevenue: 8.1 },
  { id: 3, name: "Green Valley", revenue: 6.7, emailRevenue: 3.2, smsRevenue: 3.5, flowsRevenue: 4.5 },
  { id: 4, name: "FitLife Supplements", revenue: 9.4, emailRevenue: 5.6, smsRevenue: 3.8, flowsRevenue: 7.2 }
];

// This component will be independent of any editable dashboard layouts
export const StaticRevenueGraph = () => {
  return (
    <div className="px-6 mb-8">
      <ClientRevenueGraph 
        clients={clientData}
        isLoading={false}
      />
    </div>
  );
};

export default StaticRevenueGraph;