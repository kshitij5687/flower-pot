// ──────────────────────────────────────────────────────────────
//  ApiError — Custom error class for operational errors.
//
//  WHY:  Express's default error handling sends plain text.
//        This class lets every controller throw a structured
//        error with a status code, message, and optional array
//        of field-level errors (e.g. validation failures).
//
//  USAGE:
//    throw new ApiError(404, "Product not found");
//    throw new ApiError(400, "Validation failed", validationErrors);
//
//  The global error middleware (error.middleware.ts) catches
//  these and sends a uniform JSON response to the client.
// ──────────────────────────────────────────────────────────────

class ApiError extends Error {
  statusCode: number;
  data: null;
  success: boolean;
  errors: any[];

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: any[] = [],
    stack: string = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.errors = errors;

    // If a stack trace is provided, use it; otherwise capture it
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
