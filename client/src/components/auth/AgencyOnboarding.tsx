import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { agencyOnboardingSchema } from "@shared/schema";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { RiArrowLeftLine } from "react-icons/ri";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AgencyOnboardingData = z.infer<typeof agencyOnboardingSchema>;

export const AgencyOnboarding = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'next' | 'prev'>('next');
  const totalSteps = 6;

  const form = useForm<AgencyOnboardingData>({
    resolver: zodResolver(agencyOnboardingSchema),
    defaultValues: {
      name: "",
      age: "",
      clientCount: "",
      trackingMethod: "",
      teamSize: "",
      addTeamNow: "",
    },
  });

  const createAgencyMutation = useMutation({
    mutationFn: async (data: AgencyOnboardingData) => {
      const response = await apiRequest("POST", "/api/onboarding/agency", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Organization created",
        description: "Your agency has been created successfully.",
      });
      navigate("/dashboard/agency");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create organization. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  const nextStep = async () => {
    const fields: (keyof AgencyOnboardingData)[] = [
      "name",
      "age",
      "clientCount",
      "trackingMethod",
      "teamSize",
      "addTeamNow",
    ];

    const currentField = fields[step - 1];
    const isValid = await form.trigger(currentField);

    if (isValid) {
      if (step < totalSteps) {
        // Start animation
        setAnimationDirection('next');
        setIsAnimating(true);
        
        // After animation completes, change step
        setTimeout(() => {
          setStep(step + 1);
          setIsAnimating(false);
        }, 300);
      } else {
        // Last step submission
        if (form.formState.isValid) {
          const data = form.getValues();
          createAgencyMutation.mutate(data);
        } else {
          // Validate all fields
          await form.trigger();
        }
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      // Start animation
      setAnimationDirection('prev');
      setIsAnimating(true);
      
      // After animation completes, change step
      setTimeout(() => {
        setStep(step - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const getProgress = () => {
    return ((step - 1) / (totalSteps - 1)) * 100;
  };

  // Step options
  const ageOptions = ["Less than 1 year", "1-2 years", "3-5 years", "5+ years"];
  const clientCountOptions = ["1-5", "6-10", "11-20", "20+"];
  const trackingOptions = [
    "Spreadsheets",
    "Custom dashboard",
    "Third-party tools",
    "We don't track consistently",
  ];
  const teamSizeOptions = ["Just me", "2-5", "6-10", "10+"];
  const addTeamOptions = ["Yes, add team now", "No, I'll do it later"];

  const renderOptions = (
    options: string[],
    fieldName: keyof AgencyOnboardingData
  ) => {
    const selectOption = (option: string) => {
      // Set the value in the form
      form.setValue(fieldName, option, { shouldValidate: true });
      
      // Add a small delay for visual feedback before moving to next step
      setTimeout(() => {
        nextStep();
      }, 300);
    };

    return (
      <div className="grid grid-cols-2 gap-3 mb-8">
        {options.map((option) => (
          <Button
            key={option}
            type="button"
            variant={form.watch(fieldName) === option ? "default" : "outline"}
            className={`
              transition-all duration-200
              ${form.watch(fieldName) === option
                ? "bg-blue-800 text-white border-blue-400 shadow-md shadow-blue-500/30"
                : "text-gray-200 border-gray-600 hover:border-blue-400 hover:bg-gray-700/50"
              }
            `}
            onClick={() => selectOption(option)}
          >
            {option}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="w-full max-w-2xl">
        <div className="mb-4 flex items-center">
          <div className="flex-1">
            <Progress value={getProgress()} className="h-2 bg-gray-700" />
          </div>
          <span className="ml-4 text-sm text-gray-300">
            Step {step}/{totalSteps}
          </span>
        </div>

        <Card className="bg-gray-800 border-0 shadow-xl">
          <CardContent className="pt-6 text-white">
            <Form {...form}>
              <form>
                {/* Step 1: Agency Name */}
                <div 
                  className={`transition-all duration-300 ${
                    step === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 absolute pointer-events-none'
                  } ${animationDirection === 'next' && isAnimating ? 'translate-x-20' : ''}
                    ${animationDirection === 'prev' && isAnimating ? '-translate-x-20' : ''}`}
                >
                  <h2 className="text-xl font-semibold mb-6 text-white">What's the name of your agency?</h2>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="mb-8">
                        <FormControl>
                          <Input
                            placeholder="Enter your agency name"
                            className="text-lg p-3 bg-gray-700 border-gray-600 text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Step 2: Company Age */}
                <div 
                  className={`transition-all duration-300 ${
                    step === 2 ? 'opacity-100 translate-x-0' : 'opacity-0 absolute pointer-events-none'
                  } ${animationDirection === 'next' && isAnimating ? 'translate-x-20' : ''}
                    ${animationDirection === 'prev' && isAnimating ? '-translate-x-20' : ''}`}
                >
                  <h2 className="text-xl font-semibold mb-6 text-white">How long has your agency been in business?</h2>
                  <FormField
                    control={form.control}
                    name="age"
                    render={() => (
                      <FormItem>
                        {renderOptions(ageOptions, "age")}
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Step 3: Number of Clients */}
                <div 
                  className={`transition-all duration-300 ${
                    step === 3 ? 'opacity-100 translate-x-0' : 'opacity-0 absolute pointer-events-none'
                  } ${animationDirection === 'next' && isAnimating ? 'translate-x-20' : ''}
                    ${animationDirection === 'prev' && isAnimating ? '-translate-x-20' : ''}`}
                >
                  <h2 className="text-xl font-semibold mb-6 text-white">How many clients does your agency currently have?</h2>
                  <FormField
                    control={form.control}
                    name="clientCount"
                    render={() => (
                      <FormItem>
                        {renderOptions(clientCountOptions, "clientCount")}
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Step 4: Tracking Tools */}
                <div 
                  className={`transition-all duration-300 ${
                    step === 4 ? 'opacity-100 translate-x-0' : 'opacity-0 absolute pointer-events-none'
                  } ${animationDirection === 'next' && isAnimating ? 'translate-x-20' : ''}
                    ${animationDirection === 'prev' && isAnimating ? '-translate-x-20' : ''}`}
                >
                  <h2 className="text-xl font-semibold mb-6 text-white">
                    How are you tracking your clients' email & SMS data outside of the platforms that provide them?
                  </h2>
                  <FormField
                    control={form.control}
                    name="trackingMethod"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                          {trackingOptions.map((option) => (
                            <Button
                              key={option}
                              type="button"
                              variant={form.watch("trackingMethod") === option ? "default" : "outline"}
                              className={`
                                transition-all duration-200
                                ${form.watch("trackingMethod") === option
                                  ? "bg-blue-800 text-white border-blue-400 shadow-md shadow-blue-500/30"
                                  : "text-gray-200 border-gray-600 hover:border-blue-400 hover:bg-gray-700/50"
                                }
                              `}
                              onClick={() => {
                                form.setValue("trackingMethod", option, { shouldValidate: true });
                                setTimeout(() => nextStep(), 300);
                              }}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Step 5: Team Size */}
                <div 
                  className={`transition-all duration-300 ${
                    step === 5 ? 'opacity-100 translate-x-0' : 'opacity-0 absolute pointer-events-none'
                  } ${animationDirection === 'next' && isAnimating ? 'translate-x-20' : ''}
                    ${animationDirection === 'prev' && isAnimating ? '-translate-x-20' : ''}`}
                >
                  <h2 className="text-xl font-semibold mb-6 text-white">How many team members do you have?</h2>
                  <FormField
                    control={form.control}
                    name="teamSize"
                    render={() => (
                      <FormItem>
                        {renderOptions(teamSizeOptions, "teamSize")}
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Step 6: Add Team Now */}
                <div 
                  className={`transition-all duration-300 ${
                    step === 6 ? 'opacity-100 translate-x-0' : 'opacity-0 absolute pointer-events-none'
                  } ${animationDirection === 'next' && isAnimating ? 'translate-x-20' : ''}
                    ${animationDirection === 'prev' && isAnimating ? '-translate-x-20' : ''}`}
                >
                  <h2 className="text-xl font-semibold mb-6 text-white">Would you like to add your team members now?</h2>
                  <p className="text-gray-400 mb-6">You can always add them later from your dashboard.</p>
                  <FormField
                    control={form.control}
                    name="addTeamNow"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-2 gap-3 mb-8">
                          {addTeamOptions.map((option) => (
                            <Button
                              key={option}
                              type="button"
                              variant={form.watch("addTeamNow") === option ? "default" : "outline"}
                              className={`
                                transition-all duration-200
                                ${form.watch("addTeamNow") === option
                                  ? "bg-blue-800 text-white border-blue-400 shadow-md shadow-blue-500/30"
                                  : "text-gray-200 border-gray-600 hover:border-blue-400 hover:bg-gray-700/50"
                                }
                              `}
                              onClick={() => {
                                form.setValue("addTeamNow", option, { shouldValidate: true });
                                setTimeout(() => nextStep(), 300);
                              }}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-between">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={prevStep}
                      className="text-gray-300 hover:bg-gray-700"
                      disabled={createAgencyMutation.isPending}
                    >
                      <RiArrowLeftLine className="mr-1" /> Back
                    </Button>
                  )}
                  {/* Only show Continue button on steps with text input */}
                  {step === 1 && (
                    <div className="ml-0">
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/60 transition-all duration-300"
                        disabled={createAgencyMutation.isPending}
                      >
                        Continue
                      </Button>
                    </div>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgencyOnboarding;
