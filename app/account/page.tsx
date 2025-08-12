"use client";

import { AccountLayout } from "@/components/account/AccountLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

// Disable static generation for auth-required pages
export const dynamic = "force-dynamic";

export default function AccountPage() {
  const { user } = useAuth();

  return (
    <AccountLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Account Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.displayName || user?.email || "User"}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>📦</span>
                Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                View your order history and track current orders.
              </p>
              <Link
                href="/account/orders"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View Orders →
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>👤</span>
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Update your personal information and preferences.
              </p>
              <Link
                href="/account/profile"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Edit Profile →
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>📍</span>
                Addresses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Manage your shipping and billing addresses.
              </p>
              <Link
                href="/account/addresses"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Manage Addresses →
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              href="/cart"
              className="inline-flex items-center px-3 py-1 border border-blue-600 text-blue-600 text-sm rounded-md hover:bg-blue-50 transition-colors"
            >
              View Cart
            </Link>
            <Link
              href="/wishlist"
              className="inline-flex items-center px-3 py-1 border border-blue-600 text-blue-600 text-sm rounded-md hover:bg-blue-50 transition-colors"
            >
              My Wishlist
            </Link>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
