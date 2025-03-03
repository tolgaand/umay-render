# Umay API

Free, high-performance HTML to PDF and HTML to Image conversion API service.

## Features

- ✅ **Fast PDF Generation** - Convert HTML to PDF with optimized performance
- ✅ **Image Screenshots** - Generate JPEG or PNG images from HTML
- ✅ **Customizable Options** - Control format, margins, quality and more
- ✅ **RESTful API** - Simple HTTP endpoints for PDF and image generation
- ✅ **Reliable Architecture** - Uses disk-based approach for optimal Puppeteer performance
- ✅ **Easy Deployment** - Simple to deploy on any Node.js hosting service

## Installation

```bash
# Clone the repository
git clone https://github.com/tolgaand/umay-render.git

# Navigate to the API directory
cd umay-render/packages/umay-api

# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start
```

## API Endpoints

### Generate PDF

```
POST /render/pdf
```

Request body:

```json
{
  "html": "<html><body><h1>Hello World</h1></body></html>",
  "options": {
    "format": "A4",
    "landscape": false,
    "printBackground": true,
    "margin": {
      "top": "20mm",
      "right": "20mm",
      "bottom": "20mm",
      "left": "20mm"
    },
    "filename": "document.pdf"
  }
}
```

### Generate Image

```
POST /render/image
```

Request body:

```json
{
  "html": "<html><body><h1>Hello World</h1></body></html>",
  "options": {
    "type": "jpeg",
    "quality": 90,
    "fullPage": true,
    "omitBackground": false,
    "filename": "image.jpg",
    "viewport": {
      "width": 1920,
      "height": 1080,
      "deviceScaleFactor": 2
    }
  }
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Port to run the API server | 3000 |
| HOST | Host to run the API server | 0.0.0.0 |

## Docker Deployment

```bash
# Build the Docker image
docker build -t umay-api .

# Run the Docker container
docker run -p 3000:3000 umay-api
```

## Development

```bash
# Start in development mode
npm run dev
```

## License

[MIT](LICENSE)
