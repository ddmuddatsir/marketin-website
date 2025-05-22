"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!search.trim()) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const res = await fetch(
          `https://dummyjson.com/products/search?q=${encodeURIComponent(
            search
          )}`
        );
        const data = await res.json();
        // Ambil judul produk, batasi max 5
        const productNames = data.products.map((p: any) => p.title).slice(0, 5);
        setSuggestions(productNames);
        setShowSuggestions(productNames.length > 0);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  // Handle search, bisa juga dari klik suggestion
  const handleSearch = (query?: string) => {
    const q = query || search;
    if (q.trim()) {
      router.push(`/products?q=${encodeURIComponent(q.trim())}`);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative flex flex-col w-full max-w-xl">
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          // Saat input blur, sembunyikan suggestion dengan delay supaya klik list masih terbaca
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          className="flex-1"
        />
        <Button onClick={() => handleSearch()}>
          <FaSearch className="h-4 w-4" />
        </Button>
      </div>

      {/* List suggestion */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-10 bg-white border border-gray-200 rounded shadow-md w-full max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              // onMouseDown supaya klik bisa terbaca sebelum blur
              onMouseDown={() => handleSearch(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
