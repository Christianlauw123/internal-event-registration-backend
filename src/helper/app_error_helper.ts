export class AppError extends Error {
  public statusCode: number;
  public error: string[] | null = null;

  constructor(message: string, error: string[] | null, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Bad Request", error: string[] | null = null) {
    super(message, error, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized", error: string[] | null = null) {
    super(message, error, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden", error: string[] | null = null) {
    super(message, error, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Not Found", error: string[] | null = null) {
    super(message, error, 404);
  }
}