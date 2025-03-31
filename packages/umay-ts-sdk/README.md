# Umay Render SDK

[![npm version](https://img.shields.io/npm/v/umay-render.svg)](https://www.npmjs.com/package/umay-render)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Free, high-performance HTML to PDF and HTML to Image conversion SDK for both browser and Node.js.

## Core Features

- ✅ **Universal:** Works in both browser and Node.js environments.
- ✅ **TypeScript:** Full type definitions for an enhanced development experience.
- ✅ **PDF & Image:** Convert HTML or URLs to PDF, PNG, JPEG, or WebP formats.
- ✅ **Flexible Input:** Accepts raw HTML content or a web page URL.
- ✅ **Simple & Powerful:** Easy to get started, yet offers deep customization options.
- ✅ **Lightweight:** Minimal dependencies keep the bundle size small.
- ✅ **Free & Open Source:** No hidden costs or usage limits.

## Installation

```bash
npm install umay-render
# or
yarn add umay-render
# or
pnpm add umay-render
```

## Quick Start (Simple Usage)

Get started quickly with the most basic scenarios. The SDK handles most settings by default.

```typescript
import { UmaySDK, RenderInput } from "umay-render";
// import fs from 'fs/promises'; // Uncomment for Node.js file saving

// Initialize the SDK
const client = new UmaySDK();

// --- Generate PDF from HTML ---
async function createPdfFromHtml() {
  const htmlContent = "<html><body><h1>Hello PDF!</h1></body></html>";

  const request: RenderInput = {
    html: htmlContent,
    outputFormat: "pdf", // Specify PDF output format
  };

  try {
    const pdfBuffer: Uint8Array = await client.render(request);
    console.log("PDF generated successfully (buffer)!");
    // In Node.js: await fs.writeFile('simple.pdf', pdfBuffer);
    // In Browser: (See browser examples below for Blob creation/download)
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
}

// --- Generate PNG Image from URL ---
async function createImageFromUrl() {
  const websiteUrl = "https://example.com";

  const request: RenderInput = {
    url: websiteUrl,
    outputFormat: "png", // Specify PNG output format
  };

  try {
    const imageBuffer: Uint8Array = await client.render(request);
    console.log("Image generated successfully (buffer)!");
    // In Node.js: await fs.writeFile('simple.png', imageBuffer);
    // In Browser: (See browser examples below for Blob creation/<img> tag)
  } catch (error) {
    console.error("Error generating image:", error);
  }
}

// Call the functions
createPdfFromHtml();
createImageFromUrl();
```

## Advanced Usage (Customization)

When you need more control, use the optional fields within the `request` object passed to the `render` method:

- `pageSetupOptions`: Configures the browser environment (viewport, cookies, wait conditions, etc.) _before_ rendering starts.
- `pdfOptions`: Settings specific to PDF output (page format, margins, headers/footers, etc.).
- `screenshotOptions`: Settings specific to image output (quality, full page capture, clipping, etc.).

```typescript
import { UmaySDK, RenderInput, UmayError } from "umay-render";
import fs from "fs/promises"; // For Node.js example
import path from "path"; // For Node.js example

// Initialize SDK with custom settings (optional)
const client = new UmaySDK({
  // API_URL: 'https://your-custom-api-url.com', // If hosting your own backend
  TIMEOUT: 45000, // 45 second timeout instead of the default 30 seconds
});

// --- Advanced PDF Generation (From URL, with Cookies, Custom Settings) ---
async function createAdvancedPdf() {
  const loginProtectedUrl = "https://portal.example.com/report/123";

  const request: RenderInput = {
    url: loginProtectedUrl,
    outputFormat: "pdf",
    filename: "monthly_report.pdf", // Suggested filename for download
    pageSetupOptions: {
      // Set cookies before page load (e.g., session info)
      cookies: [
        {
          name: "sessionid",
          value: "secretSessionValue",
          url: loginProtectedUrl,
        },
      ],
      // Wait for a specific element to appear
      waitForSelector: "#report-data-ready",
      // Wait for network traffic to settle
      waitUntil: "networkidle0",
      // Set the viewport
      viewport: { width: 1200, height: 900 },
    },
    pdfOptions: {
      format: "A4",
      landscape: false, // Portrait page
      printBackground: true, // Print backgrounds
      margin: {
        // Custom margins
        top: "2cm",
        bottom: "1.5cm",
        left: "1cm",
        right: "1cm",
      },
      displayHeaderFooter: true, // Display header and footer
      // Simple header/footer templates (HTML supported)
      headerTemplate: `<div style="font-size: 9px; width: 100%; text-align: center;">Page <span class="pageNumber"></span> / <span class="totalPages"></span></div>`,
      footerTemplate: `<div style="font-size: 9px; width: 100%; text-align: right; padding-right: 1cm;">Report Date: <span class="date"></span></div>`,
    },
  };

  try {
    const pdfBuffer = await client.render(request);
    // In Node.js:
    await fs.writeFile(
      path.join(__dirname, request.filename || "advanced.pdf"),
      pdfBuffer
    );
    console.log(`Advanced PDF saved: ${request.filename || "advanced.pdf"}`);
  } catch (error) {
    console.error("Error generating advanced PDF:", error);
    // Check details if it's an UmayError:
    if (error instanceof UmayError) {
      console.error("Error Details:", error.details);
    }
  }
}

// --- Advanced Image Generation (From HTML, Clipped JPEG) ---
async function createAdvancedImage() {
  const complexHtml = `
    <html>
      <head><style>body { margin: 0; } .container { background: #eee; padding: 50px; } .highlight { border: 2px solid red; padding: 10px; display: inline-block; }</style></head>
      <body>
        <div class="container">
          <h1>A Complex Section</h1>
          <p>Other content...</p>
          <div class="highlight" id="target-element">Clip Just This Part</div>
          <p>More content...</p>
        </div>
      </body>
    </html>`;

  const request: RenderInput = {
    html: complexHtml,
    outputFormat: "jpeg",
    pageSetupOptions: {
      // Set the viewport for the screenshot
      viewport: { width: 800, height: 600 },
    },
    screenshotOptions: {
      quality: 85, // JPEG quality (0-100)
      fullPage: false, // Capture only the viewport or clipped area, not the full page
      // Clip only a specific area (the div with the highlight class)
      clip: {
        x: 50, // x-coordinate of the top-left corner of the clip area (approximate)
        y: 100, // y-coordinate of the top-left corner of the clip area (approximate)
        width: 180, // Width of the area to clip (approximate)
        height: 50, // Height of the area to clip (approximate)
        // Note: Clip coordinates are often found through trial-and-error or browser dev tools.
        // Alternatively, you could get the element's position using 'evaluateScript'.
      },
      omitBackground: true, // Make background transparent (becomes white for JPEG)
    },
  };

  try {
    const imageBuffer = await client.render(request);
    // In Node.js:
    await fs.writeFile(path.join(__dirname, "clipped_image.jpeg"), imageBuffer);
    console.log("Clipped JPEG saved: clipped_image.jpeg");
  } catch (error) {
    console.error("Error generating advanced image:", error);
  }
}

// Call the functions
createAdvancedPdf();
createAdvancedImage();
```

## SDK Configuration (Constructor)

You can optionally provide parameters when initializing `UmaySDK`:

```typescript
const client = new UmaySDK({
  API_URL: "https://custom-render-service.com/api", // Your custom API endpoint (SDK provides a default)
  TIMEOUT: 60000, // Timeout for API requests (ms). Default: 30000
});
```

## API Reference

### `UmaySDK` Class

- **`constructor(config?: { API_URL?: string, TIMEOUT?: number })`**: Initializes the SDK client.
- **`render(request: RenderInput): Promise<Uint8Array>`**: The main conversion method. Returns a `Uint8Array` (buffer) on success. May throw `UmayError` on failure.

### `RenderInput` Object (Core Fields)

| Field               | Type                                       | Required | Description                                                                                             |
| ------------------- | ------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------- |
| `html`              | `string`                                   | **Yes**¹ | The HTML content to render.                                                                             |
| `url`               | `string`                                   | **Yes**¹ | The URL of the page to render.                                                                          |
| `outputFormat`      | `"pdf"` \| `"png"` \| `"jpeg"` \| `"webp"` | **Yes**  | The desired output format.                                                                              |
| `filename`          | `string`                                   | No       | Suggested filename for downloads.                                                                       |
| `pageSetupOptions`  | `object`                                   | No       | Page setup options applied before rendering. [Details](#pagesetupoptions-details)                       |
| `pdfOptions`        | `object`                                   | No       | PDF-specific output options (if `outputFormat: 'pdf'`). [Details](#pdfoutputoptions-details)            |
| `screenshotOptions` | `object`                                   | No       | Image-specific output options (if `outputFormat` is image). [Details](#screenshotoutputoptions-details) |

¹ Exactly one of `html` or `url` must be provided.

## Detailed Option References

The following sections detail all available fields for the optional configuration objects within `RenderInput`.

<details>
<summary><b>PageSetupOptions Details</b></summary>

| Field               | Type                                                                                        | Default          | Description                                                                                                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `viewport`          | `object`                                                                                    | (backend)        | Browser viewport: `width`, `height` (required, number). Optional: `deviceScaleFactor`, `isMobile`, `hasTouch`, `isLandscape`.                                                                        |
| `emulateMediaType`  | `"screen"` \| `"print"`                                                                     | `undefined`      | Emulate CSS media type (`screen` or `print`).                                                                                                                                                        |
| `waitForSelector`   | `string`                                                                                    | `undefined`      | Wait for the specified CSS selector to appear on the page.                                                                                                                                           |
| `waitForTimeout`    | `number`                                                                                    | `30000`          | Maximum time (ms) for wait operations (navigation, selectors, etc.).                                                                                                                                 |
| `waitUntil`         | `"load"` \| `"domcontentloaded"` \| `"networkidle0"` \| `"networkidle2"` \| `Array<string>` | `networkidle0`   | When to consider navigation successful. See Puppeteer docs for details. Can be a single event or an array.                                                                                           |
| `cookies`           | `Array<object>`                                                                             | `undefined`      | Array of cookies to set before navigation. Each object needs `name`, `value`. Optional: `url`, `domain`, `path`, `expires` (epoch time), `httpOnly`, `secure`, `sameSite` ("Strict", "Lax", "None"). |
| `extraHTTPHeaders`  | `Record<string, string>`                                                                    | `undefined`      | Additional HTTP headers to send with the request (only applicable when using `url`).                                                                                                                 |
| `javascriptEnabled` | `boolean`                                                                                   | `true` (backend) | Enable/disable JavaScript execution.                                                                                                                                                                 |
| `userAgent`         | `string`                                                                                    | `undefined`      | Custom browser user agent string.                                                                                                                                                                    |
| `evaluateScript`    | `string`                                                                                    | `undefined`      | **Caution!** JavaScript code to execute in the page context after load but before rendering. May pose security risks.                                                                                |

</details>

<details>
<summary><b>PdfOutputOptions Details (for `outputFormat: 'pdf'`)</b></summary>

| Field                 | Type                                      | Default                      | Description                                                                                                                                        |
| --------------------- | ----------------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scale`               | `number`                                  | `1` (backend)                | Rendering scale factor (e.g., `1` = 100%, `0.5` = 50%).                                                                                            |
| `displayHeaderFooter` | `boolean`                                 | `false` (backend)            | Display header/footer templates.                                                                                                                   |
| `headerTemplate`      | `string`                                  | `undefined`                  | HTML template for the header. Supports special classes (`pageNumber`, `totalPages`, `date`, `title`, `url`). Requires `displayHeaderFooter: true`. |
| `footerTemplate`      | `string`                                  | `undefined`                  | HTML template for the footer. Supports special classes. Requires `displayHeaderFooter: true`.                                                      |
| `printBackground`     | `boolean`                                 | `true` (backend)             | Print background graphics and colors.                                                                                                              |
| `landscape`           | `boolean`                                 | `false` (backend)            | Use landscape orientation.                                                                                                                         |
| `pageRanges`          | `string`                                  | `undefined`                  | Page ranges to print (e.g., '1-5, 8, 11-13').                                                                                                      |
| `format`              | `"Letter"`, `"Legal"`, ..., `"A0"`-`"A6"` | `"A4"` (backend)             | Paper format. Overrides `width` and `height` if set.                                                                                               |
| `width`               | `string` \| `number`                      | `undefined`                  | Page width (string with units, e.g., `"8.5in"`, `"210mm"`, or pixels number). Used if `format` is not set.                                         |
| `height`              | `string` \| `number`                      | `undefined`                  | Page height (string with units or pixels number). Used if `format` is not set.                                                                     |
| `margin`              | `object`                                  | `{top:"1cm", ...}` (backend) | Page margins. Properties `top`, `right`, `bottom`, `left` accept string with units or pixels number.                                               |
| `preferCSSPageSize`   | `boolean`                                 | `false` (backend)            | Prioritize CSS `@page` size rules over `format`, `width`, `height`.                                                                                |
| `omitBackground`      | `boolean`                                 | `false` (backend)            | Hides default white background, allowing transparency (if supported by viewer). Opposite of `printBackground`.                                     |
| `tagged`              | `boolean`                                 | `false` (backend)            | Generate a tagged (accessible) PDF.                                                                                                                |
| `timeout`             | `number`                                  | `30000` (backend)            | Maximum time (ms) for the PDF generation step itself.                                                                                              |

</details>

<details>
<summary><b>ScreenshotOutputOptions Details (for Image Formats)</b></summary>

| Field                   | Type      | Default                       | Description                                                                                                                   |
| ----------------------- | --------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `quality`               | `number`  | `90` (backend, for jpeg/webp) | Image quality (0-100). **Only applicable for `jpeg` and `webp` formats.**                                                     |
| `fullPage`              | `boolean` | `true` (backend)              | Capture the full scrollable page height.                                                                                      |
| `clip`                  | `object`  | `undefined`                   | Capture a specific rectangular area: `x`, `y`, `width`, `height` (all numbers, width/height > 0). Use with `fullPage: false`. |
| `omitBackground`        | `boolean` | `false` (backend)             | Hides default white background, allowing transparency (especially for `png`).                                                 |
| `captureBeyondViewport` | `boolean` | `true` (backend)              | Capture elements outside the initial viewport (relevant when `fullPage` is `false` or `clip` is used).                        |
| `fromSurface`           | `boolean` | `true` (backend)              | Capture from the surface rather than the view (may yield more accurate results for complex pages).                            |
| `timeout`               | `number`  | `30000` (backend)             | Maximum time (ms) for the screenshot generation step itself.                                                                  |

</details>

## Browser and Node.js Examples

The code in the "Quick Start" and "Advanced Usage" sections can be run in both environments. You just need to handle the resulting `Uint8Array` buffer appropriately.

**Browser Download Example (for PDF):**

```javascript
// Assume pdfBuffer is obtained from client.render
const blob = new Blob([pdfBuffer], { type: "application/pdf" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "generated_document.pdf"; // Desired filename
document.body.appendChild(a); // Required for Firefox
a.click();
a.remove();
URL.revokeObjectURL(url); // Release memory
```

**Browser Display Example (for Image):**

```javascript
// Assume imageBuffer is obtained from client.render
const blob = new Blob([imageBuffer], { type: "image/png" }); // or image/jpeg
const url = URL.createObjectURL(blob);
const img = document.createElement("img");
img.onload = () => URL.revokeObjectURL(url); // Release memory once loaded
img.onerror = () => URL.revokeObjectURL(url); // Also release on error
img.src = url;
document.body.appendChild(img);
```

**Node.js File Saving Example:** (Already shown in Advanced Usage section using `fs.promises.writeFile`)

## Error Handling

The `client.render` method may throw an `UmayError` for API errors or SDK-side validation issues. This error object contains additional information (`code`, `details`) to help diagnose the problem.

```typescript
import { UmaySDK, RenderInput, UmayError, ErrorCodes } from "umay-render";

// ... client initialization ...

try {
  const buffer = await client.render({
    /* ... request ... */
  });
  // Handle success
} catch (error) {
  if (error instanceof UmayError) {
    console.error(`Umay SDK Error (Code: ${error.code}): ${error.message}`);
    if (error.details) {
      console.error("Details:", error.details);
    }
    // Specific actions can be taken based on the error code
    if (error.code === ErrorCodes.API_TIMEOUT) {
      // Timeout occurred, maybe retry?
    } else if (error.code === ErrorCodes.SDK_INVALID_INPUT) {
      // Problem with input data, can notify the user.
    }
  } else {
    // Unexpected other error
    console.error("Unexpected Error:", error);
  }
}
```

## License

MIT
