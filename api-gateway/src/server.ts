import { Server } from "http";
import app from "./app";
import config from "./config";
import { RedisClient } from "./shared/redis";
import { errorLogger, infoLogger } from "./shared/logger";

async function bootstrap() {
  try {
    // Connect to Redis

    await RedisClient.connect();
    infoLogger.info("Redis Connected Successfully on API Gateway");

    // Start server
    const server: Server = app.listen(config.port, () => {
      infoLogger.info(`API Gateway Server running on PORT - ${config.port}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      infoLogger.info("Shutting down server...");
      try {
        await RedisClient.disconnect();
        server.close(() => {
          infoLogger.info("Server closed");
          process.exit(0);
        });
      } catch (error) {
        errorLogger.error("Error during shutdown", error);
        process.exit(1);
      }
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);

    // Handle unexpected errors
    process.on("uncaughtException", (error) => {
      errorLogger.error("Uncaught Exception", error);
      shutdown();
    });

    process.on("unhandledRejection", (reason) => {
      errorLogger.error("Unhandled Rejection", reason);
      shutdown();
    });
  } catch (error) {
    errorLogger.error("Failed to start the server", error);
    process.exit(1);
  }
}

bootstrap();
