
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react";
import { Label } from "@/components/ui/label";

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const navigate = useNavigate();

  const validateInput = () => {
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    
    // Password strength check
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInput()) return;
    
    // Check for too many failed attempts
    if (failedAttempts >= 3) {
      toast.error("Too many failed attempts. Please try again later.");
      return;
    }
    
    setIsLoading(true);
    
    // Mock login with security simulation
    setTimeout(() => {
      setIsLoading(false);
      
      // Demo credentials for security demo
      if (email === "teacher@school.edu" && password === "secure123") {
        toast.success("Login successful");
        setFailedAttempts(0);
        navigate('/dashboard');
      } else {
        setFailedAttempts(prev => prev + 1);
        toast.error(`Invalid credentials. ${3 - failedAttempts - 1} attempts remaining.`);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-gray-900 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">Teacher Portal</h1>
          </div>
          <p className="text-gray-600 mt-2">Secure access to your dashboard</p>
        </div>
        
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center text-gray-900">Welcome back</CardTitle>
            <p className="text-sm text-gray-600 text-center">Enter your credentials to sign in</p>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-900">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="teacher@school.edu"
                    className="pl-10 border-gray-200 focus:border-gray-900"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-900">
                    Password
                  </Label>
                  <a href="#" className="text-xs text-gray-600 hover:text-gray-900 font-medium">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 border-gray-200 focus:border-gray-900"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              {failedAttempts > 0 && (
                <div className="text-sm text-red-600 text-center">
                  {failedAttempts} failed attempt{failedAttempts > 1 ? 's' : ''}. {3 - failedAttempts} remaining.
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-2">
              <Button 
                type="submit" 
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5"
                disabled={isLoading || failedAttempts >= 3}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              
              <div className="text-center text-sm text-gray-600">
                <span>Need help? </span>
                <a href="#" className="text-gray-900 font-medium hover:underline">
                  Contact IT support
                </a>
              </div>
            </CardFooter>
          </form>
        </Card>
        
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Demo credentials: teacher@school.edu / secure123
          </p>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Teacher Portal. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
