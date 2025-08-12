"use client";

import { useRegisterPage } from "@/hooks/useRegisterPage";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  const { error, isLoading, handleGoogleSignUp, handleEmailPasswordSubmit } =
    useRegisterPage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <RegisterForm
        error={error}
        isLoading={isLoading}
        onEmailPasswordSubmit={handleEmailPasswordSubmit}
        onGoogleSignUp={handleGoogleSignUp}
      />
    </div>
  );
}
