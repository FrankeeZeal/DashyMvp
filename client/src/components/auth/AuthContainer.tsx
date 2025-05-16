import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiGoogleFill, RiMicrosoftFill } from "react-icons/ri";

export const AuthContainer = () => {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"signup" | "signin">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailSignup = () => {
    // In reality, this would be handled by Replit Auth
    // For now, just navigate to onboarding
    navigate("/onboarding");
  };

  const handleEmailSignin = () => {
    // In reality, this would be handled by Replit Auth
    // For now, just navigate to onboarding
    navigate("/onboarding");
  };

  const handleSSOLogin = (provider: string) => {
    // Redirect to Replit Auth endpoint
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-gray-50">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Dashy</h1>
            <p className="text-gray-600">The all-in-one dashboard for email, SMS, and loyalty program management</p>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "signup" | "signin")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="signin">Sign In</TabsTrigger>
            </TabsList>

            <TabsContent value="signup" className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                />
              </div>
              <Button className="w-full" onClick={handleEmailSignup}>
                Create Account
              </Button>

              <div className="relative flex items-center justify-center py-2">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-sm">or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <div className="grid gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSSOLogin("google")}
                >
                  <RiGoogleFill className="mr-2 h-4 w-4 text-red-500" />
                  Continue with Google
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSSOLogin("microsoft")}
                >
                  <RiMicrosoftFill className="mr-2 h-4 w-4 text-blue-500" />
                  Continue with Microsoft
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="signin" className="space-y-4">
              <div>
                <label htmlFor="signin-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  id="signin-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="signin-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Input
                  type="password"
                  id="signin-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                />
                <div className="flex justify-end mt-1">
                  <a href="#" className="text-sm text-primary-600 hover:text-primary-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <Button className="w-full" onClick={handleEmailSignin}>
                Sign In
              </Button>

              <div className="relative flex items-center justify-center py-2">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-sm">or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <div className="grid gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSSOLogin("google")}
                >
                  <RiGoogleFill className="mr-2 h-4 w-4 text-red-500" />
                  Sign in with Google
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSSOLogin("microsoft")}
                >
                  <RiMicrosoftFill className="mr-2 h-4 w-4 text-blue-500" />
                  Sign in with Microsoft
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthContainer;
