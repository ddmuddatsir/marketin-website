import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Handle API routes
  if (pathname.startsWith("/api/")) {
    // Let API routes handle their own 404s
    return NextResponse.next();
  }

  // Handle specific redirects for common misspellings or old routes
  const redirects: Record<string, string> = {
    "/product": "/products",
    "/shop": "/products",
    "/store": "/products",
    "/buy": "/products",
    "/profile": "/account/profile",
    "/settings": "/account/profile",
    "/account": "/account/orders", // Redirect account root to orders
    "/my-orders": "/account/orders",
    "/order-history": "/account/orders",
    "/orders": "/account/orders",
    "/shopping-cart": "/cart",
    "/basket": "/cart",
    "/checkout-page": "/checkout",
    "/login-page": "/login",
    "/register-page": "/register",
    "/sign-up": "/register",
    "/sign-in": "/login",
  };

  if (redirects[pathname]) {
    return NextResponse.redirect(new URL(redirects[pathname], request.url));
  }

  // Handle product ID validation
  if (pathname.match(/^\/products\/[^\/]+$/)) {
    const productId = pathname.split("/")[2];

    // Check if product ID is not a number
    if (productId && isNaN(Number(productId))) {
      // For non-numeric product IDs, redirect to products page
      return NextResponse.redirect(new URL("/products", request.url));
    }
  }

  // Handle order ID routes - redirect to account/orders
  if (pathname.match(/^\/orders\/[^\/]+$/)) {
    const orderId = pathname.split("/")[2];

    // Redirect all order detail pages to account section
    return NextResponse.redirect(
      new URL(`/account/orders/${orderId}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
