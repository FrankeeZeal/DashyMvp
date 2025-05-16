import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string | number;
    type: "increase" | "decrease" | "neutral";
  };
  icon: LucideIcon | IconType;
  iconBgColor: string;
  iconColor: string;
}

export const StatsCard = ({
  title,
  value,
  change,
  icon: Icon,
  iconBgColor,
  iconColor,
}: StatsCardProps) => {
  const getChangeColor = () => {
    if (!change) return "";
    switch (change.type) {
      case "increase":
        return "bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent";
      case "decrease":
        return "bg-gradient-to-r from-rose-400 to-red-500 bg-clip-text text-transparent";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 bg-clip-text text-transparent";
    }
  };

  const getChangeIcon = () => {
    if (!change) return null;
    
    switch (change.type) {
      case "increase":
        return <i className="ri-arrow-up-s-fill" />;
      case "decrease":
        return <i className="ri-arrow-down-s-fill" />;
      default:
        return null;
    }
  };

  return (
    <Card className="h-full">
      <CardContent className="p-4 md:p-5">
        <div className="flex items-center h-full">
          <div className={cn("flex-shrink-0 rounded-md p-2.5", iconBgColor)}>
            <Icon className={cn("text-xl", iconColor)} />
          </div>
          <div className="ml-3 w-full flex-1 min-w-0">
            <dl>
              <dt className="text-xs md:text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex flex-wrap items-baseline mt-1">
                <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent mr-2 truncate relative">
                  <span className="relative z-10">{value}</span>
                  <div className="absolute inset-0 blur-sm opacity-30 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 -z-10"></div>
                </div>
                {change && (
                  <div
                    className={cn(
                      "flex items-baseline text-xs md:text-sm font-semibold",
                      getChangeColor()
                    )}
                  >
                    {getChangeIcon()}
                    <span className="sr-only">
                      {change.type === "increase" ? "Increased by" : "Decreased by"}
                    </span>
                    {change.value}
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
