import { categories } from "@/data/categories";
import Link from "next/link";
import React from "react";

const CategoryList = () => {
  const formatCategoryName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div>
      {/* Mobile: Horizontal scroll */}
      <div className="sm:hidden">
        <div className="flex gap-3 overflow-x-auto pb-2 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {categories.map((categorie) => (
            <Link
              key={categorie.name}
              href={`/products/category/${categorie.name}`}
              className="flex flex-col items-center p-2 rounded-lg border shadow hover:bg-gray-100 transition-all duration-200 hover:shadow-md flex-shrink-0 min-w-[70px]"
            >
              <div className="text-lg text-blue-600 mb-1">{categorie.icon}</div>
              <span className="text-xs text-center leading-tight">
                {formatCategoryName(categorie.name)}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden sm:grid grid-cols-4 md:grid-cols-6 gap-4 justify-center my-8">
        {categories.map((categorie) => (
          <Link
            key={categorie.name}
            href={`/products/category/${categorie.name}`}
            className="flex flex-col items-center p-3 rounded-xl border shadow hover:bg-gray-100 transition-all duration-200 hover:shadow-md hover:scale-105"
          >
            <div className="text-2xl text-blue-600 mb-2">{categorie.icon}</div>
            <span className="text-sm text-center leading-tight">
              {formatCategoryName(categorie.name)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
