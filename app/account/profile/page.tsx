"use client";

import { AccountLayout } from "@/components/account/AccountLayout";
import { Profile } from "@/components/account/Profile";

// Disable static generation for auth-required pages
export const dynamic = "force-dynamic";

export default function AccountProfilePage() {
  return (
    <AccountLayout>
      <div className="p-6">
        <div className="max-w-4xl">
          <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
          <Profile />
        </div>
      </div>
    </AccountLayout>
  );
}
