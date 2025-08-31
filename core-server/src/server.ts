import { Server } from "http";
import app from "./app";
import config from "./config";
import { errorLogger, infoLogger } from "./shared/logger";
import { RedisClient } from "./shared/redis";
import { IErrorDetails } from "./interfaces/email/criticalEmailType";
// import { sendEmailForCriticalError } from "./shared/email-send/error-email/sendCriticalErrorEmail";

async function bootstrap() {
  try {
    await RedisClient.connect();
  } catch (error) {
    errorLogger.error("Error connecting to Redis during bootstrap.", error);
  }

  const server: Server = app.listen(config.port, () => {
    infoLogger.info(`Core Server Running on PORT - ${config.port}`);
  });

  const exitHandler = async () => {
    infoLogger.info("Shutting down server...");
    if (server) {
      server.close((err) => {
        if (err) {
          errorLogger.error("Error during server close:", err);
        } else {
          infoLogger.info("Server closed successfully.");
        }
      });
    }
    await RedisClient.disconnect();
    process.exit(1);
  };

  const unexpectedErrorHandler = async (error: unknown) => {
    errorLogger.error("Unexpected error occurred:", error);

    const errorDetails: IErrorDetails = {
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      stackTrace: error instanceof Error ? error.stack : undefined,
      errorName: error instanceof Error ? error.name : undefined,
      occurredAt: new Date(),
      serviceName: "Core Server",
      receiverEmail: "sazusalim@gmail.com",
      receiverEmailAnother: "shafinur512@gmail.com",
    };

    // await sendEmailForCriticalError(errorDetails);
    await exitHandler();
  };

  process.on("uncaughtException", unexpectedErrorHandler);
  process.on("unhandledRejection", unexpectedErrorHandler);

  // Handle graceful shutdown on system signals
  process.on("SIGTERM", exitHandler);
  process.on("SIGINT", exitHandler);
}

bootstrap();
