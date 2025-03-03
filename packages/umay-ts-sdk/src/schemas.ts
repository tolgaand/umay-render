// src/schemas.ts
import { z } from "zod";

export const PdfOptionsSchema = z.object({
  format: z.enum(["A4", "Letter"]).default("A4"),
  landscape: z.boolean().default(false),
  printBackground: z.boolean().default(true).optional(),
  margin: z
    .object({
      top: z.string().default("20mm"),
      right: z.string().default("20mm"),
      bottom: z.string().default("20mm"),
      left: z.string().default("20mm"),
    })
    .optional(),
});

export const ViewportSchema = z.object({
  width: z.number().default(1920),
  height: z.number().default(1080),
  deviceScaleFactor: z.number().min(1).max(3).default(2),
});

export const ImageOptionsSchema = z.object({
  quality: z.number().min(1).max(100).default(100),
  fullPage: z.boolean().default(true),
  viewport: ViewportSchema.optional(),
});

export type PdfOptions = z.infer<typeof PdfOptionsSchema>;
export type ImageOptions = {
  quality?: number;
  fullPage?: boolean;
  viewport?: {
    width: number;
    height: number;
    deviceScaleFactor: number;
  };
};
