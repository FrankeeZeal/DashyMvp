import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { type Campaign } from "@shared/schema";
import { RiAddLine, RiArrowRightSLine, RiArrowLeftSLine, RiMailLine, RiMessage2Line, RiCouponLine } from "react-icons/ri";
import { formatDistanceToNow } from "date-fns";

interface CampaignTableProps {
  campaigns: Campaign[];
  isLoading: boolean;
}

export const CampaignTable = ({ campaigns, isLoading }: CampaignTableProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount / 100);
  };

  const campaignTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return (
          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-blue-100">
            <RiMailLine className="text-blue-600" />
          </div>
        );
      case "sms":
        return (
          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-purple-100">
            <RiMessage2Line className="text-purple-600" />
          </div>
        );
      case "loyalty":
        return (
          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-yellow-100">
            <RiCouponLine className="text-yellow-600" />
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-gray-100">
            <RiMailLine className="text-gray-600" />
          </div>
        );
    }
  };

  const campaignTypeBadge = (type: string) => {
    switch (type) {
      case "email":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Email
          </Badge>
        );
      case "sms":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            SMS
          </Badge>
        );
      case "loyalty":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Loyalty
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            {type}
          </Badge>
        );
    }
  };

  const campaignStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Active
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Completed
          </Badge>
        );
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Scheduled
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Draft
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            {status}
          </Badge>
        );
    }
  };

  const getROI = (revenue: number) => {
    // Hypothetical ROI calculation
    const cost = revenue * 0.12; // Assume cost is 12% of revenue
    const roi = ((revenue - cost) / cost) * 100;
    return `${Math.round(roi)}%`;
  };

  const renderSkeleton = () => {
    return Array.from({ length: 4 }).map((_, i) => (
      <TableRow key={i}>
        <TableCell>
          <div className="flex items-center">
            <Skeleton className="h-10 w-10 rounded-md" />
            <div className="ml-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24 mt-1" />
            </div>
          </div>
        </TableCell>
        <TableCell><Skeleton className="h-6 w-16" /></TableCell>
        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
      </TableRow>
    ));
  };

  // Default example campaigns for empty state
  const defaultCampaigns = [
    {
      id: 1,
      name: "Spring Sale Announcement",
      type: "email",
      status: "completed",
      sentCount: 8452,
      openCount: 2341,
      clickCount: 986,
      revenue: 428700,
      sentDate: new Date(2023, 2, 15),
    },
    {
      id: 2,
      name: "Flash Sale Alert",
      type: "sms",
      status: "completed",
      sentCount: 3921,
      openCount: 0,
      clickCount: 764,
      revenue: 295200,
      sentDate: new Date(2023, 2, 10),
    },
    {
      id: 3,
      name: "Loyalty Member Discount",
      type: "loyalty",
      status: "completed",
      sentCount: 1254,
      openCount: 954,
      clickCount: 587,
      revenue: 364500,
      sentDate: new Date(2023, 2, 5),
    },
    {
      id: 4,
      name: "New Collection Launch",
      type: "email",
      status: "completed",
      sentCount: 7865,
      openCount: 2546,
      clickCount: 1245,
      revenue: 587900,
      sentDate: new Date(2023, 2, 1),
    },
  ] as Campaign[];

  const displayCampaigns = campaigns.length > 0 ? campaigns : defaultCampaigns;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-5 border-b border-gray-200">
        <CardTitle>Campaign Performance</CardTitle>
        <div className="flex items-center">
          <Button variant="outline" className="mr-2">
            Export
          </Button>
          <Button>
            <RiAddLine className="mr-1" />
            Add New
          </Button>
        </div>
      </CardHeader>
      
      <div className="px-4 py-3 bg-gray-50 sm:px-6">
        <div className="flex items-center flex-wrap gap-2">
          <Button size="sm" className="rounded-full">All</Button>
          <Button size="sm" variant="outline" className="rounded-full">Email</Button>
          <Button size="sm" variant="outline" className="rounded-full">SMS</Button>
          <Button size="sm" variant="outline" className="rounded-full">Loyalty</Button>
        </div>
      </div>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Opens/Clicks</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>ROI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading 
                ? renderSkeleton() 
                : displayCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div className="flex items-center">
                          {campaignTypeIcon(campaign.type)}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                            <div className="text-sm text-gray-500">
                              {campaign.sentDate 
                                ? `Sent ${formatDistanceToNow(new Date(campaign.sentDate), { addSuffix: true })}` 
                                : "Not sent yet"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{campaignTypeBadge(campaign.type)}</TableCell>
                      <TableCell>{campaignStatusBadge(campaign.status)}</TableCell>
                      <TableCell className="text-sm text-gray-500">{campaign.sentCount.toLocaleString()}</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {campaign.type === 'sms' 
                          ? `N/A / ${campaign.clickCount.toLocaleString()}`
                          : `${campaign.openCount.toLocaleString()} / ${campaign.clickCount.toLocaleString()}`}
                      </TableCell>
                      <TableCell className="text-sm text-gray-900">{formatCurrency(campaign.revenue)}</TableCell>
                      <TableCell className="text-sm text-green-600">{getROI(campaign.revenue)}</TableCell>
                    </TableRow>
                  ))
              }
            </TableBody>
          </Table>
        </div>
        
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button variant="outline" size="sm">Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
          
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of{" "}
                <span className="font-medium">12</span> results
              </p>
            </div>
            
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignTable;
