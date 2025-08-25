import Link from "next/link";
import { FaHeart, FaSignInAlt } from "react-icons/fa";

interface AuthRequiredMessageProps {
  message?: string;
  description?: string;
}

export function AuthRequiredMessage({
  message = "Login Required for Wishlist",
  description = "Please sign in to view and manage your wishlist items.",
}: AuthRequiredMessageProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <FaHeart className="w-16 h-16 text-gray-300" />
            <FaSignInAlt className="w-6 h-6 text-blue-500 absolute -bottom-1 -right-1 bg-white rounded-full p-1" />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">{message}</h3>

        <p className="text-gray-600 mb-6">{description}</p>

        <div className="space-y-3">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <FaSignInAlt className="w-4 h-4" />
            Sign In
          </Link>

          <div className="text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
