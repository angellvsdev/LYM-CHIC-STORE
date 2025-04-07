"use client";

import PaginatedList from "../components/PaginatedList";
import { ProductSchema } from "@/types";
import { z } from "zod";

type Product = z.infer<typeof ProductSchema>;

export default function TestingPage() {
  const renderProduct = (product: Product) => (
    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <h3 className="font-medium text-lg">{product.name}</h3>
      <p className="text-gray-600 dark:text-gray-300 mt-2">
        {product.description}
      </p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-lg font-bold">${product.price}</span>
        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
          Category ID: {product.category_id}
        </span>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products List</h1>
      <PaginatedList<Product> url="/api/products" renderItem={renderProduct} />
    </div>
  );
}
