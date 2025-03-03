import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public publicMessage?: string
  ) {
    super(message);
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
      error: err.publicMessage || err.message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  } else {
    console.error(err);
    res.status(500).json({
      error: "Internal Server Error",
      ...(process.env.NODE_ENV === "development" && { details: err.message }),
    });
  }
};
