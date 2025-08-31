import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import routes from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { sessionMiddleware } from "./app/middlewares/redisSessionId";
import create_required_directories from "./tasks/directory_creation_task";
import { metricsMiddleware } from "./app/middlewares/metrics.middleware";

const baseURL = "/backend/api/v1";
const app: Application = express();

// Create required directories
create_required_directories();

// Cors
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
      "http://192.168.0.128:3000",
      "http://192.168.0.128:3001",
      "http://192.168.0.128:3002",
      "http://51.21.188.160:3000",
      "http://51.21.188.160:3001",
      "http://51.21.188.160:3002",
      "http://desktop-ds6qa2m.tail30a209.ts.net:3001",
      "https://gcptlszn-3002.asse.devtunnels.ms",
      "https://gcptlszn-3000.asse.devtunnels.ms",
      "https://laborohub.com",
      "https://admin.laborohub.com",
      "https://organizers.laborohub.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  }),
);
app.use(cookieParser());

// prometheus metrics middleware
app.use(metricsMiddleware);

// Middleware for session handling
app.use(sessionMiddleware);

// Proxy static file requests to the second server

// Routes for API
app.use(baseURL, routes);
app.use("/backend/api/v1/", express.static("data/uploads"));

// Global error handler
app.use(globalErrorHandler);

// 404 handler for undefined routes
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API Not found | API GATEWAY",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not found | API GATEWAY",
      },
    ],
  });
  next();
});

export default app;
