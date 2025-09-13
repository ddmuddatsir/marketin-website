import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { Providers } from "./providers";
import ToastContainer from "@/components/ui/ToastContainer";

// Force dynamic rendering for all pages
export const dynamic = "force-dynamic";
export const revalidate = 0;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marketin - Your Complete E-commerce Store",
  description:
    "Discover amazing products with fast delivery, secure checkout, and excellent customer service. Shop electronics, fashion, home & garden, and more at unbeatable prices.",
  metadataBase: new URL("http://localhost:3000"),
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: [{ url: "/favicon.svg", sizes: "180x180", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Marketin - Your Complete E-commerce Store",
    description:
      "Discover amazing products with fast delivery, secure checkout, and excellent customer service.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marketin - Your Complete E-commerce Store",
    description:
      "Discover amazing products with fast delivery, secure checkout, and excellent customer service.",
  },
  keywords: [
    "e-commerce",
    "online shopping",
    "products",
    "fashion",
    "electronics",
    "home",
    "garden",
    "delivery",
  ],
  authors: [{ name: "Marketin Team" }],
  creator: "Marketin",
  publisher: "Marketin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <AuthProvider>
            <ToastProvider>
              <Header />
              {children}
              <Footer />
              <ToastContainer />
            </ToastProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
