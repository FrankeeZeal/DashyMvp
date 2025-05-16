import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { RiArrowRightLine } from "react-icons/ri";

export const OrganizationTypeSelection = () => {
  const [, navigate] = useLocation();

  const handleAgencySelection = () => {
    navigate("/onboarding?type=agency");
  };

  const handleEcomSelection = () => {
    navigate("/onboarding?type=ecom");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 bg-gray-50">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">What type of organization do you have?</h1>
          <p className="text-gray-600 max-w-lg mx-auto">We'll customize your experience based on your organization type</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Agency Card */}
          <div className="cursor-pointer group" onClick={handleAgencySelection}>
            <Card className="border-2 border-transparent hover:border-primary-500 transition-all duration-200 h-full">
              <div className="p-6 flex flex-col h-full">
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
                    alt="Marketing agency team workspace"
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h2 className="text-xl font-semibold mb-2 text-gray-900">I own an Agency</h2>
                <p className="text-gray-600 mb-6 flex-grow">
                  For email, SMS, and loyalty program agencies managing multiple clients and tracking ROI
                </p>
                <div className="mt-auto">
                  <span className="inline-flex items-center text-primary-600 font-medium">
                    Select this option
                    <RiArrowRightLine className="ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Ecom Store Card */}
          <div className="cursor-pointer group" onClick={handleEcomSelection}>
            <Card className="border-2 border-transparent hover:border-primary-500 transition-all duration-200 h-full">
              <div className="p-6 flex flex-col h-full">
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
                    alt="E-commerce business workspace with products"
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h2 className="text-xl font-semibold mb-2 text-gray-900">I own an Ecom Store</h2>
                <p className="text-gray-600 mb-6 flex-grow">
                  For individual e-commerce stores tracking campaign performance and accessing training resources
                </p>
                <div className="mt-auto">
                  <span className="inline-flex items-center text-primary-600 font-medium">
                    Select this option
                    <RiArrowRightLine className="ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationTypeSelection;
