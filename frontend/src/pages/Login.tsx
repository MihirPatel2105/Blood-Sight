import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Activity, Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    const success = await login(formData.email, formData.password);

    if (success) {
      navigate("/profile");
    } else {
      setError("Invalid email or password");
    }

    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordError("");
    setForgotPasswordMessage("");
    setIsForgotPasswordLoading(true);

    if (!forgotPasswordEmail) {
      setForgotPasswordError("Please enter your email address");
      setIsForgotPasswordLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const data = await response.json();

      if (data.success) {
        setForgotPasswordMessage(data.message);
        setShowOtpVerification(true);
      } else {
        setForgotPasswordError(data.error || "Failed to send OTP");
      }
    } catch (error) {
      setForgotPasswordError("Network error. Please try again.");
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordError("");
    setIsForgotPasswordLoading(true);

    if (!otp) {
      setForgotPasswordError("Please enter the OTP");
      setIsForgotPasswordLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: forgotPasswordEmail,
          otp: otp 
        }),
      });

      const data = await response.json();

      if (data.success) {
        setForgotPasswordMessage("OTP verified successfully. Please set your new password.");
        setOtpVerified(true);
      } else {
        setForgotPasswordError(data.error || "Invalid OTP");
      }
    } catch (error) {
      setForgotPasswordError("Network error. Please try again.");
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordError("");
    setIsForgotPasswordLoading(true);

    if (!newPassword || !confirmPassword) {
      setForgotPasswordError("Please fill in all password fields");
      setIsForgotPasswordLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotPasswordError("Passwords do not match");
      setIsForgotPasswordLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setForgotPasswordError("Password must be at least 6 characters long");
      setIsForgotPasswordLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: forgotPasswordEmail,
          otp: otp,
          new_password: newPassword,
          confirm_password: confirmPassword
        }),
      });

      const data = await response.json();

      if (data.success) {
        setForgotPasswordMessage("Password reset successfully! You can now login with your new password.");
        // Reset all states and close dialog after a delay
        setTimeout(() => {
          setShowForgotPasswordDialog(false);
          setShowOtpVerification(false);
          setOtpVerified(false);
          setOtp("");
          setNewPassword("");
          setConfirmPassword("");
          setForgotPasswordEmail("");
          setForgotPasswordMessage("");
          setForgotPasswordError("");
        }, 2000);
      } else {
        setForgotPasswordError(data.error || "Failed to reset password");
      }
    } catch (error) {
      setForgotPasswordError("Network error. Please try again.");
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">BloodAI</span>
          </Link>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to your BloodAI account to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="pl-10"
                      disabled={isLoading || loading}
                    />
                    <Mail className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      disabled={isLoading || loading}
                    />
                    <Lock className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || loading}
                >
                  {isLoading || loading ? "Signing in..." : "Sign In"}
                </Button>

                <div className="text-center">
                  <Dialog open={showForgotPasswordDialog} onOpenChange={setShowForgotPasswordDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="link" 
                        className="text-sm text-muted-foreground hover:text-primary"
                        onClick={() => {
                          setShowForgotPasswordDialog(true);
                          setShowOtpVerification(false);
                          setOtpVerified(false);
                          setForgotPasswordEmail("");
                          setOtp("");
                          setNewPassword("");
                          setConfirmPassword("");
                          setForgotPasswordError("");
                          setForgotPasswordMessage("");
                        }}
                      >
                        Forgot your password?
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>
                          {!showOtpVerification ? "Reset Password" : 
                           !otpVerified ? "Verify OTP" : "Set New Password"}
                        </DialogTitle>
                        <DialogDescription>
                          {!showOtpVerification ? 
                            "Enter your email address and we'll send you an OTP to reset your password." :
                           !otpVerified ?
                            "Enter the 6-digit OTP sent to your email." :
                            "Enter your new password below."}
                        </DialogDescription>
                      </DialogHeader>

                      {!showOtpVerification ? (
                        // Step 1: Email Input
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                          {forgotPasswordError && (
                            <Alert variant="destructive">
                              <AlertDescription>{forgotPasswordError}</AlertDescription>
                            </Alert>
                          )}
                          {forgotPasswordMessage && (
                            <Alert>
                              <AlertDescription className="text-green-700">{forgotPasswordMessage}</AlertDescription>
                            </Alert>
                          )}
                          
                          <div className="space-y-2">
                            <Label htmlFor="reset-email">Email</Label>
                            <div className="relative">
                              <Input
                                id="reset-email"
                                type="email"
                                value={forgotPasswordEmail}
                                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="pl-10"
                                disabled={isForgotPasswordLoading}
                              />
                              <Mail className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                            </div>
                          </div>

                          <Button
                            type="submit"
                            className="w-full"
                            disabled={isForgotPasswordLoading}
                          >
                            {isForgotPasswordLoading ? "Sending..." : "Send OTP"}
                          </Button>
                        </form>
                      ) : !otpVerified ? (
                        // Step 2: OTP Verification
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                          {forgotPasswordError && (
                            <Alert variant="destructive">
                              <AlertDescription>{forgotPasswordError}</AlertDescription>
                            </Alert>
                          )}
                          {forgotPasswordMessage && (
                            <Alert>
                              <AlertDescription className="text-green-700">{forgotPasswordMessage}</AlertDescription>
                            </Alert>
                          )}
                          
                          <div className="space-y-2">
                            <Label htmlFor="otp">Enter OTP</Label>
                            <Input
                              id="otp"
                              type="text"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              placeholder="Enter 6-digit OTP"
                              maxLength={6}
                              className="text-center text-lg tracking-widest"
                              disabled={isForgotPasswordLoading}
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              className="flex-1"
                              onClick={() => {
                                setShowOtpVerification(false);
                                setOtp("");
                                setForgotPasswordError("");
                                setForgotPasswordMessage("");
                              }}
                            >
                              Back
                            </Button>
                            <Button
                              type="submit"
                              className="flex-1"
                              disabled={isForgotPasswordLoading}
                            >
                              {isForgotPasswordLoading ? "Verifying..." : "Verify OTP"}
                            </Button>
                          </div>
                        </form>
                      ) : (
                        // Step 3: Password Reset
                        <form onSubmit={handleResetPassword} className="space-y-4">
                          {forgotPasswordError && (
                            <Alert variant="destructive">
                              <AlertDescription>{forgotPasswordError}</AlertDescription>
                            </Alert>
                          )}
                          {forgotPasswordMessage && (
                            <Alert>
                              <AlertDescription className="text-green-700">{forgotPasswordMessage}</AlertDescription>
                            </Alert>
                          )}
                          
                          <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <div className="relative">
                              <Input
                                id="new-password"
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="pl-10 pr-10"
                                disabled={isForgotPasswordLoading}
                              />
                              <Lock className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                              <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                              >
                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                            <div className="relative">
                              <Input
                                id="confirm-new-password"
                                type={showConfirmNewPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                className="pl-10 pr-10"
                                disabled={isForgotPasswordLoading}
                              />
                              <Lock className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                              <button
                                type="button"
                                onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                              >
                                {showConfirmNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>

                          <Button
                            type="submit"
                            className="w-full"
                            disabled={isForgotPasswordLoading}
                          >
                            {isForgotPasswordLoading ? "Resetting..." : "Reset Password"}
                          </Button>
                        </form>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-primary hover:underline font-medium"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Demo credentials: test@example.com / password123
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
