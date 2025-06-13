import { categories } from "@/data/categories";
import Link from "next/link";
import React from "react";

const CategoryList = () => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 justify-center my-8">
      {categories.map((categorie) => (
        <Link
          key={categorie.name}
          href={`/products/category/${categorie.name}`}
          className="flex flex-col items-center p-3 rounded-xl border shadow hover:bg-gray-100 transition"
        >
          <div className="text-2xl text-blue-600">{categorie.icon}</div>
          <span className="text-sm capitalize mt-1">{categorie.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
