import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export function useLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInWithGoogle, user, loading: authLoading } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  const callbackUrl = searchParams?.get("callbackUrl") || "/";

  // Redirect if already logged in
  useEffect(() => {
    console.log("Login: Auth state -", {
      authLoading,
      user: user?.email,
      userExists: !!user,
      hasRedirected,
      callbackUrl,
    });

    if (!authLoading && user && !hasRedirected) {
      console.log("User already logged in, redirecting to:", callbackUrl);
      setHasRedirected(true);
      setTimeout(() => {
        router.replace(callbackUrl);
      }, 100);
    }
  }, [user, router, callbackUrl, authLoading, hasRedirected]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signInWithGoogle();
      console.log("Google sign-in successful, redirecting to:", callbackUrl);
      setTimeout(() => {
        router.replace(callbackUrl);
      }, 500);
    } catch (error) {
      setError("Failed to sign in with Google");
      console.error("Google sign-in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailPasswordSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError(
      "Email/password login not implemented yet. Please use Google sign-in."
    );
  };

  return {
    error,
    isLoading,
    handleGoogleSignIn,
    handleEmailPasswordSubmit,
    setError,
  };
}
