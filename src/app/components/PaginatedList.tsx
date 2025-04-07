"use client";

import { useState } from "react";
import useSWR from "swr";

type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export default function PaginatedList<T>({
  url,
  renderItem,
}: {
  url: string;
  renderItem: (item: T) => React.ReactNode;
}) {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR<PaginatedResponse<T>>(
    `${url}?page=${page}&limit=${limit}&search=${search}&sort=${sort}&order=${order}`,
    fetcher
  );

  if (isLoading) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-4 text-red-500">
        Error: {error.message}
      </div>
    );
  if (!data) return null;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSort = (field: string) => {
    if (field === sort) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSort(field);
      setOrder("asc");
    }
    setPage(1);
  };

  const { totalPages } = data.pagination;

  return (
    <div className="w-full">
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search..."
          onChange={handleSearch}
          value={search}
          className="px-4 py-2 border rounded-lg"
        />
        <button
          onClick={() => handleSort("name")}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100"
        >
          Sort by Name {sort === "name" && (order === "asc" ? "↑" : "↓")}
        </button>
      </div>

      <div className="grid gap-4 mb-4">
        {data.data.map((item, index) => (
          <div key={index}>{renderItem(item)}</div>
        ))}
      </div>

      <div className="flex justify-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded-lg border disabled:opacity-50"
        >
          Previous
        </button>

        <span className="px-4 py-2">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 rounded-lg border disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
