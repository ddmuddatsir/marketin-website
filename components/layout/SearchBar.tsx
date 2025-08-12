"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaSearch, FaSpinner } from "react-icons/fa";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SafeImage } from "@/components/ui/SafeImage";
import { SearchResponse } from "@/types/search";

const searchProducts = async (query: string) => {
  const { data } = await axios.get<SearchResponse>(`/api/products`, {
    params: {
      search: query,
      limit: 5,
      skip: 0,
    },
  });
  return data;
};

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedSearch = useDebounce(search, 200);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search", debouncedSearch],
    queryFn: () => searchProducts(debouncedSearch),
    enabled: debouncedSearch.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  const handleSearch = (query?: string) => {
    const q = query || search;
    if (q.trim()) {
      router.push(`/products?q=${encodeURIComponent(q.trim())}`);
      setShowSuggestions(false);
      setSearch("");
    }
  };

  const handleProductClick = (product: {
    id: string | number;
    title: string;
  }) => {
    // Navigate directly to product detail page
    router.push(`/products/${product.id}`);
    setShowSuggestions(false);
    setSearch("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (selectedIndex >= 0 && searchResults?.products?.[selectedIndex]) {
        // Navigate to selected product detail page
        handleProductClick(searchResults.products[selectedIndex]);
      } else {
        // Search for the typed query
        handleSearch();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < (searchResults?.products?.length ?? 0) - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setShowSuggestions(value.length > 0);
    setSelectedIndex(-1);
  };

  const products = searchResults?.products ?? [];

  return (
    <div className="relative flex flex-col w-full max-w-xl">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (search.length > 0) setShowSuggestions(true);
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pr-10"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <FaSpinner className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        <Button onClick={() => handleSearch()}>
          <FaSearch className="h-4 w-4" />
        </Button>
      </div>

      {showSuggestions && search.length > 0 && (
        <div className="absolute z-50 top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <FaSpinner className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : products.length > 0 ? (
            products.map((product, index) => (
              <div
                key={product.id}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50",
                  selectedIndex === index && "bg-gray-50"
                )}
                onMouseDown={() => handleProductClick(product)}
              >
                <div className="relative w-12 h-12 flex-shrink-0">
                  {product.thumbnail ? (
                    <SafeImage
                      src={product.thumbnail}
                      alt={product.title}
                      width={48}
                      height={48}
                      className="object-cover rounded-md w-full h-full"
                      sizes="48px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{product.title}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {product.brand} • ${product.price}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No products found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
