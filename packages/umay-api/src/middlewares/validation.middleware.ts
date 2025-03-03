import { Request, Response, NextFunction } from "express";
import { RenderRequestSchema } from "../schemas/render.schema";
import { ZodError } from "zod";

export const validateRenderRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const result = RenderRequestSchema.safeParse(req.body);

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

    // Add the parsed and validated data to the request
    req.body = result.data;
    next();
  } catch (error) {
    console.error("Validation error:", error);
    next(error);
  }
};
