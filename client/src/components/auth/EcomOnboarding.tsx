import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ecomOnboardingSchema } from "@shared/schema";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { RiArrowLeftLine } from "react-icons/ri";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type EcomOnboardingData = z.infer<typeof ecomOnboardingSchema>;

export const EcomOnboarding = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  const form = useForm<EcomOnboardingData>({
    resolver: zodResolver(ecomOnboardingSchema),
    defaultValues: {
      name: "",
      url: "",
      age: "",
      revenue: "",
      trackingMethod: "",
      retentionTeam: "",
      teamSize: "",
      addTeamNow: "",
    },
  });

  const createEcomMutation = useMutation({
    mutationFn: async (data: EcomOnboardingData) => {
      const response = await apiRequest("POST", "/api/onboarding/ecom", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Organization created",
        description: "Your ecommerce store has been created successfully.",
      });
      navigate("/dashboard/ecom");
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
    const fields: (keyof EcomOnboardingData)[] = [
      ["name", "url"],
      ["age"],
      ["revenue"],
      ["trackingMethod"],
      ["retentionTeam"],
      ["teamSize", "addTeamNow"],
    ][step - 1];

    let isValid = true;
    for (const field of Array.isArray(fields) ? fields : [fields]) {
      const fieldValid = await form.trigger(field);
      isValid = isValid && fieldValid;
    }

    if (isValid) {
      if (step < totalSteps) {
        setStep(step + 1);
      } else {
        // Last step submission
        if (form.formState.isValid) {
          const data = form.getValues();
          createEcomMutation.mutate(data);
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
  const revenueOptions = ["Less than $10k", "$10k - $50k", "$50k - $100k", "$100k+"];
  const trackingOptions = [
    "Spreadsheets",
    "Custom dashboard",
    "Third-party tools",
    "We don't track consistently",
  ];
  const retentionTeamOptions = [
    "Yes, we have an in-house team",
    "Yes, we work with an agency",
    "No, I manage it myself",
    "We're not doing much retention marketing yet",
  ];
  const teamSizeOptions = ["Just me", "2-5 people", "6-10 people", "More than 10 people"];
  const addTeamOptions = ["Yes, add team now", "No, I'll do it later"];

  const renderOptions = (
    options: string[],
    fieldName: keyof EcomOnboardingData
  ) => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-2 gap-3 mb-8">
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
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-gray-50">
      <div className="w-full max-w-2xl">
        <div className="mb-4 flex items-center">
          <div className="flex-1">
            <Progress value={getProgress()} className="h-2" />
          </div>
          <span className="ml-4 text-sm text-gray-500">
            Step {step}/{totalSteps}
          </span>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form>
                {/* Step 1: Store Name & URL */}
                {step === 1 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">What's the name of your ecommerce store?</h2>
                    <div className="space-y-4 mb-8">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Store Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your store name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Store URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://yourstorename.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Store Age */}
                {step === 2 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">How long has your store been in business?</h2>
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

                {/* Step 3: Monthly Revenue */}
                {step === 3 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">What is your estimated monthly revenue?</h2>
                    <FormField
                      control={form.control}
                      name="revenue"
                      render={() => (
                        <FormItem>
                          {renderOptions(revenueOptions, "revenue")}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 4: Data Tracking */}
                {step === 4 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Where are you tracking your email and SMS data together in one place?</h2>
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
                                    ? "bg-primary-50 text-primary-700 border-primary-500"
                                    : ""
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

                {/* Step 5: Retention Marketing Team */}
                {step === 5 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Do you have an email & SMS team managing your store's retention marketing?</h2>
                    <FormField
                      control={form.control}
                      name="retentionTeam"
                      render={() => (
                        <FormItem>
                          <div className="grid grid-cols-1 gap-3 mb-8">
                            {retentionTeamOptions.map((option) => (
                              <Button
                                key={option}
                                type="button"
                                variant={form.watch("retentionTeam") === option ? "default" : "outline"}
                                className={
                                  form.watch("retentionTeam") === option
                                    ? "bg-primary-50 text-primary-700 border-primary-500"
                                    : ""
                                }
                                onClick={() => form.setValue("retentionTeam", option, { shouldValidate: true })}
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

                {/* Step 6: Add Team Members */}
                {step === 6 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">How many team members do you have, and would you like to add them now?</h2>
                    <p className="text-gray-600 mb-4">You can always add them later from your dashboard.</p>
                    
                    <FormField
                      control={form.control}
                      name="teamSize"
                      render={({ field }) => (
                        <FormItem className="mb-6">
                          <FormLabel>Team Size</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select team size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {teamSizeOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
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
                      disabled={createEcomMutation.isPending}
                    >
                      <RiArrowLeftLine className="mr-1" /> Back
                    </Button>
                  )}
                  <div className={step === 1 ? "ml-auto" : ""}>
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={createEcomMutation.isPending}
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

export default EcomOnboarding;
