# Use the official Node.js image as the base image
FROM node:18-slim AS base

# Set the working directory
WORKDIR /usr/src/app

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install gnupg wget -y && \
    wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install google-chrome-stable -y --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Verify that Chrome is installed at the expected location
RUN ls -alh /usr/bin/google-chrome-stable && \
    /usr/bin/google-chrome-stable --version

# Create a builder image for building the application
FROM base AS builder

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source files
COPY src ./src
COPY tsconfig.json ./

# Build the project
RUN npm run build || (echo "Build failed. Check the logs above." && exit 1)

# Production image
FROM base AS production

# Set the working directory
WORKDIR /usr/src/app

# Copy built files from the builder stage
COPY --from=builder /usr/src/app/lib ./lib
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./

# Set Chrome path for Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Create temp directory and set permissions
RUN mkdir -p /usr/src/app/temp && chown -R node:node /usr/src/app

# Expose the port on which the app will run
EXPOSE 8080

# Set PORT environment variable for Cloud Run
ENV PORT=8080

# Use non-root user for security
USER node

# Start the application
CMD ["node", "lib/server.js"] 