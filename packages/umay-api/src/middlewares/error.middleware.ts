import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public publicMessage?: string,
    public errorCode?: string
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        message: err.publicMessage || "An error occurred.",
        code: err.errorCode || "UNKNOWN_ERROR",
        ...(process.env.NODE_ENV !== "production" && {
          internal_message: err.message,
        }),
      },
      ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    });
  } else {
    console.error("Unexpected Error:", err);
    res.status(500).json({
      error: {
        message: "Internal Server Error",
        code: "INTERNAL_SERVER_ERROR",
        ...(process.env.NODE_ENV !== "production" && {
          internal_message: err.message,
        }),
      },
      ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    });
  }
};
