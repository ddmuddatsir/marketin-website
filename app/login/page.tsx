"use client";

import { useLoginPage } from "@/hooks/useLoginPage";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  const { error, isLoading, handleGoogleSignIn, handleEmailPasswordSubmit } =
    useLoginPage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm
        error={error}
        isLoading={isLoading}
        onEmailPasswordSubmit={handleEmailPasswordSubmit}
        onGoogleSignIn={handleGoogleSignIn}
      />
    </div>
  );
}
