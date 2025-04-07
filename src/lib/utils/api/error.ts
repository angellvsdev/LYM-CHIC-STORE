export class APIError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

export const createError = (
  message: string,
  statusCode: number,
  code: string
) => {
  return new APIError(message, statusCode, code);
};

export const handleError = (error: unknown) => {
  if (error instanceof APIError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    };
  }

  console.error("Unhandled error:", error);
  return {
    message: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    statusCode: 500,
  };
};
