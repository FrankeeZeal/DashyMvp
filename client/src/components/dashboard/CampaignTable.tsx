import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Campaign } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface CampaignTableProps {
  campaigns: Campaign[];
  isLoading: boolean;
}

export const CampaignTable = ({ campaigns, isLoading }: CampaignTableProps) => {
  // Function to render status badge with appropriate color
  const renderStatus = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      active: { color: "bg-green-100 text-green-800", label: "Active" },
      draft: { color: "bg-gray-100 text-gray-800", label: "Draft" },
      scheduled: { color: "bg-blue-100 text-blue-800", label: "Scheduled" },
      completed: { color: "bg-purple-100 text-purple-800", label: "Completed" },
      cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" }
    };

    const config = statusMap[status] || statusMap.draft;

    return (
      <Badge variant="outline" className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Upcoming Campaigns</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          View and manage scheduled email and SMS campaigns
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign Name</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <TableRow key={campaign.id} className="hover:bg-gray-50 cursor-pointer">
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>{(campaign as any).clientName || `Client ${(campaign as any).clientId}`}</TableCell>
                  <TableCell>{format(new Date((campaign as any).startDate || campaign.sentDate || new Date()), 'MMM d, yyyy')}</TableCell>
                  <TableCell>{format(new Date((campaign as any).endDate || campaign.updatedAt || new Date()), 'MMM d, yyyy')}</TableCell>
                  <TableCell>{renderStatus(campaign.status)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                  No campaigns found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CampaignTable;