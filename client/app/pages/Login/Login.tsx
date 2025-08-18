// Import dependencies
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form"; // Import Controller
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, verifyEmail } from "@/api/authService";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { AxiosError } from "axios";
import { store } from "@/store/store";
import { persistLogin, setAccessToken } from "@/store/auth/authSlice";
import type { ErrorResponse } from "@/types/auth";

// Define schema with zod
const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  otp: z
    .string()
    .optional()
    .refine(
      (value) => !value || /^\d{4}$/.test(value),
      "OTP must be a 4-digit number"
    ),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [otpVisible, setOtpVisible] = useState<boolean>(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await signIn(data);
      if (!response.data.isVerified) {
        setOtpVisible(true);
      } else {
        // Store access token in localStorage
        localStorage.setItem("accessToken", response.data.accessToken);

        store.dispatch(setAccessToken(response.data.accessToken));
        store.dispatch(persistLogin(response.data));

        localStorage.setItem("role", response.data.role);
        if (response.data.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
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

  const handleVerifyOtp = async () => {
    const otp = watch("otp");
    try {
      const response = await verifyEmail({ otp });
      if (response.data.success && response.data.Code === "VERIFIED") {
        navigate("/");
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Link
              to="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="w-12 h-12 bg-gradient-to-tr from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                {/* <Cog className="" /> */}
                <img
                  src="https://i.ibb.co/ymr4kp0f/CNER-LAB-LOGO.jpg"
                  className="text-white w-8 h-8"
                  alt="CNER LAB Logo"
                />
              </div>
              <span className="sr-only">CNER LAB</span>
            </Link>
            <h1 className="text-xl font-bold">Welcome to CNER LAB</h1>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/auth/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
            {errors.root && (
              <div className="flex items-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
                <AlertCircle className="w-5 h-5 mr-3" />
                <span>{errors.root.message}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-6">
            {!otpVisible && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="usn@bmsit.in"
                    {...register("email")}
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Your password"
                      {...register("password")}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}{" "}
                  Login
                </Button>
              </>
            )}

            {otpVisible && (
              <div className="grid gap-2">
                <div className="space-y-2 text-center">
                  <h2 className="text-lg font-semibold">Verify your email</h2>
                  <p className="text-sm text-muted-foreground text-green-700">
                    We've sent a verification code to registerd mail!
                    <br />
                  </p>
                </div>

                <Controller
                  name="otp"
                  control={control}
                  render={({ field }) => (
                    <InputOTP
                      value={field.value || ""}
                      onChange={(value) => field.onChange(value)}
                      maxLength={4}
                      containerClassName="group flex items-center gap-2 justify-center"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="w-14 h-14 text-lg" />
                        <InputOTPSlot index={1} className="w-14 h-14 text-lg" />
                        <InputOTPSlot index={2} className="w-14 h-14 text-lg" />
                        <InputOTPSlot index={3} className="w-14 h-14 text-lg" />
                      </InputOTPGroup>
                    </InputOTP>
                  )}
                />
                {errors.otp && (
                  <p className="text-sm text-red-500">{errors.otp.message}</p>
                )}

                <Button onClick={handleVerifyOtp} className="w-full">
                  Verify OTP and Login
                </Button>
              </div>
            )}
          </div>
        </div>
      </form>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our{" "}
        <Link to="/terms-condition">Terms of Service</Link> and{" "}
        <Link to="/privacy-policy">Privacy Policy</Link>.
      </div>
    </div>
  );
}

const Login = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm border-none shadow-lg p-5">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
