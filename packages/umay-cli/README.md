# Umay CLI

[![npm version](https://img.shields.io/npm/v/umay-cli.svg)](https://www.npmjs.com/package/umay-cli)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Command-line interface for free, high-performance HTML to PDF and HTML to Image conversion.

## Features

- ✅ **Easy to Use** - Simple CLI commands for PDF and image generation
- ✅ **File Input** - Generate PDFs and images from HTML files
- ✅ **URL Input** - Generate PDFs and images from web URLs
- ✅ **Customizable Options** - Control output format, quality, and more
- ✅ **Free and Open Source** - No hidden costs or usage limits

## Installation

```bash
# Install globally
npm install -g umay-cli

# Or run with npx
npx umay-cli
```

## Usage

### Generate PDF from HTML file

```bash
# Basic usage
umay pdf path/to/input.html output.pdf

# With options
umay pdf path/to/input.html output.pdf --format A4 --landscape --print-background
```

### Generate PDF from URL

```bash
umay pdf https://example.com output.pdf --format Letter
```

### Generate Image from HTML file

```bash
# Basic usage
umay image path/to/input.html output.png

# With options
umay image path/to/input.html output.png --quality 100 --full-page
```

### Generate Image from URL

```bash
umay image https://example.com output.jpg --viewport-width 1920 --viewport-height 1080
```

## Commands

### PDF Generation

```
umay pdf <input> <output> [options]
```

Arguments:
- `input` - HTML file path or URL
- `output` - Output PDF file path

Options:
- `--format <format>` - Paper format (A4, Letter, etc.) [default: "A4"]
- `--landscape` - Landscape orientation [default: false]
- `--print-background` - Print background graphics [default: true]
- `--margin-top <margin>` - Top margin [default: "20mm"]
- `--margin-right <margin>` - Right margin [default: "20mm"]
- `--margin-bottom <margin>` - Bottom margin [default: "20mm"]
- `--margin-left <margin>` - Left margin [default: "20mm"]
- `--api-url <url>` - Custom API URL (optional) [default: "https://umay-api-935360498495.us-central1.run.app/v1"]

### Image Generation

```
umay image <input> <output> [options]
```

Arguments:
- `input` - HTML file path or URL
- `output` - Output image file path

Options:
- `--quality <quality>` - Image quality (1-100) [default: 90]
- `--full-page` - Capture full page height [default: true]
- `--omit-background` - Hide default white background [default: false]
- `--viewport-width <width>` - Viewport width [default: 1920]
- `--viewport-height <height>` - Viewport height [default: 1080]
- `--device-scale-factor <factor>` - Device scale factor [default: 2]
- `--api-url <url>` - Custom API URL (optional) [default: "https://umay-api-935360498495.us-central1.run.app/v1"]

## API Reference

UmayRender provides simple methods for converting HTML to PDF and image formats.

| Method | Description | Parameters |
|--------|-------------|------------|
| `toPDF(html, options)` | Converts HTML to PDF | `html`: HTML content string<br>`options`: (Optional) PDF options object |
| `toImage(html, options)` | Converts HTML to image | `html`: HTML content string<br>`options`: (Optional) Image options object |

### PDF Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `format` | string | "A4" | Paper format (A4, Letter, etc.) |
| `landscape` | boolean | false | Landscape orientation |
| `printBackground` | boolean | true | Print background graphics |
| `margin` | object | `{top:"20mm", right:"20mm", bottom:"20mm", left:"20mm"}` | Page margins |

### Image Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `quality` | number | 90 | Image quality (1-100) |
| `fullPage` | boolean | true | Capture full page height |
| `viewport` | object | `{width:1920, height:1080, deviceScaleFactor:2}` | Viewport settings |

## Examples

```bash
# Generate A4 PDF with custom margins
umay pdf input.html output.pdf --format A4 --margin-top 10mm --margin-left 15mm

# Generate high-quality PNG screenshot
umay image https://github.com github.png --type png --quality 100 --device-scale-factor 3

# Generate PDF from URL with landscape orientation
umay pdf https://news.ycombinator.com news.pdf --landscape

# Generate full-page screenshot from URL
umay image https://example.com example.jpg --full-page
```

## License

[MIT](LICENSE) 