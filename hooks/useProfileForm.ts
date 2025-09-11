import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";

export const profileSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Current password is required to set a new password",
      path: ["currentPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export type ProfileFormData = z.infer<typeof profileSchema>;

export function useProfileForm() {
  const { user } = useAuth();
  const { profile, updateProfile } = useUserProfile();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || user?.displayName || "",
      email: profile?.email || user?.email || "",
    },
  });

  useEffect(() => {
    if (profile || user) {
      reset({
        name: profile?.name || user?.displayName || "",
        email: profile?.email || user?.email || "",
      });
    }
  }, [user, profile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Use optimistic update from useUserProfile hook
      const success = await updateProfile({
        name: data.name,
        email: data.email,
      });

      if (!success) {
        // Error already handled by useUserProfile hook
        return;
      }

      // Handle password update separately if provided
      if (data.newPassword && data.currentPassword) {
        const response = await fetch("/api/user/password", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await user?.getIdToken()}`,
          },
          credentials: "include",
          body: JSON.stringify({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to update password");
        }

        toast.success("Password updated successfully");

        // Clear password fields
        reset({
          name: data.name,
          email: data.email,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    profile,
  };
}
