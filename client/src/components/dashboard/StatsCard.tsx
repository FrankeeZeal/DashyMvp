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
        return "text-green-600";
      case "decrease":
        return "text-red-600";
      default:
        return "text-gray-600";
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
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={cn("flex-shrink-0 rounded-md p-3", iconBgColor)}>
            <Icon className={cn("text-xl", iconColor)} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {value}
                </div>
                {change && (
                  <div
                    className={cn(
                      "ml-2 flex items-baseline text-sm font-semibold",
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
