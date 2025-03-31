import { z } from "zod";

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
        })
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
    printBackground: z.boolean().optional(),
    landscape: z.boolean().optional(),
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
      .optional(),
    width: z.string().or(z.number()).optional(),
    height: z.string().or(z.number()).optional(),
    margin: z
      .object({
        top: z.string().or(z.number()).optional(),
        right: z.string().or(z.number()).optional(),
        bottom: z.string().or(z.number()).optional(),
        left: z.string().or(z.number()).optional(),
      })
      .optional(),
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
    fullPage: z.boolean().optional(),
    clip: z
      .object({
        x: z.number(),
        y: z.number(),
        width: z.number().positive(),
        height: z.number().positive(),
      })
      .optional(),
    omitBackground: z.boolean().optional(),
    encoding: z.enum(["base64", "binary"]).optional(),
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
    message: "SDK Input Error: Either 'html' or 'url' must be provided",
    path: ["html"],
  })
  .refine((data) => !(data.html && data.url), {
    message: "SDK Input Error: Provide either 'html' or 'url', not both",
    path: ["html"],
  })
  .refine(
    (data) => {
      if (
        data.outputFormat === "png" &&
        data.screenshotOptions?.quality !== undefined
      )
        return false;
      return true;
    },
    {
      message:
        "SDK Input Error: 'quality' option is not applicable for 'png' output format",
      path: ["screenshotOptions", "quality"],
    }
  );

export type ConversionRequest = z.infer<typeof ConversionRequestSchema>;

export type RenderInput = (
  | { html: string; url?: never }
  | { url: string; html?: never }
) & {
  outputFormat: ConversionRequest["outputFormat"];
} & {
  filename?: ConversionRequest["filename"];
  pageSetupOptions?: z.input<typeof PageSetupOptionsSchema>;
  pdfOptions?: z.input<typeof PdfOutputOptionsSchema>;
  screenshotOptions?: z.input<typeof ScreenshotOutputOptionsSchema>;
};

export type PageSetupOptions = z.infer<typeof PageSetupOptionsSchema>;
export type PdfOutputOptions = z.infer<typeof PdfOutputOptionsSchema>;
export type ScreenshotOutputOptions = z.infer<
  typeof ScreenshotOutputOptionsSchema
>;
