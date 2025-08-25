"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { CheckoutLoading } from "./CheckoutLoading";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ children, redirectTo = "/login" }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      const currentUrl = window.location.pathname + window.location.search;
      const callbackUrl = encodeURIComponent(currentUrl);
      router.replace(`${redirectTo}?callbackUrl=${callbackUrl}`);
    }
  }, [loading, user, router, redirectTo]);

  // Show loading while checking auth or redirecting
  if (loading || !user) {
    return <CheckoutLoading />;
  }

  return <>{children}</>;
}
