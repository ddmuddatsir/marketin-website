import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Search } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-6">
        {/* Product Icon */}
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Produk Tidak Ditemukan
          </h1>
          <p className="text-gray-600">
            Produk yang Anda cari tidak tersedia atau mungkin telah dihapus dari
            katalog kami.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button className="w-full sm:w-auto" size="lg">
                <Search className="mr-2 h-4 w-4" />
                Lihat Semua Produk
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.history.back()}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          </div>
        </div>

        {/* Product Categories */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-3">
            Jelajahi Kategori Produk:
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/products/category/electronics">
              <Button variant="ghost" size="sm" className="w-full">
                Elektronik
              </Button>
            </Link>
            <Link href="/products/category/fashion">
              <Button variant="ghost" size="sm" className="w-full">
                Fashion
              </Button>
            </Link>
            <Link href="/products/category/home">
              <Button variant="ghost" size="sm" className="w-full">
                Rumah
              </Button>
            </Link>
            <Link href="/products/category/sports">
              <Button variant="ghost" size="sm" className="w-full">
                Olahraga
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
