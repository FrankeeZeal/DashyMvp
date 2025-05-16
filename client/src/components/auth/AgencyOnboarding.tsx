import { useState } from "react";
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
        setStep(step + 1);
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
      setStep(step - 1);
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
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {options.map((option) => (
          <Button
            key={option}
            type="button"
            variant={form.watch(fieldName) === option ? "default" : "outline"}
            className={
              form.watch(fieldName) === option
                ? "bg-primary-50 text-primary-700 border-primary-500"
                : ""
            }
            onClick={() => form.setValue(fieldName, option, { shouldValidate: true })}
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
                {step === 1 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6 text-white">What's the name of your agency?</h2>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="mb-8">
                          <FormControl>
                            <Input
                              placeholder="Enter your agency name"
                              className="text-lg p-3"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 2: Company Age */}
                {step === 2 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6 text-white">How long has your agency been in business?</h2>
                    <FormField
                      control={form.control}
                      name="age"
                      render={() => (
                        <FormItem>
                          {renderOptions(ageOptions, "age")}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 3: Number of Clients */}
                {step === 3 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6 text-white">How many clients does your agency currently have?</h2>
                    <FormField
                      control={form.control}
                      name="clientCount"
                      render={() => (
                        <FormItem>
                          {renderOptions(clientCountOptions, "clientCount")}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 4: Tracking Tools */}
                {step === 4 && (
                  <div>
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
                                className={
                                  form.watch("trackingMethod") === option
                                    ? "bg-blue-800 text-white border-blue-400"
                                    : "text-gray-200 border-gray-600"
                                }
                                onClick={() => form.setValue("trackingMethod", option, { shouldValidate: true })}
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 5: Team Size */}
                {step === 5 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6 text-white">How many team members do you have?</h2>
                    <FormField
                      control={form.control}
                      name="teamSize"
                      render={() => (
                        <FormItem>
                          {renderOptions(teamSizeOptions, "teamSize")}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 6: Add Team Now */}
                {step === 6 && (
                  <div>
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
                                className={
                                  form.watch("addTeamNow") === option
                                    ? "bg-primary-50 text-primary-700 border-primary-500"
                                    : ""
                                }
                                onClick={() => form.setValue("addTeamNow", option, { shouldValidate: true })}
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <div className="flex justify-between">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={prevStep}
                      className="text-gray-600 hover:bg-gray-100"
                      disabled={createAgencyMutation.isPending}
                    >
                      <RiArrowLeftLine className="mr-1" /> Back
                    </Button>
                  )}
                  <div className={step === 1 ? "ml-auto" : ""}>
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={createAgencyMutation.isPending}
                    >
                      {step === totalSteps ? "Finish Setup" : "Continue"}
                    </Button>
                  </div>
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
