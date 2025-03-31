import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ConversionRequestSchema } from "../schemas/render.schema";

export const validateRenderRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const result = ConversionRequestSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        error: "Validation Error",
        details: result.error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
          code: err.code,
        })),
      });
      return;
    }

    req.body = result.data;
    next();
  } catch (error) {
    console.error("Validation error:", error);
    next(error);
  }
};
