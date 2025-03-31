import { z } from "zod";
import type { PDFOptions, ScreenshotOptions } from "puppeteer";
import type { Protocol } from "puppeteer";

const LifeCycleEventSchema = z.enum([
  "load",
  "domcontentloaded",
  "networkidle0",
  "networkidle2",
]);

export const PageSetupOptionsSchema = z
  .object({
    viewport: z
      .object({
        width: z.number().int().positive(),
        height: z.number().int().positive(),
        deviceScaleFactor: z.number().positive().optional(),
        isMobile: z.boolean().optional(),
        hasTouch: z.boolean().optional(),
        isLandscape: z.boolean().optional(),
      })
      .optional(),
    emulateMediaType: z.enum(["screen", "print"]).optional(),
    waitForSelector: z.string().optional(),
    waitForTimeout: z.number().int().positive().optional().default(30000),
    waitUntil: z
      .union([LifeCycleEventSchema, z.array(LifeCycleEventSchema)])
      .optional()
      .default("networkidle0"),
    cookies: z
      .array(
        z.object({
          name: z.string(),
          value: z.string(),
          url: z.string().url().optional(),
          domain: z.string().optional(),
          path: z.string().optional(),
          expires: z.number().optional(),
          httpOnly: z.boolean().optional(),
          secure: z.boolean().optional(),
          sameSite: z.enum(["Strict", "Lax", "None"]).optional(),
        }) satisfies z.ZodType<Protocol.Network.CookieParam>
      )
      .optional(),
    extraHTTPHeaders: z.record(z.string()).optional(),
    javascriptEnabled: z.boolean().optional(),
    userAgent: z.string().optional(),
    evaluateScript: z.string().optional(),
  })
  .strict()
  .optional();

export const PdfOutputOptionsSchema = z
  .object({
    scale: z.number().positive().optional(),
    displayHeaderFooter: z.boolean().optional(),
    headerTemplate: z.string().optional(),
    footerTemplate: z.string().optional(),
    printBackground: z.boolean().optional().default(true),
    landscape: z.boolean().optional().default(false),
    pageRanges: z.string().optional(),
    format: z
      .enum([
        "Letter",
        "Legal",
        "Tabloid",
        "Ledger",
        "A0",
        "A1",
        "A2",
        "A3",
        "A4",
        "A5",
        "A6",
      ])
      .optional()
      .default("A4"),
    width: z.string().or(z.number()).optional(),
    height: z.string().or(z.number()).optional(),
    margin: z
      .object({
        top: z.string().or(z.number()).optional(),
        right: z.string().or(z.number()).optional(),
        bottom: z.string().or(z.number()).optional(),
        left: z.string().or(z.number()).optional(),
      })
      .optional()
      .default({ top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" }),
    preferCSSPageSize: z.boolean().optional(),
    omitBackground: z.boolean().optional(),
    tagged: z.boolean().optional(),
    timeout: z.number().int().nonnegative().optional(),
  })
  .strict()
  .optional();

export const ScreenshotOutputOptionsSchema = z
  .object({
    quality: z.number().int().min(0).max(100).optional(),
    fullPage: z.boolean().optional().default(true),
    clip: z
      .object({
        x: z.number(),
        y: z.number(),
        width: z.number().positive(),
        height: z.number().positive(),
      })
      .optional(),
    omitBackground: z.boolean().optional().default(false),
    encoding: z.enum(["base64", "binary"]).optional().default("binary"),
    captureBeyondViewport: z.boolean().optional(),
    fromSurface: z.boolean().optional(),
    timeout: z.number().int().nonnegative().optional(),
  })
  .strict()
  .optional();

export const ConversionRequestSchema = z
  .object({
    html: z.string().optional(),
    url: z.string().url().optional(),

    outputFormat: z.enum(["pdf", "png", "jpeg", "webp"]),

    filename: z.string().optional(),

    pageSetupOptions: PageSetupOptionsSchema,

    pdfOptions: PdfOutputOptionsSchema,
    screenshotOptions: ScreenshotOutputOptionsSchema,
  })
  .refine((data) => data.html || data.url, {
    message: "Either 'html' or 'url' must be provided",
    path: ["html"],
  })
  .refine((data) => !(data.html && data.url), {
    message: "Provide either 'html' or 'url', not both",
    path: ["html"],
  })
  .refine(
    (data) => {
      if (
        (data.outputFormat === "jpeg" || data.outputFormat === "webp") &&
        data.screenshotOptions?.quality !== undefined
      )
        return true;
      if (
        data.outputFormat === "png" &&
        data.screenshotOptions?.quality !== undefined
      )
        return false;
      return true;
    },
    {
      message:
        "'quality' option is only applicable for 'jpeg' or 'webp' output formats",
      path: ["screenshotOptions", "quality"],
    }
  );

export type ConversionRequest = z.infer<typeof ConversionRequestSchema>;
export type PageSetupOptions = z.infer<typeof PageSetupOptionsSchema>;

export type PdfOutputOptions = z.infer<typeof PdfOutputOptionsSchema>;
export type ScreenshotOutputOptions = z.infer<
  typeof ScreenshotOutputOptionsSchema
>;

export type ValidPDFOptions = Omit<PDFOptions, "path">;
export type ValidScreenshotOptions = Omit<ScreenshotOptions, "path" | "type">;

export type PdfOptions = z.infer<typeof PdfOutputOptionsSchema>;
export type ImageOptions = z.infer<typeof ScreenshotOutputOptionsSchema>;
