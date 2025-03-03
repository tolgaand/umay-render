import { z } from "zod";

export const RenderPDFOptionsSchema = z
  .object({
    format: z.enum(["A4", "Letter"]).default("A4"),
    margin: z
      .object({
        top: z.string().default("20mm"),
        right: z.string().default("20mm"),
        bottom: z.string().default("20mm"),
        left: z.string().default("20mm"),
      })
      .optional(),
    landscape: z.boolean().default(false),
    printBackground: z.boolean().default(true),
  })
  .strict();

export const ViewportSchema = z
  .object({
    width: z.number().default(1920),
    height: z.number().default(1080),
    deviceScaleFactor: z.number().min(1).max(3).default(2),
  })
  .strict();

export const RenderImageOptionsSchema = z
  .object({
    type: z.enum(["png", "jpeg"]).default("jpeg"),
    quality: z.number().min(1).max(100).default(100),
    fullPage: z.boolean().default(true),
    viewport: ViewportSchema.optional(),
  })
  .strict();

export const RenderRequestSchema = z.object({
  html: z.string().min(1),
  options: z
    .union([RenderPDFOptionsSchema, RenderImageOptionsSchema])
    .optional(),
});
