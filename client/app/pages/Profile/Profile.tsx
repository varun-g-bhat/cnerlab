import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
  Mail,
  Calendar,
} from "lucide-react";
import { getUserProfile, updateUserProfile } from "@/api/authService";
import { AxiosError } from "axios";
import type { ErrorResponse } from "@/types/auth";

// Profile form schema
const profileSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional().or(z.literal("")),
});

type ProfileFormInputs = z.infer<typeof profileSchema>;

interface UserProfile {
  id: string;
  username: string;
  email: string;
  image?: string;
  role: string;
  createdAt: string;
}

function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateStatus, setUpdateStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormInputs>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfile();
        const userData = response.data;
        setProfile(userData);

        // Set form values
        setValue("username", userData.username);
        setValue("email", userData.email);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setUpdateStatus("error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setValue]);

  const onSubmit = async (data: ProfileFormInputs) => {
    try {
      setUpdateStatus("idle");

      // Remove password if it's empty
      const updateData = { ...data };
      if (!updateData.password) {
        delete updateData.password;
      }

      const response = await updateUserProfile(updateData);

      if (response.data) {
        setSuccessMessage("Profile updated successfully!");
        setUpdateStatus("success");

        // Update local profile state
        if (profile) {
          setProfile({
            ...profile,
            username: data.username,
            email: data.email,
          });
        }

        // Clear password field
        setValue("password", "");

        // Reset success message after 3 seconds
        setTimeout(() => setUpdateStatus("idle"), 3000);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response && axiosError.response.data) {
        const backendError = axiosError.response.data.message;
        setError("root", { message: backendError });
      } else {
        setError("root", { message: "Failed to update profile" });
      }
      setUpdateStatus("error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load profile information.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const avatarSrc = profile.image
    ? `data:image/svg+xml;base64,${btoa(profile.image)}`
    : "";

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={avatarSrc} />
          <AvatarFallback className="text-lg">
            {profile.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{profile.username}</h1>
          <p className="text-muted-foreground">{profile.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">
              Member since {new Date(profile.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Username</Label>
              <p className="text-sm font-medium">{profile.username}</p>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <p className="text-sm font-medium">{profile.email}</p>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <p className="text-sm font-medium capitalize">{profile.role}</p>
            </div>
            <div className="space-y-2">
              <Label>Account Created</Label>
              <p className="text-sm font-medium">
                {new Date(profile.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Edit Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            {updateStatus === "success" && (
              <Alert className="mb-4 bg-emerald-50 text-emerald-600 border-emerald-200">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            {errors.root && (
              <Alert className="mb-4 bg-red-50 text-red-600 border-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.root.message}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" type="text" {...register("username")} />
                {errors.username && (
                  <p className="text-sm text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  New Password (leave blank to keep current)
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProfilePage;
