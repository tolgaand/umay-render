import { createApp } from "./app";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    const app = createApp();

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      server.close();
      console.log("Server kapatıldı");
      process.exit(0);
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
