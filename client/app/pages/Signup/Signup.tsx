import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { signUp, verifyEmail } from "@/api/authService";
import { AxiosError } from "axios";
import { signUpSchema } from "@/validation/userSchema";
import type { ErrorResponse } from "@/types/auth";

// Type for the form inputs
type SignUpFormInputs = z.infer<typeof signUpSchema>;

type VerificationStatus = "pending" | "success" | "error";

function SignUpForm() {
  const [step, setStep] = useState<"details" | "verification">("details");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>("pending");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormInputs>({
    resolver: zodResolver(signUpSchema),
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "verification" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const onSubmit = async (data: SignUpFormInputs) => {
    try {
      const response = await signUp(data);

      if (response.data.success && !response.data.isVerified) {
        setStep("verification");
        setTimer(30);
        setCanResend(false);
        setVerificationStatus("pending");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response && axiosError.response.data) {
        const backendError = axiosError.response.data.message;
        console.error("Error:", backendError);
        setError("root", { message: backendError });
      }
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 4) return;
    setIsVerifying(true);
    try {
      const response = await verifyEmail({ otp });

      if (response.data.success && response.data.Code === "VERIFIED") {
        setVerificationStatus("success");
      } else {
        setVerificationStatus("error");
        setOtp("");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setVerificationStatus("error");
      setOtp("");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTimer(30);
      setCanResend(false);
      setOtp("");
      setVerificationStatus("pending");
    } catch (error) {
      console.error("Error resending OTP:", error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="border-none shadow-lg w-full max-w-md">
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              {/* <Cog className="text-white w-4 h-4" /> */}
              <img
                src="https://i.ibb.co/ymr4kp0f/CNER-LAB-LOGO.jpg"
                className="text-white w-8 h-8"
                alt="CNER LAB Logo"
              />
            </div>
            <div className="space-y-3 text-center">
              <h1 className="text-2xl font-bold tracking-tight">
                Create your account
              </h1>
              <p className="text-muted-foreground text-sm">
                Already have an account?{" "}
                <Link
                  to="/auth/login"
                  className="text-primary hover:text-primary/90 underline underline-offset-4"
                >
                  Login
                </Link>
              </p>
              {errors.root && (
                <div className="flex items-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
                  <AlertCircle className="w-5 h-5 mr-3" />
                  <span>{errors.root.message}</span>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {step === "details" ? (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="username">Name</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="John Doe"
                    {...register("username")}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500">
                      {errors.username.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="usn@bmsit.in"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}{" "}
                  Continue
                </Button>
              </>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-lg font-semibold">Verify your email</h2>
                  <p className="text-sm text-muted-foreground">
                    We've sent a verification code to
                    <br />
                    <span className="font-medium text-foreground">
                      {/* Display email */}
                    </span>
                  </p>
                </div>

                <div className="flex flex-col items-center gap-4">
                  {verificationStatus === "success" ? (
                    <div className="space-y-4 w-full">
                      <Alert className="bg-emerald-50 text-emerald-600 border-emerald-200">
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertDescription className="ml-2">
                          Email verified successfully! Your login credentials
                          have been sent to your email address.
                        </AlertDescription>
                      </Alert>
                      <Button asChild className="w-full">
                        <Link to="/auth/login">Go to Login</Link>
                      </Button>
                    </div>
                  ) : (
                    <>
                      <InputOTP
                        value={otp}
                        onChange={(value) => setOtp(value)}
                        maxLength={4}
                        containerClassName="group flex items-center gap-2"
                      >
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={0}
                            className="w-14 h-14 text-lg"
                          />
                          <InputOTPSlot
                            index={1}
                            className="w-14 h-14 text-lg"
                          />
                          <InputOTPSlot
                            index={2}
                            className="w-14 h-14 text-lg"
                          />
                          <InputOTPSlot
                            index={3}
                            className="w-14 h-14 text-lg"
                          />
                        </InputOTPGroup>
                      </InputOTP>

                      {verificationStatus === "error" && (
                        <p className="text-sm font-medium text-red-500">
                          Invalid OTP
                        </p>
                      )}

                      <div className="text-sm text-center">
                        <p className="text-muted-foreground">
                          {canResend ? (
                            <button
                              type="button"
                              onClick={handleResendOTP}
                              disabled={isResending}
                              className="text-primary hover:text-primary/80 underline underline-offset-4 disabled:opacity-50"
                            >
                              {isResending ? (
                                <>
                                  <Loader2 className="w-3 h-3 inline animate-spin mr-1" />
                                  Resending...
                                </>
                              ) : (
                                "Resend code"
                              )}
                            </button>
                          ) : (
                            <span>Resend code in {timer}s</span>
                          )}
                        </p>
                      </div>

                      <Button
                        type="button"
                        onClick={handleVerifyOTP}
                        disabled={otp.length !== 4 || isVerifying}
                        className="w-full"
                      >
                        {isVerifying ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          "Verify Email"
                        )}
                      </Button>

                      <button
                        type="button"
                        onClick={() => setStep("details")}
                        className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4"
                      >
                        Change email address
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </form>

          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            By signing up, you agree to our{" "}
            <Link to="/terms-condition" target="_blank" rel="noreferrer">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy-policy" target="_blank" rel="noreferrer">
              Privacy Policy
            </Link>
            .
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignUpForm;
