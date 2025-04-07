"use client";

import useSWR from "swr";

export default function Posts() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWR(
    "https://jsonplaceholder.typicode.com/posts",
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

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-center sm:text-left">
        Posts
      </h2>
      <div className="grid gap-4">
        {data.map((post: { id: string; title: string }) => (
          <div
            key={post.id}
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <h3 className="font-medium">{post.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
