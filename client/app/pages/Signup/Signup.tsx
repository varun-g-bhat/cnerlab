import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { signUp } from "@/api/authService";
import { AxiosError } from "axios";
import { signUpSchema } from "@/validation/userSchema";
import type { ErrorResponse } from "@/types/auth";

// Type for the form inputs
type SignUpFormInputs = z.infer<typeof signUpSchema>;

type SignupStatus = "form" | "success" | "error";

function SignUpForm() {
  const [status, setStatus] = useState<SignupStatus>("form");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormInputs>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormInputs) => {
    try {
      const response = await signUp(data);

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setStatus("success");
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="border-none shadow-lg w-full max-w-md">
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
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

          {status === "success" ? (
            <div className="space-y-4 w-full">
              <Alert className="bg-emerald-50 text-emerald-600 border-emerald-200">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription className="ml-2">
                  {successMessage}
                </AlertDescription>
              </Alert>
              <Button asChild className="w-full">
                <Link to="/auth/login">Go to Login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}{" "}
                Create Account
              </Button>
            </form>
          )}

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
