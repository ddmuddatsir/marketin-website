"use client";

import { useState } from "react";
import Link from "next/link";
import SearchBar from "./SearchBar";
import {
  FaUserAlt,
  FaBars,
  FaShoppingCart,
  FaHeart,
  FaSignInAlt,
} from "react-icons/fa";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useCartCount } from "@/hooks/useCartCount";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartCount = useCartCount();
  const { wishlist } = useWishlist();
  const { user } = useAuth();

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 py-4">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 text-blue-600 text-xl font-bold">
            <Link href="/">Marketin</Link>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-2xl">
            <SearchBar />
          </div>

          {/* Icons */}
          <div className="flex gap-4 items-center text-gray-700 text-lg">
            <Link
              href="/cart"
              className="hover:text-blue-600 relative"
              title="Cart"
            >
              <FaShoppingCart />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1 min-w-[18px] h-[18px] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              href="/wishlist"
              className="hover:text-pink-600 relative"
              title="Wishlist"
            >
              <FaHeart />
              {wishlist && wishlist.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full px-1 min-w-[18px] h-[18px] flex items-center justify-center">
                  {wishlist.items.length}
                </span>
              )}
            </Link>
            {/* Auth Section */}
            {user ? (
              <Link
                href="/account/orders"
                className="hover:text-blue-600"
                title="Account"
              >
                <FaUserAlt />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/register"
                  className="text-blue-600 hover:text-blue-700 px-3 py-1 rounded-md border border-blue-600 hover:bg-blue-50 transition-colors text-sm font-medium"
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition-colors text-sm font-medium"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 text-blue-600 text-2xl font-bold">
            <Link href="/">Marketin</Link>
          </div>

          {/* Mobile Icons & Menu */}
          <div className="flex items-center gap-3">
            {/* Cart Icon */}
            <Link
              href="/cart"
              className="hover:text-blue-600 relative"
              title="Cart"
            >
              <FaShoppingCart className="text-lg" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1 min-w-[18px] h-[18px] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="hover:text-pink-600 relative"
              title="Wishlist"
            >
              <FaHeart className="text-lg" />
              {wishlist && wishlist.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full px-1 min-w-[18px] h-[18px] flex items-center justify-center">
                  {wishlist.items.length}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <FaBars className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-6 py-4">
                  {/* Search */}
                  <div className="px-2">
                    <SearchBar />
                  </div>

                  {/* Navigation Links */}
                  <nav className="flex flex-col gap-4 px-2">
                    {user ? (
                      <Link
                        href="/account/orders"
                        className="flex items-center gap-2 text-lg hover:text-blue-600"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <FaUserAlt />
                        <span>Account</span>
                      </Link>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <Link
                          href="/register"
                          className="flex items-center justify-center gap-2 text-lg text-blue-600 hover:text-blue-700 border border-blue-600 rounded-md py-2 hover:bg-blue-50 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <FaSignInAlt />
                          <span>Sign Up</span>
                        </Link>
                        <Link
                          href="/login"
                          className="flex items-center justify-center gap-2 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <FaSignInAlt />
                          <span>Sign In</span>
                        </Link>
                      </div>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
