import { z } from "zod";

// PDF options validation schema
export const PdfOptionsSchema = z.object({
  format: z
    .enum([
      "A0",
      "A1",
      "A2",
      "A3",
      "A4",
      "A5",
      "A6",
      "Letter",
      "Legal",
      "Tabloid",
      "Ledger",
    ])
    .optional(),
  landscape: z.boolean().optional(),
  margin: z
    .object({
      top: z.string().optional(),
      right: z.string().optional(),
      bottom: z.string().optional(),
      left: z.string().optional(),
    })
    .optional(),
  printBackground: z.boolean().optional(),
  filename: z.string().optional(),
});

// Image options validation schema
export const ImageOptionsSchema = z.object({
  type: z.enum(["jpeg", "png"]).optional(),
  quality: z.number().min(0).max(100).optional(),
  fullPage: z.boolean().optional(),
  omitBackground: z.boolean().optional(),
  filename: z.string().optional(),
  viewport: z
    .object({
      width: z.number().positive(),
      height: z.number().positive(),
      deviceScaleFactor: z.number().positive().optional(),
    })
    .optional(),
});

export type PdfOptions = z.infer<typeof PdfOptionsSchema>;
export type ImageOptions = z.infer<typeof ImageOptionsSchema>;
