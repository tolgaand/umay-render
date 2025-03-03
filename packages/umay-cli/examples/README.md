# Umay CLI Examples

This directory contains example files and usage patterns for the Umay CLI tool.

## Examples

### Invoice Example

The `input/invoice.html` file contains a professional-looking invoice template that you can use to test the PDF and image generation capabilities of Umay CLI.

#### Generate PDF from the invoice template:

```bash
# Navigate to the examples directory
cd examples

# Generate PDF with default options
umay pdf input/invoice.html output/invoice.pdf

# Generate PDF with custom options
umay pdf input/invoice.html output/invoice.pdf --format A4 --landscape --print-background
```

#### Generate Image from the invoice template:

```bash
# Generate JPEG image with default options
umay image input/invoice.html output/invoice.jpg

# Generate PNG image with custom options
umay image input/invoice.html output/invoice.png --type png --quality 100 --full-page
```

## Output Directory

Generated PDFs and images will be saved to the `output` directory. If the directory doesn't exist, you may need to create it:

```bash
mkdir -p output
```

## Creating Your Own Examples

You can add your own HTML files to the `input` directory to test with Umay CLI. Here are some ideas:

- Receipts
- Reports
- Certificates
- Tickets
- Business cards
- Brochures

## Additional Resources

For more detailed information on available options and commands, refer to the [Umay CLI README](../README.md) or run:

```bash
umay --help
``` 