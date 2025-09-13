import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-center space-y-8 mt-16">
      <div className="space-y-4">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700">
          Product Not Found
        </h2>
        <p className="text-gray-600 max-w-lg mx-auto text-lg">
          Sorry, the product you&apos;re looking for doesn&apos;t exist or has
          been removed from our catalog.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/products"
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Browse All Products
        </Link>
        <Link
          href="/"
          className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Back to Home
        </Link>
      </div>

      {/* Additional helpful links */}
      <div className="pt-8 border-t border-gray-200">
        <p className="text-gray-500 mb-4">You might also be interested in:</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/products/category/electronics"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Electronics
          </Link>
          <Link
            href="/products/category/jewelery"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Jewelry
          </Link>
          <Link
            href="/products/category/men's clothing"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Men&apos;s Clothing
          </Link>
          <Link
            href="/products/category/women's clothing"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Women&apos;s Clothing
          </Link>
        </div>
      </div>
    </div>
  );
}
