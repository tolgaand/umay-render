#!/usr/bin/env node

import { Command } from "commander";
import { UmaySDK } from "umay-render";
import * as fs from "fs";
import * as path from "path";

interface RenderOptions {
  type?: string;
  output?: string;
  width?: string;
  height?: string;
  scale?: string;
  quality?: string;
  fullPage?: string;
  apiUrl?: string;
}

// Function to ensure output directory exists
function ensureDirectoryExists(filePath: string): void {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return;
  }

  console.log(`Creating directory: ${dirname}`);
  fs.mkdirSync(dirname, { recursive: true });
}

const program = new Command();

// Get version from package.json
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf-8")
);

program
  .name("umay")
  .description("CLI tool for HTML to PDF/Image rendering")
  .version(packageJson.version);

program
  .command("render")
  .description("Render HTML to PDF or Image")
  .argument("<file>", "HTML file to render")
  .option("-t, --type <type>", "Output type (pdf or image)", "pdf")
  .option("-o, --output <file>", "Output file")
  .option("-w, --width <width>", "Viewport width", "1920")
  .option("-h, --height <height>", "Viewport height", "1080")
  .option("-s, --scale <scale>", "Device scale factor", "2")
  .option("-q, --quality <quality>", "Image quality (1-100)", "100")
  .option(
    "-f, --full-page <boolean>",
    "Capture full page height (true/false)",
    "true"
  )
  .option("-a, --api-url <url>", "API URL (overrides UMAY_API_URL env)")
  .action(async (file: string, options: RenderOptions) => {
    try {
      // Read HTML file
      const html = fs.readFileSync(path.resolve(file), "utf-8");

      // Initialize SDK
      const sdk = new UmaySDK({
        API_URL:
          options.apiUrl ||
          process.env.UMAY_API_URL ||
          "https://api.umayrender.com/v1",
      });

      // Generate PDF
      if (options.type === "pdf") {
        console.log("Requesting PDF generation...");
        const buffer = await sdk.toPDF(html, {
          format: "A4",
          landscape: false,
          printBackground: true,
        });

        console.log("PDF received from API, buffer type:", typeof buffer);
        console.log("Is buffer a Buffer?", Buffer.isBuffer(buffer));
        console.log("Buffer length:", buffer?.length || 0);

        // Make sure we have valid data before writing to file
        if (!buffer || !Buffer.isBuffer(buffer) || buffer.length === 0) {
          throw new Error("Received invalid or empty PDF data from API");
        }

        const outputFile = options.output || "output.pdf";

        // Ensure the output directory exists
        ensureDirectoryExists(outputFile);

        try {
          fs.writeFileSync(outputFile, buffer);
          console.log(`PDF saved to ${outputFile} (${buffer.length} bytes)`);
        } catch (fileError: unknown) {
          console.error("Error saving PDF file:", fileError);
          throw new Error(
            `Failed to save PDF to ${outputFile}: ${
              fileError instanceof Error ? fileError.message : "Unknown error"
            }`
          );
        }
      }
      // Generate image
      else if (options.type === "image") {
        try {
          console.log(`Rendering image of ${file} to ${options.output}`);

          const buffer = await sdk.toImage(html, {
            quality: options.quality ? Number(options.quality) : 100,
            fullPage: options.fullPage
              ? options.fullPage.toLowerCase() === "true"
              : true,
            viewport: {
              width: options.width ? Number(options.width) : 1920,
              height: options.height ? Number(options.height) : 1080,
              deviceScaleFactor: options.scale ? Number(options.scale) : 2,
            },
          });

          // Çıktı dosyasını yazma işlemi
          const outputFile = options.output || "output.png";
          ensureDirectoryExists(outputFile);
          fs.writeFileSync(outputFile, buffer);
          console.log(
            `Image generated successfully (${buffer.length} bytes) at ${outputFile}`
          );
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error("\x1b[31mError:\x1b[0m", error.message);
          } else {
            console.error("\x1b[31mUnknown error occurred\x1b[0m");
          }
          process.exit(1);
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("\x1b[31mError:\x1b[0m", error.message);

        // Show detailed error information
        if ("details" in error && (error as any).details) {
          console.error("\x1b[31mDetails:\x1b[0m", (error as any).details);
        }

        // Show error code if available
        if ("code" in error && (error as any).code) {
          console.error("\x1b[31mCode:\x1b[0m", (error as any).code);
        }
      } else {
        console.error("\x1b[31mUnknown error occurred\x1b[0m");
      }
      process.exit(1);
    }
  });

// Add new PDF specific command
program
  .command("pdf")
  .description("Generate PDF from HTML file")
  .argument("<input>", "HTML file or URL to render")
  .argument("<output>", "Output PDF file path")
  .option("--format <format>", "Paper format (A4, Letter, etc.)", "A4")
  .option("--landscape", "Landscape orientation", false)
  .option("--print-background", "Print background graphics", true)
  .option("--margin-top <margin>", "Top margin", "20mm")
  .option("--margin-right <margin>", "Right margin", "20mm")
  .option("--margin-bottom <margin>", "Bottom margin", "20mm")
  .option("--margin-left <margin>", "Left margin", "20mm")
  .option("--api-url <url>", "API URL (overrides UMAY_API_URL env)")
  .action(async (input: string, output: string, options: any) => {
    try {
      // Check if input is a URL or a file
      let html: string;
      if (input.startsWith("http://") || input.startsWith("https://")) {
        console.log(`Fetching HTML from URL: ${input}`);
        // Fetch from URL (would need to add a fetch library in a real implementation)
        throw new Error(
          "URL input not implemented yet, please provide a file path"
        );
      } else {
        // Read from file
        html = fs.readFileSync(path.resolve(input), "utf-8");
      }

      // Initialize SDK
      const sdk = new UmaySDK({
        API_URL:
          options.apiUrl ||
          process.env.UMAY_API_URL ||
          "https://api.umayrender.com/v1",
      });

      console.log("Requesting PDF generation...");
      const buffer = await sdk.toPDF(html, {
        format: options.format,
        landscape: options.landscape,
        printBackground: options.printBackground,
        margin: {
          top: options.marginTop,
          right: options.marginRight,
          bottom: options.marginBottom,
          left: options.marginLeft,
        },
      });

      if (!buffer || !Buffer.isBuffer(buffer) || buffer.length === 0) {
        throw new Error("Received invalid or empty PDF data from API");
      }

      // Ensure the output directory exists
      ensureDirectoryExists(output);

      fs.writeFileSync(output, buffer);
      console.log(`PDF saved to ${output} (${buffer.length} bytes)`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("\x1b[31mError:\x1b[0m", error.message);
      } else {
        console.error("\x1b[31mUnknown error occurred\x1b[0m");
      }
      process.exit(1);
    }
  });

// Add new Image specific command
program
  .command("image")
  .description("Generate image from HTML file")
  .argument("<input>", "HTML file or URL to render")
  .argument("<output>", "Output image file path")
  .option("--type <type>", "Image format (jpeg, png)", "jpeg")
  .option("--quality <quality>", "Image quality (1-100)", "90")
  .option("--full-page", "Capture full page height", true)
  .option("--viewport-width <width>", "Viewport width", "1920")
  .option("--viewport-height <height>", "Viewport height", "1080")
  .option("--device-scale-factor <factor>", "Device scale factor", "2")
  .option("--api-url <url>", "API URL (overrides UMAY_API_URL env)")
  .action(async (input: string, output: string, options: any) => {
    try {
      // Check if input is a URL or a file
      let html: string;
      if (input.startsWith("http://") || input.startsWith("https://")) {
        console.log(`Fetching HTML from URL: ${input}`);
        // Fetch from URL (would need to add a fetch library in a real implementation)
        throw new Error(
          "URL input not implemented yet, please provide a file path"
        );
      } else {
        // Read from file
        html = fs.readFileSync(path.resolve(input), "utf-8");
      }

      // Initialize SDK
      const sdk = new UmaySDK({
        API_URL:
          options.apiUrl ||
          process.env.UMAY_API_URL ||
          "https://api.umayrender.com/v1",
      });

      console.log("Requesting image generation...");
      const buffer = await sdk.toImage(html, {
        quality: parseInt(options.quality, 10),
        fullPage: options.fullPage
          ? options.fullPage.toLowerCase() === "true"
          : true,
        viewport: {
          width: parseInt(options.viewportWidth, 10),
          height: parseInt(options.viewportHeight, 10),
          deviceScaleFactor: parseInt(options.deviceScaleFactor, 10),
        },
      });

      if (!buffer || !Buffer.isBuffer(buffer) || buffer.length === 0) {
        throw new Error("Received invalid or empty image data from API");
      }

      // Ensure the output directory exists
      ensureDirectoryExists(output);

      fs.writeFileSync(output, buffer);
      console.log(`Image saved to ${output} (${buffer.length} bytes)`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("\x1b[31mError:\x1b[0m", error.message);
      } else {
        console.error("\x1b[31mUnknown error occurred\x1b[0m");
      }
      process.exit(1);
    }
  });

program.parse();
