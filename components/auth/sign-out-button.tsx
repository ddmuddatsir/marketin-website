"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/"); // Redirect to home page after sign out
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 text-xs font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-200"
      title="Sign out"
    >
      Sign Out
    </button>
  );
}
