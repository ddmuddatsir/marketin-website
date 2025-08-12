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
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 justify-center my-8">
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
  );
};

export default CategoryList;
