"use client";

import { AccountLayout } from "@/components/account/AccountLayout";
import { Address } from "@/components/account/Address";

// Disable static generation for auth-required pages
export const dynamic = "force-dynamic";

export default function AccountAddressesPage() {
  return (
    <AccountLayout>
      <div className="p-6">
        <div className="max-w-4xl">
          <h1 className="text-2xl font-bold mb-6">Manage Addresses</h1>
          <Address />
        </div>
      </div>
    </AccountLayout>
  );
}
