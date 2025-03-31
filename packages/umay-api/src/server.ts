import { createApp } from "./app";
import { closeBrowser } from "./features/render/render.service";
import http from "http";

const app = createApp();

const PORT = process.env.PORT || 3001;

const server: http.Server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`API endpoint available at http://localhost:${PORT}/v1/render`);
});

const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];

signals.forEach((signal) => {
  process.on(signal, async () => {
    console.log(`\nReceived ${signal}. Shutting down gracefully...`);

    server.close(async (err?: Error) => {
      if (err) {
        console.error("Error closing HTTP server:", err);
      } else {
        console.log("HTTP server closed.");
      }

      await closeBrowser();

      process.exit(err ? 1 : 0);
    });

    setTimeout(() => {
      console.error("Graceful shutdown timed out. Forcing exit.");
      process.exit(1);
    }, 15000);
  });
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception thrown:", error);
  process.exit(1);
});
