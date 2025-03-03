import { RequestHandler } from "express";
import { RenderService } from "./render.service";
import { AppError } from "../../middlewares/error.middleware";
import { PdfOptionsSchema, ImageOptionsSchema } from "./render.schema";
import path from "path";
import fs from "fs";
import { z } from "zod";

const renderService = new RenderService();

export const renderPDF: RequestHandler = async (req, res, next) => {
  try {
    const html = req.body.html;
    const options = req.body.options || {};

    if (!html || typeof html !== "string" || html.trim().length === 0) {
      throw new AppError(
        400,
        "HTML content is required and must be a valid string",
        "Invalid input data"
      );
    }

    await PdfOptionsSchema.parseAsync(options).catch((err: z.ZodError) => {
      throw new AppError(400, err.message, "Invalid PDF options");
    });

    const pdf = await renderService.generatePDF(html, options);

    if (!pdf || !Buffer.isBuffer(pdf) || pdf.length === 0) {
      throw new AppError(
        500,
        "Generated PDF is invalid or empty",
        "PDF generation failed"
      );
    }

    const filename = options.filename || "document.pdf";

    res.set({
      "Content-Type": "application/pdf",
      "Content-Length": pdf.length,
      "Content-Disposition": `attachment; filename="${filename}"`,
    });

    res.send(pdf);
  } catch (error) {
    next(error);
  }
};

export const renderImage: RequestHandler = async (req, res, next) => {
  try {
    const html = req.body.html;
    const options = req.body.options || {};

    if (!html || typeof html !== "string" || html.trim().length === 0) {
      throw new AppError(
        400,
        "HTML content is required and must be a valid string",
        "Invalid input data"
      );
    }

    await ImageOptionsSchema.parseAsync(options).catch((err: z.ZodError) => {
      throw new AppError(400, err.message, "Invalid image options");
    });

    const image = await renderService.generateImage(html, options);

    if (!image || !Buffer.isBuffer(image) || image.length === 0) {
      throw new AppError(
        500,
        "Generated image is invalid or empty",
        "Image generation failed"
      );
    }

    const type = options.type || "jpeg";
    const extension = type === "png" ? "png" : "jpg";
    const filename = options.filename || `image.${extension}`;
    const contentType = type === "png" ? "image/png" : "image/jpeg";

    res.set({
      "Content-Type": contentType,
      "Content-Length": image.length,
      "Content-Disposition": `attachment; filename="${filename}"`,
    });

    res.send(image);
  } catch (error) {
    next(error);
  }
};
