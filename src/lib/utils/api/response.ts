import { NextResponse } from "next/server";

export const createResponse = <T>(
  data: T,
  statusCode: number = 200,
  headers?: Record<string, string>
) => {
  return NextResponse.json(data, {
    status: statusCode,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
};

export const createPaginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  headers?: Record<string, string>
) => {
  const totalPages = Math.ceil(total / limit);
  const nextPage = page < totalPages ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;

  const linkHeader = [
    prevPage &&
      `<http://localhost:3000/api?page=${prevPage}&limit=${limit}>; rel="prev"`,
    nextPage &&
      `<http://localhost:3000/api?page=${nextPage}&limit=${limit}>; rel="next"`,
  ]
    .filter(Boolean)
    .join(", ");

  return createResponse(
    {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        nextPage,
        prevPage,
      },
    },
    200,
    {
      "X-Total-Count": total.toString(),
      "X-Total-Pages": totalPages.toString(),
      ...(linkHeader && { Link: linkHeader }),
      ...headers,
    }
  );
};
