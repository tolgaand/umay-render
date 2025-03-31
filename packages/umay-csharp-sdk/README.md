# Umay Render SDK

[![NuGet version](https://img.shields.io/nuget/v/UmaySDK.svg)](https://www.nuget.org/packages/UmaySDK)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Free, high-performance HTML to PDF and HTML to Image conversion SDK for .NET applications.

[Website](https://umayrender.com) | [GitHub](https://github.com/tolgaand/umay-render)

## Core Features

- ✅ **Cross-Platform:** Works on Windows, macOS, and Linux.
- ✅ **Multi-Target:** Supports .NET 6.0, 7.0, and 8.0.
- ✅ **PDF & Image:** Convert HTML or URLs to PDF, PNG, JPEG, or WebP formats.
- ✅ **Flexible Input:** Accepts raw HTML content or a web page URL.
- ✅ **Simple & Powerful:** Easy to get started, yet offers deep customization options.
- ✅ **Lightweight:** Minimal dependencies keep the package small.
- ✅ **Free & Open Source:** No hidden costs or usage limits.

## Installation

```bash
dotnet add package UmaySDK
```

## Quick Start (Simple Usage)

Get started quickly with the most basic scenarios. The SDK handles most settings by default.

```csharp
using UmaySDK;
using UmaySDK.Models;

// Initialize the SDK
var client = new UmayClient();

// --- Generate PDF from HTML ---
async Task CreatePdfFromHtml()
{
    var htmlContent = "<html><body><h1>Hello PDF!</h1></body></html>";

    var request = new ConversionRequest
    {
        Html = htmlContent,
        OutputFormat = "pdf" // Specify PDF output format
    };

    try
    {
        // Save directly to file
        await client.SaveToFileAsync(request, "simple.pdf");
        Console.WriteLine("PDF generated successfully!");

        // Or get the bytes directly
        byte[] pdfBytes = await client.RenderAsync(request);
        Console.WriteLine("PDF generated successfully (buffer)!");
    }
    catch (UmayException ex)
    {
        Console.WriteLine($"Error generating PDF: {ex.Message}");
    }
}

// --- Generate PNG Image from URL ---
async Task CreateImageFromUrl()
{
    var websiteUrl = "https://example.com";

    var request = new ConversionRequest
    {
        Url = websiteUrl,
        OutputFormat = "png" // Specify PNG output format
    };

    try
    {
        await client.SaveToFileAsync(request, "simple.png");
        Console.WriteLine("Image generated successfully!");
    }
    catch (UmayException ex)
    {
        Console.WriteLine($"Error generating image: {ex.Message}");
    }
}

// Call the functions
await CreatePdfFromHtml();
await CreateImageFromUrl();
```

## Advanced Usage (Customization)

When you need more control, use the optional properties within the `ConversionRequest` object:

- `PageSetupOptions`: Configures the browser environment (viewport, cookies, wait conditions, etc.) _before_ rendering starts.
- `PdfOptions`: Settings specific to PDF output (page format, margins, headers/footers, etc.).
- `ScreenshotOptions`: Settings specific to image output (quality, full page capture, clipping, etc.).

```csharp
using UmaySDK;
using UmaySDK.Models;

// Initialize SDK with custom settings
var client = new UmayClient("https://your-umay-server:3000");

// --- Advanced PDF Generation (From URL, with Cookies, Custom Settings) ---
async Task CreateAdvancedPdf()
{
    var loginProtectedUrl = "https://portal.example.com/report/123";

    var request = new ConversionRequest
    {
        Url = loginProtectedUrl,
        OutputFormat = "pdf",
        Filename = "monthly_report.pdf", // Suggested filename
        PageSetupOptions = new PageSetupOptions
        {
            // Set cookies before page load (e.g., session info)
            Cookies = new List<Cookie>
            {
                new Cookie
                {
                    Name = "sessionid",
                    Value = "secretSessionValue",
                    Url = loginProtectedUrl
                }
            },
            // Wait for a specific element to appear
            WaitForSelector = "#report-data-ready",
            // Wait for network traffic to settle
            WaitUntil = "networkidle0",
            // Set the viewport
            Viewport = new Viewport
            {
                Width = 1200,
                Height = 900
            }
        },
        PdfOptions = new PdfOptions
        {
            Format = "A4",
            Landscape = false, // Portrait page
            PrintBackground = true, // Print backgrounds
            Margin = new Margin
            {
                // Custom margins
                Top = "2cm",
                Bottom = "1.5cm",
                Left = "1cm",
                Right = "1cm"
            },
            DisplayHeaderFooter = true, // Display header and footer
            // Simple header/footer templates (HTML supported)
            HeaderTemplate = "<div style=\"font-size: 9px; width: 100%; text-align: center;\">Page <span class=\"pageNumber\"></span> / <span class=\"totalPages\"></span></div>",
            FooterTemplate = "<div style=\"font-size: 9px; width: 100%; text-align: right; padding-right: 1cm;\">Report Date: <span class=\"date\"></span></div>"
        }
    };

    try
    {
        await client.SaveToFileAsync(request, request.Filename ?? "advanced.pdf");
        Console.WriteLine($"Advanced PDF saved: {request.Filename ?? "advanced.pdf"}");
    }
    catch (UmayException ex)
    {
        Console.WriteLine($"Error generating advanced PDF: {ex.Message}");
    }
}

// --- Advanced Image Generation (From HTML, JPEG) ---
async Task CreateAdvancedImage()
{
    var complexHtml = @"
        <html>
          <head><style>body { margin: 0; } .container { background: #eee; padding: 50px; } .highlight { border: 2px solid red; padding: 10px; display: inline-block; }</style></head>
          <body>
            <div class=""container"">
              <h1>A Complex Section</h1>
              <p>Other content...</p>
              <div class=""highlight"" id=""target-element"">Clip Just This Part</div>
              <p>More content...</p>
            </div>
          </body>
        </html>";

    var request = new ConversionRequest
    {
        Html = complexHtml,
        OutputFormat = "jpeg",
        PageSetupOptions = new PageSetupOptions
        {
            // Set the viewport for the screenshot
            Viewport = new Viewport { Width = 800, Height = 600 }
        },
        ScreenshotOptions = new ScreenshotOptions
        {
            Quality = 85, // JPEG quality (0-100)
            FullPage = false, // Capture only the viewport or clipped area, not the full page
            // Clip only a specific area (the div with the highlight class)
            Clip = new Clip
            {
                X = 50, // x-coordinate of the top-left corner of the clip area (approximate)
                Y = 100, // y-coordinate of the top-left corner of the clip area (approximate)
                Width = 180, // Width of the area to clip (approximate)
                Height = 50 // Height of the area to clip (approximate)
                // Note: Clip coordinates are often found through trial-and-error or browser dev tools.
            },
            OmitBackground = true // Make background transparent (becomes white for JPEG)
        }
    };

    try
    {
        await client.SaveToFileAsync(request, "clipped_image.jpeg");
        Console.WriteLine("Clipped JPEG saved: clipped_image.jpeg");
    }
    catch (UmayException ex)
    {
        Console.WriteLine($"Error generating advanced image: {ex.Message}");
    }
}

// Call the functions
await CreateAdvancedPdf();
await CreateAdvancedImage();
```

## API Reference

### `UmayClient` Class

- **`constructor(baseUrl?: string)`**: Initializes the SDK client with an optional custom API endpoint.
- **`RenderAsync(request: ConversionRequest): Task<byte[]>`**: The main conversion method. Returns a byte array on success. May throw `UmayException` on failure.
- **`SaveToFileAsync(request: ConversionRequest, filePath: string): Task`**: Convenience method to render and save directly to a file. May throw `UmayException` on failure.

### `ConversionRequest` Class (Core Properties)

| Property            | Type                | Required | Description                                                           |
| ------------------- | ------------------- | -------- | --------------------------------------------------------------------- |
| `Html`              | `string`            | **Yes**¹ | The HTML content to render.                                           |
| `Url`               | `string`            | **Yes**¹ | The URL of the page to render.                                        |
| `OutputFormat`      | `string`            | **Yes**  | The desired output format (`"pdf"`, `"png"`, `"jpeg"`, or `"webp"`).  |
| `Filename`          | `string`            | No       | Suggested filename for downloads.                                     |
| `PageSetupOptions`  | `PageSetupOptions`  | No       | Page setup options applied before rendering.                          |
| `PdfOptions`        | `PdfOptions`        | No       | PDF-specific output options (if `OutputFormat` is `"pdf"`).           |
| `ScreenshotOptions` | `ScreenshotOptions` | No       | Image-specific output options (if `OutputFormat` is an image format). |

¹ Exactly one of `Html` or `Url` must be provided.

For a complete list of all available properties for `PageSetupOptions`, `PdfOptions`, and `ScreenshotOptions`, please refer to the model classes in the source code.
