import puppeteer, {
  Browser,
  Page,
  PDFOptions as PuppeteerPDFOptions,
  ScreenshotOptions as PuppeteerScreenshotOptions,
} from "puppeteer";
import { AppError } from "../../middlewares/error.middleware";
import type {
  ConversionRequest,
  PageSetupOptions,
  ValidPDFOptions,
  ValidScreenshotOptions,
} from "../../schemas/render.schema";

let browserInstance: Browser | null = null;
let browserClosing: boolean = false;

async function getBrowser(): Promise<Browser> {
  if (browserClosing) {
    throw new AppError(
      503,
      "Service is shutting down. Please try again later.",
      "Browser Unavailable",
      "SERVICE_UNAVAILABLE"
    );
  }
  if (browserInstance && browserInstance.isConnected()) {
    return browserInstance;
  }

  console.log("Launching new Puppeteer browser instance...");
  try {
    browserInstance = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--window-size=1920,1080",
      ],
    });

    browserInstance.on("disconnected", () => {
      console.warn("Puppeteer browser instance disconnected unexpectedly.");
      browserInstance = null;
      browserClosing = false;
    });

    console.log("Puppeteer browser instance launched successfully.");
    return browserInstance;
  } catch (error: any) {
    console.error("FATAL: Failed to launch Puppeteer browser:", error);
    throw new AppError(
      500,
      `Failed to initialize rendering engine: ${error.message}`,
      "Browser Launch Failed",
      "BROWSER_LAUNCH_FAILED"
    );
  }
}

export async function closeBrowser(): Promise<void> {
  if (browserInstance && !browserClosing) {
    console.log("Closing Puppeteer browser instance...");
    browserClosing = true;
    try {
      await browserInstance.close();
      browserInstance = null;
      console.log("Puppeteer browser instance closed.");
    } catch (error: any) {
      console.error("Error closing Puppeteer browser instance:", error.message);
    } finally {
      browserClosing = false;
    }
  } else if (browserClosing) {
    console.log("Browser close already in progress.");
  } else {
    console.log("No active browser instance to close.");
  }
}

export class RenderService {
  constructor() {
    console.log("RenderService initialized.");
  }

  private async applyPageSetup(
    page: Page,
    options?: PageSetupOptions
  ): Promise<void> {
    if (!options) {
      return;
    }

    if (options.viewport) {
      await page.setViewport(options.viewport);
    }
    if (options.emulateMediaType) {
      await page.emulateMediaType(
        options.emulateMediaType as "screen" | "print"
      );
    }
    if (options.cookies && options.cookies.length > 0) {
      await page.setCookie(
        ...(options.cookies as Parameters<typeof page.setCookie>[0][])
      );
    }
    if (options.extraHTTPHeaders) {
      await page.setExtraHTTPHeaders(options.extraHTTPHeaders);
    }
    if (options.javascriptEnabled !== undefined) {
      await page.setJavaScriptEnabled(options.javascriptEnabled);
    }
    if (options.userAgent) {
      await page.setUserAgent(options.userAgent);
    }
  }

  async performConversion(request: ConversionRequest): Promise<Buffer> {
    let page: Page | null = null;
    const browser = await getBrowser();

    try {
      page = await browser.newPage();

      page.on("console", (msg) => {
        if (
          !msg.text().includes("Download the React DevTools") &&
          !msg.text().includes("ERR_BLOCKED_BY_CLIENT")
        ) {
          console.log(`PAGE LOG (${msg.type()}):`, msg.text());
        }
      });
      page.on("pageerror", (error) =>
        console.error("PAGE JAVASCRIPT ERROR:", error.message)
      );
      page.on("requestfailed", (req) =>
        console.warn(
          `PAGE REQUEST FAILED: ${req.failure()?.errorText} ${req.url()}`
        )
      );

      await this.applyPageSetup(page, request.pageSetupOptions);

      const navigationOptions = {
        waitUntil: request.pageSetupOptions?.waitUntil ?? "networkidle0",
        timeout: request.pageSetupOptions?.waitForTimeout ?? 30000,
      };

      if (request.html) {
        await page.setContent(request.html, navigationOptions);
      } else if (request.url) {
        console.log(`Navigating to URL: ${request.url}`);
        await page.goto(request.url, navigationOptions);
        console.log(`Navigation successful for: ${request.url}`);
      } else {
        throw new AppError(
          400,
          "Internal Error: No input 'html' or 'url' provided.",
          "Invalid Request State",
          "INVALID_INPUT"
        );
      }

      if (request.pageSetupOptions?.waitForSelector) {
        console.log(
          `Waiting for selector: ${request.pageSetupOptions.waitForSelector}`
        );
        await page.waitForSelector(request.pageSetupOptions.waitForSelector, {
          timeout: navigationOptions.timeout,
          visible: true,
        });
        console.log(
          `Selector found: ${request.pageSetupOptions.waitForSelector}`
        );
      }

      if (request.pageSetupOptions?.evaluateScript) {
        console.log("Executing evaluateScript...");
        try {
          const scriptResult = await page.evaluate(
            request.pageSetupOptions.evaluateScript
          );
          console.log(
            "evaluateScript executed successfully. Result:",
            scriptResult
          );
        } catch (evalError: any) {
          console.error("Error executing evaluateScript:", evalError);
          throw new AppError(
            400,
            `Script evaluation failed: ${evalError.message}`,
            "Invalid Script Execution",
            "SCRIPT_EVAL_FAILED"
          );
        }
      }

      let outputBuffer: Buffer;
      let resultData: Uint8Array | Buffer;

      if (request.outputFormat === "pdf") {
        console.log("Generating PDF...");
        const pdfGenOptions: ValidPDFOptions = {
          printBackground: request.pdfOptions?.printBackground ?? true,
          format: request.pdfOptions?.format ?? "A4",
          margin: request.pdfOptions?.margin ?? {
            top: "20mm",
            right: "20mm",
            bottom: "20mm",
            left: "20mm",
          },
          ...(request.pdfOptions || {}),
        };
        delete (pdfGenOptions as any).path;
        resultData = await page.pdf(pdfGenOptions);
        outputBuffer = Buffer.from(resultData);
        console.log(
          `PDF generated successfully (${(outputBuffer.length / 1024).toFixed(
            1
          )} KB).`
        );
      } else {
        console.log(`Generating Image (Format: ${request.outputFormat})...`);
        const screenshotGenOptions: ValidScreenshotOptions & {
          type: "png" | "jpeg" | "webp";
        } = {
          fullPage: request.screenshotOptions?.fullPage ?? true,
          omitBackground: request.screenshotOptions?.omitBackground ?? false,
          ...(request.screenshotOptions || {}),
          type: request.outputFormat,
        };
        delete (screenshotGenOptions as any).path;
        if (screenshotGenOptions.type === "png") {
          delete screenshotGenOptions.quality;
        }
        resultData = await page.screenshot(screenshotGenOptions);
        outputBuffer = Buffer.from(resultData);
        console.log(
          `Image generated successfully (${(outputBuffer.length / 1024).toFixed(
            1
          )} KB).`
        );
      }

      return outputBuffer;
    } catch (error: any) {
      console.error("Error during conversion process:", error);
      if (error instanceof AppError) {
        throw error;
      }

      let statusCode = 500;
      let userMessage = "Conversion failed due to an internal error.";
      let internalMessage = error.message || "Unknown error during conversion";
      let errorCode = "CONVERSION_ERROR";

      if (
        error.name === "TimeoutError" ||
        error.constructor?.name === "TimeoutError"
      ) {
        statusCode = 408;
        userMessage = `Operation timed out (limit: ${
          request.pageSetupOptions?.waitForTimeout || 30000
        }ms). The requested page or element might be too slow or complex.`;
        internalMessage = `TimeoutError: ${error.message}`;
        errorCode = "TIMEOUT_ERROR";
      } else if (internalMessage.includes("net::ERR_")) {
        statusCode = 400;
        userMessage = `Failed to load the specified URL. Please check if it's correct and accessible. (${
          internalMessage.match(/net::\w+/)?.[0]
        })`;
        internalMessage = `NavigationError: ${error.message}`;
        errorCode = "NAVIGATION_ERROR";
      } else if (
        internalMessage.includes("failed to find element matching selector")
      ) {
        statusCode = 400;
        userMessage = `Could not find the element specified by 'waitForSelector': "${request.pageSetupOptions?.waitForSelector}".`;
        internalMessage = `SelectorError: ${error.message}`;
        errorCode = "SELECTOR_NOT_FOUND";
      } else if (internalMessage.includes("Execution context was destroyed")) {
        statusCode = 500;
        userMessage =
          "The page context was lost during rendering, possibly due to a crash or unexpected navigation.";
        internalMessage = `ContextDestroyedError: ${error.message}`;
        errorCode = "PAGE_CONTEXT_DESTROYED";
      }

      throw new AppError(statusCode, internalMessage, userMessage, errorCode);
    } finally {
      if (page) {
        try {
          await page.close();
          console.log("Page closed successfully.");
        } catch (e: any) {
          console.warn("Ignoring error during page close:", e.message);
        }
      }
    }
  }
}
