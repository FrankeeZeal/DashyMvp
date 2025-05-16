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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Who are you?</h1>
          <p className="text-gray-300 max-w-md mx-auto">We'll customize your experience based on your selection</p>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-6">
          {/* Agency Card */}
          <div className="cursor-pointer group flex-1" onClick={handleAgencySelection}>
            <Card className="bg-gray-800 border-2 border-transparent hover:border-primary-500 transition-all duration-200 shadow-xl hover:shadow-blue-500/20 h-full">
              <div className="p-8 flex flex-col text-center h-full">
                <h2 className="text-2xl font-semibold mb-6 text-white">Agency</h2>
                <div className="mt-auto mx-auto">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium transition-all shadow-lg hover:shadow-blue-500/50 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800">
                    Next
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* Ecom Store Card */}
          <div className="cursor-pointer group flex-1" onClick={handleEcomSelection}>
            <Card className="bg-gray-800 border-2 border-transparent hover:border-primary-500 transition-all duration-200 shadow-xl hover:shadow-blue-500/20 h-full">
              <div className="p-8 flex flex-col text-center h-full">
                <h2 className="text-2xl font-semibold mb-6 text-white">Ecom Store</h2>
                <div className="mt-auto mx-auto">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium transition-all shadow-lg hover:shadow-blue-500/50 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800">
                    Next
                  </button>
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
