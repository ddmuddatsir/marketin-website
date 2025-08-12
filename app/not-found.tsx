"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-md mx-auto text-center px-6">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-200 select-none">404</h1>
          <div className="relative -mt-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="h-16 w-16 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-gray-600 text-lg">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin halaman
            telah dipindahkan atau tidak pernah ada.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="w-full sm:w-auto" size="lg">
                <Home className="mr-2 h-4 w-4" />
                Kembali ke Beranda
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.history.back()}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Halaman Sebelumnya
            </Button>
          </div>

          {/* Search Suggestion */}
          <div className="mt-8 p-4 bg-white rounded-lg shadow-sm border">
            <h3 className="font-semibold text-gray-800 mb-2">
              Coba cari produk yang Anda inginkan:
            </h3>
            <Link href="/products">
              <Button variant="ghost" className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Jelajahi Semua Produk
              </Button>
            </Link>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            Butuh bantuan?{" "}
            <Link href="/contact" className="text-blue-600 hover:underline">
              Hubungi kami
            </Link>{" "}
            atau kembali ke{" "}
            <Link href="/" className="text-blue-600 hover:underline">
              halaman utama
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
