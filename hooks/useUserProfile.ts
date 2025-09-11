import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { updateProfile } from "firebase/auth";

export interface UserProfile {
  name: string;
  email: string;
  photoURL?: string;
}

export function useUserProfile() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize profile from Firebase user
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || undefined,
      });
    } else {
      setProfile(null);
    }
    setLoading(false);
  }, [user]);

  const updateUserProfile = useCallback(
    async (updates: Partial<UserProfile>): Promise<boolean> => {
      if (!user || !profile) {
        showError("Error", "User not authenticated");
        return false;
      }

      // Store previous profile state for rollback
      const previousProfile = { ...profile };

      try {
        // OPTIMISTIC UPDATE: Update UI immediately
        const optimisticProfile = { ...profile, ...updates };
        setProfile(optimisticProfile);

        // Show immediate success feedback
        showSuccess(
          "Profile Updated",
          "Your profile has been updated successfully"
        );

        // Background server request
        if (updates.name || updates.photoURL) {
          // Update Firebase Auth profile
          await updateProfile(user, {
            displayName: updates.name || profile.name,
            photoURL: updates.photoURL || profile.photoURL || null,
          });
        }

        // Update profile in our backend
        const response = await fetch("/api/user", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
          credentials: "include",
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          // ROLLBACK: Restore previous state on server error
          setProfile(previousProfile);

          const errorData = await response.json().catch(() => ({}));
          showError(
            "Update Failed",
            errorData.message || "Server error - changes have been reverted"
          );
          return false;
        }

        // Success - profile is already updated optimistically
        console.log("✅ Profile updated successfully on server");
        return true;
      } catch (error) {
        // ROLLBACK: Restore previous state on any error
        setProfile(previousProfile);

        console.error("Failed to update profile:", error);
        showError(
          "Update Failed",
          "Network error - changes have been reverted. Please try again."
        );
        return false;
      }
    },
    [user, profile, showSuccess, showError]
  );

  return {
    profile,
    loading,
    updateProfile: updateUserProfile,
  };
}
