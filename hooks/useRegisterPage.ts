import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export function useRegisterPage() {
  const router = useRouter();
  const { signInWithGoogle } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signInWithGoogle();
      router.push("/");
    } catch (error) {
      setError("Failed to sign up with Google");
      console.error("Google sign-up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailPasswordSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError(
      "Email/password registration not implemented yet. Please use Google sign-up."
    );
  };

  return {
    error,
    isLoading,
    handleGoogleSignUp,
    handleEmailPasswordSubmit,
    setError,
  };
}
