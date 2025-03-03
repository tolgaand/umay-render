# Umay Render SDK

[![npm version](https://img.shields.io/npm/v/umay-render.svg)](https://www.npmjs.com/package/umay-render)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Free, high-performance HTML to PDF and HTML to Image conversion SDK for both browser and Node.js.

## Features

- ✅ **Universal Compatibility** - Works in both browser and Node.js environments
- ✅ **TypeScript Support** - Full type definitions for enhanced development experience
- ✅ **PDF Generation** - Convert HTML to PDF with customizable options
- ✅ **Image Screenshots** - Generate JPEG or PNG images from HTML
- ✅ **Lightweight** - Minimal dependencies for reduced bundle size
- ✅ **Free and Open Source** - No hidden costs or usage limits

## Installation

```bash
npm install umay-render
# or
yarn add umay-render
# or 
pnpm add umay-render
```

## Usage

You can convert HTML content to PDF or image formats using UmaySDK.

```typescript
import { UmaySDK } from 'umay-render';

// Initialize the SDK
const client = new UmaySDK();
// Or with custom API URL (optional)
// const client = new UmaySDK({ 
//   API_URL: 'https://your-custom-api-url.com', // Optional: A default API URL is provided
//   TIMEOUT: 60000 // Optional: Default is 30000 (30 seconds)
// });

// Generate PDF
const pdfBuffer = await client.toPDF(html, options);

// Generate Image
const imageBuffer = await client.toImage(html, options);
```

## Configuration

When initializing the SDK, you can optionally provide configuration options:

```typescript
const client = new UmaySDK({
  API_URL: 'https://your-custom-api-url.com', // Optional: A default API URL is provided
  TIMEOUT: 60000 // Optional: Default is 30000 (30 seconds)
});
```

## API Reference

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

### Browser Environment

```typescript
import { UmaySDK } from 'umay-render';

// Initialize the SDK
const client = new UmaySDK();

// Generate PDF
async function generatePDF() {
  const html = '<html><body><h1>Hello World</h1></body></html>';
  
  const pdfBuffer = await client.toPDF(html, {
    format: 'A4',
    landscape: false,
    printBackground: true
  });
  
  // Use the buffer as needed
  // For example, create a Blob and download
  const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'document.pdf';
  a.click();
}

// Generate Image
async function generateImage() {
  const html = '<html><body><h1>Hello World</h1></body></html>';
  
  const imageBuffer = await client.toImage(html, {
    quality: 90,
    fullPage: true,
    viewport: {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 2
    }
  });
  
  // Use the buffer as needed
  // For example, create a Blob and download
  const blob = new Blob([imageBuffer], { type: 'image/png' });
  const url = URL.createObjectURL(blob);
  const img = document.createElement('img');
  img.src = url;
  document.body.appendChild(img);
}
```

### Node.js Environment

```typescript
import { UmaySDK } from 'umay-render';
import fs from 'fs';

// Initialize the SDK
const client = new UmaySDK();

// Generate PDF
async function generatePDF() {
  const html = '<html><body><h1>Hello World</h1></body></html>';
  
  const pdfBuffer = await client.toPDF(html, {
    format: 'A4',
    landscape: false,
    printBackground: true
  });
  
  // Save to file
  fs.writeFileSync('document.pdf', pdfBuffer);
}

// Generate Image
async function generateImage() {
  const html = '<html><body><h1>Hello World</h1></body></html>';
  
  const imageBuffer = await client.toImage(html, {
    quality: 90,
    fullPage: true,
    viewport: {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 2
    }
  });
  
  // Save to file
  fs.writeFileSync('image.png', imageBuffer);
}
```