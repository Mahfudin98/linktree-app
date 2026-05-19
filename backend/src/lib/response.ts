import type { Context } from "hono";

/**
 * Standard API response helper functions
 */
export function successResponse<T>(
  c: Context,
  data: T,
  message = "Success",
  status: 200 | 201 = 200
) {
  return c.json(
    {
      success: true,
      message,
      data,
    },
    status
  );
}

export function errorResponse(
  c: Context,
  message: string,
  status: 400 | 401 | 403 | 404 | 409 | 422 | 500 = 400,
  errors?: unknown
) {
  return c.json(
    {
      success: false,
      message,
      ...(errors ? { errors } : {}),
    },
    status
  );
}
