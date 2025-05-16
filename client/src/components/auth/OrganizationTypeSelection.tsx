import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { RiArrowRightLine } from "react-icons/ri";
import { useState } from "react";

export const OrganizationTypeSelection = () => {
  const [, navigate] = useLocation();
  const [selectedCard, setSelectedCard] = useState<'agency' | 'ecom' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleAgencySelection = () => {
    // Only proceed if not already transitioning
    if (!isTransitioning) {
      setSelectedCard('agency');
      setIsTransitioning(true);
      
      // Add a slight delay for the animation effect
      setTimeout(() => {
        window.location.href = "/onboarding?type=agency";
      }, 500);
    }
  };

  const handleEcomSelection = () => {
    // Only proceed if not already transitioning
    if (!isTransitioning) {
      setSelectedCard('ecom');
      setIsTransitioning(true);
      
      // Add a slight delay for the animation effect
      setTimeout(() => {
        window.location.href = "/onboarding?type=ecom";
      }, 500);
    }
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
          <div 
            className={`cursor-pointer group flex-1 transform transition-all duration-300 ${
              selectedCard === 'agency' ? 'scale-105' : ''
            } ${isTransitioning && selectedCard === 'agency' ? 'opacity-90' : ''}`} 
            onClick={handleAgencySelection}
          >
            <Card 
              className={`bg-gray-800 border-2 ${
                selectedCard === 'agency' ? 'border-primary-500 shadow-blue-500/40' : 'border-transparent'
              } transition-all duration-300 shadow-xl hover:shadow-blue-500/20 h-full`}
            >
              <div className="p-8 flex flex-col text-center h-full">
                <h2 className="text-2xl font-semibold mb-6 text-white">Agency</h2>
                <div className="mt-auto mx-auto">
                  <button className={`px-8 py-2 bg-blue-600 text-white rounded-full font-medium transition-all shadow-lg ${
                    selectedCard === 'agency' ? 'shadow-blue-500/50 bg-blue-500' : 'hover:shadow-blue-500/50 hover:bg-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800`}>
                    Next
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* Ecom Store Card */}
          <div 
            className={`cursor-pointer group flex-1 transform transition-all duration-300 ${
              selectedCard === 'ecom' ? 'scale-105' : ''
            } ${isTransitioning && selectedCard === 'ecom' ? 'opacity-90' : ''}`}
            onClick={handleEcomSelection}
          >
            <Card 
              className={`bg-gray-800 border-2 ${
                selectedCard === 'ecom' ? 'border-primary-500 shadow-blue-500/40' : 'border-transparent'
              } transition-all duration-300 shadow-xl hover:shadow-blue-500/20 h-full`}
            >
              <div className="p-8 flex flex-col text-center h-full">
                <h2 className="text-2xl font-semibold mb-6 text-white">Ecom Store</h2>
                <div className="mt-auto mx-auto">
                  <button className={`px-8 py-2 bg-blue-600 text-white rounded-full font-medium transition-all shadow-lg ${
                    selectedCard === 'ecom' ? 'shadow-blue-500/50 bg-blue-500' : 'hover:shadow-blue-500/50 hover:bg-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800`}>
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
