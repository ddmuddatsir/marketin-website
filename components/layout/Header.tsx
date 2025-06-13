import Link from "next/link";
import SearchBar from "./SearchBar";
import { FaStore, FaShoppingCart, FaUserAlt } from "react-icons/fa";

export default function Header() {
  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 text-blue-600 text-2xl font-bold">
          <FaStore />
          <Link href="/">Marketin</Link>
        </div>

        {/* Search */}
        <SearchBar />

        {/* Icons */}
        <div className="flex gap-4 items-center text-gray-700 text-lg">
          <Link href="/cart" className="hover:text-blue-600" title="Cart">
            <FaShoppingCart />
          </Link>
          <Link href="/account" className="hover:text-blue-600" title="Account">
            <FaUserAlt />
          </Link>
        </div>
      </div>
    </header>
  );
}
