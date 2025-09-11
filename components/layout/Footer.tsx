"use client";

import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-10">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Marketin</h3>
            <p className="text-sm text-gray-600">
              Your trusted online marketplace for quality products. Discover
              amazing deals, add items to your wishlist, and enjoy seamless
              shopping experience.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-600 hover:text-blue-600">
                <FaFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600">
                <FaLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Shop</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/products" className="hover:text-blue-600">
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products/category/electronics"
                  className="hover:text-blue-600"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link
                  href="/products/category/clothing"
                  className="hover:text-blue-600"
                >
                  Clothing
                </Link>
              </li>
              <li>
                <Link
                  href="/products/category/home"
                  className="hover:text-blue-600"
                >
                  Home & Garden
                </Link>
              </li>
            </ul>
          </div>

          {/* Account & Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">My Account</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/login" className="hover:text-blue-600">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-blue-600">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-blue-600">
                  My Orders
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-blue-600">
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-blue-600">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <p className="font-medium">Customer Service</p>
                <p>Email: support@marketin.com</p>
                <p>Phone: +1 (555) 123-4567</p>
              </div>
              <div>
                <p className="font-medium">Business Hours</p>
                <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                <p>Sat - Sun: 10:00 AM - 4:00 PM</p>
              </div>
              <div>
                <p className="font-medium">Quick Help</p>
                <Link
                  href="/account/profile"
                  className="block hover:text-blue-600"
                >
                  Account Settings
                </Link>
                <Link href="/checkout" className="block hover:text-blue-600">
                  Checkout Help
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Marketin E-commerce Platform.
              All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-600">
              <Link href="/account/addresses" className="hover:text-blue-600">
                Shipping Info
              </Link>
              <Link href="/order-success" className="hover:text-blue-600">
                Order Tracking
              </Link>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">Secure Shopping</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
