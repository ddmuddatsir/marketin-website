"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, ReactNode, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { SignOutButton } from "@/components/auth/sign-out-button";
import Link from "next/link";

interface AccountLayoutProps {
  children: ReactNode;
}

export function AccountLayout({ children }: AccountLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [authTimeout, setAuthTimeout] = useState(false);

  // Set timeout untuk auth loading agar tidak menunggu tanpa batas
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("AccountLayout: Auth timeout reached");
      setAuthTimeout(true);
    }, 3000); // 3 second timeout

    if (!loading) {
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    console.log("AccountLayout: Auth state -", {
      loading,
      user: user?.email,
      hasRedirected,
      authTimeout,
      pathname,
    });

    // Hanya dialihkan jika autentikasi dimuat (atau waktu habis), tidak ada pengguna, dan belum mengalihkan
    if ((!loading || authTimeout) && !user && !hasRedirected) {
      console.log("AccountLayout: Redirecting to login from:", pathname);
      setHasRedirected(true);
      // Gunakan default yang lebih spesifik untuk menghindari pengalihan middleware
      const fallbackPath = pathname?.startsWith("/account")
        ? pathname
        : "/account/orders";
      const callbackUrl = encodeURIComponent(fallbackPath);
      // Gunakan replace untuk mencegah loop tombol kembali
      router.replace(`/login?callbackUrl=${callbackUrl}`);
    }
  }, [loading, user, router, pathname, hasRedirected, authTimeout]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navigation = [
    {
      name: "Profile",
      href: "/account/profile",
      icon: "👤",
      current: pathname === "/account/profile",
    },
    {
      name: "Addresses",
      href: "/account/addresses",
      icon: "📍",
      current: pathname === "/account/addresses",
    },
    {
      name: "Orders",
      href: "/account/orders",
      icon: "📦",
      current: pathname?.startsWith("/account/orders"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">My Account</h2>
            <p className="text-sm text-gray-600 mt-1">
              {user.displayName || user.email}
            </p>
          </div>

          <nav className="p-6">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      item.current
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="absolute bottom-0 w-64 p-6 border-t bg-white">
            <SignOutButton />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
