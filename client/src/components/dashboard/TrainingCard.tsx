import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiPlayFill, RiTimeLine } from "react-icons/ri";

export const TrainingCard = () => {
  const trainingResources = [
    {
      id: 1,
      title: "Email Campaign Best Practices",
      description: "Learn how to create high-converting email campaigns that drive revenue.",
      duration: "25 minutes",
      thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=400"
    },
    {
      id: 2,
      title: "SMS Marketing Strategies",
      description: "Discover effective SMS marketing techniques for ecommerce businesses.",
      duration: "18 minutes",
      thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=400"
    },
    {
      id: 3,
      title: "Building Customer Loyalty",
      description: "Learn how to create and maintain an effective loyalty program for your store.",
      duration: "22 minutes",
      thumbnail: "https://images.unsplash.com/photo-1542626991-cbc4e32524cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=400"
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-3 border-b border-gray-200 flex justify-between items-center">
        <CardTitle>Training Resources</CardTitle>
        <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
          View All
        </a>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trainingResources.map(resource => (
            <div 
              key={resource.id} 
              className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="h-36 bg-gray-200 relative">
                <img 
                  src={resource.thumbnail} 
                  alt={`${resource.title} thumbnail`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white bg-opacity-75 flex items-center justify-center">
                    <RiPlayFill className="text-primary-600 text-2xl" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-base font-medium text-gray-900">{resource.title}</h4>
                <p className="mt-1 text-sm text-gray-600">{resource.description}</p>
                <div className="mt-3 flex items-center text-sm text-gray-500">
                  <RiTimeLine className="mr-1" />
                  {resource.duration}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingCard;
