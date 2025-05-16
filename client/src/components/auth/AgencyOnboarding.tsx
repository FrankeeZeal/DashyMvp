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
import { RiArrowLeftLine, RiCheckLine, RiCloseLine, RiUserAddLine, RiMailLine } from "react-icons/ri";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type AgencyOnboardingData = z.infer<typeof agencyOnboardingSchema>;

export const AgencyOnboarding = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'next' | 'prev'>('next');
  const [teamMembers, setTeamMembers] = useState<{email: string; role: string; invited: boolean}[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [showSuccessInvite, setShowSuccessInvite] = useState<number | null>(null);
  const totalSteps = 7; // Added one more step for team management

  const form = useForm<AgencyOnboardingData>({
    resolver: zodResolver(agencyOnboardingSchema),
    defaultValues: {
      name: "",
      age: "",
      clientCount: "",
      trackingMethod: "",
      teamSize: "",
      addTeamNow: "",
      teamMembers: [],
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
        // Check if we're on the addTeamNow step (6)
        if (step === 6) {
          // If user selected "No, I'll do it later", skip the team members step
          if (form.getValues().addTeamNow === "No, I'll do it later") {
            // Submit the form instead of going to the next step
            if (form.formState.isValid) {
              const data = form.getValues();
              createAgencyMutation.mutate(data);
            } else {
              await form.trigger();
            }
            return;
          }
        }
        
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
              <form onSubmit={(e) => e.preventDefault()}>
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
                    How are you currently tracking your client(s) Email & Sms data?
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
                                ${option === "Yes, add team now"
                                  ? form.watch("addTeamNow") === option
                                    ? "bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/60 animate-pulse"
                                    : "bg-blue-700/80 text-white border-blue-400 shadow-md hover:shadow-blue-500/60 hover:bg-blue-600/90"
                                  : form.watch("addTeamNow") === option 
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

                {/* Step 7: Add Team Members (only shown if user selected "Yes, add team now") */}
                {step === 7 && form.watch("addTeamNow") === "Yes, add team now" && (
                  <div className="transition-all duration-300">
                    <h2 className="text-xl font-semibold mb-4 text-white">Add team members to your agency</h2>
                    <p className="text-gray-400 mb-6">Enter your team members' email addresses and select their roles.</p>
                    
                    <div className="grid grid-cols-1 gap-4 mb-6">
                      <div className="flex items-end gap-3">
                        <div className="flex-1">
                          <FormLabel className="text-gray-300 mb-2 block">Email address</FormLabel>
                          <div className="relative">
                            <RiMailLine className="absolute left-3 top-3 text-gray-400" />
                            <Input
                              placeholder="team@example.com"
                              className="pl-9 bg-gray-700 border-gray-600 text-white"
                              value={newMemberEmail}
                              onChange={(e) => setNewMemberEmail(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="w-44">
                          <FormLabel className="text-gray-300 mb-2 block">Role</FormLabel>
                          <Select value={newMemberRole} onValueChange={setNewMemberRole}>
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600 text-white">
                              <SelectItem value="Account Manager">Account Manager</SelectItem>
                              <SelectItem value="Designer">Designer</SelectItem>
                              <SelectItem value="Analyst">Analyst</SelectItem>
                              <SelectItem value="Co-Founder">Co-Founder</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          type="button"
                          className="bg-blue-600 hover:bg-blue-500 text-white h-10 px-4"
                          onClick={() => {
                            if (newMemberEmail && newMemberRole) {
                              // Check if email already exists
                              const emailExists = teamMembers.some(
                                member => member.email.toLowerCase() === newMemberEmail.toLowerCase()
                              );
                              
                              if (emailExists) {
                                toast({
                                  title: "Email already added",
                                  description: "This email address has already been added to the team.",
                                  variant: "destructive",
                                });
                                return;
                              }
                              
                              setTeamMembers([...teamMembers, {
                                email: newMemberEmail,
                                role: newMemberRole,
                                invited: false
                              }]);
                              setNewMemberEmail('');
                              setNewMemberRole('');
                            }
                          }}
                        >
                          <RiUserAddLine className="mr-1" /> Add
                        </Button>
                      </div>
                    </div>
                    
                    {teamMembers.length > 0 && (
                      <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
                        <h3 className="text-white font-medium mb-3">Team members</h3>
                        <div className="space-y-3">
                          {teamMembers.map((member, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-md bg-gray-800 border border-gray-700 relative">
                              <div className="flex items-center">
                                <div className={`w-2 h-2 rounded-full ${member.invited ? 'bg-green-500' : 'bg-blue-500'} mr-2`}></div>
                                <div>
                                  <p className="text-white">{member.email}</p>
                                  <p className="text-sm text-gray-400">{member.role}</p>
                                </div>
                              </div>
                              {member.invited ? (
                                <div className="flex items-center text-green-500">
                                  <div className="bg-green-500/20 px-3 py-1 rounded-full flex items-center">
                                    <RiCheckLine className="mr-1" /> Invited
                                  </div>
                                </div>
                              ) : (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-1 h-auto"
                                    onClick={() => {
                                      setTeamMembers(teamMembers.filter((_, i) => i !== index));
                                    }}
                                  >
                                    <RiCloseLine size={18} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3"
                                    onClick={() => {
                                      // Simulate sending invite
                                      const updatedMembers = [...teamMembers];
                                      updatedMembers[index].invited = true;
                                      setTeamMembers(updatedMembers);
                                      setShowSuccessInvite(index);
                                      
                                      // Add to form data
                                      const currentTeamMembers = form.getValues().teamMembers || [];
                                      form.setValue('teamMembers', [
                                        ...currentTeamMembers, 
                                        { email: member.email, role: member.role }
                                      ]);
                                      
                                      // Hide success message after 1.5 seconds
                                      setTimeout(() => {
                                        setShowSuccessInvite(null);
                                      }, 1500);
                                    }}
                                  >
                                    Send Invite
                                  </Button>
                                  
                                  {/* Success overlay */}
                                  {showSuccessInvite === index && (
                                    <div className="absolute inset-0 bg-black/80 rounded-md flex items-center justify-center z-10">
                                      <div className="bg-green-600 rounded-full p-2">
                                        <RiCheckLine className="text-white text-lg" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {teamMembers.length === 0 && (
                      <div className="bg-gray-700/30 border border-gray-700 rounded-lg p-6 mb-6 text-center">
                        <p className="text-gray-400">No team members added yet</p>
                      </div>
                    )}
                  </div>
                )}

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
                  {/* Only show Continue button on steps with text input or last screen */}
                  {(step === 1 || step === 7) && (
                    <div className="ml-0">
                      <Button
                        type="button"
                        onClick={step === 7 ? () => createAgencyMutation.mutate(form.getValues()) : nextStep}
                        className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/60 transition-all duration-300"
                        disabled={createAgencyMutation.isPending}
                      >
                        {step === 7 ? "Complete Setup" : "Continue"}
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
