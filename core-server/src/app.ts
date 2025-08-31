import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import routes from "./app/routes";
import cookieParser from "cookie-parser";
import { metricsMiddleware } from "./app/middlewares/metrics.middleware";
import config from "./config";

const app: Application = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  }),
);
app.use(cookieParser());

// prometheus metrics middleware
app.use(metricsMiddleware);

// google
// Session setup

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static(config.STATIC_DIR || "public"));
app.use("/backend/api/v1/", routes);

// Apply the checkOrigin middleware before serving static files
app.use(
  "/backend-files/api/v1/",
  // checkOriginForFile,
  express.static("data/uploads"),
);

//global error handler
app.use(globalErrorHandler);

//handle not found

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API Not Found | Core Server",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found | Core Server",
      },
    ],
  });
  next();
});

export default app;
