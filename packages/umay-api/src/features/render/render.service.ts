import puppeteer, {
  PDFOptions,
  ScreenshotOptions,
  Viewport,
  Browser,
} from "puppeteer";
import { AppError } from "../../middlewares/error.middleware";
import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "crypto";

interface ImageOptions extends ScreenshotOptions {
  viewport?: Viewport;
}

export class RenderService {
  private tempDir: string;

  constructor() {
    // Use /tmp directory for Cloud Run compatibility
    this.tempDir =
      process.env.NODE_ENV === "production"
        ? "/tmp"
        : path.join(process.cwd(), "temp");
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  private createTempHtmlFile(html: string): string {
    const filename = `${randomUUID()}.html`;
    const filepath = path.join(this.tempDir, filename);
    fs.writeFileSync(filepath, html, "utf-8");
    return filepath;
  }

  private deleteTempFile(filepath: string): void {
    try {
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    } catch (error) {
      // Silent cleanup error
    }
  }

  private async launchBrowser(): Promise<Browser> {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--disable-extensions",
      ],
    });
    return browser;
  }

  async generatePDF(html: string, options?: PDFOptions) {
    let browser = null;
    let page = null;
    let tempHtmlPath = null;
    let tempPdfPath = null;

    try {
      if (!html || html.trim().length === 0) {
        throw new Error("HTML content is empty or invalid");
      }

      tempHtmlPath = this.createTempHtmlFile(html);
      tempPdfPath = path.join(this.tempDir, `${randomUUID()}.pdf`);

      browser = await this.launchBrowser();
      page = await browser.newPage();

      page.on("error", (err) => console.error("PAGE ERROR:", err));
      page.on("pageerror", (err) => console.error("PAGE ERROR:", err));

      await page.goto(`file://${tempHtmlPath}`, {
        waitUntil: ["load", "networkidle0"],
        timeout: 30000,
      });

      await page.evaluate(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );

      const pdfOptions: PDFOptions = {
        path: tempPdfPath,
        format: "A4",
        printBackground: true,
        margin: {
          top: "20mm",
          right: "20mm",
          bottom: "20mm",
          left: "20mm",
        },
        landscape: false,
        ...options,
      };

      const pdfPromise = page.pdf(pdfOptions);
      const pdfResult = await pdfPromise;

      const buffer = fs.readFileSync(tempPdfPath);
      return buffer;
    } catch (error: unknown) {
      throw new AppError(
        500,
        error instanceof Error
          ? `PDF Generation Error: ${error.message}`
          : "Unknown error during PDF generation",
        "Failed to generate PDF"
      );
    } finally {
      if (page) {
        try {
          await page.close();
        } catch (e) {
          // Ignore page close errors
        }
      }

      if (browser) {
        try {
          await browser.close();
        } catch (e) {
          // Ignore browser close errors
        }
      }

      if (tempHtmlPath) {
        this.deleteTempFile(tempHtmlPath);
      }
      if (tempPdfPath) {
        this.deleteTempFile(tempPdfPath);
      }
    }
  }

  async generateImage(html: string, options?: ImageOptions) {
    let browser = null;
    let page = null;
    let tempHtmlPath = null;
    let tempImagePath = null;

    try {
      if (!html || html.trim().length === 0) {
        throw new Error("HTML content is empty or invalid");
      }

      tempHtmlPath = this.createTempHtmlFile(html);

      const imageType = options?.type || "jpeg";
      const extension = imageType === "png" ? "png" : "jpg";
      tempImagePath = path.join(this.tempDir, `${randomUUID()}.${extension}`);

      browser = await this.launchBrowser();
      page = await browser.newPage();

      if (options?.viewport) {
        await page.setViewport({
          width: options.viewport.width,
          height: options.viewport.height,
          deviceScaleFactor: options.viewport.deviceScaleFactor || 1,
        });
      }

      await page.goto(`file://${tempHtmlPath}`, {
        waitUntil: ["load", "networkidle0"],
        timeout: 30000,
      });

      await page.evaluate(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );

      const screenshotOptions: ScreenshotOptions = {
        path: tempImagePath,
        type: options?.type || "jpeg",
        quality: options?.quality || 90,
        fullPage: options?.fullPage || true,
        omitBackground: false,
      };

      await page.screenshot(screenshotOptions);

      const buffer = fs.readFileSync(tempImagePath);
      return buffer;
    } catch (error: unknown) {
      throw new AppError(
        500,
        error instanceof Error
          ? `Image Generation Error: ${error.message}`
          : "Unknown error during image generation",
        "Failed to generate image"
      );
    } finally {
      if (page) {
        try {
          await page.close();
        } catch (e) {
          // Ignore page close errors
        }
      }

      if (browser) {
        try {
          await browser.close();
        } catch (e) {
          // Ignore browser close errors
        }
      }

      if (tempHtmlPath) {
        this.deleteTempFile(tempHtmlPath);
      }
      if (tempImagePath) {
        this.deleteTempFile(tempImagePath);
      }
    }
  }
}
