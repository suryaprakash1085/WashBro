/**
 * Custom API Error class
 */
export class APIError extends Error {
  constructor(
    public status: number,
    public message: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

/**
 * Error handling middleware
 */
export function errorHandler(err: any, req: any, res: any, next: any) {
  if (err instanceof APIError) {
    return res.status(err.status).json({
      success: false,
      error: {
        message: err.message,
        status: err.status,
      },
    });
  }

  console.error("Unhandled error:", err);

  res.status(500).json({
    success: false,
    error: {
      message: "Internal server error",
      status: 500,
    },
  });
}
